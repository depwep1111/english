var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://localhost/PMGG');
var bcrypt = require('bcrypt');
//
var userSchema = new  mongoose.Schema({
	username: String,
	password: {type: String, bcrypt:true},
	name: String,
	email:String,
	avatar: {type: String, default:'../images/avatar_user.png'},
	facebook: {id:String},
	google: {id:String},
	timeCreated: {type: Date, default:Date.now},
});

var User = module.exports = conn.model('User',userSchema);

module.exports.findIdFacebook = function(idFacebook, callback){

var query = {facebook:{id:idFacebook}};
	User.findOne(query, callback);
	
}
module.exports.checkEmail = function(email, callback){

var query = {email:email};
	User.findOne(query, callback);

}
module.exports.createUserFG = function(newUser,callback){
		newUser.save(callback);
}
module.exports.insertIdFacebook = function(id,email, callback){
	var query = {email:email};
	User.update(query,{$set:{facebook:{id:id}}},callback);
}
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
module.exports.findIdGoogle = function(idGoogle, callback){

var query = {google:{id:idGoogle}};
	User.findOne(query, callback);
	
}
module.exports.insertIdGoogle = function(id,email, callback){
	var query = {email:email};
	User.update(query,{$set:{google:{id:id}}},callback);
}
module.exports.checkUsername = function(username, callback){

var query = {username:username};
	User.findOne(query, callback);
	
}
module.exports.checkEmail = function(email, callback){

var query = {email:email};
	User.findOne(query, callback);

}
module.exports.createUser = function(newUser,callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		newUser.password = hash;
		newUser.save(callback);
	});
	
}
module.exports.compare = function(password,hash, callback){
	bcrypt.compare(password,hash,function(err,ismatch){
		if(err) throw callback(err);
		callback(null,ismatch);

	});
}