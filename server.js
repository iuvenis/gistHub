'use strict';
const express        = require('express'),
      ghClient       = require('./public/keys.js'),
      passport       = require('passport'),
      GitHubStrategy = require('passport-github2').Strategy,
      queryString    = require('query-string'),
      PORT           = process.env.PORT || 3000;
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
  function(req, res) {

    var resData = queryString.stringify({
      id          : req.user.id,
      username    : req.user.username,
      accessToken : req.user.accessToken,
    });
    var profileData = queryString.stringify({
      displayName : req.user.displayName,
      avatarUrl   : req.user._json.avatar_url,
      publicGists : req.user._json.public_gists
    });
    res.redirect('/?' + resData);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});