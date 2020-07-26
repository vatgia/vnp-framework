<?php

$vars = false;

$item = \App\Models\News::mustHave(['tags'])->findByID(input('id'));

if ($item) {
    $vars = transformer_item($item, new \App\Transformers\NewsTransformer(), ['category']);
}

return [
    'vars' => $vars
];