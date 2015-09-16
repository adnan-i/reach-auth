'use strict';

let User   = Reach.model('User');
let hooks  = Reach.Hooks;
let auth   = Reach.Auth;
let error  = Reach.Error;

/**
 * @class AuthService
 */
let AuthService = module.exports = {};

/**
 * Authorize a user by the provided identifier and password.
 * @method login
 * @param  {String} identifier
 * @param  {String} password
 * @param  {Object} [options]
 * @return {User}
 */
AuthService.login = function *(identifier, password, options) {
  let loginHook = hooks.get('auth:login');
  if (!loginHook) {
    throw error.parse({
      type    : 'AUTH_INVALID_METHOD',
      message : 'Login is not a valid authentication method.'
    }, 400);
  }
  return yield loginHook(identifier, password, options || {});
};

/**
 * @method social
 * @param  {String} service
 * @param  {Mixed}  data
 * @param  {User}   _user
 * @return {User}
 */
AuthService.social = function *(service, data, _user) {
  service = getSocialService(service);
  service.verifyData(data);
  let user = yield service.handle(data, _user);
  if (data.type === 'connect') {
    return user;
  }
  return yield this.setToken(user, data.options);
};

/**
 * Reqests and sets a token for the provided user.
 * @param  {User}   user
 * @param  {Object} [options]
 * @return {Object}
 */
AuthService.setToken = function *(user, options) {
  options    = options || {};
  user       = user.toJSON();
  user.token = yield auth.token(user.id, options);
  return user;
};

/**
 * Returns the request social service class.
 * @private
 * @method getSocialService
 * @param  {String} id
 * @return {Object}
 */
function getSocialService(id) {
  switch (id) {
    case 'facebook' : return require('./facebook-service');
    default :
      throw error.parse({
        code    : 'AUTH_INVALID_SOCIAL',
        message : 'The social service requested for authentication is not supported'
      }, 400);
  }
}