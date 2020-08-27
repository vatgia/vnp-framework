<?
require_once dirname(__FILE__) . '/../../bootstrap.php';
include("config_security.php"); 

$returnurl 		= base64_decode(getValue("url","str","GET",base64_encode("listingtable.php")));
$record_id		= getValue("record_id","str","GET");

$db_select 	= new db_query("SELECT * FROM  config_table WHERE conf_id = " . $record_id);
if($row		=	mysql_fetch_assoc($db_select->result)){	
	$db_del = new db_execute("ALTER TABLE `" . $row["conf_table"] ."` DROP `" . $row["conf_field"] . "` ");
	unset($db_del);
}


//Delete data with ID
$db_del = new db_execute("DELETE FROM config_table WHERE conf_id = " . $record_id);
unset($db_del);

echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
echo '<script language="javascript">alert("' . translate_text("You have successfully deleted") . '!");</script>';
redirect($returnurl);
exit();
?>