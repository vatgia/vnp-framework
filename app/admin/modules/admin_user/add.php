<?

require_once("../../bootstrap.php");
require_once 'inc_security.php';
//check quyền them sua xoa
checkAddEdit("add");

$ff_action = $_SERVER['REQUEST_URI'];
$ff_redirect_succ = "listing.php";
$ff_redirect_fail = "";
$fs_action = getURL();
$fs_errorMsg = "";


$action = getValue("action", "str", "POST", "");
$arelate_select = (array)getValue("arelate_select", "arr", "POST");

$fs_errorMsg = "";
$allow_insert = 1;

$myform = new generate_form();
$myform->add("adm_loginname", "adm_loginname", 0, 0, "", 1, translate_text("Username is not empty and> 3 characters"), 1, translate_text("Administrator account already exists"));
$myform->add("adm_password", "adm_password", 4, 0, "", 1, translate_text("Password must be greater than 4 characters"), 0, "");
$myform->add("adm_email", "adm_email", 2, 0, "", 1, translate_text("Email is invalid"), 0, "");
$myform->add("adm_name", "adm_name", 0, 0, "", 0, "", 0, "");
$myform->add("adm_phone", "adm_phone", 0, 0, "", 0, "", 0, "");
$myform->add("adm_all_category", "adm_all_category", 1, 0, 0, 0, "", 0, "");
$myform->add("adm_all_website", "adm_all_website", 1, 0, 0, 0, "", 0, "");
//$myform->add("adm_access_category","adm_access_category",0,1,"",0,"",0,"");
$myform->add("adm_edit_all", "adm_edit_all", 1, 0, 0, 0, "", 0, "");
$myform->add("admin_id", "admin_id", 1, 1, 0, 0, "", 0, "");
$myform->addTable("admin_user");
//get vaule from POST
$adm_loginname = getValue("adm_loginname", "str", "POST", "", 1);
//password hash md5 --> only replace \' = '
$adm_password = getValue("adm_password", "str", "POST", "", 1);
//get Access Module list
$module_list = "";
$module_list = getValue("mod_id", "arr", "POST", "");
$user_lang_id_list = getValue("user_lang_id", "arr", "POST", "");
$arelate_select = getValue("arelate_select", "arr", "POST", "");


if ($action == 'execute') {
    if ($module_list == "") {
        $allow_insert = 0;
        $fs_errorMsg .= 'Bạn phải chọn module';
    }

    //insert new user to database
    if ($allow_insert == 1) {
        //Call Class generate_form();
        $querystr = $myform->generate_insert_SQL();
        $fs_errorMsg .= $myform->checkdata();
        $last_id = 0;
        if ($fs_errorMsg == "") {
            $db_ex = new db_execute_return();
            $last_id = $db_ex->db_execute($querystr);
            unset($db_ex);
            if ($last_id != 0) {

                admin_log($admin_id, 'ADD', $last_id, 'Thêm mới quản trị viên ' . getValue('adm_name', 'str', 'POST'));

                //insert user right\
                if (isset($module_list[0])) {
                    for ($i = 0; $i < count($module_list); $i++) {
                        $query_str = "INSERT INTO admin_user_right VALUES(" . $last_id . "," . $module_list[$i] . ", " . getValue("adu_add" . $module_list[$i], "int", "POST") . ", " . getValue("adu_edit" . $module_list[$i], "int", "POST") . ", " . getValue("adu_delete" . $module_list[$i], "int", "POST") . ")";
                        $db_ex = new db_execute($query_str);
                        unset($db_ex);
                    }
                }
                if (isset($user_lang_id_list[0])) {
                    for ($i = 0; $i < count($user_lang_id_list); $i++) {
                        $query_str = "INSERT INTO admin_user_language VALUES(" . $last_id . "," . $user_lang_id_list[$i] . ")";
                        $db_ex = new db_execute($query_str);
                        unset($db_ex);
                    }
                }
                //category right

                //website right

                //get value access all website
//				$adm_all_website		=	getValue("adm_all_website", "int", "POST", 0);
//				if($adm_all_website != 1){
//					//get array value website
//					$arr_website		=	getValue("arrweb", "arr", "POST", array());
//					$list_website		=	array();
//					foreach($arr_website as $key => $value){
//						$list_website[]	=	"(" . $last_id . "," . $value . ")";
//					}
//					//Insert into table admin_user_website
//					if(count($list_website) > 0){
//						$db_ex	=	new db_execute("INSERT INTO admin_user_website(auw_user_id,auw_web_id) VALUES " . implode(",", $list_website));
//						unset($db_ex);
//					}
//				}

                redirect($ff_redirect_succ);
                exit();
            }
        }
    }
}
$myform->evaluate();
//$db_getallmodule = new db_query("SELECT *
//											FROM modules
//											ORDER BY mod_order DESC");

$modules = \VatGia\Admin\Models\Module::order_by('mod_order', 'DESC')->all();
echo $blade->view()->make('add', get_defined_vars())->render();