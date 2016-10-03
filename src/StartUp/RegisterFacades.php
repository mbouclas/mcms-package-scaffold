<?php

namespace Mcms\Events\StartUp;


use App;
use Illuminate\Support\ServiceProvider;

/**
 * Register your Facades/aliases here
 * Class RegisterFacades
 * @package Mcms\Events\StartUp
 */
class RegisterFacades
{
    /**
     * @param ServiceProvider $serviceProvider
     */
    public function handle(ServiceProvider $serviceProvider)
    {

        /**
         * Register Facades
         */
        $facades = \Illuminate\Foundation\AliasLoader::getInstance();
//        $facades->alias('ModuleRegistry', \Mcms\Events\Facades\ModuleRegistryFacade::class);
        
    }
}