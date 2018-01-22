'use strict';
var path = require('path'),
  mongoose = require('./mongoose'),
  passport = require('passport'),
  express = require('express'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  expressJwt = require('express-jwt'),
  router = express.Router(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  request = require('request'),
  Config = require('./config.js');

const PORT = process.env.PORT || 5000;

mongoose();
mongoose.Promise = Promise; 

var Patron = require('./models/patron');
var app = express();
var User = require('mongoose').model('User');
app.use(passport.initialize());
var passportConfig = require('./passport');

//setup configuration
passportConfig();

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var Yelp = require('node-yelp-fusion');
var configY = require('./yelp.js');

// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const clientId = configY.clientId;
const clientSecret = configY.clientSecret;
var yelp=new Yelp({ id:clientId , secret:clientSecret});
const searchRequest = configY.searchRequest;  

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var passportAuth1 =  function (req, res, next) {
    passport.authenticate('twitter-token', {session: false}, function(err, user, newStatus) {
    req.user = user;
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');   
      }
     req.data = {newStatus: newStatus};
      // prepare token for API
      req.auth = {
        id: req.user.id
      }; 
    return next();
    }) (req, res, next);}

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
    return res.json({newStatus: req.data.newStatus, user: req.user});
};

var passportAuth2 =  function (req, res, next) {
    passport.authenticate('google-token', {session: false}, function(err, user, newStatus) {
    req.user = user;
    //
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');   
      }
     req.data = {newStatus: newStatus};
      // prepare token for API
      req.auth = {
        id: req.user.id
      }; 
    return next();
    }) (req, res, next);}

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
    return res.json({newStatus: req.data.newStatus, user: req.user});
};
   
router.route('/api').get(function (req, res) {
  res.json({message:"Hello again from the custom server!"});
});

router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "https%3A%2F%2Ffindndine.herokuapp.com",
        consumer_key: Config.consumerKey,
        consumer_secret: Config.consumerSecret    
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });

router.route('/auth/google')
  .post((req, res, next) => {  
  var headers = {'Content-Type': 'application/x-www-form-urlencoded'}    
  var url = 'https://accounts.google.com/o/oauth2/token';
  var payload = {
    grant_type: 'authorization_code',
    code: req.query.code,
    client_id: Config.clientID,
    client_secret: Config.clientSecret,  
    redirect_uri: 'https://findndine.herokuapp.com',
  }; 
  request.post({url: url, form: payload, headers: headers },
  function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }   
     var values = JSON.parse(r.body);             
     req.body['access_token'] =  values.access_token;
     req.body['refresh_token'] =  values.refresh_token;
      next();
  });
},passportAuth2, generateToken, sendToken);       

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: Config.consumerKey,
        consumer_secret: Config.consumerSecret,    
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passportAuth1, generateToken, sendToken);

router.route('/search2')
  .get(function(req, res) {  
var date = String(req.query.date.trim());
var resNames  = [];
    var index;
for (var i = 0; i< req.query.busNameslg; i++){
resNames.push(req.query[i]);   
}
var lastName = resNames[6];
var patronTally = []; 
patronTally.length = 0;
var i;  
var promises = [];
var arrayLg = resNames.length;

function cntPatrons(value) {
 return new Promise((resolve) => {
Patron.count({'visit.date': date, 'visit.location': resNames[value]}, function (err, count) {
   if (err) {var obj={location: resNames[value], busCount: '0'}; resolve(patronTally.push(obj));}
        else if (count) {var obj={location: resNames[value], busCount: count}; resolve(patronTally.push(obj));}
        else {var obj={location: resNames[value], busCount: '0'}; resolve(patronTally.push(obj));}});
      });
    }

for (var i = 0; i < arrayLg; ++i) {
promises.push(cntPatrons(i));}
      
Promise.all(promises).then(() => {res.json({patronTally:patronTally});
});});

