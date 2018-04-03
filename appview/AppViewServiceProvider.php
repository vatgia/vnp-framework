<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 4/4/18
 * Time: 01:05
 */

namespace AppView;


use AppView\Commands\WelcomeCommand;
use AppView\Repository\PostRepository;
use AppView\Repository\PostRepositoryInterface;
use AppView\Middlewares\UserAuthFromCookie;
use AppView\Middlewares\LoginRequire;
use VatGia\Helpers\ServiceProvider;
use VatGia\Helpers\Facade\Route;

class AppViewServiceProvider extends ServiceProvider
{

    public function register()
    {

        $this->registerBindingRepository();

        $this->registerCommands();
    }

    public function boot()
    {

        $this->loadRoutes();
    }

    public function routeFilter()
    {
        Route::filter(UserAuthFromCookie::class, new UserAuthFromCookie);
        Route::filter(LoginRequire::class, new LoginRequire);
    }

    public function loadRoutes()
    {

        $this->routeFilter();

        Route::group([
            'before' => [
                UserAuthFromCookie::class
            ]
        ], function () {
            $this->loadRoutesFrom(base_path('appview/routes/web.php'));
        });
    }

    public function registerBindingRepository()
    {
        $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
    }

    public function registerCommands()
    {
        $this->commands([
            WelcomeCommand::class
        ]);
    }

}