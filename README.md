# Reach Auth

  - [Setup](#setup)

## [Setup](#setup)

First start off by going into the root of the reach-api and run the following command.

```sh
# Install reach-auth module.
$ reach install reach-auth --save
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

#### Email & Password

```
POST /auth/login
{
  "email"    : "",
  "password" : ""
}
```

#### Facebook

```
POST /auth/facebook
{
  "type"        : "register|connect|login", // The type of facebook authentication.
  "code"        : "",                       // The code provided by facebook.
  "redirectUri" : ""                        // The redirect uri used when request facebook code.
}
```

If you are requesting an account connection make sure you provide the `Authorization` token of the authenticate user.