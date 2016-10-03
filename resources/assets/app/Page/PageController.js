(function() {
    'use strict';

    angular.module('mcms.pages.page')
        .controller('PageController',Controller);

    Controller.$inject = ['item', 'LangService', '$location', '$filter', '$scope', '$rootScope', 'PAGES_CONFIG'];

    function Controller(Item, Lang, $location, $filter, $scope, $rootScope, Config) {
        var vm = this;

        vm.Item = Item;
        vm.defaultLang = Lang.defaultLang();
        vm.previewAvailable = !(!Config.previewUrl);


        vm.onSave = function (item, isNew) {
            if (isNew){
                $location.path($filter('reverseUrl')('pages-edit',{id : item.id}).replace('#',''));
            }
        };

        vm.preview = function () {
            if (typeof vm.Item.id == 'undefined'){
                return;
            }

            vm.previewSrc = Config.previewUrl + vm.Item.id;
            $scope.preview = !$scope.preview;
            $scope.layout = ($scope.preview) ? 'row' : 'column';

            $rootScope.$broadcast('sideNav.unlock', !$scope.preview);
            $rootScope.$broadcast('page.preview', $scope.preview);



        };

    }

})();
