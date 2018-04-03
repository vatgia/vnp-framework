<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 4/27/2017
 * Time: 5:14 PM
 */

namespace AppView\Repository;


class PostRepository implements PostRepositoryInterface
{

    /**
     * @param $id
     * @return bool|\VatGia\Helpers\Collection
     */
    public function getByID($id)
    {
        $result = model('posts/get_post_by_id')->load([
            'id' => (int)$id
        ]);

        return $result['vars'] ? collect_recursive($result['vars']) : false;
    }

    public function all()
    {

    }
}