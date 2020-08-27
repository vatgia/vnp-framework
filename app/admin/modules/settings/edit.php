<?
require_once 'inc_security.php';

checkAddEdit("edit");

$fs_redirect = base64_decode(getValue("url", "str", "GET", base64_encode("listing.php")));
$record_id = getValue("record_id");

//Khai báo biến khi thêm mới
$fs_title = "Sửa thông tin key";
$fs_action = getURL();
$fs_errorMsg = "";

// Lấy giá trị từ POST
$swe_label = getValue('swe_label', 'str', 'POST', '');
$swe_key = getValue('swe_key', 'str', 'POST', '');
$swe_type = getValue('swe_type', 'str', 'POST', '');
$swe_update_time = time();
$swe_value = '';
//Call Class generate_form();
$myform = new generate_form();

switch ($swe_type) {
    case 'text':
        $swe_value = getValue('swe_value_text', 'str', 'POST', '');
        $myform->add('swe_value', 'swe_value', 0, 1, '', 1, 'Chưa nhập value');
        break;
    case 'plain_text':
        $swe_value = getValue('swe_value_plain_text', 'str', 'POST', '');
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
        unset($upload);
        break;
    default:
        break;
}

$myform->add('swe_label', 'swe_label', 0, 1, '', 1, 'Chưa nhập mô tả');
$myform->add('swe_key', 'swe_key', 0, 1, '', 1, 'Chưa nhập key');
$myform->add('swe_type', 'swe_type', 0, 1, '');
$myform->add('swe_update_time', 'swe_update_time', 1, 1, 1);

$myform->addTable('settings_website');

$myform->evaluate();

//Get action variable for add new data
$action = getValue("action", "str", "POST", "");
//Check $action for insert new data
if ($action == "execute") {
    if ($fs_errorMsg == "") {
        $fs_errorMsg .= $myform->checkdata();

        if ($fs_errorMsg == '') {
            //echo $myform->generate_insert_SQL();
            $sqlUpdate = $myform->generate_update_SQL('swe_id', $record_id);
            // _debug($sqlUpdate);die;
            $db_excute = new db_execute($sqlUpdate);
            unset($db_excute);
            echo 'Sửa thành công!';
            redirect($fs_redirect);
        }
    }//End if($fs_errorMsg == "")

}//End if($action == "insert")

//lay du lieu cua record can sua doi
$db_data = new db_query("SELECT * FROM " . $fs_table . " WHERE " . $id_field . " = " . $record_id);
if ($row = $db_data->fetch(true)) {
    foreach ($row as $key => $value) {
        if ($key != 'lang_id' && $key != 'admin_id') $$key = $value;
    }
} else {
    exit();
}
unset($db_data);

echo $blade->view()->make('edit', get_defined_vars())->render();
return;
?>