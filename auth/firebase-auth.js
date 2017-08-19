const emailPasswordProvider = require('./email-password-provider');

function FirebaseAuth(apiKey){
	this.apiKey = apiKey;
}

FirebaseAuth.prototype.signInWithEmail = function(email, password, callback) {
	
};

module.exports = FirebaseAuth;