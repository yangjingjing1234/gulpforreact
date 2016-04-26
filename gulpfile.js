
var config = require("./config.json"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	less = require("gulp-less"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	babel = require("gulp-babel"),
	clean = require("gulp-clean"),
	notify = require("gulp-notify"),
	es2015 = require("babel-preset-es2015"),
	presetreact = require("babel-preset-react"),
	minifycss = require("gulp-minify-css"),
	postcss= require("gulp-postcss"),
	px2rem = require("postcss-px2rem"),
	plumber = require("gulp-plumber"),
	webpack = require("gulp-webpack"),
	changed = require("gulp-changed"),
	rev = require("gulp-rev");

var PATH = config.path;
var _env = gulp.env;
var _isPxToRem = _env.isflexible&&_env.isflexible=="true" || false;
var selfNotify = notify.withReporter(function(options,callback){
	options.templateOptions={
		date:new Date()
	}
	callback();
});
gulp.task("clean",function(){
	return gulp.src([PATH.cssPath+"*.min.css",PATH.jsPath+"*.min.js"],{read:false})
	.pipe(plumber({errorHandler:notify.onError("Clean Error:<%=error.message %>")}))
	.pipe(clean({force:true}))
	.pipe(selfNotify({
		title:"Clean Css,Js,Image",
		message:"Clean task complete."
	}));
});

gulp.task("reactes6:compile",function(){
	return gulp.src(PATH.jsPath+"jsx/*.jsx")
		.pipe(changed(PATH.jsPath))
		.pipe(plumber({errorHandler:notify.onError("React ES6 Error:<%=error.message %>")}))
		.pipe(babel({"presets":[presetreact,es2015]}))
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest(PATH.jsPath))
		.pipe(webpack({
			output:{
        path:PATH.jsPath,
        filename:"[name].js",
      },
      stats: {
          // Nice colored output
          colors: true
      },
		}))
		.pipe(rev())
		.pipe(gulp.dest(PATH.jsPath))
		.pipe(selfNotify({title:"React JSX (use ES6) to js and minify",message:"JSX task complete."}));
});

gulp.task("less:compile",function(){
	if(_isPxToRem){
		var processors = [px2rem({remUnit:75})];
		return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
			.pipe(changed(PATH.cssPath))
			.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
			.pipe(less())
			.pipe(postcss(processors))
			.pipe(gulp.dest(PATH.cssPath))
			.pipe(rename({suffix:".min"}))
			.pipe(minifycss())
			.pipe(rev())
			.pipe(gulp.dest(PATH.cssPath))
			.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
	}else{
		return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
			.pipe(changed(PATH.cssPath))
			.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
			.pipe(less())
			.pipe(gulp.dest(PATH.cssPath))
			.pipe(rename({suffix:".min"}))
			.pipe(minifycss())
			.pipe(rev())
			.pipe(gulp.dest(PATH.cssPath))
			.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
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
	gulp.watch(PATH.htmlPath+"*.html",browsersync.reload);
	gulp.watch(PATH.cssPath+"less/*.less",[browsersync.reload]);
	gulp.watch(PATH.imagePath+"*",browsersync.reload);
	gulp.watch(PATH.jsPath+"jsx/*.jsx",[browsersync.reload]);
})
gulp.task("default",["clean"],function(){
	gulp.start("reactes6:compile","less:compile","watch","browsersync");
});
