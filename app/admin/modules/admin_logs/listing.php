<?

require_once 'inc_security.php';

$model = new \VatGia\Admin\Models\AdminLog();

$title = getValue('cla_title', 'str', 'GET', '', 2);
$type = getValue('cla_type', 'int', 'GET', -1);
$category = getValue('cla_category_id', 'int', 'GET', 0);
$user_id = getValue('cla_user_id', 'int', 'GET', -1);
$phone = getValue('cla_phone', 'int', 'GET', '');


$range_date = getValue('adl_created_at', 'str', 'GET', '', 3);
//if (!$range_date) {
//    $range_date = date('d/m/Y') . ' - ' . date('d/m/Y');
//}
if ($range_date) {
    $dates = explode(" - ", $range_date);
    $star_date = new \DateTime(str_replace('/', '-', $dates[0]));
    $end_date = new \DateTime(str_replace('/', '-', $dates[1]));
    $model->where("adl_created_at BETWEEN '" . $star_date->format('Y-m-d 00:00:01') . "' AND '" . $end_date->format('Y-m-d 23:59:59') . "'");
}

if ($title) {
//    $model->where('cla_title LIKE "%' . $title . '%"');
}

if ($type >= 0) {
//    $model->where('cla_type = ' . $type);
}
if ($user_id >= 0) {
//    $model->where('cla_user_id', $user_id);
}
if ($phone) {
//    $model->where('cla_phone', $phone);
}

$items = $model
    ->pagination(getValue('page', 'int', 'GET', 1), $per_page)
    ->order_by('adl_id', 'DESC')
    ->all();

$total = $model->count();


$dataGrid = new DataGrid($items, $total, 'adl_id');

$dataGrid->column('adl_admin_user_id', 'Quản trị viên', function ($row) {
    return $row->admin->name;
});
$dataGrid->column(['adl_action', $actions ?? []], 'Hành động', 'selectShow', [], true);

$dataGrid->column('adl_record_title', 'Diễn giải', 'string', [], false);

$dataGrid->column('adl_created_at', 'Ngày tạo', 'string', [], true);

//$dataGrid->column(uniqid(), 'Sửa', 'edit|center');

//$dataGrid->column(uniqid(), 'Xóa', 'delete|center');
//$dataGrid->column('', 'Sửa', 'edit|center');
//$dataGrid->column('', 'Xóa', 'delete|center');

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render()
    ] + get_defined_vars())->render();
die;
?>
