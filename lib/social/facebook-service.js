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
 * @param  {String} code
 * @return {User}
 */
FacebookService.handle = function *(code) {
  let fb   = yield this.getFacebookProfile(code);
  let user = yield User.findOne({
    where : {
      $or: [
        {
          facebook : fb.id
        },
        {
          email : fb.email
        }
      ]
    }
  });
  if (!user) {
    user = new User({
      firstName : fb.first_name,
      lastName  : fb.last_name,
      email     : fb.email,
      facebook  : fb.id
    });
    yield user.save();
  }
  if (!user.facebook) {
    user.facebook = fb.id
    yield user.update();
  }
  return user;
};

/**
 * @method getFacebookProfile
 * @param  {String} code
 */
FacebookService.getFacebookProfile = function *(code) {
  let facebook = new Facebook();
  let token    = yield facebook.getToken(code);
  let profile  = yield facebook.getProfile(token);
  if (!profile) {
    throw error.parse({
      code    : 'FACEBOOK_PROFILE_ERROR',
      message : 'Could not retrieve profile with the provided code'
    }, 400)
  }
  return profile;
};