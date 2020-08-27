<?php
/**
 * Created by amall.
 * Date: 8/30/2017
 * Time: 3:13 PM
 */

use App\Models\Setting;
use App\Transformers\SettingTransformer;

$items = Setting::all();
$items = $items->keyBy('swe_key');
$items = transformer_collection($items, new SettingTransformer());
return [
    'vars' => $items,
];