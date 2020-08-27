<?
function checkIpLogin()
{
    return true;
    if ($_SERVER['SERVER_NAME'] == "localhost") {
        return true;
    }

    global $array_ip;
    $ip = $_SERVER['REMOTE_ADDR'];
    $check_ip = 0;
    foreach ($array_ip as $m_key => $m_value) {
        if (strpos($ip, $m_value) === 0) {
            $check_ip = 1;
            break;
        }
    }
    $db_select = new db_query("SELECT * FROM resetip WHERE ip = " . ip2long($ip));
    $result = mysql_num_rows($db_select->result);
    unset($db_select);
    if ($result > 0 && $check_ip == 1) {
        return true;
    } else {
        return false;
    }
}

function checkLogin($username, $password)
{
    $username = replaceMQ($username);
    $password = replaceMQ($password);
    $adm_id = 0;
    $db_check = new db_query("SELECT adm_id
										 FROM admin_user
										 WHERE adm_loginname = '" . $username . "' AND adm_password = '" . md5($password) . "' AND adm_active = 1 AND adm_delete = 0");
    $check = $db_check->fetch(true);
    if ($check) {
        $adm_id = $check["adm_id"];
        $db_check->close();
        unset($db_check);

        return $adm_id;
    } else {
        $db_check->close();
        unset($db_check);

        return 0;
    }
}

function checklogged()
{
    $denypath = "../../login.php";
    if (!isset($_SESSION["logged"])) {
        redirect($denypath);
        exit();
    } else {
        if ($_SESSION["logged"] != 1) {
            redirect($denypath);
            exit();
        }
    }
}

function get_curent_language()
{
    $db_current_language = new db_query("SELECT lang_id
										 FROM admin_user
										 WHERE adm_loginname='" . $_SESSION["userlogin"] . "' AND adm_password='" . $_SESSION["password"] . "' AND adm_active=1 AND adm_delete = 0");
    if ($row = $db_current_language->fetch(true)) {
        $db_current_language->close();
        unset($db_current_language);

        return $row["lang_id"];
    } else {
        return "";
    }
}

function get_curent_path()
{
    $db_current_path = new db_query("SELECT lang_path
										 FROM languages
										 WHERE lang_id=" . intval(get_curent_language()) . "");
    if ($row = $db_current_path->fetch(true)) {
        $db_current_path->close();
        unset($db_current_path);

        return $row["lang_path"];
    } else {
        return "";
    }
}

function checkAccessModule($module_id)
{

    $userlogin = getValue("userlogin", "str", "SESSION", "", 1);
    $password = getValue("password", "str", "SESSION", "", 1);
    $lang_id = getValue("lang_id", "int", "SESSION", 1);
    $db_getright = new db_query("SELECT *
								 FROM admin_user
								 WHERE adm_loginname='" . $userlogin . "' AND adm_password='" . $password . "' AND adm_active=1 AND adm_delete = 0");

    //Check xem user co ton tai hay khong
    if ($row = $db_getright->fetch(true)) {
        //Neu column adm_isadmin = 1 thi cho access
        if ($row['adm_isadmin'] == 1) {
            $db_getright->close();
            unset($db_getright);

            return 1;
        }
    } //Ko co thi` fail luon
    else {
        $db_getright->close();
        unset($db_getright);

        return 0;
    }
    $db_getright->close();
    unset($db_getright);

    //check user
    $db_getright = new db_query("SELECT *
								 FROM admin_user, admin_user_right, modules
								 WHERE adm_id = adu_admin_id AND mod_id = adu_admin_module_id AND
								 adm_loginname='" . $userlogin . "' AND adm_password='" . $password . "' AND adm_active=1 AND adm_delete = 0
								 AND mod_id = " . $module_id);

    if ($row = $db_getright->fetch()) {
        $db_getright->close();
        unset($db_getright);

        return 1;
    } else {
        $db_getright->close();
        unset($db_getright);

        return 0;
    }
}

function checkAddEdit($right = "add")
{

    $userlogin = getValue("userlogin", "str", "SESSION", "", 1);
    $password = getValue("password", "str", "SESSION", "", 1);
    $lang_id = getValue("lang_id", "int", "SESSION", 1);
    global $module_id;
    $db_getright = new db_query("SELECT *
								 FROM admin_user, admin_user_right, modules
								 WHERE adm_id = adu_admin_id AND mod_id = adu_admin_module_id AND adm_isadmin = 0 AND
								 adm_loginname='" . $userlogin . "' AND adm_password='" . $password . "' AND adm_active=1 AND adm_delete = 0
								 AND mod_id = " . $module_id);

    if ($row = $db_getright->fetch(true)) {
        $denypath = "../../error.php";
        switch ($right) {
            case "add":
                if ($row["adu_add"] == 0) {
                    header("location: " . $denypath);
                    exit();
                }
                break;
            case "edit":
                if ($row["adu_edit"] == 0) {

                    header("location: " . $denypath);
                    exit();
                }
                break;
            case "delete":
                if ($row["adu_delete"] == 0) {
                    echo json_encode(array("msg" => "Bạn không có quyền thực thi!", "status" => "0"));
                    exit();
                }
                break;
        }
        $db_getright->close();
        unset($db_getright);
    }

    return 1;
}

function checkRowUser($table, $field_id, $record_id, $returnurl)
{
    $strreturn = '';
    $db_useradmin = new db_query("SELECT adm_id,adm_isadmin,adm_edit_all FROM admin_user WHERE adm_id=" . $_SESSION["user_id"]);
    if ($adm = mysqli_fetch_array($db_useradmin->result)) {
        if ($adm["adm_isadmin"] == 1) {
            $strreturn = '';
        } else {
            $db_record = new db_query("SELECT admin_id FROM " . $table . " WHERE " . $field_id . " = " . $record_id);
            $row = mysqli_fetch_array($db_record->result);
            if ($row["admin_id"] == $_SESSION["user_id"] || $row["admin_id"] == 0 || $adm["adm_edit_all"] == 1) {
                $strreturn = '';
                unset($db_record);
            } else {
                $db_user = new db_query("SELECT adm_loginname FROM admin_user WHERE adm_id= " . intval($row["admin_id"]));
                if ($use = mysqli_fetch_array($db_user->result)) {
                    $strreturn = '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><script language="javascript">alert("Bản ghi này thuộc quyền sửa xóa của user: ' . $use["adm_loginname"] . '")</script>';
                } else {
                    $strreturn = '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><script language="javascript">alert("Bản ghi không thuộc quyền sửa xóa của bạn !")</script>';
                }
                unset($db_user);
            }
        }
    } else {
        $denypath = "../../login.php";
        redirect($denypath);
    }
    if ($strreturn != '') {
        echo $strreturn;
        redirect($returnurl);
        exit();
    } else {
        echo $strreturn;
    }
}

if (!function_exists('removeTitle')) {
    function removeTitle($string, $keyReplace)
    {
        $string = html_entity_decode($string, ENT_COMPAT, 'UTF-8');
        $string = mb_strtolower($string, 'UTF-8');
        $string = removeAccent($string);
        //neu muon de co dau
        //$string  =  trim(preg_replace("/[^A-Za-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]/i"," ",$string));

        $string = trim(preg_replace("/[^A-Za-z0-9]/i", " ", $string)); // khong dau
        $string = str_replace(" ", "-", $string);
        $string = str_replace("--", "-", $string);
        $string = str_replace("--", "-", $string);
        $string = str_replace("--", "-", $string);
        $string = str_replace($keyReplace, "-", $string);

        return $string;
    }
}


function tt($value)
{
    return $value;
}

/**
 * @param $admin_id
 * @param $action
 * @param $item_id
 * @param $title
 * @return int
 */
function admin_log($admin_id, $action, $item_id, $title)
{

    return \VatGia\Admin\Models\AdminLog::insert([
        'adl_admin_user_id' => (int)$admin_id,
        'adl_action' => $action,
        'adl_record_id' => (int)$item_id,
        'adl_record_title' => $title
    ]);
}

?>