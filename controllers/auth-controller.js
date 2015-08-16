'use strict';

let auth = require('../lib/auth-service');

Reach.Register.Controller('AuthController', function (controller) {

  /**
   * @method login
   * @return {User}
   */
  controller.login = function *(post) {
    yield this.auth.login(post.email, post.password);

    return this.auth.user;
  };

  /**
   * @method facebook
   * @param  {Object} data
   * @return {User}
   */
  controller.facebook = function *(data) {
    return yield auth.social('facebook', data);
  };

  /**
   * @method remember
   * @return {Void}
   */
  controller.remember = function *() {
    yield this.auth.remember();
  };

  /**
   * @method validate
   * @return {Void}
   */
  controller.validate = function *() {
    // If we hit this method we are validated
  };

  /**
   * @method logout
   * @return {Void}
   */
  controller.logout = function *() {
    return yield this.auth.logout();
  };

  return controller;

});