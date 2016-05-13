
var config = require("./gulpconfig.json"),
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
	rev = require("gulp-rev"),
	tinypng = require("gulp-tinypng"),
	modRewrite  = require('connect-modrewrite');

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
	return gulp.src([PATH.distJsPath+"**/*",PATH.distCssPath+"**/*.css"],{read:false})
	.pipe(plumber({errorHandler:notify.onError("Clean Error:<%=error.message %>")}))
	.pipe(clean({force:true}))
	.pipe(selfNotify({
		title:"Clean Css,Js,Image",
		message:"Clean task complete."
	}));
});

gulp.task("js:compile",function(){
	if(_isPublish){
		return gulp.src([PATH.jsPath+"*.js","!"+PATH.jsPath+"libs/**"])
		.pipe(changed(PATH.distJsPath))
		.pipe(plumber({errorHandler:notify.onError("JS Error:<%=error.message %>")}))
		.pipe(rename({suffix:".min"}))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(rev.manifest())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"JS minify",message:"JS package task complete."}));
	}else{
		return gulp.src([PATH.jsPath+"*.js","!"+PATH.jsPath+"libs/**"])
		.pipe(changed(PATH.distJsPath))
		.pipe(plumber({errorHandler:notify.onError("JS Error:<%=error.message %>")}))
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"JS copy to dist",message:"JS copy task complete."}));
	}
});

gulp.task("es6:compile",function(){
	if(_isPublish){
	return gulp.src(PATH.jsPath+"**/*.es6")
		.pipe(changed(PATH.jsPath))
		.pipe(plumber({errorHandler:notify.onError("ES6 Error:<%=error.message %>")}))
		.pipe(babel({"presets":[es2015]}))
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(webpack({
			output:{
			path:PATH.jsPath,
			filename:"[name]_jsx.js",
			},
			stats: {
			// Nice colored output
			colors: true
			},
		}))
		.pipe(rev())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(rev.manifest())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"ES6 to js and minify",message:"ES6 package task complete."}));
      }else{
      	return gulp.src(PATH.jsPath+"**/*.es6")
		.pipe(changed(PATH.jsPath.es6+"**/*.es6"))
		.pipe(plumber({errorHandler:notify.onError("ES6 Error:<%=error.message %>")}))
		.pipe(babel({"presets":[es2015]}))
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(webpack({
			output:{
			path:PATH.jsPath,
			filename:"[name]_es6.js",
			},
			stats: {
			// Nice colored output
			colors: true
			},
		}))
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"ES6 to js and minify",message:"ES6 package task complete."}));
      }
});

gulp.task("reactes6:compile",function(){
	if(_isPublish){
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
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(rev.manifest())
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"React JSX (use ES6) to js and minify",message:"JSX package task complete."}));
  }else{
    return gulp.src(PATH.jsPath+"jsx/*.jsx")
		.pipe(changed(PATH.jsPath))
		.pipe(plumber({errorHandler:notify.onError("React ES6 Error:<%=error.message %>")}))
		.pipe(babel({"presets":[presetreact,es2015]}))
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
		.pipe(gulp.dest(PATH.distJsPath))
		.pipe(selfNotify({title:"React JSX (use ES6) to js and minify",message:"JSX package task complete."}));
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
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}else{
			return gulp.src([PATH.cssPath+"less/*.less","!"+PATH.cssPath+"less/{common,public}.less"])
				.pipe(changed(PATH.distCssPath))
				.pipe(plumber({errorHandler:notify.onError("Less Error:<%=error.message %>")}))
				.pipe(less())
				.pipe(gulp.dest(PATH.distCssPath))
				.pipe(selfNotify({title:"Less to Css and minify",message:"CSS task complete."}));
		}
	}
});
var APPKEY = "DkizKeUPgUeOrOn08-sJJn7i_GrmWKRa";
gulp.task("image:compile",function(){
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
		.pipe(gulp.dest(PATH.distImagePath))
		.pipe(selfNotify({title:"Images copy to dist",message:"Images copy task complete."}));
	}

});
gulp.task("browsersync",function(){
	browsersync.init({
		// ui:{
		// 	port:80
		// },
		//server:{baseDir:PATH.rootPath},
		// server: {
		// 	baseDir: PATH.rootPath,
		// 	middleware: [
		// 		modRewrite(['^([^.]+)$ /index.html [L]'])
		// 	]
		// },
		//rewriteRules:[
		//{
		//	match:"/Cannot GET/g",
		//	fn:function(match){
		//		return "/";
		//	}
		//}
		//],
		// port:80,
		//host:"127.0.0.1/work/pageFactory",
		proxy:{
			target:"http://taotaole.local/",
			middleware: [
				// modRewrite(['^/(.*)/(.*)$ http://taotaole.local/$1/$2.html [L]'])
			]
		}
	});
});
gulp.task("watch",function(){
	gulp.watch(PATH.htmlPath+"**/*.html",browsersync.reload);
	gulp.watch(PATH.cssPath+"less/*.less",["less:compile",browsersync.reload]);
	gulp.watch(PATH.imagePath+"**",["image:compile",browsersync.reload]);
	gulp.watch(PATH.jsPath+"**/*.js",["js:compile",browsersync.reload]);
	gulp.watch(PATH.jsPath+"jsx/*.jsx",["reactes6:compile",browsersync.reload]);
	//gulp.watch(PATH.jsPath+"**/*.es6",["es6:compile",browsersync.reload]);
})
gulp.task("default",["clean"],function(){
	gulp.start("browsersync","js:compile","reactes6:compile","less:compile","image:compile","watch");
	//gulp.start("js:compile","reactes6:compile","less:compile","image:compile","watch");
});
