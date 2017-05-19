var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://localhost/PMGG');
//
var ChuDeSchema = new  mongoose.Schema({
	ten: String,
	// neu so huu = 1 thi thuoc ve tat ca, 0 la thuoc ve ca nhan
	SoHuu: String,
	// nguoi tao chu de
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	// 
	timeCreated: {type: Date, default:Date.now}
	
});

var ChuDe = module.exports = conn.model('ChuDe',ChuDeSchema);

module.exports.getallChude = function(callback){
	ChuDe.find({}, callback);
	
}
module.exports.createChuDe = function(newChuDe,callback){
		newChuDe.save(callback);
}
module.exports.getChuDeById = function(id, callback){
	ChuDe.findById(id, callback);
}