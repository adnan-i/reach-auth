'use strict';

let bcrypt = require('co-bcrypt');
let User   = Reach.model('User');
let auth   = Reach.Auth;

// ### User

auth.user = function *(userId, groupId) {
  let user = yield User.findById(userId);
  if (!user) {
    this.throw({
      type    : 'AUTH_INVALID_USER',
      message : 'The user requested with the token does not exist'
    }, 401);
  }

  if (groupId) {
    // Fetch group...
    // user._group = group;
  }

  return user;
};

// ### Login

auth.login = function *(email, password, group) {
  let user = yield User.findOne({ where: { email: email }});
  if (!user) {
    this.throw({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided did not match any record in our database'
    }, 401);
  }

  let validPassword = yield bcrypt.compare(password, user.password);
  if (!validPassword) {
    this.throw({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided did not match any record in our database'
    }, 401);
  }

  if (group) {
    // Validate Group
  }

  user       = user.toJSON();
  user.token = yield auth.token(user.id, group);

  return user;
};