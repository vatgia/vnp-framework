<?php
/**
 * Created by vatgia-framework.
 * Date: 8/4/2017
 * Time: 12:55 AM
 */

namespace App\Models;


use App\Models\Users\Users;
use VatGia\Helpers\Translation\ModelTranslationTrait;
use VatGia\Model\Model;

class News extends Model
{

    public $table = 'posts';
    public $prefix = 'pos';

    public $soft_delete = true;

    //Sử dụng cho các table đa ngôn ngữ
    use ModelTranslationTrait;
    //Các column đa ngôn ngữ
    public $localeFields = ['title'];

    //Table cần kết nối đến 1 databse khác
    //public $connection = 'slaves.web31';

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

    public function category()
    {
        return $this->hasOne(
            __FUNCTION__,
            Category::class,
            'cat_id',
            'pos_category_id'
        );
    }
}