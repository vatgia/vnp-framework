<?
require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

/**
 * Module id.
 * Thay thế bằng id lấy từ mục 'Cấu hình module'
 */
$module_id = 2;

$module_name = "Module name";

//Check user login...
checkLogged();

//Check access module...
if (checkAccessModule($module_id) != 1) {
    redirect($fs_denypath);

}

//Declare prameter when insert data
$model = \VatGia\Model\Model::class;
$fs_table = (new $model)->table;
$id_field = (new $model)->prefix . '_' . (new $model)->id_filed;
$name_field = (new $model)->prefix . "_name";
$break_page = "{---break---}";
$fs_filepath = ROOT . "/public/upload/";

$per_page = 10;

$fs_fieldupload = (new $model)->prefix . "_picture";
$fs_extension = "gif,jpg,jpe,jpeg,png";
$fs_filesize = 2000;

$views = [

    //Chứa view module
    dirname(__FILE__) . '/views',

    //Chứa view master
    realpath(dirname(__FILE__) . '/../../resource/views')
];
$cache = ROOT . '/storage/framework/views/';
$blade = new \Philo\Blade\Blade($views, $cache);
?>