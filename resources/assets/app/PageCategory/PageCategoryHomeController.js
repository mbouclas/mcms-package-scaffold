(function() {
    'use strict';

    angular.module('mcms.pages.pageCategory')
        .controller('PageCategoryHomeController',Controller);

    Controller.$inject = ['init', 'LangService', 'Dialog', 'PageCategoryService', 'core.services', 'ItemSelectorService'];

    function Controller(Categories, Lang, Dialog, PageCategoryService, Helpers, ItemSelector) {
        var vm = this;
        vm.Categories = Categories;
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.treeOptions = {
            dragStop: function (ev) {

            }
        };

        PageCategoryService.find(3)
            .then(function (res) {
                vm.Item = res;
                vm.Connectors = ItemSelector.connectors();

            });

        vm.onResult = function (result) {
            if (typeof vm.Item.featured == 'undefined' || !vm.Item.featured){
                vm.Item.featured = [];
            }

            vm.Item.featured.push(result);
        };

        vm.onSave = function (item, isNew, parent) {
            if (isNew){
                if (parent){
                    if (!parent.children){
                        parent.children = [];
                    }

                    parent.children.push(item);
                } else {
                    vm.Categories.push(item);
                }
                PageCategoryService.toFlat();

                Dialog.close();
                vm.edit(item);
            }
            var found = PageCategoryService.where({id : item.id});

            if (found){
                found.title= item.title;
            }
        };

        vm.add = function (node) {
            node = node || null;
            var newCategory = PageCategoryService.newCategory();
            newCategory.parent_id = node.id;

            Dialog.show({
                title: (!node) ? 'Create root node' : 'Add node to "' + node.title[vm.defaultLang] + '"',
                contents: '<edit-page-category item="VM.node" add-to="VM.parentNode" ' +
                'on-save="VM.onSave(item, isNew, parent)"></edit-page-category>',
                locals: {
                    node: newCategory,
                    onSave: vm.onSave,
                    parentNode: node || null
                }
            });
        };

        vm.edit = function (node) {
            if (!node){
                node = PageCategoryService.newCategory();
            }

            Dialog.show({
                title: (node.id) ? 'Edit "' + node.title[vm.defaultLang] + '"' : 'Create new',
                contents: '<edit-page-category item="VM.node" ' +
                'on-save="VM.onSave(item, isNew)"></edit-page-category>',
                locals: {
                    node: (node.id) ? node.id : node,
                    onSave: vm.onSave
                }
            });

        };

        vm.save = function () {
            PageCategoryService.rebuild(vm.Categories)
                .then(function () {
                    Helpers.toast('Saved!');
                });
        };

        vm.delete = function (node) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    PageCategoryService.destroy(node)
                        .then(function (nodes) {
                            vm.Categories = nodes;
                            Helpers.toast('Deleted');
                        });
                });
        };
    }

})();
