<?

/*
	Code : dinhtoan1905
	Classs tao listing trong admin

*/

class fsDataGird
{

    var $stt = 0;
    var $arrayField = array();
    var $arrayLabel = array();
    var $arrayType = array();
    var $arrayAttribute = array();
    var $field_id = '';
    var $field_name = '';
    var $image_path = '../../resource/images/grid/';
    var $fs_border = "#C3DAF9";
    var $html = '';
    var $scriptText = '';
    var $title = '';
    var $arraySort = array();
    var $arraySearch = array();
    var $arrayAddSearch = array();
    var $quickEdit = true;
    var $total_list = 0;
    var $total_record = 0;
    var $page_size = 30;
    var $edit_ajax = false;
    var $showid = true;
    var $arrayFieldLevel = array();
    var $delete = true;
    var $searchKeyword = false;
    var $sql_keyword = '';
    // Biến lưu các mảng

    var $arrayGroup = array();
    var $nonHeader = array();

    // Biến check search button

    var $btnSearch = true;
    var $arrayButtonSearch = array();

    // Biến khai báo class button
    var $classButton = 'btn btn-primary';

    // Biến khai báo style table Search
    var $tableSearch = false;
    var $maxRowSearch = 0;

    //add cac truong va tieu de vao
    function __construct($field_id, $field_name, $title)
    {
        $this->field_id = $field_id;
        $this->field_name = $field_name;
        $this->title = $title;
    }


