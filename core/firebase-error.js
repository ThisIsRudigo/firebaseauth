'use strict';

const constants = require('./constants');

function error(code, message){
	this.code = code;
	this.message = message;
}

module.exports = error;