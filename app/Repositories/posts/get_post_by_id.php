<?php

$vars = false;

//insert demo post
\App\Models\News::replace([
    'pos_id' => 1,
    'pos_title' => 'Tesst',
    'pos_rewrite' => 'test',
    'pos_teaser' => 'Test',
    'pos_content' => 'Test',
    'pos_active' => 1
]);


$item = \App\Models\News::where('pos_active', 1)->findByID(input('id'));
if ($item) {
    $vars = transformer_item($item, new \App\Transformers\NewsTransformer(), ['category']);
}


return [
    'vars' => $vars
];