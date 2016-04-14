
var config = require("./config.json"),
  gulp=require("gulp"),
  babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015"),
  webpack = require("gulp-webpack"),
  react = require("gulp-react");

var PATH = config.path;
gulp.task("default",function(){
  gulp.src(PATH.jsx+"/*.jsx")
    .pipe(react())
    .pipe(babel({presets:[es2015]}))
    .pipe(gulp.dest(PATH.js))
    .pipe(webpack({
      output:{
        filename:"all.js",
      },
      stats:{
        colors:true
      }
    }))
    .pipe(gulp.dest(PATH.js));
});
