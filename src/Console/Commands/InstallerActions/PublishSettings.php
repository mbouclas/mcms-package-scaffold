<?php

namespace Mcms\Events\Console\Commands\InstallerActions;


use Illuminate\Console\Command;


/**
 * @example php artisan vendor:publish --provider="Mcms\Events\PagesServiceProvider" --tag=config
 * Class PublishSettings
 * @package Mcms\Events\Console\Commands\InstallerActions
 */
class PublishSettings
{
    /**
     * @param Command $command
     */
    public function handle(Command $command)
    {
        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Events\PagesServiceProvider',
            '--tag' => ['config'],
        ]);

        $command->comment('* Settings published');
    }
}