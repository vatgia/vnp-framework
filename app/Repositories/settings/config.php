<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/8/16
 * Time: 11:50 AM
 */

return [
    'settings/from_code' => [
        'title' => 'Lấy giá trị 1 setting từ setting key',
        'input' => [
            'code' => [
                'title' => 'Setting code',
                'rule' => 'required',
            ],
        ],
    ],

    'settings/all' => [
        'title' => 'Lấy tất cả settings',
        'input' => [],
    ],
];