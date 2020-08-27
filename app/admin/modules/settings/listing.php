<?

use App\Models\Setting;

require_once 'inc_security.php';

$swe_label   = getValue('swe_label', 'str', 'GET', '');
$swe_key  = getValue('swe_key', 'str', 'GET', '');

$sqlWhere = "1";

if ($swe_label) {
    $sqlWhere .= " AND swe_label LIKE '%" . $swe_label . "%'";
}
if ($swe_key) {
    $sqlWhere .= " AND swe_key LIKE '%" . $swe_key . "%'";
}

$settingsWebsite = Setting::where($sqlWhere)
    ->pagination(getValue('page'), $per_page)
    ->select_all();

$total = Setting::where($sqlWhere)->count();

$dataGrid = new DataGrid($settingsWebsite, $total, 'swe_id', $per_page);
$dataGrid->column('swe_label', 'Mô tả', ['string'], [], true);
$dataGrid->column('swe_key', 'code', ['string'], [], true);
$dataGrid->column('swe_value', 'Giá trị', function ($row) {
    if ($row['swe_type'] == 'image') {
        return '<img src="' . url() . '/upload/settings/' . $row['swe_value'] . '" height="100"/>';
    } else {
        return cut_string($row['swe_value'], 40);
    }

});

//$dataGrid->column('swe_type', 'Kiểu', ['string', 'trim']);
//$dataGrid->column('swe_create_time', 'Ngày tạo', ['string|center', function ($value) {
//    return date('d/m/Y H:i', $value);
//}]);
//$dataGrid->column('swe_update_time', 'Ngày cập nhật', ['string|center', function ($value) {
//    return ($value != null && $value > 0) ? date('d/m/Y H:i', $value) : '--';
//}]);
$dataGrid->column('', 'Sửa', 'edit|center');
$dataGrid->column('', 'Xóa', 'delete|center');

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render()
    ] + get_defined_vars())->render();
?>