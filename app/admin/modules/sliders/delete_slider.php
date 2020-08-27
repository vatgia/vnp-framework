<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';
//check quyền them sua xoa
checkAddEdit("delete");
$returnurl 		= base64_decode(getValue("returnurl","str","GET",base64_encode("listing_slider.php")));
$record_id		= getValue("record_id","int","GET","0");

$fs_table = "slider";
$id_field = "sli_id";

//Delete data with ID
$sqlDelete = "DELETE FROM ". $fs_table ." WHERE " . $id_field . " IN(" . $record_id . ")";
$db_del = new db_execute($sqlDelete, 1);

$msg = "Có " . $db_del->row_affect . " bản ghi đã được xóa !";
unset($db_del);

echo $msg;

redirect($returnurl );
?>