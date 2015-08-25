'use strict';

let User     = Reach.model('User');
let Facebook = Reach.Auth.Facebook;
let error    = Reach.ErrorHandler;
let config   = Reach.config;

/**
 * @class FacebookService
 */
let FacebookService = module.exports = {};

/**
 * @method handle
 * @param  {Object} data
 * @param  {User}   _user
 * @return {User}
 */
FacebookService.handle = function *(data, _user) {
  let fb   = yield this.getFacebookProfile(data.code, data.redirectUri);
  let user = null;
  switch (data.type) {
    case 'login' :
      user = yield this.login(fb);
      break;
    case 'connect' : 
      user = yield this.connect(fb, _user);
      break;
    case 'register' :
      user = yield this.register(fb);
      break;
    default :
      throw error.parse({
        code : 'FACEBOOK_UNKNOWN_TYPE',
        message : 'Facebook authentication does not support "'+ type +'"'
      }, 400);
  }
  return user;
};

/**
 * @method login
 * @param  {Object} fb
 * @return {User}
 */
FacebookService.login = function *(fb) {
  let user = yield User.findOne({
    where : {
      facebook : fb.id
    }
  });
  if (!user) {
    throw error.parse({
      code    : 'FACEBOOK_LOGIN_FAILED',
      message : 'Your account is not connected with facebook' 
    }, 400);
  }
  return user;
};

/**
 * @method connect
 * @param  {Object} fb
 * @return {User}
 */
FacebookService.connect = function *(fb, _user) {
  if (!_user) {
    throw error.parse({
      code    : 'FACEBOOK_CONNECT_FAILED',
      message : 'You must be logged in to connect a facebook account'
    }, 400);
  }
  _user.facebook = fb.id;
  yield _user.update();
  return _user;
};

/**
 * @method register
 * @param  {Object} fb
 * @return {User}
 */
FacebookService.register = function *(fb) {
  let user = yield User.findOne({
    where : {
      $or : [
        { email    : fb.email },
        { facebook : fb.id }
      ]
    }
  });
  if (user && user.facebook) {
    throw error.parse({
      code    : 'FACEBOOK_REGISTRATION_FAILED',
      message : 'The facebook account is already connected to an account in our system'
    }, 400);
  }
  if (user) {
    throw error.parse({
      code    : 'FACEBOOK_REGISTRATION_FAILED',
      message : 'The email connected to this facebook account has already been registered'
    }, 400);
  }
  user = new User({
    firstName : fb.first_name,
    lastName  : fb.last_name,
    email     : fb.email,
    facebook  : fb.id
  });
  yield user.save();
  return user;
};

/**
 * @method getFacebookProfile
 * @param  {String} code
 * @param  {String} redirectUri
 */
FacebookService.getFacebookProfile = function *(code, redirectUri) {
  let facebook = new Facebook();
  let token    = yield facebook.getToken(code, redirectUri);
  let profile  = yield facebook.getProfile(token);
  if (!profile) {
    throw error.parse({
      code    : 'FACEBOOK_PROFILE_ERROR',
      message : 'Could not retrieve profile with the provided code'
    }, 400)
  }
  return profile;
};

/**
 * @method verifyData
 * @param  {Object} data
 */
FacebookService.verifyData = function (data) {
  let errors = [];
  if (!data.type)        { errors.push('type'); }
  if (!data.code)        { errors.push('code'); }
  if (!data.redirectUri) { errors.push('redirectUri'); }
  if (errors.length) {
    throw error.parse({
      code    : 'FACEBOOK_MISSING_PARAMETERS',
      message : 'Facebook authentication is missing ' + errors.join(', ')
    }, 400);
  }
};