router.route('/verify*')
 .get(function(req, res) {  
    var username = decodeURIComponent(req.query.username);
    var business = decodeURIComponent(req.query.business);
    var date = req.query.date;
    var query  = Patron.where({'visit.username':  username, 'visit.location': business, 'visit.date': date} );
query.findOne(function (err, patron) {
  if (err) {};
  if (patron) {res.json({found:true, date1: date, date2: patron.visit.date});}
               else {res.json({found:false, date1: date, date2: ''});
  }
});});

router.route('/getdata*')
.get(function(req, res) { 
    var username = decodeURIComponent(req.query.username);
    var query  = User.where({'local.username':  username} );
    query.findOne(function (err, user) {
     if (err) {'there was an error'};
     if (user) {res.json({found:true, term: user.data.term, city: user.data.city, state: user.data.state, page: user.data.page, offset: user.data.offset, total: user.data.total});}
               else {res.json({found:false, page: 5, offset: 0, total: 20});
  }
});});

router.route('/delete')
.get(function(req, res) { 
    User.findOneAndRemove({'local.password': ''})
    .then( doc => {res.json({doc:doc})}); 
});

router.route('/searchdata2*')
.get(function(req, res) { 
    var username = decodeURIComponent(req.query.username);
    var data = JSON.parse(decodeURIComponent(req.query.data));
    User.update({'local.username': username}, {
    'data.total': data.value1, 'data.offset': data.offset, 'data.page': data.value2}, function(err, num, rawResponse) {res.json({num: num[0]})});});

router.route('/searchdata*')
.get(function(req, res) { 
    var username = decodeURIComponent(req.query.username);
    var data = JSON.parse(decodeURIComponent(req.query.data));
    User.update({'local.username': username}, {
    'data.term': data.term, 'data.city': data.city, 'data.state': data.state}, function(err, num, rawResponse) {res.json({num: num[0]})});});

router.route('/reviews')
  .get(function(req, res) {  
   var busIdArray = req.query.busIdArray.split(',');
   var arrayLg = busIdArray.length;
   var busId;
   var promises = [];

   for(var i=0;i<arrayLg;i++){
   busId = busIdArray[i]; 
   promises.push(getAllReviews(busId));
}
        
function getAllReviews(busId)
    {return new Promise((resolve) => {     
      yelp.reviews(busId).then(function(result){ resolve([result.reviews[0].text, result.reviews[1].text, result.reviews[2].text, result.reviews[0].url, result.reviews[1].url, result.reviews[2].url ])}).catch(e => {}).then(function(){
   // ready to go again, we're out of the catch    
       resolve(['review not available through Yelp search at this time','review not available  through Yelp search at this time','review not available through Yelp search at this time', 'https://www.yelp.com/', 'https://www.yelp.com/', 'https://www.yelp.com/']);
});
});}   
        
Promise.all(promises).then((results) => {results;
 res.json({reviewArray: results});})});

