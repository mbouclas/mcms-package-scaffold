<?php

namespace Mcms\Events\StartUp;

use IdeaSeven\Core\Services\SettingsManager\SettingsManagerService;
use Illuminate\Support\ServiceProvider;

class RegisterSettingsManager
{
    public function handle(ServiceProvider $serviceProvider)
    {
        SettingsManagerService::register('pages', 'page_settings.pages');
        SettingsManagerService::register('pageCategories', 'page_settings.categories');
    }
}