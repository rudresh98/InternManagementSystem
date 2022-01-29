// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://im-app-backend-dev.azurewebsites.net/v1/',
  SECRET_KEY: 'NhqPQPVSrWyAnE1Y72ABCwsqug42szgwQld3B5FduO1640',
  CLIENT_ID: '9b871411-8edf-493e-94d6-4918c0483d2f', // This is your client ID
  AUTHORITY:
    'https://login.microsoftonline.com/e4e34038-ea1f-4882-b6e8-ccd776459ca0', // This is your tenant ID
  REDIRECT_URI: 'http://localhost:5100/login', // This is your redirect URI
  POST_LOGOUT_REDIRECT_URI: 'http://localhost:5100/login',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
