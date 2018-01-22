// config/yelp.js
// expose our config directly to our application using module.exports
module.exports = {
// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
'clientId': 'ClientIdGoesHere',
'clientSecret': 'clientSecretGoesHere',
'searchRequest': {
  term:'greek',
  categories: 'restaurant',
  location: 'Gainesville, Georgia',
  actionlinks: 'True',
  url: 'eat24_url'
}}

