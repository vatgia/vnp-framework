<?
require_once 'inc_security.php';
checkAddEdit("add");


$use_group = 1;
$use_active = 1;
$use_date = time();
$use_security = rand(1, 9999);

//Khai báo biến khi thêm mới
$add = "add.php?cat_parent_id=" . getValue('cat_parent_id', 'int', 'GET');

$fs_title = translate("Thêm mới danh mục");
$fs_action = getURL();
$fs_errorMsg = "";
$cat_has_child = 0;


// Lấy giá trị từ POST
$cat_name = getValue('cat_name', 'str', 'POST', '');
$cat_parent_id = getValue('cat_parent_id', 'int', 'POST', '');
$cat_type = getValue('cat_type', 'str', 'POST', '');
$cat_rewrite = getValue('cat_rewrite', 'str', 'POST', '');
$cat_url = getValue('cat_url', 'str', 'POST', '');
$cat_show = getValue('cat_show', 'int', 'POST', 1);
$cat_title_seo = getValue('cat_title_seo', 'str', 'POST', '');
$cat_keywords_seo = getValue('cat_keywords_seo', 'str', 'POST', '');
$cat_description_seo = getValue('cat_description_seo', 'str', 'POST', '');
$cat_teaser = getValue('cat_teaser', 'str', 'POST', '');
$cat_description = getValue('cat_description', 'str', 'POST', '');
$cat_order = getValue('cat_order', 'int', 'POST', 0);
$cat_active = getValue('cat_active', 'int', 'POST', 1);

//Call Class generate_form();
$myform = new generate_form();
$myform->add('cat_name', 'cat_name', 0, 1, '', 1, 'Chưa nhập tên danh mục');
$myform->add('cat_parent_id', 'cat_parent_id', 1, 1, 0);
$myform->add('cat_type', 'cat_type', 0, 1, '', 1, 'Chưa chọn loại danh mục');
$myform->add('cat_has_child', 'cat_has_child', 1, 1, 0);
$myform->add('cat_active', 'cat_active', 1, 1, 0);
$myform->add('cat_order', 'cat_order', 1, 1, 0);
$myform->add('cat_rewrite', 'cat_rewrite', 0, 1, '');
$myform->add('cat_description', 'cat_description', 0, 1, '');

$myform->addTable($fs_table);

$myform->evaluate();


$action = getValue("action", "str", "POST", "");
if ($action == "execute") {
    $fs_errorMsg .= $myform->checkdata();

    $upload = new upload('cat_icon', $fs_filepath, $fs_extension, $fs_filesize);
    if ($upload->common_error == '') {
        $file_name = $upload->file_name;
        $myform->add('cat_icon', 'file_name', 0, 1, '');
    }
    unset($upload);
    if ($fs_errorMsg == '') {
        $db_excute = new db_execute_return();
        $id = $db_excute->db_execute($myform->generate_insert_SQL());
        unset($db_excute);
        redirect(url_back());
    }
}
echo $blade->view()->make('add', get_defined_vars())->render();
?>