<? //generate by dinhtoan@finalstyle.com
require_once dirname(__FILE__) . '/../../bootstrap.php';
require_once("config_security.php");
//check quyền them sua xoa
$returnurl 		= base64_decode(getValue("returnurl","str","GET",base64_encode("configmodule.php")));
$record_id		= getValue("record_id","int","GET",0);
//Delete data with ID
$db_del = new db_execute("DELETE FROM modules WHERE mod_id =" . $record_id);
unset($db_del);
echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
echo '<script language="javascript">alert("' . translate_text("You_have_successfully_deleted") . '")</script>';
redirect($returnurl);
?>