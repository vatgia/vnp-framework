<?php

use App\Models\News;
use App\Models\Users\Users;
use App\Transformers\UserTransformer;
use League\Fractal\Pagination\Cursor;
use VatGia\Cache\Facade\Cache;
use VatGia\Helpers\Transformer\TransformerPaginatorAdapter;


//Test paginator

dd(1);

$page = 1;
$page_size = 1;

$handle = fopen(ROOT . '/ipstore/test.txt', 'a+');
fwrite($handle, 1 . PHP_EOL);
fclose($handle);

$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));
$item = News::findByID(input('id'));


return [
    'vars' => transformer_item($item, new \App\Transformers\NewsTransformer())
];


//$model = new News();
//dd($model, $model->query->store->use_slave);
//$items = $model->all();

//dd($items);
/*
$userModel = new Users;
$items = $userModel->pagination($page, $page_size)->all();
$total = $userModel->count();
$paginator = new TransformerPaginatorAdapter($total, $page, $page_size);
$vars = transformer_collection_paginator($items, new UserTransformer(), $paginator);

dd($vars);
*/
return [
    'vars' => $user->toArray()
];


$user = App\Models\Users\Users::where('use_name', "Nguyễn Thế Định")->where('use_id', [88, 1246, 1324])->first();
$user = App\Models\Users\Users::useConnection('slaves.web31')->where('use_name', "Nguyễn Thế Định")->where('use_id', [88, 1246, 1324])->first();
$user = App\Models\Users\Users::useConnection('slaves.web32')->where('use_name', "Nguyễn Thế Định")->where('use_id', [88, 1246, 1324])->first();
$user = App\Models\Users\Users::useSlave('web32')->where('use_name', "Nguyễn Thế Định")->where('use_id', [88, 1246, 1324])->first();


dd($user);

$post = Cache::get('news_detail_' . input('id'));
if (!$post) {
    $post = News::with([
        [
            'author',
            function ($model) {
                return $model->where('use_active = 1');
            }
        ],
//        'tags'
    ])
        ->from('posts')->find('pos_id = ' . input('id'));
}

//$post1 = News::with([
//    'tags',
//    ['author', function ($model) {
//        return $model->where('use_active = 1');
//    }]
//])->all();

//dd($post1->toArray());
//dd($post->toArray(false), $post1);

dd($post);
if ($post) {
    return [
        'vars' => [
            'id' => (int)$post->id,
            'title' => $post->title,
            'author' => [
                'id' => $post->author->id,
                'name' => $post->author->name,
            ],
        ],
    ];
} else {
    return [
        'vars' => [],
    ];
}