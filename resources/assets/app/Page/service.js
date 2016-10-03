(function () {
    'use strict';

    angular.module('mcms.pages.page')
        .service('PageService',Service);

    Service.$inject = ['PageDataService', 'LangService', 'lodashFactory', 'mediaFileService',
        '$q', 'PageCategoryService', 'ItemSelectorService', 'mcms.settingsManagerService',
        'SeoService', 'TagsService', '$location', 'PAGES_CONFIG'];

    function Service(DS, Lang, lo, MediaFiles, $q, PageCategoryService, ItemSelector, SM, SEO, Tags, $location, Config) {
        var _this = this;
        var Pages = [];
        this.get = get;
        this.init = init;
        this.find = find;
        this.newPage = newPage;
        this.save = save;
        this.destroy = destroy;


        function init(filters) {
            filters = filters || {};
            var params = $location.search();
            if (typeof params.page != 'undefined' && params.page){
                filters.page = params.page;
            }

            var tasks = [
                get(filters),
                categories()
            ];

            return $q.all(tasks);
        }

        function get(filters) {
            return DS.index(filters)
                .then(function (response) {
                    Pages = response;
                    return Pages;
                });
        }

        function categories() {
            return PageCategoryService.tree();
        }

        function find(id) {
            return DS.show(id)
                .then(function (response) {
                    ItemSelector.register(response.connectors);
                    MediaFiles.setImageCategories(response.imageCategories);
                    SM.addSettingsItem(response.settings);
                    if (typeof response.config == 'undefined' || typeof response.config.previewController == 'undefined'){
                        Config.previewUrl = null;
                    }
                    SEO.init(response.seoFields);
                    Tags.set(response.tags);
                    return response.item || newPage();
                });
        }

        function newPage() {
            return {
                title : Lang.langFields(),
                slug : '',
                description : Lang.langFields(),
                description_long : Lang.langFields(),
                active : false,
                categories : [],
                extraFields : [],
                tagged : [],
                related : [],
                files : [],
                settings : {
                    seo : {}
                },
                id : null
            };
        }

        function save(item) {
            if (!item.id){
                return DS.store(item);
            }


            return DS.update(item);
        }

        function destroy(item) {
            return DS.destroy(item.id);
        }



    }
})();
