(function() {
    'use strict';

    angular.module('mcms.pages.page')
        .config(config);

    config.$inject = ['$routeProvider','PAGES_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/pages/content', {
                templateUrl:  Config.templatesDir + 'Page/index.html',
                controller: 'PageHomeController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    init : ["AuthService", '$q', 'PageService', function (ACL, $q, Page) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Page.init();
                    }]
                },
                name: 'pages-home'
            })
            .when('/pages/content/:id', {
                templateUrl:  Config.templatesDir + 'Page/editPage.html',
                controller: 'PageController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    item : ["AuthService", '$q', 'PageService', '$route', function (ACL, $q, Page, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Page.find($route.current.params.id);
                    }]
                },
                name: 'pages-edit'
            });
    }

})();
