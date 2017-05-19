var express = require('express');
var router = express.Router();
var User = require('../schema/User');
var ChuDe = require('../schema/ChuDe');
var HoiThoai = require('../schema/HoiThoai');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
/* GET home page. */
router.get('/course', function(req, res, next) {

	ChuDe.getallChude(function(err,chudes){
		HoiThoai.getallHoiThoai(function(err,hoithoais){
			
  				res.render('course', { 'chudes': chudes,'hoithoais':hoithoais});
  			
  		});
  	});
});
router.get('/logout', function(req, res, next) {
	req.logout();
	req.session.destroy();
	res.redirect('/');

});
router.get('/', function(req, res, next) {
  	res.render('home');
});
router.get('/login', function(req, res, next) {
  	res.render('login');
});
router.post('/chude/add', function(req, res, next) {
	var ten = req.body.name;
	var SoHuu = 1;
	var timeCreated = new Date();

	var newChuDe = new ChuDe({
		ten: ten,
		SoHuu: SoHuu,
		timeCreated: timeCreated,
	});
	ChuDe.createChuDe(newChuDe, function(err, chude){
			if(err) 
			{
				throw err;}
				else
				{
					res.location('/course');
					res.redirect('/course');
				}
		}); 
});
router.post('/addtopic', function(req, res, next) {
	var ten = req.body.name;
	var SoHuu = 0;
	var timeCreated = new Date();
	var author = req.session.user._id;
	console.log(author);
	var newChuDe = new ChuDe({
		ten: ten,
		SoHuu: SoHuu,
		author: author,
		timeCreated: timeCreated,
	});
	ChuDe.createChuDe(newChuDe, function(err, chude){
			if(err) 
			{
				throw err;}
				else
				{
					res.location('/course');
					res.redirect('/course');
				}
		}); 
});
router.post('/hoithoai/add', function(req, res, next) {
	var ten = req.body.name;
	var SoHuu = 1;
	var timeCreated = new Date();
	var id_chude = req.body.topic;

	var newHoiThoai = new HoiThoai({
		ten: ten,
		SoHuu: SoHuu,
		id_ChuDe: id_chude,
		timeCreated: timeCreated,
	});
	HoiThoai.createHoiThoai(newHoiThoai, function(err, hoithoai){
			if(err) 
			{
				throw err;}
				else
				{
					res.location('/course');
					res.redirect('/course');
				}
		}); 
});
router.post('/addconversaction', function(req, res, next) {
	var ten = req.body.name;
	var SoHuu = 0;
	var timeCreated = new Date();
	var author = req.session.user._id;
	var id_chude = req.body.idchude;

	var newHoiThoai = new HoiThoai({
		ten: ten,
		SoHuu: SoHuu,
		id_ChuDe: id_chude,
		timeCreated: timeCreated,
		author: author,
	});
	HoiThoai.createHoiThoai(newHoiThoai, function(err, hoithoai){
			if(err) 
			{
				throw err;}
				else
				{
					res.location('/course');
					res.redirect('/course');
				}
		}); 
});

router.post('/doanhoithoai/add', function(req, res, next) {
	var ten = req.body.name;
	var id_hoithoai = req.body.conversation;
	var nhanVat = {"name": ten};


	HoiThoai.addDoanHoiThoai(id_hoithoai, nhanVat,function(err, nhanvat){
		if(err) 
			{
				throw err;}
				else
				{
					res.location('/course');
					res.redirect('/course');
				}
	});
});

router.post('/doanhoithoainoi/add', function(req, res, next) {
	var say = req.body.say;
	var id_nhanvat = req.body.nhanvat;
	var timeCreated = new Date();
	var idhoithoai = req.body.idhoithoai;
	var DoanHoiThoai = {'name': id_nhanvat, 'say': say, 'timeCreated': timeCreated};


	HoiThoai.addDoanHoiThoaiNoi(idhoithoai, DoanHoiThoai,function(err, DoanHoiThoai){
		if(err) 
			{
				throw err;}
				else
				{
					res.send(DoanHoiThoai);
				}
	});
});

