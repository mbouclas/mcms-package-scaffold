(function(){
    'use strict';

    angular.module('mcms.pages.pageCategory', [
        'ui.tree'
    ])
        .run(run);

    run.$inject = ['mcms.menuService'];

    function run(Menu) {

    }


})();

require('./routes');
require('./dataService');
require('./service');
require('./PageCategoryHomeController');
require('./editPageCategory.component');