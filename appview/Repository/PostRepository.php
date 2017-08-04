<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 4/27/2017
 * Time: 5:14 PM
 */

namespace AppView\Repository;


use VatGia\Helpers\Collection;

class PostRepository implements PostRepositoryInterface
{

    public function getByID($id)
    {
        $data = model('posts/get_post_by_id')->load([
            'id' => (int)$id
        ]);

        return new Collection($data['vars']);
    }

    public function all()
    {

    }
}