<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 6/20/18
 * Time: 10:11
 */

namespace App\Transformers;


use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{

    public $availableIncludes = [
        'child'
    ];

    public $defaultIncludes = [
        'child'
    ];

    public function transform($item)
    {
        return [
            'id' => (int)$item->id
        ];
    }

    public function includeChild($item)
    {
        return $this->collection($item, function ($item) {
            return [
                'id' => 1
            ];
        });
    }

}