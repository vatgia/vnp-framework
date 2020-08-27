<?
require_once 'inc_security.php';

$sqlWhere = "1";

$slider = \App\Models\BannerSlider\Slider::where($sqlWhere)
    ->pagination(getValue('page'), $per_page)
    ->select_all();
$total = \App\Models\BannerSlider\Slider::where($sqlWhere)->count();

$dataGrid = new DataGrid($slider, $total, 'sli_id');
$dataGrid->column('sli_name', 'Tên Slide', ['string', 'trim']);
$dataGrid->column('sli_key', 'Key Slider', ['string', 'trim']);
$dataGrid->column('', 'Sửa', function($row){
    return '<a href="edit_slider.php?record_id='.$row['sli_id'].'"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
});
$dataGrid->column('', 'Xóa', function($row){
  return '<a href="delete_slider.php?record_id='.$row['sli_id'].'"><i class="fa fa-times" aria-hidden="true"></i></a>';
});

echo $blade->view()->make('listing_slider', [
    'data_table' => $dataGrid->render()
] + get_defined_vars())->render();
?>