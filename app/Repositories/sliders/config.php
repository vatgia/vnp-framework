<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/8/16
 * Time: 11:50 AM
 */

return [
    'sliders/from_code' => [
        'title' => 'Lấy danh sách banner tại 1 vị trí',
        'input' => [
        	'code' => [
                'title' => 'Mã vị trí',
                'rule' => 'required'
            ],
            'limit' => [
                'title' => 'Limit',
                'rule' => 'integer'
            ],
        ]
    ],
];