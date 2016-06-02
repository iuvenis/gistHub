'use strict';

const express = require('express');
const router  = express.Router;

router.route('/users/:username/gists')
  .get((req, res) => {
    console.log('req req req', req);
  });

module.exports = gistRouter;