const gulp = require('gulp');
const babel = require('gulp-babel');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('default', ['babel', 'jade', 'sass']);

gulp.task('babel', () => {
  return gulp.src("dev/js/client.js")
         .pipe( babel() )
         .pipe(gulp.dest('dist/js/'))
         .pipe( browserSync.stream() );
});

gulp.task('jade', function() {

  gulp.src('./dev/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe( browserSync.stream() );
});

gulp.task('sass', () => {
  gulp.src('./dev/sass/main.scss')
      .pipe( sass() )
      .pipe( gulp.dest('./dist/css/') )
      .pipe( browserSync.stream() );
});

/*
  Initialize browser-sync
*/

gulp.task('syncInit', () => {
  browserSync.init({
    server: './dist',
    logFileChanges: false
  });
});

gulp.task('sync', ['syncInit', 'watch']);

gulp.task('watch', function(){
  gulp.watch('./dev/sass/main.scss', ['sass']);
  gulp.watch('./dev/*.jade', ['jade']);
  gulp.watch('./dev/js/client.js', ['babel']);
});