    /*
    1: Ten truong trong bang
    2: Tieu de header
    3: kieu du lieu
    4: co sap xep hay khong, co thi de la 1, khong thi de la 0
    5: co tim kiem hay khong, co thi de la 1, khong thi de la 0
    */
    function add($field_name, $lable, $type = "string", $sort = 0, $search = 0, $attributes = "", $set_action = false)
    {
        if ($sort == 1) $this->arraySort[$this->stt] = $field_name;
        if ($search == 1) $this->arraySearch[$this->stt] = $field_name;

        $this->arrayField[$this->stt] = $field_name;
        $this->arrayLabel[$this->stt] = $lable;
        $this->arrayType[$this->stt] = $type;
        $this->arrayAttribute[$this->stt] = $attributes;
        // Nếu có set action
        if ($set_action) {
            $this->arrayGroup[$set_action][] = $this->stt;
            $this->nonHeader[] = $this->stt;
        }
        $this->stt++;
        if ($type == "array") {
            global $$field_name;
            $arrayList = $$field_name;
            $strdata = array();
            foreach ($arrayList as $key => $value) {
                $strdata[] = $key . ':' . "'" . str_replace("'", "\'", $value) . "'";
            }
            $strdata = implode(",", $strdata);
            $this->scriptText .= '<script type="text/javascript">';
            $this->scriptText .= '$(function() {
										  $(".editable_select_' . $field_name . '").editable("listing.php?ajaxedit=1", {
											 indicator : \'<img src="' . $this->image_path . 'indicator.gif">\',
											 tooltip   : "' . translate_text("No selected") . '",
											 data   : "{' . $strdata . '}",
											 type   : "select",
											 submit : "' . translate_text("Save") . '",
											 style  : "inherit",
											 submitdata : function() {
												return {id : $(this).attr("name"),array : \'' . $field_name . '\'};
											 }
										  });
										});';
            $this->scriptText .= '</script>';
        }
    }

    /**
     * Hàm add vào action chung
     * @param   $field_name : tên trường
     * @param   $label :  tiêu đề cho trường
     * @param   $group : tên action add vào
     * @param   $type : kiểu dữ liệu
     */
    function addGroup($group, $field_name, $lable, $type = "string", $search = 0, $sort = 0)
    {
        $this->add($field_name, $lable, $type, $sort, $search, "", $group);
    }

    /**
     * Hàm thêm select box sắp xếp vào search
     */
    function setSelectSort()
    {
        // Tạo select box sort
        $array_sort = array(0 => "Sắp xếp");
        foreach ($this->arraySort as $key => $field) {
            $array_sort[$field] = $this->arrayLabel[$key];
        }
        $sort = getValue("sort", "str", "GET", "asc");
        $sortname = getValue("sortname", "str", "GET", "");
        $sortSubmit = getValue("submit_sort", "str", "GET", "");
        if ($sortSubmit == "Sort") {
            if ($sort == "asc")
                $sort = "desc";
            else
                $sort = "asc";
        }
        $this->addSearch("Sắp xếp", "sortname", "array", $array_sort, $sortname, 'onchange="document.form_search.submit();"');
        $this->addSearch("", "sort", "hidden", $sort, $sort);
    }

    function showHeader($total_list)
    {

        if (!empty($this->arraySort))
            $this->setSelectSort();

        //goi phan template
        $str = '<div class="row">
<div class="col-xs-12">
<div class="box">';
        $str .= template_top($this->title, $this->urlsearch());
        if ($this->quickEdit) {
            //phan quick edit
            $str .= '<form action="quickedit.php?url=' . base64_encode($_SERVER['REQUEST_URI']) . '" method="post" enctype="multipart/form-data" name="listing">
						<input type="hidden" name="iQuick" value="update">';
        }
        // khởi tạo div content
        $str .= '

        <div class="box-body table-responsive no-padding">';
        // khoi tao table
        $str .= '<table id="listing" class="table table-hover">';

        //phan header

        $str .= '<thead><tr>';

        //tru?ng ID
        $str .= '<th width="30">#</th>';

        //phan checkbok all
        if ($this->delete) $str .= '
<th class="h check" width="30">
    <input type="checkbox" id="check_all" onclick="checkall(' . $total_list . ')">
</th>';

        if ($this->quickEdit) {
            //phan quick edit
            $str .= '
<th class="h">
    <img src="' . $this->image_path . 'save.png" onclick="document.listing.submit()" style="cursor: pointer;" border="0">
</th>';
        }

        foreach ($this->arrayLabel as $key => $lable) {
            if (in_array($key, $this->nonHeader))
                continue;
            $str .= '<th class="h" ' . $this->arrayAttribute[$key] . '>' . $lable . $this->urlsort($key) . ' </th>';

        }

        $str .= '</tr></thead>';

        return $str;
    }

    /*
    Ham hien thi ra listing
    db : ket qua tra ve cua cau lenh query gọi từ class db_query
    */

    function showTable($db, $multi = 0)
    {


        $i = 0;

        $page = getValue("page");
        if ($page < 1) $page = 1;

        $listing = [];

        if (is_array($db)) {
            $listing = $db;
        } elseif ($db instanceof db_query) {
            while ($row = mysqli_fetch_assoc($db->result)) {
                $listing[] = $row;
            }
        } else {
            $listing = [];
        }

        //phan html help
        $str = '';
        $str .= $this->showHeader(count($listing));
        foreach ($listing as $id => $row) {
            $i++;
            $str .= '<tbody id="tr_' . $row[$this->field_id] . '">';
            $str .= '<tr ' . (($i % 2 == 0) ? 'bgcolor=""' : '') . '>';

            //phan so thu tu
            if ($this->showid) {
                $str .= $this->showId($i, $page);
            }

            //phan checkbok cho tung record
            $str .= $this->showCheck($i, $row[$this->field_id]);

            foreach ($this->arrayField as $key => $field) {
                if (in_array($key, $this->nonHeader))
                    continue;
                $str .= $this->checkType($row, $key);
            }

            $str .= '</tr>';
            $str .= '</tbody>';
        }


        //phan footer

        $str .= $this->showFooter(count($listing));


        return $str;
    }

    function start_tr($i, $record_id, $add_html = "")
    {
        $page = getValue("page");
        if ($page < 1) $page = 1;

        $str = '<tbody id="tr_' . $record_id . '">
					<tr ' . (($i % 2 == 0) ? 'bgcolor=""' : '') . $add_html . '>';
        $str .= $this->showid($i, $page);
        $str .= $this->showCheck($i, $record_id);

        return $str;

    }

    function end_tr()
    {
        $str = '</tr></tbody>';

        return $str;
    }

    function showId($i, $page)
    {
        $str = '<td style="text-align:center;width:15px;"><span style="color:#142E62; font-weight:bold">' . ($i + (($page - 1) * $this->page_size)) . '</span></td>';

        return $str;
    }

    function showCheck($i, $record_id)
    {
        $str = (!$this->delete) ? "" : '
<td class="check">
    <input type="checkbox" class="check" name="record_id[]" id="record_' . $i . '" value="' . $record_id . '">
</td>';
        if ($this->quickEdit) {
            //phan quick edit
            $str .= '
<td width=15>
    <img src="' . $this->image_path . 'save.png" style="cursor: pointer;" onclick="document.getElementById(\'record_' . $i . '\').checked = true; document.listing.submit()" border="0">
</td>';
        }

        return $str;
    }

    function showEdit($record_id)
    {
        return '
<td width="10" align="center">
    <a  class="btn btn-box-tool" 
        data-widget="edit" 
        data-toggle="tooltip" 
        title="Sửa bản ghi" 
        href="edit.php?record_id=' . $record_id . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '">
        <img src="' . $this->image_path . 'edit.png" border="0">
    </a>
</td>';
    }

    function showDelete($record_id)
    {
        return '
<td width="10" align="center">
    <a  class="btn btn-box-tool" 
        data-widget="remove" 
        data-toggle="tooltip" 
        title="Xóa bản ghi" 
        href="#" onclick="if (confirm(\'' . str_replace("'", "\'", translate_text("Bạn muốn xóa bản ghi?")) . '\')){ deleteone(' . $record_id . '); }">
        <img src="' . $this->image_path . 'delete.gif" border="0">
    </a>
</td>';
    }

    function showCopy($record_id)
    {
        return '
<td width="10" align="center">
    <a  class="btn btn-box-tool" 
        data-widget="copy" 
        data-toggle="tooltip" 
        title="Copy thêm 1 bản ghi mới"  
        href="copy.php?record_id=' . $record_id . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '">
        <img src="' . $this->image_path . 'copy.gif" border="0">
    </a>
</td>';
    }

    function addAttr($i, $name, $id = "", $class = "form_control")
    {
        if ($id == "") $id = $name;

        return ' class="form-control" name="' . $name . '" id="' . $id . '" onkeyup="check_edit(\'record_' . $i . '\')"';
    }

    function showCheckbox($field, $value, $record_id)
    {
        return '<td width="10" align="center">
    <a class="edit" onclick="update_check(this); return false" href="active.php?ajax=1&field=' . $field . '&checkbox=1&record_id=' . $record_id . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '">
        <img src="' . $this->image_path . 'check_' . $value . '.gif" border="0">
    </a>
</td>';
    }

    function showFooter($total_list)
    {
        $str = '</tr>';
        //goi ham xu ly phan footer ra
        $str .= '<th class="f" colspan="' . (count($this->arrayLabel) + 3) . '">' . $this->footer($total_list) . '</th>';
        $str .= '</tr>';
        $str .= '</table>';
        $str .= '</div>';
        $str .= '</form>
</div>
</div>
</div>';
        //khet thuc phan template
        $str .= template_bottom();

        return $str;
    }

    /**
     * Hàm tạo group
     */
    function showGroup($row, $group)
    {
        $str = '';
        $str .= '<td>';
        $str .= '  <table id="' . $group . $row[$this->field_id] . '" class="table_small">';
        foreach ($this->arrayGroup[$group] as $key) {
            $str .= '  <tr>';
            if ($this->arrayLabel[$key] != "")
                $str .= '     <td class="label_action">' . $this->arrayLabel[$key] . $this->urlsort($this->arrayField[$key]) . '<span style="padding-left: 10px;float: right;">:</span></td>';
            else
                $str .= '     <td></td>';
            $str .= $this->checkType($row, $key);
            $str .= '  </tr>';
        }
        $str .= '  </table>';
        $str .= '</td>';

        return $str;
    }

    /**
     * Hàm tạo list
     */
    function showList($row, $field, $break = "<br>")
    {
        $str = '';
        $str .= '<td>';
        global $$field;
        $array = $$field;
        if (isset($array[$row[$this->field_id]]) && is_array($array[$row[$this->field_id]])) {
            foreach ($array[$row[$this->field_id]] as $key => $value) {
                $str .= $value . $break;
            }
        }
        $str .= '</td>';

        return $str;
    }

    /**
     * Hàm tạo button
     */
    function showButton($row, $func, $label, $add_html = "")
    {
        $str = '';
        $str .= '<td style="text-align:center;">';
        $str .= '  <button ' . $add_html . ' style="color:white;" class="' . $this->classButton . '" onclick="' . $func . '(' . $row[$this->field_id] . ');return false;">';
        $str .= $label;
        $str .= '  </button>';
        $str .= '</td>';

        return $str;
    }

    /**
     * Hàm tạo link
     */
    function showLink($link, $url = '/webhay/index.php?url=', $target = "_blank")
    {
        $str = '';
        $str .= '<td>';
        $str .= '  <a title="' . $link . '" target="' . $target . '" href="' . $url . base64_url_encode($link) . '">';
        $str .= cut_string2($link, 30);
        $str .= '  </a>';
        $str .= '</td>';

        return $str;
    }

    /*
    ham xu ly hien thi theo dang multi
    */

    function showTableMulti($db)
    {

        //goi phan template
        $this->html .= template_top($this->title, $this->urlsearch());

        // khoi tao table
        $this->html .= '<table id="listing" cellpadding="5" cellspacing="0" border="1" bordercolor="' . $this->fs_border . '" width="100%" class="table">';

        //phan header

        $this->html .= '</tr>';

        $this->html .= '<th width="30">STT</th>';

        $this->total_list .= count($db);

        //phan checkbok all
        $this->html .= '<th class="h check"><input type="checkbox" id="check_all" onclick="checkall(' . $this->total_list . ')"></th>';

        if ($this->quickEdit) {
            //phan quick edit
            $this->html .= '<th class="h"><img src="' . $this->image_path . 'qedit.png" border="0"></th>';
        }

        //phần hiển thị tiêu đề
        foreach ($this->arrayLabel as $key => $lable) {

            $this->html .= '<th class="h">' . $lable . $this->urlsort($this->arrayField[$key]) . ' </th>';

        }

        $this->html .= '</tr>';

        $page = getValue("page");
        if ($page < 1) $page = 1;

        $i = 0;
        foreach ($db as $key => $row) {
            $i++;
            $this->html .= '<tbody id="tr_' . $row[$this->field_id] . '">';
            $this->html .= '<tr ' . (($i % 2 == 0) ? 'bgcolor="#f7f7f7"' : '') . '>';

            //phan so thu tu
            //phan so thu tu
            if ($this->showid) {
                $this->html .= '<td width=15 align="center"><span style="color:#142E62; font-weight:bold">' . ($i + (($page - 1) * $this->page_size)) . '</span></td>';
            }
            //phan checkbok cho tung record
            $this->html .= '<td class="check"><input type="checkbox" class="check" name="record_id[]" id="record_' . $i . '" value="' . $row[$this->field_id] . '"></td>';

            if ($this->quickEdit) {
                //phan quick edit
                $this->html .= '<td width=15 align="center"><a class="thickbox" rel="tooltip" title="' . translate_text("Do you want quick edit basic") . '" href="quickedit.php?record_id=' . $row[$this->field_id] . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '&KeepThis=true&TB_iframe=true&height=300&width=400"><img src="' . $this->image_path . 'qedit.png" border="0"></a></td>';
            }
            foreach ($this->arrayField as $key => $field) {

                $this->html .= $this->checkType($row, $key);

            }

            $this->html .= '</tr>';
            $this->html .= '</tbody>';
        }


        //phan footer

        $this->html .= '</tr>';

        //goi ham xu ly phan footer ra
        $this->html .= '<th class="f" colspan="' . (count($this->arrayLabel) + 3) . '">' . $this->footer() . '</th>';


        $this->html .= '</tr>';


        $this->html .= '</table>';

        //khet thuc phan template
        $this->html .= template_bottom();

        return $this->html;
    }

    /*

    Ham xu ly type hien thi
    xử lý các kiểu hiển thị trong listing
    row  : truyền array row gọi từ mysql_fetch_assoc ra
    key  : thứ tự trường add vào
    */

    function checkType($row, $key, $check_action = true)
    {
        $level = "";
        if (isset($this->arrayFieldLevel[$this->arrayField[$key]])) {
            for ($i = 0; $i < $row["level"]; $i++) {
                $level .= $this->arrayFieldLevel[$this->arrayField[$key]];
            }
        }
        switch ($this->arrayType[$key]) {

            //kiểu tiền tệ VNĐ
            case "vnd":
                return '<td ' . $this->arrayAttribute[$key] . ' style="text-align: right;">
                <span class="vnd" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',3">
                    ' . format_number($row[$this->arrayField[$key]]) . '
                </span>
                </td>';
                break;

            //kiểu tiền tệ USD
            case "usd":
                return '<td ' . $this->arrayAttribute[$key] . '>
                <span class="clickedit vnd" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',3">
                ' . $row[$this->arrayField[$key]] . '
                </span>
                </td>';
                break;

            //kiểu ngày tháng
            case "date":
                return '<td class="date" align="center" ' . $this->arrayAttribute[$key] . '>
                ' . date("d/m/Y", $row[$this->arrayField[$key]]) . '
                </td>';
                break;

            // Kiểu ngày tháng năm giờ phút giây chi tiết
            case "datetime":
                return '<td class="date" ' . $this->arrayAttribute[$key] . '>
                ' . date("d/m/Y H:i:s", $row[$this->arrayField[$key]]) . '
                </td>';
                break;

            //kiểu hình ảnh
            case "picture":
                if ($row[$this->arrayField[$key]] != '') {
                    global $fs_filepath;

                    return '<td width="100" align="center" style="padding:5px;" >
               <a rel="tooltip"  title="<img src=\'' . $fs_filepath . "small_" . $row[$this->arrayField[$key]] . '\' border=\'0\'>" href="#"><img src="' . $fs_filepath . "small_" . $row[$this->arrayField[$key]] . '" width="150" border="0"></a>
                <input name="' . $this->arrayField[$key] . $row[$this->field_id] . '" type="file"/>
               </td>';
                } else {
                    return '<td width="100">&nbsp;</td>';
                }
                break;

            //kiểu mãng dùng cho combobox có thể edit
            case "array":
                $field = $this->arrayField[$key];
                global $$field;
                $arrayList = $$field;
                $value = isset($arrayList[$row[$this->arrayField[$key]]]) ? $arrayList[$row[$this->arrayField[$key]]] : '';

                return '<td ' . $this->arrayAttribute[$key] . '  class="tooltip"  title="' . translate_text("Click sửa đổi sau đó chọn save") . '">
                <span class="editable_select_' . $this->arrayField[$key] . '" style="display:inline" id="select_2" name="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',0">
                ' . str_replace("-", "", $value) . '
                </span>
                </td>';
                break;

            //kiểu mãng chỉ hiển thị không edit được
            case "arraytext":
                $field = $this->arrayField[$key];
                global $$field;
                $arrayList = $$field;
                $value = isset($arrayList[$row[$this->arrayField[$key]]]) ? $arrayList[$row[$this->arrayField[$key]]] : '';

                return '<td ' . $this->arrayAttribute[$key] . '>' . str_replace("-", "", $value) . '</td>';
                break;

            //kiểu copy bản ghi
            case "copy":
                return '<td width="10" align="center"><a class="edit"  rel="tooltip"  title="' . translate_text("Nhân b?n thêm m?t b?n ghi m?i") . '" href="copy.php?record_id=' . $row[$this->field_id] . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '"><img src="' . $this->image_path . 'copy.gif" border="0"></a></td>';
                break;

            //kiểu check box giá trị là 0 hoặc 1
            case "checkbox":
                return '<td width="12" align="center"><a class="edit" onclick="update_check(this); return false" href="listing.php?field=' . $this->arrayField[$key] . '&checkbox=1&record_id=' . $row[$this->field_id] . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '"><img src="' . $this->image_path . 'check_' . $row[$this->arrayField[$key]] . '.gif" border="0"></a></td>';
                break;

            //kiểu hiển thị nút edit
            case "edit":
                return '<td width="16" align="center"><a class="edit"  rel="tooltip" title="' . translate_text("Bạn muốn sửa đổi bản ghi") . '" href="edit.php?record_id=' . $row[$this->field_id] . '&url=' . base64_encode($_SERVER['REQUEST_URI']) . '"><img src="' . $this->image_path . 'edit.png" border="0"></a></td>';
                break;

            //kểu hiện thị nút xóa
            case "delete":
                if ($this->delete) {
                    return '<td width="16"  align="center"><a class="delete" href="#" onclick="if (confirm(\'' . str_replace("'", "\'", translate_text("Bạn muốn xóa bản ghi?") . ': ' . $row[$this->field_name]) . '\')){ deleteone(' . $row[$this->field_id] . '); }"><img src="' . $this->image_path . 'delete.gif" border="0"></a></td>';
                } else {
                    return '';
                }
                break;

            //kiểu hiển thị text có sửa đổi
            case "string":
                return '<td ' . $this->arrayAttribute[$key] . ' class="tooltip"  title="' . translate_text("Click vào để sửa đổi sau đó enter để lưu lại") . '">
                ' . $level . '
                <span class="clickedit" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',0">
                    ' . $row[$this->arrayField[$key]] . '
                </span>
                </td>';
                break;

            //kiểu hiện thị text không sửa đổi
            case "text":
                return '<td ' . $this->arrayAttribute[$key] . '>' . $row[$this->arrayField[$key]] . '</td>';
                break;

            //kiểu hiển thị số có sửa đổi
            case "number":
                return '<td ' . $this->arrayAttribute[$key] . ' class="tooltip"  title="' . translate_text("Click vào để sửa đổi sau đó enter để lưu lại") . '" align="center" width="10%" nowrap="nowrap">' . $level . '<span class="clickedit" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',0">' . $row[$this->arrayField[$key]] . '</span></td>';
                break;

            //kiểu hiển thị số ko sửa đổi
            case "numbernotedit":
                return '<td ' . $this->arrayAttribute[$key] . ' align="center" width="10%" nowrap="nowrap">' . $level . $row[$this->arrayField[$key]] . '</td>';
                break;

            //kiểu hiện nút reset
            case "resetpass":
                return '<td width="10"  align="center">
<a href="#" onclick="if (confirm(\'' . str_replace("'", "\'", translate_text("Bạn muốn reset lại password của user này không?") . ': ' . $row[$this->field_name]) . '\')){ resetpass(' . $row[$this->field_id] . '); }">
<img src="' . $this->image_path . 'reset.gif" border="0">
</a>
</td>';
                break;

            //kểu hiện thị nút gui email
            case "sent_email":
                return '<td width="80" align="center">
<a class="edit" href="#"  rel="tooltip" title="' . translate_text("Gửi email thông báo tới thành viên") . '" onclick="sent_email(\'' . $row[$this->field_id] . '\')">
<img src="' . $this->image_path . 'send.gif" border="0">
</a>
</td>';
                break;

            //Text Area
            case "textarea":
                return '
<td ' . $this->arrayAttribute[$key] . ' class="tooltip"  title="' . translate_text("Click vào để sửa đổi sau đó enter để lưu lại") . '">
   ' . $level . '<span class="clickedit" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',0">
      ' . $row[$this->arrayField[$key]] . '
   </span>
</td>
            ';
                break;

            //Kiểu hiển thi ip từ số long
            case 'long2ip':
                return '<td ' . $this->arrayAttribute[$key] . ' class="tooltip"  title="' . translate_text("Click vào để sửa đổi sau đó enter để lưu lại") . '" align="center" width="10%" nowrap="nowrap">' . $level . '<span class="clickedit" style="display:inline" id="' . $this->arrayField[$key] . ',' . $row[$this->field_id] . ',0">' . long2ip($row[$this->arrayField[$key]]) . '</span></td>';
                break;
            // Kiểu hiển thị dạng list
            case  'list'   :
                return $this->showList($row, $this->arrayField[$key]);
                break;
            // Kiểu group
            case 'group':
                return $this->showGroup($row, $this->arrayField[$key]);
                break;
            // Kiểu button
            case 'button':
                return $this->showButton($row, $this->arrayField[$key], $this->arrayLabel[$key]);
                break;
            // Kiểu link
            case 'link':
                return $this->showLink($row[$this->arrayField[$key]]);
                break;
            //dạng mặc định
            default:
                return '<td ' . $this->arrayAttribute[$key] . '>
                ' . $row[$this->arrayField[$key]] . '
                </td>';
                break;
        }
    }

    /*
    ham format kieu so
    */
    function formatNumber($number)
    {
        $number = number_format(round($number / 1000) * 1000, 0, "", ".");

        return $number;
    }

    /*
    phan header javascript
    */

    function headerScript()
    {
        $this->scriptText .= '<script type="text/javascript">';
        //phan script edit nhanh text box
        $this->scriptText .= '$(function() {

									  $(".clickedit").editable("listing.php?ajaxedit=1", {
											indicator : "<img src=\'../../resource/images/grid/indicator.gif\'>",
											tooltip   : "' . translate_text("Click to edit...") . '",
											style  : "inherit"
									  });
									});
									';


        //phan javascript hover vao cac tr
        $this->scriptText .= "$( function(){
											var bg = '';
											$('table#listing').children('tbody').hover( function(){
												bg = $(this).css('background-color');
												$(this).css('background-color', '#FFFFCC');
											},
											function(){
												$(this).css('background-color', bg);
											});

									});";
        $this->scriptText .= '</script>';
        $this->scriptText .= '<script language="javascript" src="../../resource/js/grid.js?v=' . time() . '"></script>';

        return $this->scriptText;

    }

    /*
    ham tao ra nut sap xep
    $key : tên trường
    */
    function urlsort($key)
    {
        $str = '';

        if (isset($this->arraySort[$key])) {
            $field = $this->arrayField[$key];
            $url = getURL(0, 1, 1, 1, "sort|sortname");
            $sort = getValue("sort", "str", "GET", "");
            $sortname = getValue("sortname", "str", "GET", "");
            $img = 'sort.gif';
            if ($sortname != $field) $sort = "";
            switch ($sort) {
                case "asc":
                    $url = $url . "&sort=desc";
                    $img = 'sort-asc.gif';
                    break;
                case "desc":
                    $url = $url . "&sort=asc";
                    $img = 'sort-desc.gif';
                    break;
                default:
                    $url = $url . "&sort=asc";
                    $img = 'sort.gif';
                    break;
            }

            $url = $url . "&sortname=" . $field;

            $str = '&nbsp;<span><a href="' . $url . '"  rel="tooltip"  title="' . translate_text("Sort A->Z or Z->A") . '" onclick="loadpage(this); return false" ><img src="' . $this->image_path . $img . '" align="absmiddle" border="0"></a></span>';

        }

        return $str;
    }

    /*
    ham tao cau lanh sql sort
    hàm sinh ra câu lênh query sort tương ứng
    */

    function sqlSort()
    {
        $sort = getValue("sort", "str", "GET", "");
        $field = getValue("sortname", "str", "GET", "");
        $str = '';
        if (in_array($field, $this->arraySort) && ($sort == "asc" || $sort == "desc")) {
            $str = $field . ' ' . $sort . ',';
        }

        return $str;
    }

    /**
     * Hàm add thêm button vào search
     * @param $name : tên button
     * @param $func : function add vào button
     */
    function addButtonSearch($name, $func)
    {
        $str = '<a onclick="' . $func . '();return false;" class="' . $this->classButton . '">' . $name . '</a>';
        $this->arrayAddSearch[] = array($str, '', '', '');
    }

    /*
    ham add them cac truong search
    name : tiêu đề
    field : tên trường
    type : kiểu search
    value : giá trị nếu kiểu array thì truyền vào một array
    default: giá trị mặc định
    */
    function addSearch($name, $field, $type, $value = '', $default = "", $add_html = "")
    {

        $str = '';
        switch ($type) {
            //kiểu array
            case "array":
                $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $name . '</label>
        <select name="' . $field . '" id="' . $field . '" class="textbox form-control" ' . $add_html . '>';
                foreach ($value as $id => $text) {
                    $str .= '
            <option value="' . $id . '" ' . (($default == $id) ? 'selected="selected"' : '') . '>' . $text . '</option>';
                }
                $str .= '
        </select>
</div></div>
';
                break;

            //kiểu ngày tháng
            case "date":
                $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $name . '</label>
        <input ' . $add_html . ' type="text"  class="textbox form-control" name="' . $field . '" id="' . $field . '"  onKeyPress="displayDatePicker(\'' . $field . '\', this);" onClick="displayDatePicker(\'' . $field . '\', this);"  value="' . $value . '">
    </div>
</div>';
                break;

            //kiểu text box
            case "text":
                $value = getValue($field, "str", "GET", "");
                $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $name . '</label>
        <input onkeydown="submit_form(event,this);" ' . $add_html . ' type="text"  class="textbox form-control" name="' . $field . '" id="' . $field . '"  value="' . $value . '">
    </div>
</div>';
                break;
            // Kiểu checkbox
            case "checkbox":
                $value = getValue($field, "int", "GET", 0);
                $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $name . '</label>
        <input ' . $add_html . ' type="checkbox" class="form-check-input" name="' . $field . '" id="' . $field . '" value="1" />
</div></div>';
            // Kiểu hidden
            case "hidden":
                $value = getValue($field, "str", "GET", $default);
                $str .= '<input ' . $add_html . ' type="hidden"  class="textbox " name="' . $field . '" id="' . $field . '" value="' . $default . '">';
                break;
        }
        $this->arrayAddSearch[] = array($str, $field, '', $type);
    }

    /**
     * Hàm set table search
     */
    function setTableSearch($max_row)
    {
        $this->tableSearch = true;
        $this->maxRowSearch = $max_row;
    }

    /**
     * Hàm trả về button search
     */
    function showButtonSearch()
    {
        return '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="search">Tìm kiếm</label>
        <button id="search" type="submit" class="' . $this->classButton . ' form-control">' . translate_text("Tìm kiếm") . '</button>
    </div>
</div>';
    }

    /**
     * Hàm trả về button sort
     */
    function showButtonSort()
    {
        return '<td style="padding: 3px;"><input type="submit" class="' . $this->classButton . '" value="Sort" name="submit_sort" /></td>';
    }

    /*
    ham tao form search
    */
    function urlsearch()
    {
        $str = '';
        $i = 0;
        $open_td = '';
        $close_td = '';

        $str = '<form action="' . $_SERVER['SCRIPT_NAME'] . '" methor="get" name="form_search" onsubmit="check_form_submit(this); return false">';
        $str .= '<input type="hidden" name="search" id="search" value="1" />';
        $str .= '';
        if ($this->searchKeyword) {
            $i++;
            if ($this->tableSearch) {
                $str .= $open_td . '<tr>';
            }
            $label = translate_text("Nhập từ khóa");
            $value = getValue("keyword", "str", "GET", $label);
            $str .= '<td></td>';
            $str .= '

    <div class="form-group">
        <input type="text" class="textbox form-control" name="keyword" id="keyword" onfocus="if(this.value==\'' . $label . '\') this.value=\'\'" onblur="if(this.value==\'\') this.value=\'' . $label . '\'" value="' . $value . '">
    </div>
';
            if ($this->tableSearch) {
                $str .= '</tr>';
            }
        }
        foreach ($this->arraySearch as $key => $field) {
            if ($this->tableSearch) {
                if ($i == 0) {
                    $str .= $open_td;
                }
//                $str .= '<tr>';
            }
            switch ($this->arrayType[$key]) {

                case "string":
                case "text":
                    $value = getValue($field, "str", "GET", '');
                    $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $this->arrayLabel[$key] . '</label>
        <input type="text" 
            class="textbox form-control" 
            name="' . $field . '" id="' . $field . '" 
            placeholder="' . $this->arrayLabel[$key] . '"
            value="' . $value . '">
    </div>
</div>
';
                    break;
                case "numbernotedit":
                    $value = getValue($field, "str", "GET", $this->arrayLabel[$key]);
                    $str .= '<td><input type="text" class="textbox" name="' . $field . '" id="' . $field . '" onfocus="if(this.value==\'' . $this->arrayLabel[$key] . '\') this.value=\'\'" onblur="if(this.value==\'\') this.value=\'' . $this->arrayLabel[$key] . '\'" value="' . $value . '"></td>';
                    break;
                case "date":
                    $value = getValue($field, "str", "GET", "");
                    $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $this->arrayLabel[$key] . '</label>
        <input type="text"  
            class="textbox form-control" 
            name="' . $field . '" 
            id="' . $field . '" 
            autocomplete="off"
            onKeyPress="displayDatePicker(\'' . $field . '\', this);" 
            onClick="displayDatePicker(\'' . $field . '\', this);" 
            placehilder="đ/mm/yyyy" 
            value="' . $value . '">
    </div>
</div>';
                    break;
                case "array":
                    $field = $this->arrayField[$key];
                    global $$field;
                    $arrayList = $$field;
                    $str .= '
<div class="col-2 col-md-2 push-md-6 bd-sidebar">
    <div class="form-group">
        <label for="' . $field . '">' . $this->arrayLabel[$key] . '</label>
        <select  class="textbox form-control select2" name="' . $field . '" id="' . $field . '">';
                    $str .= '
            <option value="-1">' . $this->arrayLabel[$key] . '</option>';
                    $selected = getValue($field, "str", "GET", -1);
                    foreach ($arrayList as $key => $value) {
                        $str .= '<option value="' . $key . '" ' . (($selected == $key) ? 'selected' : '') . '>' . $value . '</option>';
                    }
                    $str .= '
        </select>
    </div>
</div>';
                    break;

            }
            $i++;
            if ($this->tableSearch) {
                $str .= '</tr>';
                if ($i == $this->maxRowSearch) {
                    $i = 0;
                    $str .= $close_td;
                }
            }
        }

        foreach ($this->arrayAddSearch as $key => $value) {
            if ($value[3] == "hidden") {
                $str .= $value[0];
                if ($i > 0 && $key == @end(array_keys($this->arrayAddSearch)) && $this->tableSearch) {
                    $i = 0;
                    $str .= $close_td;
                }
                continue;
            }
            if ($this->tableSearch) {
                if ($i == 0) {
                    $str .= $open_td;
                }
                $str .= '<tr>';
            }
            if ($value[2] != "") {
                $str .= "<td class=\"label_text\">&nbsp;";
                $str .= $value[2];
                $str .= "&nbsp;:&nbsp;</td>";
            } else {
                $str .= "<td class=\"label_text\">&nbsp;</td>";
            }

            $str .= "<td>";
            $str .= $value[0];
            $str .= "</td>";

            $i++;
            if ($this->tableSearch) {
                $str .= '</tr>';
                if ($i == $this->maxRowSearch || $key == @end(array_keys($this->arrayAddSearch))) {
                    $i = 0;
                    $str .= $close_td;
                }
            }
        }

        if ($this->tableSearch) {
            $str .= $open_td . "<tr>";
        }
        if ($this->btnSearch) {
            $str .= $this->showButtonSearch();
        }
        if ($this->tableSearch) {
            $str .= "</tr><tr>";
        }
        if (!empty($this->arraySort)) {
            $str .= $this->showButtonSort();
        }
        if ($this->tableSearch) {
            $str .= "</tr>" . $close_td;
        }
        //echo '<pre>'.htmlentities($str).'</pre>';
//        $str .= '</tr></table>';
        $str .= '</form>';

        //phần check javascript cho form tìm kiếm
        $str .= '<script type="text/javascript">';
        $str .= 'function check_form_submit(obj){';
        foreach ($this->arraySearch as $key => $field) {
            switch ($this->arrayType[$key]) {
                case "string":
                    $str .= 'if(document.getElementById("' . $field . '").value == \'' . translate_text("Enter") . ' ' . $this->arrayLabel[$key] . '\'){document.getElementById("' . $field . '").value = \'\'}';
                    break;
            }
        }
        $str .= 'document.form_search.submit(); ';
        $str .= '};';
        $str .= '</script>';

        return $str;
    }

    /*
    ham tao ra cau lenh sql search
    */
    function sqlSearch()
    {
        $search = getValue("search", "int", "GET", 0);
        $str = '';
        if ($search == 1) {

            foreach ($this->arraySearch as $key => $field) {
                $keyword = getValue($field, "str", "GET", "");
                if ($keyword == $this->arrayLabel[$key] || $keyword == "Enter keyword") $keyword = "";
                $keyword = str_replace(" ", "%", $keyword);
                $keyword = str_replace("\'", "'", $keyword);
                $keyword = str_replace("'", "''", $keyword);
                switch ($this->arrayType[$key]) {
                    case "string":
                    case "text":
                        if (trim($keyword) != '') $str .= " AND " . $field . " LIKE '%" . $keyword . "%'";
                        break;
                    case "numbernotedit":
                        if (intval($keyword) > 0) $str .= " AND " . $field . " = " . $keyword;
                        break;
                    case "array":
                        if (intval($keyword) > -1) $str .= " AND " . $field . "=" . intval($keyword) . "";
                        break;
                }
            }
        }

        return $str;
    }

    function searchKeyword($list_field = "")
    {
        $array = explode(",", $list_field);
        $str = '';
        $keyword = getValue("keyword", "str", "GET", translate_text("Nhập từ khóa"));
        $keyword_sql = str_replace(" ", "%", $keyword);
        $keyword_sql = str_replace("\'", "'", $keyword_sql);
        $keyword_sql = str_replace("'", "''", $keyword_sql);

        if (count($array) > 0) {
            $this->searchKeyword = true;
            if ($keyword != '' && $keyword != translate_text("Nhập từ khóa")) {
                foreach ($array as $key => $field) {
                    $str .= " AND " . $field . " LIKE '%" . $keyword_sql . "%'";
                }
            }
        }

        return $str;
    }

    //ham xu ly phan footer

    function footer($total_list = 0)
    {

        $str = '<table cellpadding="5" cellspacing="0" width="100%" class="page"><tr>';

        if ($this->delete) {

            $str .= '<td width="150">';
            $str .= '<a href="#" onclick="if (confirm(\'' . str_replace("'", "\'", translate_text("Do you want to delete the product you\'ve selected ?")) . '\')){ deleteall(' . $total_list . '); }">' . translate_text("Delete all selected") . '</a>';
            $str .= ' <img src="' . $this->image_path . 'delete.gif" border="0" align="absmiddle" />';
            $str .= '</td>';
            $str .= '<td width="150">';
            $str .= '' . translate_text("Total record") . ' : ';
            $str .= '<span id="total_footer">' . $this->total_record . '</span>';
            $str .= '</td>';
        }
        $str .= '<td>';
        $str .= $this->generate_page();
        $str .= '</td>';
        $str .= '</tr></table>';

        return $str;

    }

    //ham phan trang

    function generate_page()
    {
        $str = '';
        if ($this->total_record > $this->page_size) {

            $total_page = $this->total_record / $this->page_size;
            $page = getValue("page", "int", "GET", 1);
            if ($page < 1) $page = 1;
            $str .= '
<li class="pagination-item">
    <a href="' . getURL(0, 1, 1, 1, "page") . '&page=1">
    Đầu
        <!--<img src="' . $this->image_path . 'first.gif" border="0" align="absmiddle" />-->
    </a>
</li>';
            if ($page > 1) $str .= '
<li class="pagination-item">
    <a href="' . getURL(0, 1, 1, 1, "page") . '&page=' . ($page - 1) . '" onclick="loadpage(this); return false;">
        Trước
        <!--<img src="' . $this->image_path . 'prev.gif" border="0" align="absmiddle" />-->
    </a>
</li>';

            $start = $page - 5;
            if ($start < 1) $start = 1;

            $end = $page + 5;
            if ($page < 5) $end = $end + (5 - $page);

            if ($end > $total_page) $end = intval($total_page);
            if ($end < $total_page) $end++;

            for ($i = $start; $i <= $end; $i++) {
                $str .= '
<li class="pagination-item ' . ($i == $page ? 'active' : '') . '">
    <a href="' . getURL(0, 1, 1, 1, "page") . '&page=' . $i . '">' . (($i == $page) ? '<span class="s">' . $i . '</span>' : '<span>' . $i . '</span>') . '</a>
</li>';
            }

            if ($page < $total_page) $str .= '
<li class="pagination-item">
    <a href="' . getURL(0, 1, 1, 1, "page") . '&page=' . ($page + 1) . '">
    Tiếp
        <!--<img src="' . $this->image_path . 'next.gif" border="0" align="absmiddle" />-->
    </a>
</li>';
            $str .= '
<li class="pagination-item">
    <a href="' . getURL(0, 1, 1, 1, "page") . '&page=' . $total_page . '">
    Cuối
        <!--<img src="' . $this->image_path . 'last.gif" border="0" align="absmiddle" />-->
    </a>
</li>';

        }

        return '<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-end">
    ' . $str . '
  </ul>
</nav>';
    }

    //ham tao linmit

    function limit($total_record)
    {
        $this->total_record = $total_record;
        $page = getValue("page", "int", "GET", 1);
        if ($page < 1) $page = 1;
        $str = "LIMIT " . ($page - 1) * $this->page_size . "," . $this->page_size;

        return $str;
    }

    //ham sua nhanh bang ajax

    function ajaxedit($fs_table)
    {

        $this->edit_ajax = true;

        //nếu truong hợp checkbox thì chỉ thay đổi giá trị 0 và 1 thôi

        $checkbox = getValue("checkbox", "int", "GET", 0);
        if ($checkbox == 1) {
            $record_id = getValue("record_id", "int", "GET", 0);
            $field = getValue("field", "str", "GET", "dfsfdsfdddddddddddddddd");
            if (trim($field) != '' && in_array($field, $this->arrayField)) {
                $db_query = new db_query("SELECT " . $field . " FROM " . $fs_table . " WHERE " . $this->field_id . "=" . $record_id);
                if ($row = mysql_fetch_assoc($db_query->result)) {
                    $value = ($row[$field] == 1) ? 0 : 1;
                    $db_update = new db_execute("UPDATE " . $fs_table . " SET " . $field . " = " . $value . " WHERE " . $this->field_id . "=" . $record_id);
                    unset($db_update);
                    echo '<img src="' . $this->image_path . 'check_' . $value . '.gif" border="0">';
                }
                unset($db_query);
            }
            exit();
        }
        //phần sửa đổi giá trị  từng trường
        $ajaxedit = getValue("ajaxedit", "int", "GET", 0);
        $id = getValue("id", "str", "POST", "");
        $value = getValue("value", "str", "POST", "");
        $array = trim(getValue("array", "str", "POST", ""));

        if ($ajaxedit == 1) {

            $arr = explode(",", $id);
            $id = isset($arr[1]) ? intval($arr[1]) : 0;
            $field = isset($arr[0]) ? strval($arr[0]) : '';
            $type = isset($arr[2]) ? intval($arr[2]) : 0;
            if ($type == 3) $_POST["value"] = str_replace(array("."), "", $value);

            //print_r($_POST);
            if ($id != 0 && in_array($field, $this->arrayField)) {

                $myform = new generate_form();
                $myform->removeHTML(0);
                $myform->add($field, "value", $type, 0, "", 0, "", 0, "");

                $myform->addTable($fs_table);
                $errorMsg = $myform->checkdata();

                if ($errorMsg == "") {
                    $db_ex = new db_execute($myform->generate_update_SQL($this->field_id, $id));
                }


            }

            if ($array != '') {
                if (in_array($array, $this->arrayField)) {
                    global $$array;
                    $arr = $$array;
                    $value = isset($arr[$value]) ? $arr[$value] : 'error';
                }
            }
            echo $value;
            exit();
        }
    }

}

?>