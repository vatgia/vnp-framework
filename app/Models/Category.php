<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 2/18/20
 * Time: 09:59
 */

namespace App\Models;


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