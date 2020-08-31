<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyễn <ntdinh1987@gmail.com>
 * Date: 8/31/20
 * Time: 18:25
 */

$key = input('key');
$value = input('value');
$type = input('type');
$user_id = input('user_id');

if ($user_id && !\App\Models\Users\Users::findByID($user_id)) {
    throw new RuntimeException(trans('messages.user_is_not_exists', 'Người dùng không tồn tại'), 404);
}

$vars = \App\Models\Setting::insertUpdate([
    'swe_key' => $key,
    'swe_value' => $value,
    'swe_label' => $key,
    'swe_type' => $type,
    'swe_user_id' => $user_id
], [
    'swe_value' => $value
]);

return [
    'vars' => $vars ?? []
];