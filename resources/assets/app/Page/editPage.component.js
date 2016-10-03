(function () {
    angular.module('mcms.pages.page')
        .directive('editPage', Directive);

    Directive.$inject = ['PAGES_CONFIG', 'hotkeys'];
    DirectiveController.$inject = [ '$scope','PageService',
        'core.services', 'configuration', 'AuthService', 'LangService',
        'PageCategoryService',  'PAGES_CONFIG', 'ItemSelectorService', 'lodashFactory',
        'mcms.settingsManagerService', 'SeoService', 'LayoutManagerService', '$timeout', '$rootScope', '$q',
        'momentFactory', 'ModuleExtender', 'MediaLibraryService'];

    function Directive(Config, hotkeys) {

        return {
            templateUrl: Config.templatesDir + "Page/editPage.component.html",
            controller: DirectiveController,
            controllerAs: 'VM',
            require : ['editPage'],
            scope: {
                options: '=?options',
                item: '=?item',
                onSave : '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    hasFilters: true
                };


                scope.refreshIframe = function () {
                    var iframe = document.getElementById('preview');
                    if (!iframe){
                        return;
                    }

                    iframe.contentDocument.location.reload(true);
                };

                hotkeys.add({
                    combo: 'ctrl+s',
                    description: 'save',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function(e) {
                        e.preventDefault();
                        controllers[0].save();
                    }
                });

                controllers[0].init(scope.item);
                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function DirectiveController($scope, Page, Helpers, Config, ACL, Lang, PageCategory, PagesConfig,
                                 ItemSelector, lo, SM, SEO, LMS, $timeout, $rootScope, $q,
                                 moment, ModuleExtender, MLS) {
        var vm = this,
            autoSaveHooks = [],
            Model = '\\IdeaSeven\\Pages\\Models\\Page';

        vm.published_at = {};
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();
        vm.ValidationMessagesTemplate = Config.validationMessages;
        vm.Roles = ACL.roles();
        vm.Item = {};
        vm.Roles = ACL.roles();
        vm.Permissions = ACL.permissions();
        vm.isSu = ACL.role('su');//more efficient check
        vm.isAdmin = ACL.role('admin');//more efficient check


        vm.tabs = [
            {
                label : 'General',
                file : PagesConfig.templatesDir + 'Page/Components/tab-general-info.html',
                active : true,
                default : true,
                id : 'general',
                order : 1
            },
            {
                label : 'Translations',
                file : PagesConfig.templatesDir + 'Page/Components/tab-translations.html',
                active : false,
                id : 'translations',
                order : 20
            },
            {
                label : 'Image gallery',
                file : PagesConfig.templatesDir + 'Page/Components/tab-image-gallery.html',
                active : false,
                default : false,
                id : 'imageGallery',
                order : 30
            },
            {
                label : 'Files',
                file : PagesConfig.templatesDir + 'Page/Components/tab-file-gallery.html',
                active : false,
                default : false,
                id : 'fileGallery',
                order : 40
            },
/*            {
                label : 'Extra Fields',
                file : PagesConfig.templatesDir + 'Page/Components/tab-extra-fields.html',
                active : false,
                id : 'extraFields',
            },*/
            {
                label : 'Related Items',
                file : PagesConfig.templatesDir + 'Page/Components/tab-related-items.html',
                active : false,
                alias : 'related',
                order : 50
            },
            {
                label : 'SEO',
                file : PagesConfig.templatesDir + 'Page/Components/tab-seo.html',
                active : false,
                alias : 'seo',
                order : 60
            }
        ];

        vm.tabs = ModuleExtender.extend('pages', vm.tabs);

        vm.Categories = [];
        vm.thumbUploadOptions = {
            url : Config.imageUploadUrl,
            acceptSelect : PagesConfig.fileTypes.image.acceptSelect,
            maxFiles : 1,
            params : {
                container : 'Item'
            }
        };

        vm.imagesUploadOptions = {
            url : PagesConfig.imageUploadUrl,
            acceptSelect : PagesConfig.fileTypes.image.acceptSelect,
            params : {
                container : 'Item'
            },
            uploadOptions : PagesConfig.fileTypes.image.uploadOptions
        };
        vm.mediaFilesOptions = {imageTypes : [], withMediaLibrary : true};
        vm.UploadConfig = {
            file : {},
            image : vm.imagesUploadOptions
        };

        vm.FileUploadConfig = {
            url : Config.fileUploadUrl,
            acceptedFiles : PagesConfig.fileTypes.file.acceptSelect,
            uploadOptions : PagesConfig.fileTypes.file.uploadOptions,
            params : {
                container : 'Item'
            }
        };

        vm.Layouts = LMS.layouts('pages.items');
        vm.LayoutsObj = LMS.toObj();
        vm.categoriesValid = null;

        vm.init = function (item) {
            if (!item.id){
                //call for data from the server
                return Page.find(item)
                    .then(init);
            }

            init(item);

        };


        vm.exists = function (item, type) {
            type = (!type) ? 'checkForPermission' : 'checkFor' + type;
            return ACL[type](vm.User, item);
        };

        vm.save = function () {

            if (!$scope.ItemForm.$valid){
                $q.reject();
            }

            var isNew = (!(typeof vm.Item.id == 'number'));

            vm.Item.published_at = Helpers.deComposeDate(vm.publish_at).toISOString();


            return Page.save(vm.Item)
                .then(function (result) {
                   Helpers.toast('Saved!');

                    if (isNew){
                        vm.Item = result;
                    }

                    if (typeof $scope.onSave == 'function'){
                        $scope.onSave({item : result, isNew : isNew});
                    }

                    return result;
                });
        };

        vm.onResult = function (result) {
            if (typeof vm.Item.related == 'undefined' || !vm.Item.related){
                vm.Item.related = [];
            }

            result.source_item_id = vm.Item.id;

            vm.Item.related.push(result);
        };

        vm.removeCategory = function (cat) {
            vm.Item.categories.splice(lo.findIndex(vm.Item.categories, {id : cat.id}), 1);

            if (vm.Item.categories.length == 0){
                vm.categoriesValid = null;
            }
        };

        vm.onCategorySelected = function (cat) {

            if (!cat || typeof cat.id == 'undefined'){
                return;
            }

            if (lo.find(vm.Item.categories, {id : cat.id})){
                return;
            }

            vm.Item.categories.push(cat);
            vm.categoriesValid = true;
            vm.searchText = null;
        };

        vm.getCategories = function (query) {

            if (vm.Categories.length > 0){
                return (!query) ? vm.Categories : vm.Categories.filter( Helpers.createFilterFor('title',query) );
            }

            return PageCategory.tree()
                .then(function (res) {
                    vm.Categories = res;
                    return (!query) ? res : res.filter( Helpers.createFilterFor('title',query) );
                });
        };

        function init(item) {
            vm.Item = item;
            if (typeof vm.Item.files == 'undefined'){
                vm.Item.files = [];
            }
            SEO.fillFields(vm.Item.settings, function (model, key) {
                SEO.prefill(model, vm.Item, key);
            });
            // console.log(lo.find(vm.Layouts, {varName : vm.Item.settings.Layout.id}));
            vm.publish_at = Helpers.composeDate(vm.Item.published_at);
            vm.SEO = SEO.fields();
            vm.Connectors = ItemSelector.connectors();
            vm.thumbUploadOptions.params.item_id = item.id;
            vm.thumbUploadOptions.params.model = Model;
            vm.thumbUploadOptions.params.type = 'thumb';

            vm.imagesUploadOptions.params.item_id = item.id;
            vm.imagesUploadOptions.params.model = Model;
            vm.imagesUploadOptions.params.type = 'images';
            vm.FileUploadConfig.params.item_id = item.id;
            vm.FileUploadConfig.params.model = Model;
            vm.FileUploadConfig.params.type = 'file';
            LMS.setModel(vm.Item);
            vm.Settings = SM.get({name : 'pages'});
            if (lo.isArray(vm.Item.categories) && vm.Item.categories.length > 0){
                vm.categoriesValid = true;
            }
        }



        var watcher = null,
            timer = null;
        /*
        * autosave
        * */
        watcher = $scope.$watch(angular.bind(vm, function () {
            var publishDate = Helpers.deComposeDate(vm.publish_at);
            if (publishDate.isAfter(moment())){
                vm.Item.active = false;
                vm.disableStatus = true;
                vm.toBePublished = publishDate;
            } else {
                vm.disableStatus = false;
            }
            return this.Item;
        }), function (newVal) {

            if(timer){
                $timeout.cancel(timer);
            }


            if (typeof newVal.id == 'undefined' || !newVal.id){
                watcher();
                return;
            }

            timer = $timeout(function () {
                vm.save().then(function (item) {

                    for (var i in autoSaveHooks){
                        autoSaveHooks[i].call(this, item);
                    }
                });
            }, 5000);

        }, true);

        $rootScope.$on('page.preview', function (e, preview) {
            if (preview){
                autoSaveHooks.push($scope.refreshIframe);
            } else {
                autoSaveHooks.splice(autoSaveHooks.indexOf($scope.refreshIframe), 1);
            }
        });

        vm.onSelectFromMediaLibrary = function (item) {
            MLS.assign(vm.thumbUploadOptions.params,item)
                .then(function (res) {
                    vm.Item.thumb = res;
                    Helpers.toast('Saved!!!');
                });
        };

    }
})();
