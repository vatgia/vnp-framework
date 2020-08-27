<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';

//check quyền them sua xoa
checkAddEdit("delete");

$recordId = getValue("record_id", "int", "GET", 0);
if ($recordId) {
    $item = $model::findById($recordId);
    if ($item) {
        $item->delete();
    }
}

redirect(url_back());
?>