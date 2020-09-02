<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/8/16
 * Time: 11:50 AM
 */

return [
    'users/index' => [
        'title' => 'Danh sách người dùng',
        'input' => [
        ]
    ],
    'users/login' => [
        'title' => 'Đăng nhập',
        'input' => [
            'username' => [],
            'password' => [],
            'remember' => []
        ]
    ],
    'users/register' => [
        'title' => 'Đăng ký người dùng mới',
        'input' => [
            'name' => [
                'title' => 'Tên người dùng',
                'rule' => 'required'
            ],
            'email' => [
                'title' => 'Email',
                'rule' => 'valid_email'
            ],
            'phone' => [
                'title' => 'Số điện thoại',
                'rule' => 'required|phone_number'
            ],
            'password' => [
                'title' => 'Mật khẩu',
                'rule' => 'required|min_len,6'
            ],
        ]
    ],
];