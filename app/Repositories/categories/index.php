<?php
/**
 * Created by vatgia-framework.
 * Date: 6/27/2017
 * Time: 11:39 AM
 *
 * @todo Lấy danh sách danh mục
 */

function transform(\App\Models\Categories\Category $item)
{
    return [
        'id' => (int)$item->id,
        'name' => $item->name,
        'picture' => $item->picture,
        'icon' => $item->icon,
        'rewrite' => $item->rewrite,
        'seo' => [
            'title' => $item->title_seo,
            'description' => $item->description_seo,
            'keywords' => $item->keywords_seo
        ]
    ];
}

$page = input('page') ? input('page') : 1;
$limit = input('limit') ? input('limit') : 10;

$items = \App\Models\Categories\Category::pagination($page, $limit)->select_all();


foreach ($items as $key => &$item) {
    $items[$key] = transform($item);
}

return [
    'vars' => array_values($items->toArray()),
    'meta' => [
        'pagination' => [

        ]
    ]
];