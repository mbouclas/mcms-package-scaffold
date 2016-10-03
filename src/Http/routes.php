<?php

Route::group(['prefix' => 'admin/api'], function () {
    Route::group(['middleware' =>['level:2']], function($router)
    {

    });

});