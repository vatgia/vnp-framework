<?php

use App\Models\BannerSlider\BannerSlider;
use App\Models\BannerSlider\Slider;
use VatGia\Cache\Facade\Cache;

$cache = (bool)input('cache');
$cache = false;

$vars = [];

$code = input('code') ?? '';
$limit = input('limit') ?? 0;

if ($cache) {
    $dataCompleted = Cache::get('banner_slider_' . $code);
} else {
    $dataCompleted = [];
}

if (!$dataCompleted) {

    //Lấy thông tin vị trí
    $slider_info = false;
    if ($cache) {
        $slider_info = Cache::get('slider_info_' . $code);
    }

    if (!$slider_info) {
        $slider_info = Slider::where('sli_key = \'' . $code . '\'')->select();

        if ($slider_info) {
            $slider_info = $slider_info->toArray();
            if ($cache) {
                Cache::put('slider_info_' . $code, $slider_info);
            }

            $slider_id = $slider_info['id'];

        } else {

            //Nếu chưa có vị trí thì tạo mới
            $slider_id = Slider::insert([
                'sli_name' => $code,
                'sli_key' => $code,
            ]);
        }
    } else {
        $slider_id = $slider_info['id'];
    }

    //Lấy danh sách banner
    $itemsModel = BannerSlider::with(['banner'])
        ->where('bsl_sli_id = ' . (int)$slider_id)
        ->where('((bsl_full_time = 1) OR (bsl_start_time < ' . time() . ' AND bsl_end_time > ' . time() . '))')
        ->inner_join('banner', 'bsl_ban_id = ban_id AND ban_active = 1')
//        ->limit($limit)
        ->order_by('bsl_order');
    if ($limit > 0) {
        $itemsModel->limit($limit);
    }
    $items = $itemsModel->all();

    foreach ($items as $item) {

        $banner = [
            'name' => $item->banner->ban_title,
            'url' => $item->banner->ban_link,
            'object' => [
                'type' => $item->banner->ban_object_type,
                'id' => $item->banner->ban_object_id
            ],
            'full_time' => $item->bsl_full_time,
            'start_time' => $item->bsl_start_time,
            'end_time' => $item->bsl_end_time,
            'order' => $item->bsl_order,
            'link_img' => url() . '/upload/banners/' . $item->banner->ban_image,
        ];

        $vars[] = $banner;
    }

    if ($cache) {
        Cache::put('banner_slider_' . $code, $dataCompleted);
    }
}

return [
    'vars' => $vars,
];