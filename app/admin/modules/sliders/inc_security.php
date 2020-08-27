<?
require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

$module_id = 13;
$module_name = "Banner Slider";
//Check user login...
checkLogged();
//Check access module...
if (checkAccessModule($module_id) != 1)
    redirect($fs_denypath);
//Declare prameter when insert data
$fs_table = "banner";
$id_field = "ban_id";
$name_field = "";
$break_page = "{---break---}";
$fs_filepath = ROOT . "/public/upload/banners/";
$editor_path = '../../resource/ckeditor/';

$per_page = 10;

$fs_fieldupload = "cat_picture";
$fs_extension = "gif,jpg,jpe,jpeg,png,svg";
$fs_filesize = 5000;

$status_arr = array(
    1 => 'Hiển thị',
    0 => 'Ẩn',
);

$form_arr = array(
    0 => 'Hình ảnh',
//    1 => 'HTML'
);

$views = [
    dirname(__FILE__) . '/views',
    realpath(dirname(__FILE__) . '/../../resource/views')
];
$cache = ROOT . '/ipstore';
$blade = new \Philo\Blade\Blade($views, $cache);
?>