'use strict';

let facebook = require('./social/facebook-service');
let auth     = Reach.Auth;
let error    = Reach.Error;

/**
 * @class AuthService
 */
let AuthService = module.exports = {};

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
    case 'facebook' : return require('./social/facebook-service');
    default :
      throw error.parse({
        code    : 'AUTH_INVALID_SOCIAL',
        message : 'The social service requested for authentication is not supported'
      }, 400);
  }
}