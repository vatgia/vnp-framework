<?php

/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 6/11/2017
 * Time: 11:29 PM
 */
class DataGrid
{
    public $data = [];
    public $totalRecord = 0;
    public $idField = 'id';
    public $perPage = 10;

    public $fields = [];


    public function __construct($data, $total, $id = null, $per_page = 10)
    {
        $this->data = $data;
        $this->totalRecord = (int)$total;
        $this->idField = $id ? $id : $this->idField;
        $this->perPage = $per_page ?? 10;
    }

    public function column($fieldName, $label, $type, $sort = [], $search = [], $show = true)
    {
        $fieldName = $fieldName ? $fieldName : uniqid();
        $fieldName = is_array($fieldName) ? $fieldName : (array)$fieldName;
        $this->fields[reset($fieldName)] = [
            'field' => $fieldName,
            'label' => $label,
            'type' => $type,
            'sort' => $sort,
            'search' => $search,
            'show' => $show
        ];
    }

    public function search($fieldName, $label, $type, $search = true)
    {
        $fieldName = $fieldName ? $fieldName : uniqid();
        $fieldName = is_array($fieldName) ? $fieldName : (array)$fieldName;
        $this->column($fieldName, $label, $type, [], $search, false);
    }

    public function total($field_name, $total, $add_label = '')
    {

        $this->fields[$field_name] = $this->fields[$field_name] ?? [];
        $this->fields[$field_name]['total'] = number_format($total) . ' ' . $add_label;
    }

    public function render()
    {
        $string = $this->header();
        $string .= '
<div class="row">
    <div class="col-xs-12">
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th class="text-center bg-primary">#</th>';

        foreach ($this->fields as $field => $fieldOption) {
            if ($fieldOption['show'] ?? true) {
                $string .= '
                        <th class="text-center bg-primary">
                            ' . $fieldOption['label'] . '
                        </th>';
            }

        }

        $string .= '
                    </tr>
                </thead>';
        $string .= '
                <tbody>';

        $i = 0;
        if ($this->data) {
            foreach ($this->data as $row) {
                $string .= $this->tr($row, ++$i);
            }
        }

        $string .= '<tr><td></td>';
        foreach ($this->fields as $field => $field_options) {
            if (isset($field_options['total'])) {
                $string .= '<td class="field-total" style="text-align: right">' . $field_options['total'] . '</td>';
            } else {
                $string .= ($field_options['show'] ?? true) ? '<td></td>' : '';
            }
        }
        $string .= '</tr>';


        $string .= '   
                </tbody>
        ';

        $string .= '
            </table>
        </div>
    </div>
</div>
';
        $string .= $this->footer();

        return $string;
    }

