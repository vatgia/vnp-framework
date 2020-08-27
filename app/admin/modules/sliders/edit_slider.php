<?
require_once 'inc_security.php';
checkAddEdit("add");

//Khai báo biến khi thêm mới
$add = "edit_slider.php";
$listing = "listing_slider.php";
$after_save_data = getValue("after_save_data", "str", "POST", $add);
$record_id = getValue("record_id");
$fs_title = translate("Thêm slider");
$fs_action = getURL();
$fs_redirect = $after_save_data;
$fs_errorMsg = "";

$fs_table = "slider";
$id_field = "sli_id";

// Lấy giá trị từ POST
$sli_name  = getValue('sli_name', 'str', 'POST', '');

//Call Class generate_form();
$myform = new generate_form();
$myform->add('sli_name', 'sli_name', 0, 1, '', 1, 'Chưa nhập tên slider');

$myform->addTable('slider');

$myform->evaluate();


$action = getValue("action", "str", "POST", "");
if ($action == "execute") {
    $fs_errorMsg .= $myform->checkdata();

    if ($fs_errorMsg == '') {
        $sqlUpdate = $myform->generate_update_SQL('sli_id', $record_id);
        // _debug($sqlUpdate);die;
        $db_excute = new db_execute($sqlUpdate);
        unset($db_excute);
        echo 'Sửa thành công!';
        redirect($listing);
    }
}

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

echo $blade->view()->make('edit_slider', get_defined_vars())->render();
?>