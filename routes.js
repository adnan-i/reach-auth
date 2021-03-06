'use strict';

Route.pst('/auth/login', {
  uses   : 'AuthController@login',
  params : [ 'identifier', 'password' ]
});

Route.pst('/auth/facebook',                  'AuthController@facebook');
Route.get('/auth/remember', ['authenticate', 'AuthController@remember']);
Route.get('/auth/validate', ['authenticate', 'AuthController@validate']);
Route.get('/auth/logout',   ['authenticate', 'AuthController@logout']);