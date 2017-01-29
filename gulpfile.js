var gulp = require('gulp'),
    sass = require('gulp-sass'), //plugin to compile sass
    postcss = require('gulp-postcss'), //handles css plugins like autoprefixer and cssnano
    autoprefixer = require('autoprefixer'), //autoprefixes css
    cssnano = require('cssnano'), //minifies css
	  sourcemaps = require('gulp-sourcemaps'), //maps css to sass file in the DOM
    concat = require('gulp-concat'), //concatenates js into one file
    uglify = require('gulp-uglify'), //minifies js
    pug = require('gulp-pug'), //plugin to compile pug (renamed from jade) templates
  	imagemin = require('gulp-imagemin'), //optimize images
	  cache = require('gulp-cache'), //caches images so that minified images dont get reprocessed
    bs = require('browser-sync').create();



 // SASS

var sassSrc = ['src/sass/*.scss'],
	  sassDist = ['public/css'];

gulp.task('css', function () {
    var processors = [
        autoprefixer(),
        cssnano(),
    ],
  	sassOptions = {
  	  errLogToConsole: true,
  	  outputStyle: 'compressed'
  	};
    return gulp.src(sassSrc)
		.pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .pipe(postcss(processors))
		    .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('public/css'))
        .pipe(bs.reload({stream: true}));
});

// JAVASCRIPT

var jsSrc = ['src/scripts/*.js'],
	  jsDist = ['public/js'];

gulp.task('js', function() {
    gulp.src(jsSrc)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

// PUG (for builds that aren't using express)

var pugIndexSrc = ['src/pug/*.pug'],
    pugIncludesSrc = ['src/pug/includes/*.pug'];


gulp.task('pugIndex', function() {
   return gulp.src(pugIndexSrc)
     .pipe(pug())
     .pipe(gulp.dest(''));
});

gulp.task('pugIncludes', function() {
   return gulp.src(pugIncludesSrc)
     .pipe(pug())
     .pipe(gulp.dest('includes'));
});

gulp.task('pug', ['pugIndex', 'pugIncludes']);

// ASSETS

gulp.task('images', function(){
   return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
   .pipe(cache(imagemin({
       interlaced: true
     })))
   .pipe(imagemin())
   .pipe(gulp.dest('public/img'))
});

// LIVE RELOAD

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: 'src'
        }
    })
});

// WATCH

gulp.task('watch', ['browser-sync'] function() {
    gulp.watch(sassSrc, ['css']);
    gulp.watch(jsSrc, ['js']);
	  gulp.watch([pugIndexSrc, pugIncludesSrc], ['pug']);
});


gulp.task('default', ['css', 'js', 'pug', 'watch']);
