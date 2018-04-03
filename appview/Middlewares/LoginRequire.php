<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 4/4/18
 * Time: 00:40
 */

namespace AppView\Middlewares;


class LoginRequire
{

    public function __invoke()
    {
        // TODO: Implement __invoke() method.
        if(app()->has('auth') && app('auth')->logged)
        {
            return;
        }

        redirect('/login');
    }
}