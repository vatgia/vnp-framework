<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/5/16
 * Time: 2:54 PM
 */

namespace App\Models\BannerSlider;


use VatGia\Model\Model;

class Slider extends Model
{
    public $table = 'slider';
    public $prefix = 'sli';

    public function banners()
    {
        return $this->belongsToMany(
            __FUNCTION__,
            Banner::class,
            'banner_slider',
            'ban_id',
            'sli_id',
            'bsl_ban_id',
            'bsl_sli_id'
        );
    }
}