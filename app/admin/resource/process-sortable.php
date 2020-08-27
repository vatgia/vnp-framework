<?
require_once '../bootstrap.php';

if (isset($_POST["listItem"])) {
    if (is_array($_POST["listItem"])) {
        foreach ($_POST["listItem"] as $key => $value) {
            $db_del = new db_execute("UPDATE modules SET mod_order = " . intval($key) . " WHERE mod_id=" . intval($value));
            unset($db_del);
        }
    }
}
?>