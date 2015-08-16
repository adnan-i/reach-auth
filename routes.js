'use strict';

Route.pst('/auth/login', {
  uses   : 'AuthController@login',
  params : ['email', 'password']
});

Route.get('/auth/facebook', {
  uses : 'AuthController@facebook'
});

Route.get('/auth/remember', ['authenticate', 'AuthController@remember']);
Route.get('/auth/validate', ['authenticate', 'AuthController@validate']);
Route.get('/auth/logout',                    'AuthController@logout');