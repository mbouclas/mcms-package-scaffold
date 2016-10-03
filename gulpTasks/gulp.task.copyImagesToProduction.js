module.exports = (function (gulp,config,$) {
    'use strict';

    return function (){

        $.log('Copying image files to production');
        return gulp
            .src(config.imgDir)
            .pipe(gulp.dest(config.publicDirImg));
    }


});
