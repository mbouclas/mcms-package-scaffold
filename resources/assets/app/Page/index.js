(function(){
    'use strict';

    angular.module('mcms.pages.page', [
        'cfp.hotkeys'
    ])
        .run(run);

    run.$inject = ['mcms.widgetService'];

    function run(Widget) {
        Widget.registerWidget(Widget.newWidget({
            id : 'latestPages',
            title : 'Latest pages',
            template : '<latest-pages-widget></latest-pages-widget>',
            settings : {}
        }));

    }
})();

require('./routes');
require('./dataService');
require('./service');
require('./PageHomeController');
require('./PageController');
require('./pageList.component');
require('./editPage.component');
require('./Widgets/latestPages.widget');
