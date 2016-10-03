<?php

namespace Mcms\Events\StartUp;


use Mcms\Events\Menu\PagesInterfaceMenuConnector;
use Mcms\Events\Models\Page;
use Illuminate\Support\ServiceProvider;
use ModuleRegistry, ItemConnector;

class RegisterAdminPackage
{
    public function handle(ServiceProvider $serviceProvider)
    {
        ModuleRegistry::registerModule($serviceProvider->packageName . '/admin.package.json');
        try {
            ItemConnector::register((new PagesInterfaceMenuConnector())->run()->toArray());
        } catch (\Exception $e){

        }
    }
}