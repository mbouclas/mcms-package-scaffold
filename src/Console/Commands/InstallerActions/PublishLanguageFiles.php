<?php

namespace Mcms\Events\Console\Commands\InstallerActions;


use Illuminate\Console\Command;

/**
 * Class PublishLanguageFiles
 * @package Mcms\Events\Console\Commands\InstallerActions
 */
class PublishLanguageFiles
{
    /**
     * @param Command $command
     */
    public function handle(Command $command)
    {
        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Events\PagesServiceProvider',
            '--tag' => ['lang'],
        ]);


        $command->call('core:translations:import');
        $command->comment('* Language files published');
    }
}