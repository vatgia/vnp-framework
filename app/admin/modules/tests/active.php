<?

require_once 'inc_security.php';
//check quyền them sua xoa
checkAddEdit("edit");

$id = getValue('id', 'int', 'POST', 0);
$field = getValue('value', 'int', 'POST', 0);

$item = $model::findByID($id);

if ($item) {
    $item->active = $field;
    $check = $item->update();
}

if ($check) {
    return true;
}

return false;

