<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyễn <ntdinh1987@gmail.com>
 * Date: 8/28/20
 * Time: 10:07
 */

namespace AppView\Repository;


class UserRepository
{

    public function register($name, $email, $phone, $password, $retype_password)
    {
        $password = trim($password);
        $retype_password = trim($retype_password);

        if (!$password) {
            throw new \RuntimeException(trans('messages.password_is_required', 'Bạn phải nhập mật khẩu'));
        }
        if ($password != $retype_password) {
            throw new \RuntimeException(trans('messages.retype_password_is_wrong', 'Mật khẩu xác nhận không chính xác'));
        }

        $result = repository('users/register')->post([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => $password
        ]);

        return $result['vars'];
    }

    public function login($username, $password, $remember = false): bool
    {

        $result = repository('users/login')->post([
            'username' => $username,
            'password' => $password,
            'remember' => (bool)$remember
        ]);

        return (bool)$result['vars'];
    }
}