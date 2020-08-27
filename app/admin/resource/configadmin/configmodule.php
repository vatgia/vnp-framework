<?
require_once dirname(__FILE__) . '/../../bootstrap.php';
include("config_security.php");


$record_id = getValue("record_id", "arr", "POST", array());
$field_id = "mod_id";
$fs_table = "modules";
//Warning Error!
$errorMsg = "";
//Get Action.
//Call Class generate_form();
$myform = new generate_form();
//Loại bỏ chuc nang thay the Tag Html
//$myform->removeHTML(0);
//Check Error!

$myform->add("mod_name", "mod_name", 0, 0, "", 0, "", 0, "Bạn chưa nhập tiêu đề bài viết");
$myform->add("mod_path", "mod_path", 0, 0, "", 0, "", 0, "");
$myform->add("mod_listname", "mod_listname", 0, 0, "", 0, "", 0, "");
$myform->add("mod_listfile", "mod_listfile", 0, 0, "", 0, "", 0, "");
$myform->add("mod_order", "mod_order", 1, 0, 0, 0, "", 0, "Bạn chưa nhập ngày đăng tin");
//Add table
$myform->addTable($fs_table);

$iQuick = getValue("iQuick", "str", "POST", "");
if ($iQuick == "update") {
    $errorMsg = '';
    $errorMsg .= $myform->checkdata();
    if ($errorMsg == "") {
        //echo $myform->generate_insert_SQL();
        $db_ex = new db_execute($myform->generate_insert_SQL());
        unset($db_ex);
        //Hien thi loi
    }
    redirect($_SERVER['REQUEST_URI']);
}
//add form for javacheck
$myform->addFormname("add_new");
//add more javacode
$myform->evaluate();
$myform->checkjavascript();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Add New</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link href="<?= $fs_stype_css ?>" rel="stylesheet" type="text/css">
    <link href="<?= $fs_template_css ?>" rel="stylesheet" type="text/css">
</head>
<body topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0">

<? /*---------Body------------*/ ?>
<form action="<?= $_SERVER['REQUEST_URI'] ?>" method="post">
    <input type="hidden" name="iQuick" value="update">
    <table cellpadding="5" cellspacing="0">
        <tr>
            <td colspan="2" bgcolor="#CCCCCC" class="textBold">Thêm mới module</td>
        </tr>
        <tr>
            <td class="textBold">Tên module</td>
            <td><input type="text" class="form" name="mod_name" id="mod_name" value="<?= $mod_name ?>"></td>
        </tr>
        <tr>
            <td class="textBold">Thư mục</td>
            <td><input type="text" class="form" name="mod_path" id="mod_path" value="<?= $mod_path ?>"></td>
        </tr>
        <tr>
            <td class="textBold">Thứ tự</td>
            <td><input type="text" class="form" name="mod_order" id="mod_order" value="<?= $mod_order ?>"></td>
        </tr>
        <tr>
            <td class="textBold">Tiêu đề</td>
            <td><input type="text" class="form" name="mod_listname" id="mod_listname" value="<?= $mod_listname ?>"
                       size="100"></td>
        </tr>
        <tr>
            <td class="textBold">URL file</td>
            <td><input type="text" class="form" name="mod_listfile" id="mod_listfile" value="<?= $mod_listfile ?>"
                       size="100"></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><input type="submit" value="Thêm mới module" class="form"></td>
        </tr>
    </table>
</form>
<form action="quickeditmodule.php" method="post">
    <input type="hidden" name="iQuick" value="update">
    <table cellpadding="5" cellspacing="0" align="left" width="100%">
        <?
        $db_module = new db_query("SELECT * FROM modules ORDER BY mod_order ASC");
        ?>
        <?
        $i = 0;
        foreach ($db_module->fetch() as $mod) {

            if (file_exists("../../modules/" . $mod["mod_path"] . "/inc_security.php")) {
                require("../../modules/" . $mod["mod_path"] . "/inc_security.php");
                $i++;
                ?>
                <tbody>
                <tr <? if (intval($mod["mod_id"]) != intval($module_id)) { ?> bgcolor="#FFCC00"<? } ?>>
                    <td width="10"><?= $i ?></td>
                    <td>
                        <font size="+1" color="#FF0000"><?= $mod["mod_name"] ?></font> <input type="submit" value="Save"
                                                                                              class="form">
                        <img src="<?= $fs_imagepath ?>delete.png" alt="DELETE" border="0"
                             onClick="if (confirm('Bạn muốn xóa?')) { window.location.href='deletemodule.php?record_id=<?= $mod["mod_id"]; ?>&returnurl=<?= base64_encode(getURL()) ?>'}"
                             style="cursor:pointer">
                    </td>
                </tr>
                </tbody>
                <tbody id="list_<?= $mod["mod_id"] ?>">
                <tr bgcolor="#f2f2f2">
                    <td>&nbsp;</td>
                    <td colspan="3">
                        <input type="hidden" name="record_id[]" value="<?= $mod["mod_id"] ?>">
                        <table cellpadding="3" cellspacing="0">
                            <tr>
                                <td class="textBold">Module id</td>
                                <td><?= $mod["mod_id"] ?></td>
                            </tr>
                            <tr>
                                <td class="textBold">Tên module</td>
                                <td><input type="text" class="form" name="mod_name<?= $mod["mod_id"] ?>"
                                           id="mod_name<?= $mod["mod_id"] ?>" value="<?= $mod["mod_name"] ?>"></td>
                            </tr>
                            <tr>
                                <td class="textBold">Thư mục</td>
                                <td><input type="text" class="form" name="mod_path<?= $mod["mod_id"] ?>"
                                           id="mod_path<?= $mod["mod_id"] ?>" value="<?= $mod["mod_path"] ?>"></td>
                            </tr>
                            <tr>
                                <td class="textBold">Thứ tự</td>
                                <td><input type="text" class="form" name="mod_order<?= $mod["mod_id"] ?>"
                                           id="mod_order<?= $mod["mod_id"] ?>" value="<?= $mod["mod_order"] ?>"></td>
                            </tr>
                            <tr>
                                <td class="textBold">Tiêu đề</td>
                                <td><input type="text" class="form" name="mod_listname<?= $mod["mod_id"] ?>"
                                           id="mod_listname<?= $mod["mod_id"] ?>" value="<?= $mod["mod_listname"] ?>"
                                           size="100"></td>
                            </tr>
                            <tr>
                                <td class="textBold">URL file</td>
                                <td><input type="text" class="form" name="mod_listfile<?= $mod["mod_id"] ?>"
                                           id="mod_listfile<?= $mod["mod_id"] ?>" value="<?= $mod["mod_listfile"] ?>"
                                           size="100"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                </tbody>
                <?
                unset($module_id);
            }
        }
        ?>
    </table>
</form>
<? /*---------Body------------*/ ?>
<?= template_bottom() ?>
</body>
</html>
