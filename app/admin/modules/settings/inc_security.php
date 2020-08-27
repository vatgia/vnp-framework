<?
require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

$module_id = 27;
$module_name = "Settings Website";
//Check user login...
checkLogged();
//Check access module...
if (checkAccessModule($module_id) != 1) redirect($fs_denypath);

//Declare prameter when insert data
$fs_table = "settings_website";
$id_field = "swe_id";
//$name_field = "swe_name";
$break_page = "{---break---}";
$fs_insert_logo = 0;
$editor_path = '../../resource/ckeditor/';

$fs_fieldupload = "swe_value";
$fs_filepath = ROOT . '/public/upload/settings/';

$fs_extension = "gif,jpg,jpe,jpeg,png";
$fs_filesize = 2000;

$per_page = 50;
//var_dump($arr_categories); exit;

$arr_type = array(
    'plain_text' => 'Text',
    'text' => 'Văn bản',
    'image' => 'Ảnh',
);

$views = [
    dirname(__FILE__) . '/views',
    realpath(dirname(__FILE__) . '/../../resource/views')
];
$cache = ROOT . '/ipstore';
$blade = new \Philo\Blade\Blade($views, $cache);

?>