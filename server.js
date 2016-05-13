'use strict';
const express        = require('express'),
      passport       = require('passport'),
      GitHubStrategy = require('passport-github2').Strategy,
      queryString    = require('query-string'),
      PORT           = process.env.PORT || 3000;
const app            = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

var GITHUB_CLIENT_ID = "0e7410bd9b6abcf4064b";
var GITHUB_CLIENT_SECRET = "80a0a63535d6b9f37bf73a33c0831d829e2d85ec";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
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
  function(req, res) {

    var profileData = queryString.stringify({
      displayName : req.user.displayName,
      avatarUrl   : req.user._json.avatar_url,
      publicGists : req.user._json.public_gists
    });

    var data = queryString.stringify({
      id          : req.user.id,
      username    : req.user.username,
      accessToken : req.user.accessToken,
    });
    res.redirect('/?' + data);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});