<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/3/18
 * Time: 13:29
 */

namespace App\Transformers;


use League\Fractal\TransformerAbstract;

class SettingTransformer extends TransformerAbstract
{

    public function transform($item)
    {
        if ($item->type === 'image') {
            $data = [
                'id' => (int)$item->id,
                'key' => $item->key,
                'user_id' => (int)$item->user_id,
                'type' => $item->type,
                'value' => url() . '/upload/settings/' . $item->value
            ];
        } else {
            $data = [
                'id' => (int)$item->id,
                'key' => $item->key,
                'user_id' => (int)$item->user_id,
                'type' => $item->type,
                'value' => html_entity_decode($item->value)
            ];
        }
        return $data;
    }

}