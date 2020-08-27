<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';

checkAddEdit("edit");

$fs_redirect = base64_decode(getValue("url", "str", "GET", base64_encode("listing.php")));
$record_id = getValue("record_id");

//Khai báo biến khi thêm mới
$fs_title = "Sửa thông tin danh mục";
$fs_action = getURL();
$fs_errorMsg = "";


// Lấy giá trị từ POST
$cat_name = getValue('cat_name', 'str', 'POST', '');
$cat_parent_id = getValue('cat_parent_id', 'int', 'POST', '');
$cat_type = getValue('cat_type', 'str', 'POST', '');
$cat_rewrite = getValue('cat_rewrite', 'str', 'POST', '');
$cat_url = getValue('cat_url', 'str', 'POST', '');
$cat_show = getValue('cat_show', 'int', 'POST', '');
$cat_title_seo = getValue('cat_title_seo', 'str', 'POST', '');
$cat_keywords_seo = getValue('cat_keywords_seo', 'str', 'POST', '');
$cat_description_seo = getValue('cat_description_seo', 'str', 'POST', '');
$cat_teaser = getValue('cat_teaser', 'str', 'POST', '');
$cat_description = getValue('cat_description', 'str', 'POST', '');
$cat_order = getValue('cat_order', 'int', 'POST', 0);
$cat_active = getValue('cat_active', 'int', 'POST', 0);

//Call Class generate_form();
$myform = new generate_form();
$myform->add('cat_name', 'cat_name', 0, 1, '', 1, 'Chưa nhập tên danh mục');
$myform->add('cat_parent_id', 'cat_parent_id', 0, 1, 0);
$myform->add('cat_type', 'cat_type', 0, 1, '', 1, 'Chưa chọn loại danh mục');
$myform->add('cat_has_child', 'cat_has_child', 1, 1, 0);
$myform->add('cat_active', 'cat_active', 1, 1, 0);
$myform->add('cat_order', 'cat_order', 1, 1, 0);
$myform->add('cat_rewrite', 'cat_rewrite', 0, 1, '');
$myform->add('cat_description', 'cat_description', 0, 1, '');

$myform->addTable($fs_table);

$myform->evaluate();

//Get action variable for add new data
$action = getValue("action", "str", "POST", "");
//Check $action for insert new data
if ($action == "execute") {
    if ($fs_errorMsg == "") {

        $fs_errorMsg .= $myform->checkdata();
        $upload = new upload('cat_icon', $fs_filepath, $fs_extension, $fs_filesize);

        if ($upload->common_error == '') {
            $file_name = $upload->file_name;
            $myform->add('cat_icon', 'file_name', 0, 1, '');
        }
        unset($upload);
        if ($fs_errorMsg == '') {
            $sqlUpdate = $myform->generate_update_SQL($id_field, $record_id);
            $db_excute = new db_execute($sqlUpdate);
            unset($db_excute);
            redirect($fs_redirect);
        }
    }//End if($fs_errorMsg == "")

}//End if($action == "insert")

//lay du lieu cua record can sua doi
$item = $model::findByID($record_id);
if ($item) {
    foreach ($item->toArray(false) as $key => $value) {
        if ($key != 'lang_id' && $key != 'admin_id') $$key = $value;
    }
} else {
    exit();
}
unset($db_data);

echo $blade->view()->make('edit', get_defined_vars())->render();
return;
?>