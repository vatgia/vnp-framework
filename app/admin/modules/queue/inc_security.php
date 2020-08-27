<?
require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

$module_id = 11;
$module_name = "Queue";
//Check user login...
checkLogged();
//Check access module...
if (checkAccessModule($module_id) != 1)
    redirect($fs_denypath);

//Declare prameter when insert data
$fs_table = "queue";
$id_field = "que_id";
$name_field = "que_name";
$break_page = "{---break---}";
$fs_filepath = ROOT . "/public/upload/";

$page_size = 10;

$fs_fieldupload = "cat_picture";
$fs_extension = "gif,jpg,jpe,jpeg,png";
$fs_filesize = 1000;

$views = [
    dirname(__FILE__) . '/views',
    realpath(dirname(__FILE__) . '/../../resource/views')
];
$cache = ROOT . '/ipstore';
$blade = new \Philo\Blade\Blade($views, $cache);
