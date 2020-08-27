<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';

use App\Models\Category;

//check quyền them sua xoa
checkAddEdit("edit");

$id = getValue('id', 'int', 'POST', 0);
$field = getValue('field', 'str', 'POST');
var_dump($id);
//Bắn value cho vui thôi chứ thực ra chả cần
$value = getValue('value', 'int', 'POST', 0);
$category = Category::findByID($id);
// var_dump($field);
if ($id && $category) {
	var_dump($category->$field);
    $category->$field = ($category->$field == 1) ? 0 : 1;
    $category->update();
}

return;
