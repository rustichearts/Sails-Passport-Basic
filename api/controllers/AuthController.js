/**
 * AuthController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');

var AuthController = {

    login: function (req,res)
    {
        res.view("auth/login");
    },

    process: function(req, res)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if ((err) || (!user))
            {
                res.redirect('/login');
                return;
            }

            req.logIn(user, function(err)
            {
                if (err)
                {
                    res.view();
                    return;
                }

                res.redirect('/dashboard');
                return;
            });
        })(req, res);
    },

    logout: function (req,res)
    {
        req.logout();
        res.redirect('/');
    }

};

module.exports = AuthController;
