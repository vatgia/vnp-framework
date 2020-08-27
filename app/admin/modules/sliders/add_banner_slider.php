<?
require_once 'inc_security.php';
checkAddEdit("add");

use VatGia\Cache\Facade\Cache;

//Khai báo biến khi thêm mới
$add = "add_banner_slider.php";
$listing = "listing.php";
$after_save_data = getValue("after_save_data", "str", "POST", $add);
$fs_title = translate("Thêm banner vào slider");
$fs_action = getURL();
$fs_redirect = $after_save_data;
$fs_errorMsg = "";

$slider = \App\Models\BannerSlider\Slider::all();

$arr_slider = array();
$arr_slider[0] = 'Chọn vị trí';
foreach ($slider as $value) {
    $arr_slider[$value['sli_id']] = $value['sli_name'];
}

$banner = \App\Models\BannerSlider\Banner::all();

$sli_id = getValue('sli_id', 'int', 'GET', 0);

$action = getValue('action', 'str', 'POST', '');
$choose_banner = getValue('choose_banner', 'arr', 'POST', array());

if ($action == 'execute') {
    $db_delete = new db_execute('DELETE FROM banner_slider WHERE bsl_sli_id = ' . $sli_id);
    Cache::forget('banner_slider_' . $slider[$sli_id]['sli_key']);
    unset($db_delete);
    if (!empty($choose_banner)) {
        foreach ($choose_banner as $key => $value):

            $choose_full_time = getValue('choose_full_time', 'arr', 'POST', array());
            $choose_start_time = getValue('choose_start_time', 'arr', 'POST', array());
            $choose_end_time = getValue('choose_end_time', 'arr', 'POST', array());
            $choose_order = getValue('choose_order', 'arr', 'POST', array());

            $choose = isset($choose_banner[$key]) ? $choose_banner[$key] : 0;
            $full_time = isset($choose_full_time[$key]) ? $choose_full_time[$key] : '';
            $start_time = isset($choose_start_time[$key]) ? $choose_start_time[$key] : 0;
            $end_time = isset($choose_end_time[$key]) ? $choose_end_time[$key] : 0;
            $order = isset($choose_order[$key]) ? $choose_order[$key] : 0;

            $start_date = convertDateTime(isset($start_date) ? $start_date : 0, "00:00:00");
            $end_time = convertDateTime($end_time, "23:59:59");

            $full_time = ($full_time == 'on') ? 1 : 0;
            $ban_id = $key;
            $full_time = 1;

            $myform = new generate_form();
            $myform->add('bsl_sli_id', 'sli_id', 1, 1, 1);
            $myform->add('bsl_ban_id', 'ban_id', 1, 1, 1);
            $myform->add('bsl_full_time', 'full_time', 1, 1, 1);
            $myform->add('bsl_start_time', 'start_date', 1, 1, 1);
            $myform->add('bsl_end_time', 'end_time', 1, 1, 1);
            $myform->add('bsl_order', 'order', 1, 1, 1);

            $myform->addTable('banner_slider');
            $myform->evaluate();

            $fs_errorMsg .= $myform->checkdata();
            if ($fs_errorMsg == '') {
                $db_excute = new db_execute($myform->generate_insert_SQL());
                unset($db_excute);
                Cache::forget('banner_slider_' . $slider[$sli_id]['sli_key']);
            }

        endforeach;

        echo 'Thêm thành công!';
        redirect($fs_redirect);
    }
}

echo $blade->view()->make('add_banner_slider', get_defined_vars())->render();
?>