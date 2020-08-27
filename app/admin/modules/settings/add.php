<?

use App\Models\Setting;

require_once 'inc_security.php';
checkAddEdit("add");

//Khai báo biến khi thêm mới
$add = "add.php";
$listing = "listing.php";
$after_save_data = getValue("after_save_data", "str", "POST", $add);
$fs_title = translate("Thêm mới danh mục");
$fs_action = getURL();
$fs_redirect = $after_save_data;
$fs_errorMsg = "";
$file_name = "";

// Lấy giá trị từ POST
$swe_label = getValue('swe_label', 'str', 'POST', '');
$swe_key = getValue('swe_key', 'str', 'POST', '');
$swe_type = getValue('swe_type', 'str', 'POST', '');
$swe_create_time = time();
$swe_value = '';

if ($swe_key != '') {
    $checkKeyExist = Setting::where('swe_key = "' . $swe_key . '"')->select();

    if ($checkKeyExist != NULL) {
        $fs_errorMsg .= '• Key Setting đã trùng <br>';
    }
}

//Call Class generate_form();
$myform = new generate_form();

switch ($swe_type) {
    case 'text':
        $swe_value = getValue('swe_value_text', 'str', 'POST', '');
        $myform->add('swe_value', 'swe_value', 0, 1, '', 1, 'Chưa nhập value');
        break;
    case 'image':
        $upload = new upload('swe_value_image', $fs_filepath, $fs_extension, $fs_filesize);
        if ($upload->common_error == '') {
            $file_name = $upload->file_name;
            if ($file_name != '') {
                $myform->add('swe_value', 'file_name', 0, 1, '', 1, 'Chưa chọn ảnh');
            }
        }
        break;
    case 'plain_text':
        $swe_value = getValue('swe_value_plain_text', 'str', 'POST', '');
        $myform->add('swe_value', 'swe_value', 0, 1, '', 1, 'Chưa nhập value');
        break;
    default:
        break;
}

$myform->add('swe_label', 'swe_label', 0, 1, '', 1, 'Chưa nhập mô tả');
$myform->add('swe_key', 'swe_key', 0, 1, '', 1, 'Chưa nhập key');
$myform->add('swe_type', 'swe_type', 0, 1, '');
$myform->add('swe_create_time', 'swe_create_time', 1, 1, 1);

$myform->addTable('settings_website');

$myform->evaluate();


$action = getValue("action", "str", "POST", "");
if ($action == "execute") {
    $fs_errorMsg .= $myform->checkdata();

    if ($fs_errorMsg == '') {
        $db_excute = new db_execute($myform->generate_insert_SQL());
        unset($db_excute);
        echo 'Thêm thành công!';
        redirect($fs_redirect);
    }
}
echo $blade->view()->make('add', get_defined_vars())->render();
?>