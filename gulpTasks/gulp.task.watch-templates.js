module.exports = (function (gulp,config,$) {
    'use strict';

    return function (){

        $.log('Copying templates to production');
        return gulp
            .watch([
                config.templatesDir,
                config.cssDir,
                config.imgDir
            ], ['copyTemplatesToProduction','copyCssToProduction','copyImgToProduction']);
    }


});
