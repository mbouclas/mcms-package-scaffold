(function () {
    angular.module('mcms.pages.page')
        .directive('editPageCategory', Directive);

    Directive.$inject = ['PAGES_CONFIG', '$timeout'];
    DirectiveController.$inject = ['$scope', 'PageCategoryService',
        'core.services', 'configuration', 'AuthService', 'LangService',
        'PAGES_CONFIG', 'ItemSelectorService', 'SeoService', 'mcms.settingsManagerService',
        'LayoutManagerService', 'ModuleExtender'];

    function Directive(Config, $timeout) {

        return {
            templateUrl: Config.templatesDir + "PageCategory/editPageCategory.component.html",
            controller: DirectiveController,
            controllerAs: 'VM',
            require: ['editPageCategory'],
            scope: {
                options: '=?options',
                addTo: '=?addTo',
                item: '=?item',
                onSave: '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    hasFilters: true
                };

                controllers[0].init(scope.item);
                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function DirectiveController($scope, PageCategory, Helpers, Config, ACL, Lang, PagesConfig, ItemSelector, SEO, SM, LMS, ModuleExtender) {
        var vm = this;
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();
        vm.ValidationMessagesTemplate = Config.validationMessages;
        vm.Roles = ACL.roles();
        vm.Item = {};
        vm.Parent = null;
        vm.Roles = ACL.roles();
        vm.Permissions = ACL.permissions();
        vm.isSu = ACL.role('su');//more efficient check
        vm.isAdmin = ACL.role('admin');//more efficient check
        vm.tabs = [
            {
                label: 'General',
                file: PagesConfig.templatesDir + 'PageCategory/Components/tab-general-info.html',
                active: true,
                default: true,
                id: 'general',
                order : 1
            },
            {
                label: 'Translations',
                file: PagesConfig.templatesDir + 'PageCategory/Components/tab-translations.html',
                active: false,
                id: 'translations',
                order : 10
            },
            {
                label: 'Extra Fields',
                file: PagesConfig.templatesDir + 'Page/Components/tab-extra-fields.html',
                active: false,
                id: 'extraFields',
                order : 20
            },
            {
                label: 'Featured',
                file: PagesConfig.templatesDir + 'PageCategory/Components/tab-featured.html',
                active: false,
                id: 'featured',
                order : 30
            },
            {
                label : 'SEO',
                file : PagesConfig.templatesDir + 'PageCategory/Components/tab-seo.html',
                active : false,
                id : 'seo',
                order : 40
            }
        ];

        vm.tabs = ModuleExtender.extend('pages', vm.tabs);
        vm.Layouts = LMS.layouts('pages.categories');
        vm.LayoutsObj = LMS.toObj();

        vm.thumbUploadOptions = {
            url : Config.imageUploadUrl,
            acceptSelect : PagesConfig.fileTypes.image.acceptSelect,
            maxFiles : 1,
            params : {
                container : 'Item'
            }
        };
        vm.UploadConfig = {
            file: {},
            image: vm.imagesUploadOptions
        };

        vm.init = function (item) {
            if (typeof item == 'number') {
                //call for data from the server
                return PageCategory.find(item)
                    .then(init);
            }

            init(item);

        };

        vm.onResult = function (result) {
            if (typeof vm.Item.featured == 'undefined' || !vm.Item.featured){
                vm.Item.featured = [];
            }

            result.category_id = vm.Item.id;
            vm.Item.featured.push(result);
        };


        vm.save = function () {
            PageCategory.save(vm.Item)
                .then(function (result) {
                    var isNew = (!vm.Item.id && result.id);
                    if (isNew) {
                        vm.Item = result;
                        vm.Item.children = [];
                    }

                    Helpers.toast('Saved!');

                    if (typeof $scope.onSave == 'function') {
                        $scope.onSave({item: vm.Item, isNew: isNew, parent: vm.Parent});
                    }
                });
        };

        function init(item) {
            vm.Connectors = ItemSelector.connectors();
            vm.Item = item;

            SEO.fillFields(vm.Item.settings, function (model, key) {
                SEO.prefill(model, vm.Item, key);
            });

            vm.SEO = SEO.fields();
            vm.Parent = $scope.addTo || null;
            vm.thumbUploadOptions.params.item_id = item.id;
            vm.thumbUploadOptions.params.configurator = '\\IdeaSeven\\Pages\\Services\\PageCategory\\ImageConfigurator';
            vm.thumbUploadOptions.params.type = 'thumb';
            vm.Settings = SM.get({name : 'pageCategories'});
            LMS.setModel(vm.Item);
        }
    }
})();
