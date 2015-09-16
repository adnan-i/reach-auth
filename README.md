# Reach Auth

  - [Setup](#setup)
  - [Login Methods](#login-methods)

## [Setup](#setup)

First start off by going into the root of the reach-api and run the following command.

```sh
# Install required reach packages.
$ reach install reach-auth reach-bcrypt --save
```

#### User Hook

Because of the modular nature of reach you will need to make sure that the hooks folder contains a file providing the `auth:user` hook. If one is not present create a file and include the following:

```js
'use strict';

let User  = Reach.model('User');
let hooks = Reach.Hooks;
let error = Reach.Error;

hooks.set('auth:user', function *(id, group) {
  let user = yield User.findById(id);
  if (!user) {
    throw error.parse({
      type    : `AUTH_INVALID_USER`,
      message : `The token provided belongs to a user that is no longer accessible.`
    }, 400);
  }
  return user;
});
```

Feel free to adjust the method as needed based on how you have your user interface setup.

## [Login Methods](#login-methods)

This module currently supports the following login types:

#### Identifier & Password

Before you can start using this method you will need to create a `auth:login` hook.

```js
hooks.set('auth:login', function *(identifier, password, options) {
  let user = yield User.findOne({ where : { email : identifier }});
  if (!user) {
    throw error.parse({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided is invalid.'
    }, 400);
  }

  let validPassword = yield bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw error.parse({
      type    : 'AUTH_INVALID_CREDENTIALS',
      message : 'The email and/or password provided is invalid.'
    }, 400);
  }

  user       = user.toJSON();
  user.token = yield auth.token(user.id, options);

  return user;
});
```

Feel free to change this implementation as needed based on your API requirements, the above hook comes with a default install and can be found in `hooks/auth.js`.

This is the standard way to authenticate with the api, with one major difference. We do not provide email or username. We provide an identifier, we do this because an identifier can be any value we deem a valid identifier in the `auth:login` hook.

To be a valid identifier the value used has to be `unique`.

```
POST /auth/login
{
  "identifier" : "",
  "password"   : ""
}
```

#### Facebook

With facebook login you can register, connect and exisiting account or login. When using connect make sure that you are providing `Authorization` token of the authenticated user attempting to connect their account.

If a registration attempt hits a dupe email check it will ask the user to use the connect feature instead of registration since the account already exists in the database.

Login will match the facebook_id provided by facebook and provide the authenticated user on success.

```
POST /auth/facebook
{
  "type"        : "register|connect|login",
  "code"        : "",
  "redirectUri" : ""
}
```

#### Next

We will be adding more social login methods, next up will be google, twitter and linkedin.