<?
require_once 'inc_security.php';
checkAddEdit("add");

//Khai báo biến khi thêm mới
$add = "add_slider.php";
$listing = "listing_slider";
$after_save_data = getValue("after_save_data", "str", "POST", $add);
$fs_title = translate("Thêm slider");
$fs_action = getURL();
$fs_redirect = $after_save_data;
$fs_errorMsg = "";

// Lấy giá trị từ POST
$sli_name  = getValue('sli_name', 'str', 'POST', '');
$sli_key  = getValue('sli_key', 'str', 'POST', '');

if($sli_key != ''){
	$checkKeyExist = \App\Models\BannerSlider\Slider::where('sli_key = "' . $sli_key . '"')->select();

	if($checkKeyExist != NULL){
		$fs_errorMsg .= '• Key slider đã trùng <br>';
	}
}

//Call Class generate_form();
$myform = new generate_form();
$myform->add('sli_name', 'sli_name', 0, 1, '', 1, 'Chưa nhập tên slider');
$myform->add('sli_key', 'sli_key', 0, 1, '', 1, 'Chưa nhập key slider');

$myform->addTable('slider');

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
echo $blade->view()->make('add_slider', get_defined_vars())->render();
?>