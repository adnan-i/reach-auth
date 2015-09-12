'use strict';

let bcrypt = require('../lib/bcrypt-service');
let User   = Reach.model('User');

describe('Auth Module', function () {
  before(function *() {
    let user = new User({
      firstName : 'John',
      lastName  : 'Doe',
      email     : 'john.doe@test.none',
      password  : yield bcrypt.hash('password', 10)
    });
    yield user.save();
  });

  // ### Routes
  // Test against auth module routes

  describe('Routes', function () {
    require('./routes.js');
  });
});