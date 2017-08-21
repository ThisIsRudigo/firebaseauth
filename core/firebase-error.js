'use strict';

function error(code, message){
	this.code = code;
	this.message = message;
}

module.exports = error;