    public function header()
    {
        //Show form search
        $search = [];
        foreach ($this->fields as $field => $fieldOption) {
            if ($fieldOption['search']) {
                $search[$field] = $fieldOption;
            }
        }
        if (!$search) {
            return '';
        }
        $string = '<form action="" method="get">
    <div class="row table-header-search">  
      ';

        //Giữ các giá trị trên $_GET, loại bỏ những field đã có trong $search
        $search_keeps = $_GET;

        foreach ($search_keeps as $key => $value) {
            if (!array_key_exists($key, $search)) {
                $string .= '<input type="hidden" name="' . $key . '" value="' . $value . '" />';
            }
        }

        $i = 0;
        foreach ($search as $field => $fieldOption) {
            $i++;
            if ($i % 6 == 1) {
                $string .= '<div style="clear:both"></div>';
            }
            $string .= '
        <div class="col-xs-2">
            <div class="form-group">
                <label>' . $fieldOption['label'] . '</label>';


            $fieldOption['type'] = is_array($fieldOption['type']) ? $fieldOption['type'] : (array)$fieldOption['type'];
            $type = reset($fieldOption['type']);

            switch ($type) {
                case 'select':
                case 'selectShow':
                    $data = $fieldOption['field'][1];
                    $string .= '<select class="form-control select select2" name="' . $field . '' . (($fieldOption['search']['multi'] ?? false) ? '[]' : '') . '" ' . (($fieldOption['search']['multi'] ?? false) ? 'multiple' : '') . '>
';

                    foreach ($data as $id => $name) {
                        if (getValue($field, 'str', 'GET', -1) == $id || in_array($id, (array)getValue($field, 'arr', 'GET', []))) {
                            $selected = 'selected';
                        } else {
                            $selected = '';
                        }
                        $string .= '<option ' . $selected . ' value="' . $id . '">' . $name . '</option>';
                    }

                    $string .= '
</select>';
                    break;

                case 'active':
                    $string .= '<select class="form-control select" name="' . $field . '">
';

                    foreach ([-1 => 'Tất cả', 0 => 'Không', 1 => 'Có'] as $id => $name) {
                        if (getValue($field, 'str', 'GET', -1) == $id) {
                            $selected = 'selected';
                        } else {
                            $selected = '';
                        }
                        $string .= '<option ' . $selected . ' value="' . $id . '">' . $name . '</option>';
                    }

                    $string .= '
</select>';
                    break;
                case 'string':
                default:
                    $string .= '<input name="' . $field . '" value="' . getValue($field, 'str', 'GET', '') . '" class="form-control">';
                    break;
            }


            $string .= '
            </div>
        </div>';
        }

        $string .= '
        <div class="col-xs-2">
            <div class="form-group">
                <label>&nbsp;</label>
                <input class="form-control btn btn-primary" type="submit" value="Tìm kiếm"/>
            </div>
        </div>
    </div>
</form>';

        return $string;
    }

    public function pagination()
    {
        $page = getValue('page');
        $page = ($page <= 1) ? 1 : $page;

        $total = $this->totalRecord;
        $totalPage = ceil($total / $this->perPage);

        if ($totalPage <= 1) {
            return;
        }

        $pageShow = 5;
        $pageShow = ($pageShow > $totalPage) ? $totalPage : $pageShow;

        $startPage = $page - floor($pageShow / 2);
        if ($startPage + $pageShow > $totalPage)
            $startPage = $totalPage - $pageShow + 1;
        $startPage = ($startPage >= 1) ? $startPage : 1;

        $arrayPage = array_fill($startPage, $pageShow, array());

        function pageUrl($page)
        {
            $pageParrams = $_GET;
            $pageParrams['page'] = $page;

            return '?' . http_build_query($pageParrams);
        }

        $string = '<ul class="pagination pagination-sm no-margin pull-right">
<li><a href="' . pageUrl(1) . '">«</a></li>';
        foreach ($arrayPage as $pageNumber => $pageData) {
            $active = ($page == $pageNumber) ? 'active' : '';
            $string .= '
<li class="' . $active . '">
    <a href="' . pageUrl($pageNumber) . '">
        ' . $pageNumber . '
    </a>
</li>';
        }
        $string .= '<li><a href="' . pageUrl($totalPage) . '">»</a></li>
</ul>';

        return $string;

    }

    public function footer()
    {
        $footer = '';
        $footer .= '
<div class="pull-left">
    Tổng số: ' . $this->totalRecord . ' bản ghi.
</div>
        ' . $this->pagination();

        return $footer;
    }

