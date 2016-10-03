(function(){
    'use strict';

    angular.module('mcms.pages.page')
        .directive('latestPagesWidget', Component);

    Component.$inject = ['PAGES_CONFIG', 'PageService'];

    function Component(Config, Page){

        return {
            templateUrl: Config.templatesDir + "Page/Widgets/latestPages.widget.html",
            restrict : 'E',
            link : function(scope, element, attrs, controllers){
                scope.Options = {limit : 5};
                Page.init({limit : scope.Options.limit}).then(function (res) {
                    scope.Categories = res[1];
                    scope.Items = res[0];

                });
            }
        };
    }
})();