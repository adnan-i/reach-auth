'use strict';

let bcrypt = require('co-bcrypt');
let User   = Reach.model('User');
let error  = Reach.ErrorHandler;
let auth   = Reach.Auth;

/**
 * Method used by the core authentication in reach to assign a user to
 * the incoming requests that contains an auth token.
 * @method user
 * @param  {Int} id
 * @param  {Int} group
 * @return {User}
 */
auth.user = function *(id, group) {
  let user = yield User.findById(id);
  if (!user) {
    throw error.parse({
      type    : 'AUTH_INVALID_USER',
      message : 'No user with the id provided by the authentication store.'
    }, 400);
  }

  if (group) {
    // Fetch group...
    // user.group = group;
  }

  return user;
};

/**
 * @method login
 * @param  {String} email
 * @param  {String} password
 * @param  {Object} [options]
 * @return {User}
 * @example
    this.auth.login('john@doe.com', 'secret', {
      from  : '8sUwaQ1k', // Allows for a client to sign in from multiple devices
      group : 1           // If the user is signing in to a certain group
    })
 */
auth.login = function *(email, password, options) {
  options = options || {};
  
  let user = yield User.findOne({ where: { email: email }});
  if (!user) {
    throw error.parse({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided is invalid.'
    }, 400);
  }

  let validPassword = yield bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw error.parse({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided is invalid.'
    }, 400);
  }

  if (options.group) {
    // Validate Group
  }

  user       = user.toJSON();
  user.token = yield auth.token(user.id, options);

  return user;
};