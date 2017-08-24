'use strict';

function error(code, message, originalError){
	this.code = code;
	this.message = message;
	if (originalError)
		this.originalError = originalError;
}

module.exports = error;