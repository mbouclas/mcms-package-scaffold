<?php

namespace Mcms\Events\StartUp;

use Widget;

class RegisterWidgets
{
    public function handle()
    {
        Widget::create([
            'name' => 'recentNews',
            'instance' => \Mcms\Events\Widgets\RecentNews::class
        ]);

        Widget::create([
            'name' => 'otherNews',
            'instance' => \Mcms\Events\Widgets\RecentNews::class
        ]);
    }
}