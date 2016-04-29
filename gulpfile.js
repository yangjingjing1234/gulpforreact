
var config = require("./config.json"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	less = require("gulp-less"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	clean = require("gulp-clean"),
	notify = require("gulp-notify"),
	minifycss = require("gulp-minify-css"),
	postcss= require("gulp-postcss"),
	px2rem = require("postcss-px2rem"),
	plumber = require("gulp-plumber"),
	changed = require("gulp-changed"),
	tinypng = require("gulp-tinypng"),
	rev = require("gulp-rev");

var PATH = config.path;
var _env = gulp.env;
var _isPxToRem = _env.isflexible&&_env.isflexible=="true" || false;
var _isPublish = _env.environment&&_env.environment=="release" || false;

var selfNotify = notify.withReporter(function(options,callback){
	options.templateOptions={
		date:new Date()
	}
	callback();
});
gulp.task("clean",function(){
	return gulp.src([PATH.distJsPath,PATH.distCssPath],{read:false})
	.pipe(plumber({errorHandler:notify.onError("Clean Error:<%=error.message %>")}))
	.pipe(clean({force:true}))
	.pipe(selfNotify({
		title:"Clean Css,Js,Image",
		message:"Clean task complete."
	}));
});

gulp.task("js:compile",function(){
	if(_isPublish){
		return gulp.src(PATH.jsPath+"*.js")
		.pipe(changed(PATH.distJsPath))
		.pipe(plumber({errorHandler:notify.onError("JS Error:<%=error.message %>")}))
		.pipe(rename({suffix:".min"}))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(rev.manifest())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"JS minify",message:"JS task complete."}));
	}else{
		return gulp.src(PATH.jsPath+"*.js")
		.pipe(changed(PATH.distJsPath))
		.pipe(plumber({errorHandler:notify.onError("JS Error:<%=error.message %>")}))
		.pipe(rename({suffix:".min"}))
		.pipe(uglify())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"JS minify",message:"JS task complete."}));
	}
	
});

gulp.task("less:compile",function(){
	
	if(_isPublish){
		if(_isPxToRem){
			var processors = [px2rem({remUnit:75})];
			return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
				.pipe(changed(PATH.distCssPath))
				.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
				.pipe(less())
				.pipe(postcss(processors))
				.pipe(rename({suffix:".min"}))
				.pipe(minifycss())
				.pipe(rev())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(rev.manifest())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}else{
			return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
				.pipe(changed(PATH.distCssPath))
				.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
				.pipe(less())
				.pipe(rename({suffix:".min"}))
				.pipe(minifycss())
				.pipe(rev())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(rev.manifest())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}
	}else{
		if(_isPxToRem){
			var processors = [px2rem({remUnit:75})];
			return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
				.pipe(changed(PATH.distCssPath))
				.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
				.pipe(less())
				.pipe(postcss(processors))
				.pipe(rename({suffix:".min"}))
				.pipe(minifycss())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}else{
			return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
				.pipe(changed(PATH.distCssPath))
				.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
				.pipe(less())
				.pipe(rename({suffix:".min"}))
				.pipe(minifycss())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}
	}
});
var APPKEY = "DkizKeUPgUeOrOn08-sJJn7i_GrmWKRa";
gulp.task("image::compile",function(){
	if(_isPublish){
		return gulp.src(PATH.imagePath+"**")
		.pipe(changed(PATH.distImagePath))
		.pipe(plumber({errorHandler:notify.onError("Images Error:<%=error.message %>")}))
		.pipe(tinypng(APPKEY))
		.pipe(rev())
		.pipe(gulp.dest(PATH.distImagePath))
		.pipe(rev.manifest())
		.pipe(gulp.dest(PATH.distImagePath))
		.pipe(selfNotify({title:"Image minify",message:"Image task complete."}));
	}else{
		return gulp.src(PATH.imagePath+"**")
		.pipe(changed(PATH.distImagePath))
		.pipe(plumber({errorHandler:notify.onError("Images Error:<%=error.message %>")}))
		.pipe(tinypng(APPKEY))
		.pipe(gulp.dest(PATH.distImagePath))
		.pipe(selfNotify({title:"Image minify",message:"Image task complete."}));
	}
	
});
gulp.task("browsersync",function(){
	browsersync.init({
		// ui:{
		// 	port:80
		// },
		server:{baseDir:PATH.rootPath},
		// port:80,
		// host:"test.kaolafm.com",
		// proxy:{
		// 	target:"test.kaolafm.com/liveproject/liveroom",
		// 	middleware:function(req,res,next){
		// 		console.log(req.url);
		// 		next();
		// 	}
		// }
	});
});
gulp.task("watch",function(){
	gulp.watch(PATH.htmlPath+"**/*.html",browsersync.reload);
	gulp.watch(PATH.cssPath+"less/*.less",["less:compile",browsersync.reload]);
	gulp.watch(PATH.imagePath+"**",["image::compile",browsersync.reload]);
	gulp.watch(PATH.jsPath+"**/*.js",["js:compile",browsersync.reload]);
})
gulp.task("default",["clean"],function(){
	gulp.start("js:compile","less:compile","image::compile","watch","browsersync");
});
