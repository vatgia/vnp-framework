<?php
/**
 * Created by PhpStorm.
 * User: ntdinh1987
 * Date: 4/25/2017
 * Time: 10:35 AM
 */

use App\Models\Users\Users;

$access_token = input('access_token')[0]['access_token'];
$info = input('access_token')[0]['acc'];
//$facebook_token = input('access_token')[0]['facebook_token'];

if ($info) {
    $user_info = Users::find('use_email = \'' . $info['email'] . '\'');
    if (!$user_info) {

        $info['access_token'] = $access_token;

        $user_info = Users::createUserFromDataIdVg($info);
        $user_info = Users::find('use_email = \'' . $info['email'] . '\'');
    }

    if ($user_info) {
        $myUser = new user();

        $_COOKIE[$myUser->pre_cookie . "loginname"] = $user_info['use_email'];
        $_COOKIE[$myUser->pre_cookie . "PHPSESSlD"] = $user_info['use_password'];

        $myUser = new \user();
        $myUser->logged = 1;
        $myUser->savecookie(2 * 86400);
    }

    return [
        'vars' => [
            'success' => true,
            'info' => $user_info
        ]
    ];
}

