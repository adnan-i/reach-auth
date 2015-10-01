'use strict';

let request = require('co-request');
let auth    = Reach.Auth;
let error   = Reach.Error;

/**
 * @class Facebook
 */
module.exports = class Facebook {

  /**
   * @method constructor
   */
  constructor () {
    this.accessTokenUrl = 'https://graph.facebook.com/v2.4/oauth/access_token';
    this.graphiApiUrl   = 'https://graph.facebook.com/v2.4/me';
  }

  /**
   * Generates a facebook accessToken
   * @method getToken
   * @param {String} code
   * @param {String} redirectUri
   */
  *getToken (code, redirectUri) {
    let config = yield getConfig();
    let res    = yield request({
      url : this.accessTokenUrl,
      qs  : {
        code          : code,
        client_id     : config.appId,
        client_secret : config.appSecret,
        redirect_uri  : redirectUri
      },
      json : true
    });
    if (res.statusCode !== 200) {
      throw error.parse({
        code : 'FACEBOOK_ERROR',
        message : res.body.error.message
      }, res.statusCode);
    }
    return res.body;
  };

  /**
   * Fetches a profile based on the code and accessToken provided
   * @method getProfile
   * @param {String} accessToken
   */
  *getProfile (accessToken) {
    let res = yield request({
      url  : this.graphiApiUrl,
      qs   : {access_token: accessToken, fields: 'first_name,last_name,email'},
      json : true
    });
    if (res.statusCode !== 200) {
      throw error.parse({
        code : 'FACEBOOK_ERROR',
        message : res.body.error.message
      }, res.statusCode);
    }
    return res.body;
  };

}

/**
 * @private
 * @method getConfig
 * @return {Object}
 */
function *getConfig() {
  let config = yield auth.getConfig();
  if (!config.facebook) {
    throw error.parse({
      code    : 'REACH_AUTH_FACEBOOK_ERROR',
      message : 'Missing facebook authentication configuration',
      solution: 'Make sure you have defined [default] and/or ['+ Reach.ENV +'] configuration for facebook authentication'
    });
  }
  return config.facebook;
}