    public function tr($row, $i = 1)
    {

        $id = $row[$this->idField];

        $is_deleted = false;
        if ($row->deleted_at ?? false) {
            $is_deleted = true;
        }

        $string = '
<tr id="row_' . (int)$id . '" row-id="' . (int)$id . '" class="' . ($is_deleted ? 'is_deleted' : '') . '">
    <td class="text-center">' . $i . '</td>
';
        foreach ($this->fields as $field => $fieldOption) {

            if (!($fieldOption['show'] ?? true)) {
                continue;
            }
            $type = $fieldOption['type'];

            if (is_array($fieldOption['type'])) {
                $type = reset($fieldOption['type']);
                if (isset($fieldOption['type'][1])) {
                    $callbackType = $fieldOption['type'][1];
                    if (is_callable($callbackType)) {
                        $row[$field] = call_user_func_array($callbackType, [$row[$field]]);
                    } else {
                        $callbackType = explode('|', $callbackType);
                        foreach ($callbackType as $callback) {
                            $row[$field] = $callback($row[$field]);
                        }
                    }
                }
            }

            $td_class = 'text-left';
            if (is_string($type)) {
                $typeArr = explode('|', $type);
                if (isset($typeArr[1])) {
                    $td_class = 'text-' . $typeArr[1];
                }
                $type = $typeArr[0];
            }
            $string .= '<td class="' . $td_class . '">';
            //Trường hợp type của field là 1 hàm callback thì gọi luôn
            if (is_callable($type)) {
                $string .= call_user_func_array($type, [$row, $field]);
            } else {
                $fieldTypeMethod = 'type' . ucfirst(strtolower($type));
                if (method_exists($this, $fieldTypeMethod)) {
                    $string .= call_user_func_array([$this, $fieldTypeMethod], [$row, $field, $fieldOption]);
                }
            }
            $string .= '</td>';

        }
        $string .= '</tr>';

        return $string;
    }

    public function typeString($row, $field)
    {
        return htmlentities($row[$field]);
    }

    public function typeNumber($row, $field)
    {
        return (int)$row[$field];
    }

    public function typeSelect($row, $field, $option)
    {

        $data = isset($option['field'][1]) ? $option['field'][1] : [];

        $string = '<select data-row-id="' . $row[$this->idField] . '" class="select2 ' . $field . '" id="' . $field . '_' . $row[$this->idField] . '" name="' . $field . '[' . $row[$this->idField] . ']">
';
        foreach ($data as $id => $label) {
            if ($row[$field] == $id) {
                $selected = 'selected';
            } else {
                $selected = '';
            }
            $string .= '<option ' . $selected . ' value="' . $id . '">' . $label . '</option>';
        }
        $string .= '
</select>';

        return $string;
    }

    public function typeSelectShow($row, $field, $option)
    {

        $data = isset($option['field'][1]) ? $option['field'][1] : [];

        return isset($data[$row[$field]]) ? $data[$row[$field]] : 'Chưa rõ';
    }

    public function typeMoney($row, $field)
    {
        return '<div style="text-align: right">' . number_format($row[$field]) . 'đ' . '</div>';
    }

    public function typeImage($row, $field)
    {
        return '<img class="data-grid-image" style="max-height: 100px;" src="' . $row[$field] . '" />';
    }

    public function typeActive($row, $field)
    {
        if ($row[$field]) {
            $checked = 'checked';
        } else {
            $checked = '';
        }

        return '<input class="' . $field . '" ' . $checked . ' name="' . $field . '[' . $row[$this->idField] . ']" id="' . $field . '_' . $row[$this->idField] . '" type="checkbox" />';
    }

    public function typeEdit($row)
    {
        $linkEdit = 'edit.php?record_id=' . $row[$this->idField] . '&page=' . getValue('page', 'int', 'GET', 1);

        return '<a href="' . $linkEdit . '">
    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
</a>';
    }

    public function typeDelete($row)
    {
        $linkDelete = 'delete.php?record_id=' . $row[$this->idField];

        return '<a onclick="return confirm(\'Bạn có chắc muốn xóa bản ghi này?\');" href="' . $linkDelete . '">
    <i class="fa fa-times" aria-hidden="true"></i>
</a>';
    }

    public function typeRestore($row)
    {
        $linkDelete = 'restore.php?record_id=' . $row[$this->idField];

        return '<a title="Khôi phục bản ghi" onclick="return confirm(\'Bạn có chắc muốn khôi phục bản ghi này?\');" href="' . $linkDelete . '">
    <i class="fa fa-times" aria-hidden="true"></i>
</a>';
    }

    public function typeSoftDelete($row)
    {
        if ($row->deleted_at ?? false) {
            return 'Đã xóa';
        }
    }


}