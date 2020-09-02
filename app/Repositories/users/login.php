<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyễn <ntdinh1987@gmail.com>
 * Date: 9/1/20
 * Time: 11:29
 */

return [
    'vars' => \VatGia\Auth\Facade\Auth::login((string)input('username'), (string)input('password'), (bool)input('remember'))
];