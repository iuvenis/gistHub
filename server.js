'use strict';

const express        = require('express'),
const ghClient       = require('./public/js/keys.js'),
const passport       = require('passport'),
const GitHubStrategy = require('passport-github2').Strategy,
const queryString    = require('query-string'),
const gistRouter     = require('./public/js/router.js'),
const PORT           = process.env.PORT || 3000;

const app            = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: ghClient.GITHUB_CLIENT_ID,
    clientSecret: ghClient.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(accessToken);
      return done(null, profile);
    });
  }
));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'gist', 'user:email' ] }),
  function(req, res){
  });

app.get('/user', function(req, res){
  res.json(req.user);
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res, next) {
    // console.log(res);
    let username = req.user.username;
    let resData = queryString.stringify({
      id          : req.user.id,
      username    : req.user.username,
      accessToken : req.user.accessToken,
    });
    let profileData = queryString.stringify({
      displayName : req.user.displayName,
      avatarUrl   : req.user._json.avatar_url,
      publicGists : req.user._json.public_gists
    });
    res.redirect('/?' + resData);
    next();
  });


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
