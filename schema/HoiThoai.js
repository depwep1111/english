var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://localhost/PMGG');
//
var HoiThoaiSchema = new  mongoose.Schema({
	ten: String,
	// neu so huu = 1 thi thuoc ve tat ca, 0 la thuoc ve ca nhan
	SoHuu: String,
	// nguoi tao chu de
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	// 
	id_ChuDe: {type: mongoose.Schema.Types.ObjectId, ref: 'ChuDe'},

	timeCreated: {type: Date, default:Date.now},
	//
	image:{type: String, default:'../images/avatar_user.png'},

	nhanVat:[{name:String}],

	DoanHoiThoai:[{name: String, say: String, timeCreated: {type: Date, default:Date.now}}],
});

var HoiThoai = module.exports = conn.model('HoiThoai',HoiThoaiSchema);

module.exports.getallHoiThoai = function(callback){
	HoiThoai.find({}, callback);
	
}
module.exports.createHoiThoai = function(newHoiThoai,callback){
		newHoiThoai.save(callback);
}

module.exports.addDoanHoiThoai = function(id,nhanVat, callback){
	HoiThoai.update({_id:id}, {$push:{"nhanVat":nhanVat}},callback);
}

module.exports.addDoanHoiThoaiNoi = function(id,DoanHoiThoai, callback){
	HoiThoai.update({_id:id}, {$push:{"DoanHoiThoai":DoanHoiThoai}},callback);
}
module.exports.getHoiThoaiById = function(id, callback){
	HoiThoai.findById(id, callback);
}
module.exports.deleteHoiThoai = function(id,callback){

	HoiThoai.remove({_id:id},callback);
}