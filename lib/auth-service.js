'use strict';

let facebook = require('./social/facebook-service');
let auth     = Reach.Auth;
let error    = Reach.ErrorHandler;

/**
 * @class AuthService
 */
let AuthService = module.exports = {};

/**
 * @method social
 * @param  {String} type
 * @param  {Mixed}  data
 * @return {User}
 */
AuthService.social = function *(type, data) {
  let user = null;
  switch (type) {
    case 'facebook' :
      user = yield facebook.handle(data);
      break;
    default : 
      throw error.parse({
        code    : 'AUTH_INVALID_SOCIAL',
        message : 'The social service requested for authentication is not supported'
      }, 400);
  }
  return yield this.setToken(user);
};

/**
 * Reqests and sets a token for the provided user.
 * @param  {User} user
 * @return {Object}
 */
AuthService.setToken = function *(user) {
  user       = user.toJSON();
  user.token = yield auth.token(user.id);
  return user;
};