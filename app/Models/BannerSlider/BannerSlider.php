<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/5/16
 * Time: 2:54 PM
 */

namespace App\Models\BannerSlider;


use VatGia\Model\Model;

class BannerSlider extends Model
{
    public $table = 'banner_slider';
    public $prefix = 'bsl';

    public function getBannerSlider($cond = array())
    {
        $this->inner_join('banner', 'ban_id = bsl_ban_id');
        $this->inner_join('slider', 'sli_id = bsl_sli_id');

        if (!empty($cond['key_slider'])) {
            $this->where('sli_key = "' . $cond['key_slider'] . '"');
        }

        $this->order_by('bsl_order', 'ASC');

        if ($cond['limit'] > 0) {
            $this->limit($cond['limit']);
        }

        return $this->select_all();
    }

    public function banner()
    {
        $this->hasOne(
            __FUNCTION__,
            Banner::class,
            'ban_id',
            'bsl_ban_id'
        );
    }
}