<?
require_once 'inc_security.php';

$cat_type = getValue('cat_type', 'str', 'GET', '', 3);

/**
 * @var \VatGia\Model\Model
 */
$model = new $model;

if ($cat_type) {
    $model->where('cat_type', $cat_type);
}

$items = $model->pagination(getValue('page', 'int', 'GET', 1), $per_page ?? 10)
    ->all();
$total = $model->count();

$items = collect([]);
$total = 0;

$dataGrid = new DataGrid($items, $total, $id_field, $per_page);
$dataGrid->column('cat_icon', 'Icon', ['image', function ($cat_icon) {
    $cat_icon = $cat_icon ? ('http://localhost:5000/upload/' . $cat_icon) : '';

    return $cat_icon;
}]);
$dataGrid->column('cat_name', 'Tên', ['string', 'trim'], [], true);
//$dataGrid->column(['cat_type', $type_arr], 'Loại', 'select', [], true);

//$dataGrid->column('cat_picture', 'Ảnh đại diện', function ($row) {
//    if ($row['cat_picture']) {
//        return '<img src="http://localhost:5000/upload/' . $row['cat_picture'] . '" />';
//    }
//    return '';
//});

$dataGrid->column('cat_order', 'Sắp xếp', 'number');
$dataGrid->column('cat_active', 'Active', 'active|center');
$dataGrid->column('', 'Sửa', 'edit|center');
$dataGrid->column('', 'Xóa', 'delete|center');

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render()
    ] + get_defined_vars())->render();
die;
?>
