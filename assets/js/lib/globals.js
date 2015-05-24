React = require('react');
_ = require('lodash');
async = require('async');
$ = require('jquery');
Spinner = require('./../../../public/vendor/react-spinner/index.jsx');
DOCKER_HOST = process.env.DOCKER_HOST;
EMAIL_AUTH_APP = process.env.NODE_ENV === "docker" ? process.env.EMAIL_AUTH_APP : "http://localhost:8000";
