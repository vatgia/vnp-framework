<?

use VatGia\Admin\Models\AdminUser;

require_once 'inc_security.php';


$listing = AdminUser::where('
    adm_loginname NOT IN (\'admin\')
    AND adm_delete = 0
')
    ->order_by('adm_active', 'DESC')
    ->order_by('adm_loginname', 'ASC')
    ->all();

$dataGrid = new DataGrid($listing, $listing->count(), 'adm_id');
$dataGrid->column('adm_loginname', 'Username', 'string');
$dataGrid->column('adm_name', 'Fullname', 'string');
$dataGrid->column('adm_email', 'Email', 'string');
$dataGrid->column('adm_isadmin', 'Root', 'active');

$dataGrid->column('', 'Sửa', 'edit|center');
$dataGrid->column('', 'Xóa', 'delete|center');

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render(),
    ] + get_defined_vars())->render();