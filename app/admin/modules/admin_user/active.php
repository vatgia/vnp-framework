<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';

//check quyền them sua xoa
checkAddEdit("delete");
$record_id = getValue("record_id");
$sql = "";
$type = getValue("type", "str", "GET", "", 1);
$value = getValue("value");
$filed = "adm_active";
switch ($type) {
    case "adm_active":
        $filed = "adm_active";
        break;
    case "adm_delete":
        $filed = "adm_delete";
        break;
}
$url = base64_decode(getValue("url", "str", "GET", base64_encode("listing.php")));

$fs_redirect = base64_decode(getValue("returnurl", "str", "GET", base64_encode("listing.php")));
$record_id = getValue("record_id", "int", "GET");
$field_id = "adm_id";
//kiểm tra quyền sửa xóa của user xem có được quyền ko
checkRowUser($fs_table, $field_id, $record_id, $fs_redirect);
$db_category = new db_execute("UPDATE " . $fs_table . " SET " . $filed . " = " . $value . " WHERE lang_id = " . $_SESSION["lang_id"] . " AND adm_id=" . $record_id);
unset($db_category);
redirect($url);
?>