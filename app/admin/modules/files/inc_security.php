<?
require_once("../../resource/security/security.php");

$module_id = 16;
$module_name = "Quản lý Files";
//Check user login...
checkLogged();
//Check access module...
if (checkAccessModule($module_id) != 1) redirect($fs_denypath);

//Declare prameter when insert data
$fs_table = "news";
$id_field = "new_id";
$name_field = "new_title";
$break_page = "{---break---}";
$fs_insert_logo = 0;
$editor_path = '../../resource/ckeditor/';

// Categories
?>