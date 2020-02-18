<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/5/16
 * Time: 2:54 PM
 */

namespace App\Models\Categories;


use VatGia\Model\Model;

class Category extends Model
{
    public $table = 'categories_multi';
    public $prefix = 'cat';

    public function childs()
    {
        return $this->hasMany(
            __FUNCTION__,
            static::class,
            'cat_id',
            'cat_parent_id'
        );
    }
}