<?
require_once dirname(__FILE__) . '/../../bootstrap.php';
require_once("config_security.php");


$url			= base64_decode(getValue("url","str","POST",base64_encode("configmodule.php")));
$record_id 		= getValue("record_id", "arr", "POST", array());
$fs_redirect	= $url;
$field_id		= "mod_id";
$fs_table		= "modules";
//Warning Error!
$errorMsg = "";
//Get Action.
$iQuick = getValue("iQuick","str","POST","");
if ($iQuick == "update"){
	if(isset($record_id[0])){
		for($i=0;$i<count($record_id);$i++){
			$errorMsg='';
			//Call Class generate_form();
			$myform = new generate_form();
			//Loại bỏ chuc nang thay the Tag Html
			//$myform->removeHTML(0);
			//Check Error!
			
			$myform->add("mod_name","mod_name" . $record_id[$i],0,0,"",0,"",0,"Bạn chưa nhập tiêu đề bài viết");
			$myform->add("mod_path","mod_path" . $record_id[$i],0,0,"",0,"",0,"");
			$myform->add("mod_listname","mod_listname" . $record_id[$i],0,0,"",0,"",0,"");
			$myform->add("mod_listfile","mod_listfile" . $record_id[$i],0,0,"",0,"",0,"");
			$myform->add("mod_order","mod_order" . $record_id[$i],1,0,0,0,"",0,"Bạn chưa nhập ngày đăng tin");
			//Add table
			$myform->addTable($fs_table);
			$errorMsg .= $myform->checkdata();
			if($errorMsg == ""){
				$db_ex = new db_execute($myform->generate_update_SQL("mod_id", $record_id[$i]));
				//echo $myform->generate_update_SQL("pro_id", $record_id[$i]);
				unset($db_ex);
				//Hien thi loi
			}
			unset($errorMsg);
			unset($myform);
			unset($upload_pic);
			unset($picture);
		}//end for
	}
	redirect($url);
}
?>