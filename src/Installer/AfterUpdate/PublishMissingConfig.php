<?php

namespace Mcms\Events\Installer\AfterUpdate;


use IdeaSeven\Core\Models\UpdatesLog;
use Illuminate\Console\Command;

class PublishMissingConfig
{
    public function handle(Command $command, UpdatesLog $item)
    {
        $item->result = true;
        $item->save();
        $command->comment('All done in PublishMissingConfig');
    }
}