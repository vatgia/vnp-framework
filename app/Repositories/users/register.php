<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyễn <ntdinh1987@gmail.com>
 * Date: 8/28/20
 * Time: 10:46
 */

$name = input('name');
$email = input('email');
$phone = input('phone');
$password = input('password');

//Check user
if ($email && \App\Models\Users\Users::where('use_email', $email)->first()) {
    throw new RuntimeException(trans('messages.email_is_exists'), 409);
}

if (\App\Models\Users\Users::where('use_phone', $phone)->first()) {
    throw new RuntimeException(trans('messages.phone_is_exists'), 409);
}

$id = \App\Models\Users\Users::insert([
    'use_login' => $phone,
    'use_loginname' => $phone,
    'use_password' => md5($password),
    'use_phone' => $phone,
    'use_email' => (string)$email,
    'use_name' => (string)$name,
    'use_mobile' => $phone,
    'use_active' => 1
]);

$user = new user($phone, $password);
if ($user->logged) {
    $user->savecookie(30 * 6 + 86400);
}

return [
    'vars' => $id
];