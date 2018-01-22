// config/yelp.js
// expose our config directly to our application using module.exports
module.exports = {
// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
'clientId': 'APpm8ZusqUevKtE_S9AMvw',
'clientSecret': 'j7wj0RnVe2FC0Iz4Aef0mn3pgkJaJpc8ph0YGtSLXHvNUhGhz8h2K3iXBAd6NwMz',
'searchRequest': {
  term:'greek',
  categories: 'restaurant',
  location: 'Gainesville, Georgia',
  actionlinks: 'True',
  url: 'eat24_url'
}}

