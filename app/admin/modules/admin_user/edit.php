<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';
//check quyền them sua xoa
checkAddEdit("edit");


$ff_action = getURL();
$ff_redirect_succ = "listing.php";
$ff_redirect_fail = "";
$iAdm = getValue("record_id");
$ff_table = "admin_user";

$fs_redirect = base64_decode(getValue("returnurl", "str", "GET", base64_encode("listing.php")));
$record_id = getValue("iAdm", "int", "GET");
$field_id = "adm_id";
$fs_errorMsg = "";
$fs_action = getValue("action", "str", "POST", "");

$arelate_select = (array)getValue("arelate_select", "arr", "POST", "");


//Call Class generate_form();
$myform = new generate_form();
$myform->add("adm_email", "adm_email", 2, 0, "", 1, " Email không chính xác !", 0, "");
$myform->add("adm_name", "adm_name", 0, 0, "", 0, "", 0, "");
$myform->add("adm_phone", "adm_phone", 0, 0, "", 0, "", 0, "");
$myform->add("adm_all_category", "adm_all_category", 1, 0, 0, 0, "", 0, "");
$myform->add("adm_all_website", "adm_all_website", 1, 0, 0, 0, "", 0, "");
$myform->add("adm_access_category", "adm_access_category", 0, 1, "", 0, "", 0, "");
$myform->add("adm_edit_all", "adm_edit_all", 1, 0, 0, 0, "", 0, "");
$myform->add("admin_id", "admin_id", 1, 1, 0, 0, "", 0, "");

$myform->addTable($fs_table);

//Edit user profile
if ($fs_action == 'update') {
    $fs_errorMsg .= $myform->checkdata();
    if ($fs_errorMsg == "") {
        //echo $myform->generate_update_SQL("adm_id",$iAdm); exit();
        $db_ex = new db_execute($myform->generate_update_SQL("adm_id", $iAdm));
        unset($db_ex);
        admin_log($admin_id, 'EDIT', $record_id, 'Sửa quản trị viên ' . getValue('adm_name', 'str', 'POST'));

        $module_list = (array)getValue("mod_id", "arr", "POST", "");
        $user_lang_id_list = (array)getValue("user_lang_id", "arr", "POST", "");

        $arelate_select = (array)getValue("arelate_select", "arr", "POST", "");

        $db_delete = new db_execute("DELETE FROM admin_user_right WHERE adu_admin_id =" . $iAdm);
        unset($db_delete);
        if (isset($module_list[0])) {
            for ($i = 0; $i < count($module_list); $i++) {
                $query_str = "INSERT INTO admin_user_right 
VALUES(
  " . $iAdm . "," . $module_list[$i] . ", 
  " . getValue("adu_add" . $module_list[$i], "int", "POST") . ", 
  " . getValue("adu_edit" . $module_list[$i], "int", "POST") . ", 
  " . getValue("adu_delete" . $module_list[$i], "int", "POST") . "
  )";
                $db_ex = new db_execute($query_str);
                unset($db_ex);
            }
        }
        /*
        $db_delete = new db_execute("DELETE FROM admin_user_language WHERE aul_admin_id =" . $iAdm);
        unset($db_delete);
        if (isset($user_lang_id_list[0])) {
            for ($i = 0; $i < count($user_lang_id_list); $i++) {
                $query_str = "INSERT INTO admin_user_language VALUES(" . $iAdm . "," . $user_lang_id_list[$i] . ")";
                $db_ex = new db_execute($query_str);
                unset($db_ex);
            }
        }
        */

        //update admin_user_website
        //delete all record in admin_user_website of uer
        /*
        $db_delete = new db_execute("DELETE FROM admin_user_website WHERE auw_user_id = " . $iAdm);
        unset($db_delete);
        //get value access all website
        $adm_all_website = getValue("adm_all_website", "int", "POST", 0);
        if ($adm_all_website != 1) {
            //get array value website
            $arr_website = getValue("arrweb", "arr", "POST", array());
            $list_website = array();
            foreach ($arr_website as $key => $value) {
                $list_website[] = "(" . $iAdm . "," . $value . ")";
            }
            //Insert into table admin_user_website
            if (count($list_website) > 0) {
                $db_ex = new db_execute("INSERT INTO admin_user_website(auw_user_id,auw_web_id) VALUES " . implode(",", $list_website));
                unset($db_ex);
            }
        }
        */

        //Update password
        $adm_password = getValue('adm_password', 'str', 'POST', '');
        $adm_password_verify = getValue('adm_password_verify', 'str', 'POST', '');
        if ($adm_password != '') {
            if ($adm_password === $adm_password_verify) {
                $myform = new generate_form();
                $myform->add("adm_password", "adm_password", 4, 0, "", 1, translate_text("Please enter new password"), 0, "");
                $myform->addTable($fs_table);
                $fs_errorMsg .= $myform->checkdata();
                if ($fs_errorMsg == "") {
                    $db_ex = new db_execute($myform->generate_update_SQL("adm_id", $iAdm));
                    unset($db_ex);
                    echo '<script>alert("Mật khẩu đã được thay đổi")</script>';
                    redirect($ff_redirect_succ);
                }
            } else {
                $fs_errorMsg = 'Confirm password wrong.';
            }
        } else {
            redirect($ff_redirect_succ);
            exit();
        }
    }
}

//Edit user password
$errorMsgpass = '';
if ($fs_action == 'update_password') {
    $myform = new generate_form();
    $myform->add("adm_password", "adm_password", 4, 0, "", 1, translate_text("Please enter new password"), 0, "");
    $myform->addTable($fs_table);
    $errorMsgpass .= $myform->checkdata();
    if ($errorMsgpass == "") {
        $db_ex = new db_execute($myform->generate_update_SQL("adm_id", $iAdm));
        unset($db_ex);
        echo '<script>alert("Mật khẩu đã được thay đổi")</script>';
        redirect($ff_redirect_succ);
    }
}


//Select access module
$acess_module = "";
$arrayAddEdit = array();
$db_access = new db_query("SELECT * 
									FROM admin_user, admin_user_right, modules
									WHERE adm_id = adu_admin_id AND mod_id = adu_admin_module_id AND adm_id =" . $iAdm);
while ($row_access = mysqli_fetch_array($db_access->result)) {
    $acess_module .= "[" . $row_access['mod_id'] . "]";
    $arrayAddEdit[$row_access['mod_id']] = array($row_access["adu_add"], $row_access["adu_edit"], $row_access["adu_delete"]);
}
unset($db_access);

//Select access channel
$access_channel = "";
//Select access languages
$access_language = "";
$db_access = new db_query("SELECT *
										FROM admin_user, admin_user_language, languages
										WHERE adm_id = aul_admin_id AND languages.lang_id = aul_lang_id AND adm_id =" . $iAdm);
while ($row_access = mysqli_fetch_array($db_access->result)) $access_language .= "[" . $row_access['lang_id'] . "]";
unset($row_access);

//Check user exist or not
$db_admin_sel = new db_query($s = "SELECT *
										  FROM admin_user
										  WHERE adm_id = " . $iAdm);
$row = mysqli_fetch_array($db_admin_sel->result);
extract($row);

//echo $s;die;
$db_getallmodule = new db_query("SELECT * 
												FROM modules
												ORDER BY mod_order DESC");

echo $blade->view()->make('edit', get_defined_vars())->render();

return;