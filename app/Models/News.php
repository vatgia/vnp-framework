<?php
/**
 * Created by vatgia-framework.
 * Date: 8/4/2017
 * Time: 12:55 AM
 */

namespace App\Models;


use App\Models\Users\Users;
use VatGia\Model\Model;

class News extends Model
{

    public $table = 'posts';
    public $prefix = 'pos';

    public $soft_delete = true;

//    public $connection = 'slaves.web31';

    public function author()
    {
        return $this->hasOne('author', Users::class, 'use_id', 'user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(
            __FUNCTION__,
            Tags::class
        );
    }
}