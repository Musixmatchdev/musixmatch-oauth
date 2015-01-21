var express = require('express'),
    app = express();

var http = require('http');
var qs = require('querystring');

var YOUR_CLIENT_ID = "";
var YOUR_SECRET = "";
var YOUR_APP_REDIRECT_URI = ""; // Example: http://mysite.com/callback
var YOUR_APP_DEEP_LINK_URI = ""; // Example: myapp://callback

var OAuth2 = require('simple-oauth2')({
  clientID: YOUR_CLIENT_ID,
  clientSecret: YOUR_SECRET,
    site: 'http://apic.musixmatch.com',
    authorizationPath: '/oauth/authorize',
    tokenPath: '/oauth/token'
});

// Authorization uri definition
var authorization_uri = OAuth2.authCode.authorizeURL({  
  client_id : YOUR_CLIENT_ID,
  redirect_uri : 'http://localhost:3000/callback',
  scope: 'all',
  state: 'non'
});

// Initial page redirecting to Github
app.get('/authorize', function (req, res) {
    res.redirect(authorization_uri);
});

app.get('/swap', function (request, response) {

    var code = request.query.code;
    console.log('/swap ' + code);

    var params = {
        client_id : YOUR_CLIENT_ID,
        client_secret : YOUR_SECRET,
        grant_type : 'authorization_code',
        code : code,
        redirect_uri : YOUR_APP_DEEP_LINK_URI
    };

    var body  = qs.stringify(params);

    var headers = {
        'Content-Length' : body.length
    };

    var options = {
        host: "localhost",
        port: 8181,
        path: "/oauth/token",
        method: "POST",
        headers : headers
    };

    console.log( body );
    console.log( JSON.stringify(headers) );

    var reqClient = http.request(options, function(res) {
        var data = '';
        res.setEncoding('utf8');
    });
    // on error
    reqClient.on('error', function(e) {
        console.log('POST error: ' + e.message);
    });
    // on response
    reqClient.on('response', function (res) {
        var data = '';
        res.on('data', function (chunk)
        {
            data+=chunk;
        });
        res.on('end',function() {

            var plainResponse = JSON.stringify(data);

            console.log(plainResponse);

            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.write( data );
            response.end();

        });
    });
    reqClient.write( body );
    reqClient.end();

});

/*
 *
 * Callback service parsing the authorization token and asking for the access token
 * Response Format
 
         {
    		access_token: '',
    		refresh_token: '',
    		expires_in: '',
    		token_type: 'bearer',
    		expires_at: FriOct31201415: 54: 31GMT+0100(CET)
		}
*/    
app.get('/callback', function (req, res) {

  var code = req.query.code;
  console.log('/callback ' + code);

   if( typeof(code)=='undefined' ) {

       res.writeHead(200, { 'Content-Type': 'text/plain' });
       var j = JSON.stringify( req.query );
       res.write( j );
       res.end();

       return;
   }

  OAuth2.authCode.getToken({
    "code": code,
    redirect_uri: YOUR_APP_REDIRECT_URI // Use YOUR_APP_DEEP_LINK_URI for mobile oauth
  }, useToken);

    function useToken(error, result) {

        if (error) { console.log('Access Token Error', error.message); }
        token = OAuth2.accessToken.create(result);

        console.log(req.query.access_token);

        if ( typeof(req.query.access_token) == "undefined" ) {

            var access_token = token.token["access_token"];
            var token_type = token.token["token_type"];
            var expires_in = token.token["expires_in"];
            var refresh_token = token.token["refresh_token"];

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

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            var j = JSON.stringify(token);
            res.write( j );
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

