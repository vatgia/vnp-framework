<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 4/4/18
 * Time: 00:39
 */

namespace AppView\Middlewares;


class UserAuthFromCookie
{

    public function __invoke()
    {
        // TODO: Implement __invoke() method.
        $result = model('config/index')->load([]);
        app()->singleton('auth', $result['vars']['user']);
    }
}