router.post('/addsay', function(req, res, next) {
	var say = req.body.say;
	var id_nhanvat = req.body.nhanvat;
	var timeCreated = new Date();
	var idhoithoai = req.body.idhoithoai;
	//var author = req.session.user._id;
	var DoanHoiThoai = {'name': id_nhanvat, 'say': say, 'timeCreated': timeCreated};


	HoiThoai.addDoanHoiThoaiNoi(idhoithoai, DoanHoiThoai,function(err, DoanHoiThoai){
		if(err) 
			{
				throw err;}
				else
				{
					res.send(DoanHoiThoai);
				}
	});
});
router.post('/getconversation', function(req, res, next) {
	var id = req.body.id;
	HoiThoai.getHoiThoaiById(id,function(err,hoithoai){
		res.send(hoithoai);
	});
});

router.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['user_about_me', 'email'] }));

router.get('/auth/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' }),function(req, res) {
		req.session.user = req.user;
		res.redirect('/course');
	});

passport.use(new FacebookStrategy({
		clientID: '1465225643494413',
		clientSecret: '6063714b30c0f33ee9f79cae0cf048c9',
		callbackURL: "http://english.baigiai.vn/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'email','picture']
	},
	function(accessToken, refreshToken, profile, done) {

		User.findIdFacebook(profile.id, function(err, user){
				if(err){
					return done(err);
				}
				if(user){
				
					return done(null, user);
			}
				else {
					if(profile.emails!=null)
					{
						User.checkEmail(profile.emails[0].value, function(err, user){
							console.log("1");
					if(err){
						throw err;
					}
					
					if(user==null)
					{
						console.log("2");
						var newUser = new User({
							username: accessToken,
							email: profile.emails[0].value,
							name: profile.displayName,
							facebook:{ id: profile.id},

						});
						// create user
						User.createUserFG(newUser, function(err, user){
							console.log("3");
							if(err) 
							{
								throw err;
							}
							else
							{
								return done(null,user);
							}
						}); 
						
					}
					else
					{
						console.log("4");
						User.insertIdFacebook(profile.id,profile.emails[0].value, function(err){
							console.log("5");
							if(err) 
							
								throw err;
							
							else
							
								return done(null,user);
							
						}); 
					}
				});
					}
			
				else
				{
					var newUser = new User({
						username: accessToken,
						name: profile.displayName,
						facebook:{ id: profile.id},
				});
					User.createUserFG(newUser, function(err, user)
					{
					if(err) 
					{
						throw err;}
					else
					{
						return done(null,user);
					}
				});
				}
			}
		});
		}
));

passport.use(new GoogleStrategy({
		clientID: '356027517781-bqdnsamsbh2d8sifs9h1qu4v6fudtrgj.apps.googleusercontent.com',
		clientSecret: 'tGKEMN2-HfIRNCZXs2UmKEsy',
		callbackURL: "http://english.baigiai.vn/google/callback",
		profileFields: ['id', 'displayName', 'email','picture']
	},
	function(accessToken, refreshToken, profile, done) {
			 User.findIdGoogle(profile.id, function(err, user){
			if(err){
				return done(err);
			}
			if(user)
				return done(null, user);
			else {
				User.checkEmail(profile.emails[0].value, function(err, user){
					console.log("1");
			if(err){
				throw err;
			}
				
			if(user==null)
			{
				console.log("2");
				var newUser = new User({
					username: accessToken ,
					email: profile.emails[0].value,
					name: profile.displayName,
					google:{ id: profile.id},
					});
				console.log(newUser);
					// create user
				User.createUserFG(newUser, function(err, user){
					console.log("3");
					if(err) 
							{
								throw err;}
					else
					{
						return done(null,user);
					}
				}); 
					
			}
			else
			{
				User.insertIdGoogle(profile.id,profile.emails[0].value, function(err){
					console.log("4");
					if(err) 
						throw err;
					else
						return done(null,user);
				}); 
			}
			});
				}
		});
	}
));

