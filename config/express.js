var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');


//helper functions
function findById(id, fn) {
    User.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

function findByUsername(u, fn) {
    User.findOne({
        username: u
    }).exec(function (err, user) {
        // Error handling
        if (err) {
            return fn(null, null);
            // The User was found successfully!
        } else {
            return fn(null, user);
        }
    });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Find the user by username. If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message. Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function (err, user) {
                if (err)
                    return done(null, err);
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }
                bcrypt.compare(password, user.password, function (err, res) {
                    if (!res)
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    var returnUser = {
                        username: user.username,
                        createdAt: user.createdAt,
                        id: user.id
                    };
                    return done(null, returnUser, {
                        message: 'Logged In Successfully'
                    });
                });
            })
        });
    }
));

/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.express = {

	// Completely override Express middleware loading.  
	// If you only want to override the bodyParser, cookieParser
	// or methodOverride middleware, see the appropriate keys below.
	// If you only want to override one or more of the default middleware,
	// but keep the order the same, use the `middleware` key.
	// See the `http` hook in the Sails core for the default loading order.
	//
	// loadMiddleware: function( app, defaultMiddleware, sails ) { ... }

    customMiddleware: function( app ){
        console.log('Express midleware for passport');
        app.use(passport.initialize());
        app.use(passport.session());
    }


	// Override one or more of the default middleware (besides bodyParser, cookieParser)
	// 
	// middleware: {
	//    session: false, // turn off session completely for HTTP requests
	//    404: function ( req, res, next ) { ... your custom 404 middleware ... }
	// }




	// The middleware function used for parsing the HTTP request body.
	// (this most commonly comes up in the context of file uploads)
	//
	// Defaults to a slightly modified version of `express.bodyParser`, i.e.:
	// If the Connect `bodyParser` doesn't understand the HTTP body request 
	// data, Sails runs it again with an artificial header, forcing it to try
	// and parse the request body as JSON.  (this allows JSON to be used as your
	// request data without the need to specify a 'Content-type: application/json'
	// header)
	// 
	// If you want to change any of that, you can override the bodyParser with
	// your own custom middleware:
	// bodyParser: function customBodyParser (options) { ... return function(req, res, next) {...}; }
	// 
	// Or you can always revert back to the vanilla parser built-in to Connect/Express:
	// bodyParser: require('express').bodyParser,
	// 
	// Or to disable the body parser completely:
	// bodyParser: false,
	// (useful for streaming file uploads-- to disk or S3 or wherever you like)
	//
	// WARNING
	// ======================================================================
	// Multipart bodyParser (i.e. express.multipart() ) will be removed
	// in Connect 3 / Express 4.
	// [Why?](https://github.com/senchalabs/connect/wiki/Connect-3.0)
	//
	// The multipart component of this parser will be replaced
	// in a subsequent version of Sails (after v0.10, probably v0.11) with:
	// [file-parser](https://github.com/balderdashy/file-parser)
	// (or something comparable)
	// 
	// If you understand the risks of using the multipart bodyParser,
	// and would like to disable the warning log messages, uncomment:
	// silenceMultipartWarning: true,
	// ======================================================================



	// Cookie parser middleware to use
	//			(or false to disable)
	//
	// Defaults to `express.cookieParser`
	//
	// Example override:
	// cookieParser: (function customMethodOverride (req, res, next) {})(),



	// HTTP method override middleware
	//			(or false to disable)
	//
	// This option allows artificial query params to be passed to trick 
	// Sails into thinking a different HTTP verb was used.
	// Useful when supporting an API for user-agents which don't allow 
	// PUT or DELETE requests
	//
	// Defaults to `express.methodOverride`
	//
	// Example override:
	// methodOverride: (function customMethodOverride (req, res, next) {})()
};





/**
 * HTTP Flat-File Cache
 * 
 * These settings are for Express' static middleware- the part that serves
 * flat-files like images, css, client-side templates, favicons, etc.
 *
 * In Sails, this affects the files in your app's `assets` directory.
 * By default, Sails uses your project's Gruntfile to compile/copy those 
 * assets to `.tmp/public`, where they're accessible to Express.
 *
 * The HTTP static cache is only active in a 'production' environment, 
 * since that's the only time Express will cache flat-files.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.cache = {

	// The number of seconds to cache files being served from disk
	// (only works in production mode)
	maxAge: 31557600000
};
