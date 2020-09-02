<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 4/4/18
 * Time: 00:40
 */

namespace AppView\Middlewares;


use VatGia\Auth\Facade\Auth;

class LoginRequire
{

    public function __invoke()
    {
        // TODO: Implement __invoke() method.
        if (Auth::isLogged()) {
            return;
        }
        redirect(url('login'));
    }
}