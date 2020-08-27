<?
require_once("../../bootstrap.php");
require_once 'inc_security.php';

use App\Models\Category;

function childs_delete($category)
{
    if ($category->childs->count() > 0) {
        foreach ($category->childs as $child) {
            childs_delete($child);
        }
    }
    Category::delete('cat_id = ' . (int)$category->id);
//    $category->delete();
}

//check quyền them sua xoa
checkAddEdit("delete");

$returnUrl = base64_decode(getValue("returnurl", "str", "GET", base64_encode("listing.php")));
$recordId = getValue("record_id", "int", "GET", 0);
if ($recordId) {
    $category = Category::findById($recordId);
    if ($category) {
        childs_delete($category);
    }
}

redirect($returnUrl);
?>