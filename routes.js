'use strict';

Route.post('/auth/login', {
  uses   : 'AuthController@login',
  params : ['email', 'password']
});

Route.post('/auth/facebook', {
  uses   : 'AuthController@facebook',
  params : ['code', 'redirectUri']
});

Route.get('/auth/remember', ['authenticate', 'AuthController@remember']);
Route.get('/auth/validate', ['authenticate', 'AuthController@validate']);
Route.get('/auth/logout',                    'AuthController@logout');