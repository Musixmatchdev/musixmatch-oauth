var express = require('express'),
    app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');

var oauth_config= require("./oauth_config");
var request = ("request");

var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var root_hostname = "https://oauth.musixmatch.com";
//root_hostname = "http://localhost:8181";
//root_hostname = "http://local.musixmatch.com:8181";


var strategy = new OAuth2Strategy({
        authorizationURL: root_hostname+'/oauth/authorize',
        tokenURL: root_hostname+'/oauth/token',

        clientID: oauth_config.YOUR_CLIENT_ID,
        clientSecret: oauth_config.YOUR_SECRET,
        callbackURL: oauth_config.YOUR_APP_REDIRECT_URI,
        scope: "all"
    },
    function(accessToken, refreshToken, profile, done) {
        var request = require( 'promised-request' );
        request( root_hostname+'/ws/1.1/user.get?app_id=' + oauth_config.YOUR_CLIENT_ID + "&usertoken=" + accessToken ).then( function( response )
        {
            try {
                var parsedres = JSON.parse( response.body);
                var mxmuser = parsedres.message.body.user;
                done( null,{ id: mxmuser.user_id, scope: "all" } );
            } catch (e) {
                done(null,false,e);
            }
        },function(err){
            done(null,false,e);
        });
    }
);


passport.use('musixmatch', strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(cookieParser()); //read cookies (needed for auth)
app.use(session({
    secret: 'jksdfhasdkjhalkjghfdkghk',
    maxAge: null,
    resave: true,
    saveUninitialized: true
})); //session secret
app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/musixmatch', passport.authenticate('musixmatch'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/musixmatch/callback',
    function(req, res, next) {
        if (typeof( req.query.error )!="undefined") //handle error codes

            res.redirect('/failure');
         else
            next();
    },passport.authenticate('musixmatch',
        { successRedirect: '/',
        failureRedirect: '/failure' }));

app.get('/failure', function(req,res) {
    res.write("Not authorized");
    res.end();
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/login', function(req, res){
    req.logout();
    res.redirect('/auth/musixmatch');
    });

app.get('/',
    function(req, res) {
        if (!req.user) {
            res.write("<html><body><a href='/login'>Login</a> is required to access this page</body></html>");
            res.end();
        }
        else {
            res.write(JSON.stringify(req.user));
            res.end();
        };
});

app.listen(3000);
console.log('Express server started on port 3000');