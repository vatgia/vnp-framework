<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyen (ntdinh1987@gmail.com)
 * Date: 8/19/19
 * Time: 00:21
 */

namespace App\Transformers;


use League\Fractal\TransformerAbstract;

class NewsTransformer extends TransformerAbstract
{

    public $availableIncludes = [
        'category'
    ];

    public function transform($item)
    {

        return [
            'title' => $item->title,
            'teaser' => $item->teaser,
            'content' => $item->content
        ];
    }

    public function includeCategory($item)
    {
        return $this->item($item->category, new CategoryTransformer());
    }

}