router.get('/auth/google',
	passport.authenticate('google', { scope: ['email'] }));

router.get('/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),function(req, res) {
		req.session.user = req.user;
		res.redirect('/course');
	});

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
		User.getUserById(id, function(err, user) {
			
		done(err, user);
	});
});

router.get('/:id&:idchude', function(req, res, next) {
	var iddoanhoithoai = req.params.id;
	var idchude = req.params.idchude;
	var name = "";
	ChuDe.getallChude(function(err,chudes){
		HoiThoai.getallHoiThoai(function(err,hoithoais){
			HoiThoai.getHoiThoaiById(req.params.id,function(err,nhanvats){
				ChuDe.getChuDeById(req.params.idchude,function(err,tenchude){
  					res.render('index', { 'chudes': chudes,'hoithoais':hoithoais,'nhanvats':nhanvats, 'iddoanhoithoai':iddoanhoithoai, 'name':name, 'tenchude':tenchude,'idchude':idchude});
  				});
  			});
  		});
  	});
});
router.post('/practice', function(req, res, next) {
	var iddoanhoithoai = req.body.IDdoanhoithoai;
	var idchude = req.body.idchude;
	var name = req.body.example;
	ChuDe.getallChude(function(err,chudes){
		HoiThoai.getallHoiThoai(function(err,hoithoais){
			HoiThoai.getHoiThoaiById(iddoanhoithoai,function(err,nhanvats){
				ChuDe.getChuDeById(idchude,function(err,tenchude){
  					res.render('thuam', { 'chudes': chudes,'hoithoais':hoithoais,'nhanvats':nhanvats, 'iddoanhoithoai':iddoanhoithoai, 'name':name, 'tenchude':tenchude,'idchude':idchude});
  				});
  			});
  		});
  	});
});
router.post('/register',function(req, res, next) {
	var name = req.body.first + " " + req.body.last
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	
	req.checkBody('password2','Mật khẩu không đúng').equals(req.body.password);

	// check for errors
	var errors = req.validationErrors();
	if(errors){
		res.render('login',{
			errors: errors
		});
	} else {
		User.checkUsername(username,function(err, user){
			if(err){
					throw err;
				}
			if(user==null)
			{
				User.checkEmail(email, function(err, user){
				if(err){
			
					throw err;

				}
				
				if(user==null)
				{
				
					var newUser = new User({
					email: email,
					name: name,
					username: username,
					password: password
					});
					// create user
					User.createUser(newUser, function(err, user){
						if(err) 
							{throw err;}
						else
						{		
									req.session.user = user;
									res.location('/course');
									res.redirect('/course');
						}
					}); 

				}
				else
				{
					res.location('/');
					res.redirect('/');
				}
			});
			}
			else
			{
				res.location('/');
				res.redirect('/');
			}
		});
			
	}
});
router.post('/signup',passport.authenticate('local',{failureRedirect:'/login'}),function(req, res) {
	req.session.user = req.user;
	res.redirect('/course');
});
passport.use(new LocalStrategy(
	function(username, password, done){
		User.checkUsername(username, function(err,user){
			if(err) throw err;
			if(!user){
				console.log('Unknown user');
				return done(null,false);
			}
			User.compare(password, user.password,function(err,ismatch){
				if(err) throw err;
				if(ismatch){
					return done(null, user);
				}
				else
				{
					return done(null,false);
				}
			});
		});
	}
));
router.post('/removeconversation', function(req, res, next) {
	var id = req.body.idhoithoai;
	HoiThoai.deleteHoiThoai(id,function(err,hoithoai){
		res.send(hoithoai);
	});
});
module.exports = router;
