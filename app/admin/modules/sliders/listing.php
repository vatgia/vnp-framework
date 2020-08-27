<?
require_once 'inc_security.php';

$sqlWhere = "1";

$banner = \App\Models\BannerSlider\Banner::where($sqlWhere)
    ->order_by('ban_id', 'DESC')
    ->pagination(getValue('page'), $per_page)
    ->select_all();
$total = \App\Models\BannerSlider\Banner::where($sqlWhere)->count();

$dataGrid = new DataGrid($banner, $total, 'ban_id');
$dataGrid->column('ban_title', 'Tiêu đề', ['string', 'trim']);
$dataGrid->column('ban_link', 'Đường dẫn', ['string', 'trim']);
$dataGrid->column('ban_image', 'Ảnh', function ($row) {
    if ($row['ban_image']) {
        return '<img class="banner_image"  src="http://' . $_SERVER['HTTP_HOST'] . '/upload/banners/' . $row['ban_image'] . '" />';
    }
    return '';
});
//$dataGrid->column('ban_html', 'HTML', function ($row) {
//    if ($row['ban_html'] == NULL) {
//        return 'Không';
//    }
//
//    return 'Có';
//});
$dataGrid->column('ban_active', 'Trạng thái', 'active|center');
$dataGrid->column('ban_create_time', 'Ngày tạo', ['string|center', function ($value) {
    return date('d/m/Y H:i', $value);
}]);
$dataGrid->column('ban_update_time', 'Ngày cập nhật', ['string|center', function ($value) {
    return ($value != null && $value > 0) ? date('d/m/Y H:i', $value) : '--';
}]);
$dataGrid->column('', 'Sửa', function ($row) {
    return '<a href="edit_banner.php?record_id=' . $row['ban_id'] . '"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
});
$dataGrid->column('', 'Xóa', function ($row) {
    return '<a href="delete_banner.php?record_id=' . $row['ban_id'] . '"><i class="fa fa-times" aria-hidden="true"></i></a>';
});

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render()
    ] + get_defined_vars())->render();
?>