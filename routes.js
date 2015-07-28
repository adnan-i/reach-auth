'use strict';

Route.post('/auth/login', {
  uses   : 'AuthController@login',
  params : ['email', 'password']
});

Route.post('/auth/facebook', {
  uses   : 'AuthController@facebook',
  params : ['code', 'redirectUri']
});

Route.get('/auth/remember', {
  policy : 'authenticate',
  uses   : 'AuthController@remember'
});

Route.get('/auth/validate', {
  policy : 'authenticate',
  uses   : 'AuthController@validate'
});

Route.get('/auth/logout', {
  uses : 'AuthController@logout'
});