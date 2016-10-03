var gulp = require('gulp');
var args = require('yargs').argv;
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});
$.log = log;
$.clean = clean;
var Config = require('./gulp.config');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
gulp.task('copyToProduction',[],require('./gulp.task.copyToProduction')(gulp,Config,$));
gulp.task('copyTemplatesToProduction',require('./gulp.task.copyTemplatesToProduction')(gulp,Config,$));
gulp.task('copyCssToProduction',require('./gulp.task.copyCssToProduction')(gulp,Config,$));
gulp.task('copyImgToProduction',require('./gulp.task.copyImagesToProduction')(gulp,Config,$));
gulp.task('watch',['copyToProduction','copyTemplatesToProduction'],require('./gulp.task.watch')(gulp,Config,$));
gulp.task('watch-templates',['copyTemplatesToProduction','copyCssToProduction','copyImgToProduction'],require('./gulp.task.watch-templates')(gulp,Config,$));

gulp.task('browserify',[],require('./gulp.task.browserify')(gulp,Config,$));
gulp.task('publish',['browserify','copyToProduction', 'copyTemplatesToProduction'],require('./gulp.task.publish')(gulp,Config,$));

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    fs.emptyDir(path,done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}