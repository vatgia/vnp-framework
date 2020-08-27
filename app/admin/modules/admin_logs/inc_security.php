<?

require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

/**
 * Module id.
 * Thay thế bằng id lấy từ mục 'Cấu hình module'
 */
$module_id = 25;
$module_name = "Lịch sử quản trị viên";

//Check user login...
checkLogged();

//Check access module...
if (checkAccessModule($module_id) != 1) {
    redirect($fs_denypath);

}

//Declare prameter when insert data
$fs_table = "admin_logs";
$fs_redirect = 'listing.php';
$id_field = "adl_id";
$name_field = "adl_record_title";
$break_page = "{---break---}";
$fs_filepath = ROOT . "/public/upload/admin_logs/";

$model = \VatGia\Admin\Models\AdminLog::class;

$per_page = 10;

$fs_fieldupload = "cla_avatar";
$fs_extension = "gif,jpg,jpe,jpeg,png";
$fs_filesize = 2000;

$locales = collect(config('app.locales'))->lists('code', 'name');


$actions = [
    'ADD' => 'Thêm mới',
    'EDIT' => 'Sửa',
    'DELETE' => 'Xóa',
    'ACTIVE' => 'Kích hoạt'
];

$views = [
    dirname(__FILE__) . '/views',
    realpath(dirname(__FILE__) . '/../../resource/views')
];
$cache = ROOT . '/storage/framework/views/';
$blade = new \Philo\Blade\Blade($views, $cache);
?>