router.route('/search')
  .get(function(req, res) { 
var date = String(req.query.date.trim());
var limit = req.query.limit;
var newtotal, searchStr;
var offset = req.query.offset;   
//get search data.    
var username = decodeURIComponent(req.query.username);
var searchData = JSON.parse(decodeURIComponent(req.query.searchData));
var query  = User.where({'local.username':  username});
query.findOne(function (err, user) {
     if (err) {}
else {
if (user) { var total = limit; 
    searchStr = "limit=" + limit + "&" + "offset=" + offset + "&" +  "term=" + user.data.term + "&"  + "location=" + user.data.city + ',' + user.data.state + "&"  + "actionlinks=" + searchRequest.actionlinks
+ "&" + "url=" + searchRequest.url;}
else if (username != '')
{
//we should never come here
var total = 20;
searchStr =  "limit=" + total + "&" + "offset=" + 0 + "&" + "term=greek" + "&"  + "location=Gainesville, Georgia" + "&"  + "actionlinks=" + searchRequest.actionlinks
+ "&" + "url=" + searchRequest.url;}
//
else{//user has not signed in.
var total = searchData.total;   
searchStr =  "limit=" + total + "&" + "offset=" + searchData.offset + "&" + "term=" + searchData.term + "&"  + "location=" + searchData.city + ',' + searchData.state + "&"  + "actionlinks=" + searchRequest.actionlinks
+ "&" + "url=" + searchRequest.url;}
}    
   
var resNames = [];
var busIdArray = [];
var photoArray = [];
var reviewArray = []; 
var busId;
var patronTally = [];
var burlArray = [];
patronTally.length = 0;
resNames.length =0; 
busIdArray.length= 0;
photoArray.length= 0;
reviewArray.length =0;
burlArray.length = 0;

var i;  
var promises = [];
    
yelp.search(searchStr)
    .then(function(result){if (result.businesses.length < total) newtotal = result.businesses.length;
     else newtotal = total;
      for (i=0; i<newtotal; i++)
      {//get business
        resNames.push(result.businesses[i].name);
        busIdArray.push(result.businesses[i].id); 
        photoArray.push(result.businesses[i].image_url);
        burlArray.push(result.businesses[i].url);
      }}).then(function(){
      var arrayLg = busIdArray.length;
for(var i=0;i<arrayLg;i++){
    busId = busIdArray[i]; 
    promises.push(getFirstReview(busId));}
    
function getFirstReview(busId)
     {return new Promise((resolve) => {     
      yelp.reviews(busId).then(function(result){resolve([result.reviews[0].text, result.reviews[0].url])}).catch(e => {}).then(function(){
   // ready to go again, we're out of the catch  
       resolve(['review not available through Yelp search at this time', 'https://www.yelp.com/']);});
});}
  
Promise.all(promises).then((results) => {reviewArray = results;
    
function cntPatrons(value) {
 return new Promise((resolve) => {
Patron.count({'visit.date': date, 'visit.location': resNames[value]}, function (err, count) {
   if (err) {var obj={location: resNames[value], busCount: '0'}; resolve(patronTally.push(obj));}
        else if (count) {var obj={location: resNames[value], busCount: count}; resolve(patronTally.push(obj));}
        else {var obj={location: resNames[value], busCount: '0'}; resolve(patronTally.push(obj));}});
      });}
     
promises = [];
promises.length = 0;
for (var i = 0; i < newtotal; ++i) {promises.push(cntPatrons(i));}
      
Promise.all(promises).then(() => {
res.json({busIdArray: busIdArray, nameArray: resNames, reviewArray: reviewArray, photoArray: photoArray, patronTally:patronTally, burlArray: burlArray});
});});}).catch(e => {});});});

router.route('/verify*')
 .get(function(req, res) {
        var username = req.query.username;
        var date = req.query.date;
        var business = req.query.business;
        var query  = Patron.where({'visit.username':  username, 'visit.location': business, 'visit.date': date} );
query.findOne(function (err, patron) {
  if (err) {};
  if (patron) {res.json({found:true, date1: date, date2: patron.visit.date});}
               else {res.json({found:false, date1: date, date2: ''});
  }
});});

router.route('/patron*')
  .get(function(req, res) {
        var username = decodeURIComponent(req.query.username);
        var date = req.query.date;
        var business = decodeURIComponent(req.query.business);
        var action = req.query.action;
    var conditions = { 'visit.location': business, 'visit.date':  date, 'visit.username': username};
    if (action == 'add')    
    {Patron.create(conditions, function (err, result) {
         if (err) {}
        else if (result)
        {var conditions = { 'visit.location': business, 'visit.date':  date}; 
        Patron.count(conditions, function (err, count) {if (err) {}
        else if (count) {
            {res.json({pTally: String(count), username: username, date: date, business: business});}
                                                         
                                                         
        }});}});}
    else
    {Patron.remove(conditions, function (err, result) {
        if (err) {} 
        else if (result)
        {var conditions = { 'visit.location': business, 'visit.date':  date};
        Patron.count(conditions, function (err, count) {if (err) {}
        else {
            res.json({pTally: String(count), username: username, date: date, business: business});}         });}});}});


app.use('/api/v1', router);

//for local-auth
// pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;