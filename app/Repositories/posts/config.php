<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/8/16
 * Time: 11:50 AM
 */

return [
    'posts/get_post_by_id' => [
        'title' => 'Lấy chi tiết bài viết từ ID',
        'input' => [
            'id' => [
                'title' => 'ID bài viết',
                'rule' => 'required|integer'
            ]
        ]
    ],
    'posts/index' => [
        'title' => 'Danh sách bài viết',
        'input' => [
            'page' => [
                'title' => 'Số trang',
                'rule' => 'integer|min_numeric,0'
            ]
        ]
    ]
];