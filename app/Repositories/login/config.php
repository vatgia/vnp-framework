<?php
/**
 * Created by PhpStorm.
 * User: ntdinh1987
 * Date: 4/25/2017
 * Time: 10:35 AM
 */

return [
    'login/login_with_idvg_access_token' => [
        'title' => 'Đăng nhập hệ thống từ idvg access token info',
        'input' => [
            'access_token' => [
                'title' => 'User Info IDVG trả về từ access code',
                'rule' => 'required'
            ]
        ]
    ]
];