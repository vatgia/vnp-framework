<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 2/18/20
 * Time: 10:19
 */

namespace App\Transformers;


use League\Fractal\TransformerAbstract;

class CategoryTransformer extends TransformerAbstract
{

    public function transform($item)
    {

        return [
            'id' => (int)$item->id,
            'name' => $item->name
        ];
    }

}