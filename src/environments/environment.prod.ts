export const environment = {
  production: true,
  API_URL: 'https://ims-backend-prod.azurewebsites.net/v1/',
  SECRET_KEY: 'NhqPQPVSrWyAnE1Y72ABCwsqug42szgwQld3B5FduO1640',
  CLIENT_ID: '9b871411-8edf-493e-94d6-4918c0483d2f', // This is your client ID
  AUTHORITY: 'https://login.microsoftonline.com/e4e34038-ea1f-4882-b6e8-ccd776459ca0', // This is your tenant ID
  REDIRECT_URI: 'https://ims-frontend-prod.azurewebsites.net/login',// This is your redirect URI
  POST_LOGOUT_REDIRECT_URI: "https://ims-frontend-prod.azurewebsites.net/login"
};
