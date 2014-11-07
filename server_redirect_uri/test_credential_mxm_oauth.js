var express = require('express'),
    app = express();

var OAuth2 = require('simple-oauth2')({
  clientID: 'example_app_id',
  clientSecret: 'xxxyyyzzz',
    site: 'http://apic.musixmatch.com',
    authorizationPath: '/oauth/authorize',
    tokenPath: '/oauth/token'
});

// Authorization uri definition
var authorization_uri = OAuth2.authCode.authorizeURL({  
  client_id:'example_app_id',
  redirect_uri: 'http://localhost:3000/callback?',
  scope: 'all',
  state: 'non'
});

// Initial page redirecting
app.get('/authorize', function (req, res) {
    res.redirect(authorization_uri);

});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;
  console.log('/callback');

  OAuth2.authCode.getToken({
    "code": code,
    redirect_uri: 'http://localhost:3000/callback?'
  }, useToken);

    function useToken(error, result) {

        if (error) { console.log('Access Token Error', error.message); }
        token = OAuth2.accessToken.create(result);

        console.log(req.query.access_token);

        if ( typeof(req.query.access_token) == "undefined" ) {

            var access_token = token.token.access_token;
            var token_type = token.token.token_type;
            var expires_in = token.token.expires_in;
            var refresh_token = token.token.refresh_token;

            var request_url = "/callback" + '?'
            request_url +="access_token="+access_token;
            request_url +="&token_type="+token_type;
            request_url +="&refresh_token="+refresh_token;
            request_url +="&expires_in="+expires_in;

            res.writeHeader(302, {
                'Location': request_url,
                'Content-Type': 'text/plain; charset=utf-8',
                'x-mxm-cache': 'no-cache',
                'Set-Cookie': "app_id=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/"
            });
            res.end();

        }  else {

            res.writeHead(200, { 'Content-Type': 'text/html' });
            var j = JSON.stringify(token);
            var page = '<!doctype html><html class="no-js" lang="en">' +
                '<head>'+
                '    <meta charset="utf-8" />' +
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
                '    <title>EXAMPLE APP</title>'+
                '</head>'+
                '<body>'+
                '<div class="container">'+
                '    <div class="row wrapper">'+
                '        <div class="medium-6 columns small-centered">'+
                '            <div class="form_cont">'+
                '                <h2>MY EXAMPLE-APP</h2>'+
                ''+
                '                <p>OK </p> <br/>'+
                '                                        '+
                '                <p>YOU ARE LOGGED IN</p>'+
                ''+
                '            </div>'+
                '        </div>'+
                '    </div>'+
                '</div>'+
                '</body>'+
                '</html>';

            res.write(page);
            res.end();
        }

    }
});

app.get('/',function(req,res){


var homepage = '<!doctype html><html class="no-js" lang="en">' +
        '<head>'+
        '    <meta charset="utf-8" />' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
        '    <title>EXAMPLE APP</title>'+
        '</head>'+
        '<body>'+
        '<div class="container">'+
        '    <div class="row wrapper">'+
        '        <div class="medium-6 columns small-centered">'+
        '            <div class="form_cont">'+
        '                <h2>EXAMPLE-APP</h2>'+
        ''+
        '                <p>THIS IS AN EXAMPLE LOGIN PAGE</p> <br/>'+
        '                                        '+
        '                <p><br/><br/><a href="/authorize">LOGIN WITH YOUR MUSIXMATCH ACCOUNT </a></p>'+
        ''+
        '            </div>'+
        '        </div>'+
        '    </div>'+
        '</div>'+
        '</body>'+
    '</html>';

    res.write(homepage);

})

app.listen(3000);

console.log('Express server started on port 3000');

