<?php

$vars = [];

$page = input('page') ? input('page') : 1;
$page_size = input('page_size') ? input('page_size') : 10;

$items = \App\Models\Customer::pagination($page, $page_size)->all();

if ($items->count()) {
    $vars = transformer_collection($items, new \App\Transformers\CustomerTransformer());
}

return [
    'vars' => $vars
];