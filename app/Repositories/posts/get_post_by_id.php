<?php

use App\Models\News;
use App\Models\Users\Users;
use App\Transformers\UserTransformer;
use League\Fractal\Pagination\Cursor;
use VatGia\Cache\Facade\Cache;
use VatGia\Helpers\Transformer\TransformerPaginatorAdapter;


//Test paginator

//dd(1);
$vars = false;

$handle = fopen(ROOT . '/ipstore/test.txt', 'a+');
fwrite($handle, 1 . PHP_EOL);
fclose($handle);

$item = News::findByID(input('id'));
if ($item) {
    $vars = transformer_item($item, new \App\Transformers\NewsTransformer());
}

return [
    'vars' => $vars
];