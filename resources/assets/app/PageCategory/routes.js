(function() {
    'use strict';

    angular.module('mcms.pages.pageCategory')
        .config(config);

    config.$inject = ['$routeProvider','PAGES_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/pages/categories', {
                templateUrl:  Config.templatesDir + 'PageCategory/index.html',
                controller: 'PageCategoryHomeController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    init : ["AuthService", '$q', 'PageCategoryService', function (ACL, $q, Category) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Category.get();
                    }]
                },
                name: 'pages-categories'
            });
    }

})();
