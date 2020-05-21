const gulp = require("gulp");
const prettier = require("gulp-prettier");

/*
 * Apply prettier to all js files
 */
gulp.task("default", () => {
    return gulp
        .src([
            "./api/**/*.js",
            "./database/**/*.js",
            "./index.js",
            "./knexfile.js",
            "./package.json",
            "./gulpfile.js",
        ])
        .pipe(prettier({ editorconfig: true }))
        .pipe(gulp.dest((file) => file.base));
});
