<?php

use App\Models\Setting;

$code = input('code');

$value = Setting::where('swe_key', '=', $code)->first();

return [
    'vars' => $value ? transformer_item($value, new \App\Transformers\SettingTransformer()) : null,
];