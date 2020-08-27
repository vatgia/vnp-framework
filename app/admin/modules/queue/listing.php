<?
require_once 'inc_security.php';

use App\Models\Category;
use VatGia\Queue\QueueDatabaseModel;

//$_GET['cat_type'] = isset($_GET['cat_type']) ? $_GET['cat_type'] : 'PRODUCT';

$page = getValue('page', 'int', 'GET', 1);
$que_name = getValue('que_name', 'str', 'GET', '');

//Lấy danh sách queue name
$names = QueueDatabaseModel::fields('DISTINCT que_name')->all();
$name_arr = [];
foreach ($names as $name) {
    $name_arr[$name->name] = $name->name;
}

$sqlWhere = "1";
if ($que_name) {
    $sqlWhere .= ' AND que_name = \'' . $que_name . '\'';
}

$items = QueueDatabaseModel::where($sqlWhere)
    ->order_by('que_created_at', 'DESC')
    ->pagination($page, $page_size)
    ->all();
$total = QueueDatabaseModel::where($sqlWhere)->count();
//dd($items);

$dataGrid = new DataGrid($items, (int)$total, $id_field);

$dataGrid->column(['que_name', $name_arr], 'Name', 'select', [], 1);

$dataGrid->column(
    'que_payload_worker',
    'Worker',
    function ($row) {
        $payload = unserialize(base64_decode($row['que_payload']));
        return json_encode(reset($payload));
    }
);

$dataGrid->column(
    'que_payload_data',
    'Data',
    function ($row) {
        $payload = unserialize(base64_decode($row['que_payload']));
        return json_encode(end($payload));
    }
);

$dataGrid->column('que_created_at', 'Created at', 'string|center');

$dataGrid->column('que_can_run_at', 'Can run at', function ($row) {
    return date('Y-m-d H:i:s', $row['que_can_run_at']);
});


$dataGrid->column('que_running', 'Running', 'active|center');
//$dataGrid->column('que_attempts', 'Attempts', 'number|center');
//$dataGrid->column('que_attempts', 'Attempts', 'number|center');

echo $blade->view()->make('listing', [
        'data_table' => $dataGrid->render(),
//        'parent' => $parent
    ] + get_defined_vars())->render();
die;
?>
