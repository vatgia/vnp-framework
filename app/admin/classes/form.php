<?

//Code by: Mr. Tran - Yahoo: txnc2002, boy_infotech
class form
{

    var $class_table = 'form_table';        // Style của table
    var $class_form = 'form';                // Style của form
    var $class_form_button = 'btn btn-primary';        // Style của button control
    var $class_form_name = 'form_name';            // Style của tên control
    var $class_form_control = 'form-control';        // Style của control
    var $class_form_errorMsg = 'form_errorMsg';    // Style của chuỗi text thông báo submit error
    var $class_form_text = 'form_text';            // Style của chuỗi text bên cạnh control
    var $class_form_text_note = 'form_text_note';    // Style của chuỗi text thông báo yêu cầu nhập dữ liệu
    var $class_form_require = 'form_asterisk';    // Style của chuỗi text biểu thị dữ liệu bắt buộc nhập
    var $check_javascript = '';                        // Kiểm tra form với javascript
    var $ec = '{-----}';            // Explode character
    var $tr_html = '';

    // Create <table>
    function create_table($cellpadding = '3', $cellspacing = '3', $add_html = '')
    {
        echo $create_table = '<table class="' . $this->class_table . '" cellpadding="' . $cellpadding . '" cellspacing="' . $cellspacing . '" ' . $add_html . '>';
    }

    // Close </table>
    function close_table($close_table = '</table>')
    {
        echo $close_table;
    }

    // Create <form>
    function create_form($name, $action, $method = 'get', $enctype = 'multipart/form-data', $add_html = '')
    {
        echo $create_form = '<form class="' . $this->class_form . '" name="' . $name . '" action="' . $action . '" method="' . $method . '" enctype="' . $enctype . '" ' . $add_html . '>';
    }

    // Close </form>
    function close_form($close_form = '</form>')
    {
        echo $close_form;
    }

    // Generate control in table
    function create_control($name, $control)
    {
        if ($name != "") $name = $name . ' :';
        else $name = "&nbsp;";

        return '
<div class="form-group" ' . $this->tr_html . '>
    <label for="">' . $name . '</label>
    ' . $control . '
</div>';

        return '
        <tr' . $this->tr_html . '>
		    <td class="' . $this->class_form_name . '">' . $name . '</td>
		    <td class="' . $this->class_form_text . '">' . $control . '</td>
		</tr>';
    }

    // Add file javascript
    function add_javascript($filepath, $java_code_add_on = '')
    {
        if ($filepath != '') $src = 'src="' . $filepath . '"';
        else $src = '';
        echo '<script type="text/javascript" ' . $src . '>' . $java_code_add_on . '</script>';
    }

    // Check data require
    function data_require($require, $title, $object = '')
    {
        if ($require != 0) {
            $control_name = '<font class="' . $this->class_form_require . '">* </font>' . $title;
            if ($object != '') {
                switch ($require) {
                    case 1:
                        $type = 'R';
                        break;
                    case 2:
                        $type = 'RisNum';
                        break;
                    case 3:
                        $type = 'RisEmail';
                        break;
                    default:
                        $type = 'R';
                        break;
                }
                $arrObject = explode($this->ec, $object);
                for ($i = 0; $i < count($arrObject); $i++) {
                    $this->check_javascript .= "'" . $arrObject[$i] . "','','" . $type . "',";
                }
            }
        } else $control_name = $title;
        return $control_name;
    }

    // Show error
    function errorMsg($errorMsg)
    {
        if ($errorMsg != "") {
            $control = '<font class="' . $this->class_form_errorMsg . '">' . $errorMsg . '</font>';
            return $this->create_control('', $control);
        }
    }

    //Replace " -> &quot; (chống phá ngoặc)
    function replaceQ($string)
    {
        $string = str_replace('\"', '"', $string);
        $string = str_replace("\'", "'", $string);
        $string = str_replace("\&quot;", "&quot;", $string);
        $string = str_replace("\\\\", "\\", $string);
        return str_replace('"', "&quot;", $string);
    }

    /**
     * Hàm check isset gán bằng rỗng
     */
    function check_isset(&$array, &$key, $default = "")
    {
        $array[$key] = isset($array[$key]) ? $array[$key] : $default;
    }

    /*
    --- Create text note ---
    1. $text_note		: Chuỗi text ghi chú ở đầu Form	(Exp: "Fields marked with an asterisk (<font class="form_asterisk">*</font>) are required.")
    */
    function text_note($text_note = 'Fields marked with an asterisk (<font class="form_asterisk">*</font>) are required.')
    {
        if ($text_note != "") {
            $control = '<font class="form_text_note">' . $text_note . '</font>';
            return $this->create_control('', $control);
        }
    }

    /*
    --- Create button control ---
    1. $typeControl	: Loại button							(Exp: "submit|reset")
    2. $id				: ID của control						(Exp: "submit_id|reset_id")
    3. $name				: Tên của control						(Exp: "submit|reset")
    4. $value			: Giá trị của control				(Exp: "Submit|Reset")
    5. $title			: Title của control					(Exp: "Click submit|Click Reset")
    6. $add_html		: Code HTML thêm vào					(Exp: "onClick=\"checkForm()\"|''")
    7. $add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function button($typeControl, $id, $name, $value, $title = '', $add_html = '', $add_text = '')
    {
        $arrTypeControl = explode($this->ec, $typeControl);
        $arrID = explode($this->ec, $id);
        $arrName = explode($this->ec, $name);
        $arrValue = explode($this->ec, $value);
        $arrTitle = explode($this->ec, $title);
        $arrAdd_html = explode($this->ec, $add_html);
        $control = '';
        for ($i = 0; $i < count($arrID); $i++) {
            $this->check_isset($arrTypeControl, $i);
            $this->check_isset($arrName, $i);
            $this->check_isset($arrValue, $i);
            $this->check_isset($arrTitle, $i);
            $this->check_isset($arrAdd_html, $i);
            $check_javascript = '';
            $control .= '<input class="' . $this->class_form_button . '" type="' . $arrTypeControl[$i] . '" title="' . $arrTitle[$i] . '" id="' . $arrID[$i] . '" name="' . $arrName[$i] . '" value="' . $arrValue[$i] . '" ' . $arrAdd_html[$i] . ' ' . $check_javascript . '/>';
            if ($i < count($arrID) - 1) $control .= ' ';
        }
        $control .= $add_text;
        return $this->create_control('', $control);
    }

    /*
    --- Create checkbox control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Option")
    2. $id				: ID của control						(Exp: "new_hot_id|new_latest_id")
    3. $name				: Tên của control						(Exp: "new_hot|new_latest")
    4. $value			: Giá trị của control				(Exp: "1|1")
    5. $currentValue	: Giá trị hiện tại của control	(Exp: "1|0")
    6. $title			: Chuỗi text bên cạnh control		(Exp: "Tin nổi bật|Tin mới";)
    7. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    8. $add_html		: Code HTML thêm vào					(Exp: "onClick=\"alert('Hello world !')\"")
    9. $add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function checkbox($titleControl, $id, $name, $value, $currentValue, $title = '', $require = '0', $add_html = '', $add_text = '')
    {
        $arrID = explode($this->ec, $id);
        $arrName = explode($this->ec, $name);
        $arrValue = explode($this->ec, $value);
        $arrCurrentValue = explode($this->ec, $currentValue);
        $arrTitle = explode($this->ec, $title);
        $arrAdd_html = explode($this->ec, $add_html);
        $control = '';
        for ($i = 0; $i < count($arrID); $i++) {
            $checked = '';
            if ($arrValue[$i] == $arrCurrentValue[$i]) $checked = ' checked="checked"';
            $control .= '<input type="checkbox" id="' . $arrID[$i] . '" name="' . $arrName[$i] . '" value="' . $arrValue[$i] . '"' . $checked . ' ' . $arrAdd_html[$i] . '/>';
            if ($arrTitle[$i] != '') $control .= '<label for="' . $arrID[$i] . '">' . $arrTitle[$i] . '</label>';
            if ($i < count($arrID) - 1) $control .= ' &nbsp; ';
        }
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl), $control);
    }

    /*
    --- Create radio control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Gender")
    2. $id				: ID của control						(Exp: "male_id|female_id")
    3. $name				: Tên của control						(Exp: "male|female")
    4. $value			: Giá trị của control				(Exp: "0|1")
    5. $currentValue	: Giá trị hiện tại của control	(Exp: "0")
    6. $title			: Chuỗi text bên cạnh control		(Exp: "Male|Female";)
    7. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    8. $add_html		: Code HTML thêm vào					(Exp: "onClick=\"alert('Hello world !')\"")
    9. $add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function radio($titleControl, $id, $name, $value, $currentValue, $title = '', $require = '0', $add_html = '', $add_text = '')
    {
        $arrID = explode($this->ec, $id);
        $arrValue = explode($this->ec, $value);
        $arrTitle = explode($this->ec, $title);
        $arrAdd_html = explode($this->ec, $add_html);
        $control = '';
        for ($i = 0; $i < count($arrID); $i++) {
            $checked = '';
            if ($arrValue[$i] == $currentValue) $checked = ' checked="checked"';
            $control .= '<input type="radio" id="' . $arrID[$i] . '" name="' . $name . '" value="' . $arrValue[$i] . '"' . $checked . ' ' . $arrAdd_html[$i] . '/>';
            if ($arrTitle[$i] != '') $control .= '<label for="' . $arrID[$i] . '">' . $arrTitle[$i] . '</label>';
            if ($i < count($arrID) - 1) $control .= ' &nbsp; ';
        }
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl), $control);
    }

    /*
    --- Create getFile control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Image")
    2. $id				: ID của control						(Exp: "new_image_id")
    3. $name				: Tên của control						(Exp: "new_image")
    4. $title			: Title của control					(Exp: "Your avatar")
    5. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    6. $size				: Chiều rộng của filebox			(Exp: "30" character)
    7. $add_html		: Code HTML thêm vào					(Exp: "onFocus=\"this.value=''\"")
    8. $add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function getFile($titleControl, $id, $name, $title = '', $require = '0', $size = '30', $add_html = '', $add_text = '')
    {
        $control = '<input class="' . $this->class_form_control . '" type="file" title="' . $title . '" id="' . $id . '" name="' . $name . '" size="' . $size . '" ' . $add_html . '/>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl), $control);
    }

    /*
    --- Create select control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "City")
    2. $id				: ID của control						(Exp: "city_id")
    3. $name				: Tên của control						(Exp: "city")
    4. $array_option	: Mảng giá trị của control			(Exp: "$arrayCity = array("--[Select]--" => 0, "London" => 1, Manchester => 2,)")
    5. $currentValue	: Giá trị hiện tại của control	(Exp: "1")
    6. $title			: Title của control					(Exp: "Select city")
    7. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    8. $width			: Chiều rộng của combobox			(Exp: "200" px)
    9. $size				: Chiều cao của combobox			(Exp: "10" rows)
    10.$multiple		: Chọn nhiều dữ liệu một lúc		(Exp: "1" -> multiple; "0" -> not multiple)
    11.$add_html		: Code HTML thêm vào					(Exp: "onChange=\"alert('Hello world !')\"")
    12.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function select($titleControl, $id, $name, $array_option, $currentValue, $title = '', $require = '0', $width = '', $size = '', $multiple = '0', $add_html = '', $add_text = '')
    {
        $select_multi = '';
        if ($multiple != 0) $select_multi = 'multiple="multiple"';
        $control = '<select class="' . $this->class_form_control . ' select2" title="' . $title . '" id="' . $id . '" name="' . $name . (($multiple == 1) ? '[]' : '') . '" style="width:' . $width . 'px" size="' . $size . '" ' . $select_multi . ' ' . $add_html . '>';
        if (is_array($array_option)) {
            foreach ($array_option as $arrKey => $arrValue) {
                $selected = '';
                if ($multiple != 0) {
                    if (in_array($arrKey, $currentValue) !== false) $selected = ' selected="selected"';
                } else {
                    if ($arrKey == $currentValue) $selected = ' selected="selected"';
                }
                $control .= '<option title="' . $this->replaceQ($arrValue) . '" value="' . $arrKey . '"' . $selected . '>' . $arrValue . '</option>';
            }
        }//End if(is_array($array_option))
        $control .= '</select>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create select_db control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "City")
    2. $id				: ID của control						(Exp: "city_id")
    3. $name				: Tên của control						(Exp: "city")
    4. $db_query		: Class db_query						(Exp: "$db_select = new db_query(...)")
    5. $value_field	: Tên trường cần lấy giá trị		(Exp: "cit_id")
    6. $name_field		: Tên trường cần hiển thị			(Exp: "cit_name")
    7. $currentValue	: Giá trị hiện tại của control	(Exp: "1")
    8. $title			: Title của control					(Exp: "Select city")
    9. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    10.$width			: Chiều rộng của combobox			(Exp: "200" px)
    11.$size				: Chiều cao của combobox			(Exp: "10" rows)
    12.$multiple		: Chọn nhiều dữ liệu một lúc		(Exp: "1" -> multiple; "0" -> not multiple)
    13.$add_html		: Code HTML thêm vào					(Exp: "onChange=\"alert('Hello world !')\"")
    14.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function select_db($titleControl, $id, $name, $db_query, $value_field, $name_field, $currentValue, $title = '', $require = '0', $width = '', $size = '', $multiple = '0', $add_html = '', $add_text = '')
    {
        $select_multi = '';
        if ($multiple != 0) $select_multi = 'multiple="multiple"';
        $control = '<select class="' . $this->class_form_control . '" title="' . $title . '" id="' . $id . '" name="' . $name . '" style="width:' . $width . 'px" size="' . $size . '" ' . $select_multi . ' ' . $add_html . '>';
        if ($title != "" && $multiple == 0) $control .= '<option value="">- ' . $title . ' -</option>';
        while ($row = mysqli_fetch_array($db_query->result)) {
            $selected = '';
            if ($multiple != 0) {
                if (strpos($currentValue, "[" . $row[$value_field] . "]") !== false) $selected = ' selected="selected"';
            } else {
                if ($currentValue == $row[$value_field]) $selected = ' selected="selected"';
            }
            $control .= '<option title="' . $this->replaceQ($row[$name_field]) . '" value="' . $row[$value_field] . '"' . $selected . '>' . $row[$name_field] . '</option>';
        }
        $control .= '</select>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create select_db_2_level control ---
    1. $titleControl		: Tiêu đề của control				(Exp: "City")
    2. $id					: ID của control						(Exp: "city_id")
    3. $name					: Tên của control						(Exp: "city")
    4. $db_query			: Class db_query						(Exp: "$db_select = new db_query(...)")
    5. $value_field_lv1	: Tên trường giá trị optgroup		(Exp: "root_id")
    6. $name_field_lv1	: Tên trường hiển thị optgroup	(Exp: "root_name")
    7. $value_field_lv2	: Tên trường cần lấy giá trị		(Exp: "sub_id")
    8. $name_field_lv2	: Tên trường cần hiển thị			(Exp: "sub_name")
    9. $currentValue		: Giá trị hiện tại của control	(Exp: "1")
    10.$title				: Title của control					(Exp: "Select city")
    11.$require				: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    12.$width				: Chiều rộng của combobox			(Exp: "200" px)
    13.$size					: Chiều cao của combobox			(Exp: "10" rows)
    14.$multiple			: Chọn nhiều dữ liệu một lúc		(Exp: "1" -> multiple; "0" -> not multiple)
    15.$add_html			: Code HTML thêm vào					(Exp: "onChange=\"alert('Hello world !')\"")
    16.$add_text			: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function select_db_2_level($titleControl, $id, $name, $db_query, $value_field_lv1, $name_field_lv1, $value_field_lv2, $name_field_lv2, $currentValue, $title = '', $require = '0', $width = '', $size = '', $multiple = '0', $add_html = '', $add_text = '')
    {
        $select_multi = '';
        if ($multiple != 0) $select_multi = 'multiple="multiple"';
        $control = '<select class="' . $this->class_form_control . '" title="' . $title . '" id="' . $id . '" name="' . $name . '" style="width:' . $width . 'px" size="' . $size . '" ' . $select_multi . ' ' . $add_html . '>';
        if ($title != "" && $multiple == 0) $control .= '<option value="">- ' . $title . ' -</option>';
        $root_id = 0;
        while ($row = mysql_fetch_array($db_query->result)) {
            if ($root_id != $row[$value_field_lv1]) {
                $root_id = $row[$value_field_lv1];
                $control .= '<optgroup label="' . $this->replaceQ($row["root_name"]) . '"></optgroup>';
            }
            $selected = '';
            if ($multiple != 0) {
                if (strpos($currentValue, "[" . $row[$value_field_lv2] . "]") !== false) $selected = ' selected="selected"';
            } else {
                if ($currentValue == $row[$value_field_lv2]) $selected = ' selected="selected"';
            }
            $control .= '<option title="' . $this->replaceQ($row[$name_field_lv2]) . '" value="' . $row[$value_field_lv2] . '"' . $selected . '>&nbsp; |-- ' . $row[$name_field_lv2] . '</option>';
        }
        $control .= '</select>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create select_db_multi control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Category")
    2. $id				: ID của control						(Exp: "pro_category")
    3. $name				: Tên của control						(Exp: "pro_category")
    4. $array_multi	: Array chứa dữ liệu					(Exp: "$listAll")
    5. $value_field	: Tên trường cần lấy giá trị		(Exp: "cat_id")
    6. $name_field		: Tên trường cần hiển thị			(Exp: "cat_name")
    7. $currentValue	: Giá trị hiện tại của control	(Exp: "1")
    8. $title			: Title của control					(Exp: "Select city")
    9. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    10.$width			: Chiều rộng của combobox			(Exp: "200" px)
    11.$size				: Chiều cao của combobox			(Exp: "10" rows)
    12.$multiple		: Chọn nhiều dữ liệu một lúc		(Exp: "1" -> multiple; "0" -> not multiple)
    13.$add_html		: Code HTML thêm vào					(Exp: "onChange=\"alert('Hello world !')\"")
    14.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function select_db_multi($titleControl, $id, $name, $array_multi, $value_field, $name_field, $currentValue, $title = '', $require = '0', $width = '', $size = '', $multiple = '0', $add_html = '', $add_text = '')
    {
        $select_multi = '';
        if ($multiple != 0) $select_multi = 'multiple="multiple"';
        $control = '<select class="' . $this->class_form_control . '" title="' . $title . '" id="' . $id . '" name="' . $name . '" style="width:' . $width . 'px" size="' . $size . '" ' . $select_multi . ' ' . $add_html . '>';
        if ($title != "" && $multiple == 0) $control .= '<option value="">- ' . $title . ' -</option>';
        for ($i = 0; $i < count($array_multi); $i++) {
            $selected = '';
            if ($multiple != 0) {
                if (strpos($currentValue, "[" . $array_multi[$i][$value_field] . "]") !== false) $selected = ' selected="selected"';
            } else {
                if ($currentValue == $array_multi[$i][$value_field]) $selected = ' selected="selected"';
            }
            $control .= '<option title="' . $this->replaceQ($array_multi[$i][$name_field]) . '" value="' . $array_multi[$i][$value_field] . '"' . $selected . '>';
            for ($j = 0; $j < $array_multi[$i]['level']; $j++) $control .= '&nbsp;|--';
            $control .= ' ' . $array_multi[$i][$name_field] . '</option>';
        }
        $control .= '</select>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create text control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Name")
    2. $id				: ID của control						(Exp: "name_id")
    3. $name				: Tên của control						(Exp: "name")
    4. $value			: Giá trị của control				(Exp: "Mr. Tran")
    5. $title			: Title của control					(Exp: "Full name")
    6. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    7. $width			: Chiều rộng của textbox			(Exp: "150" px)
    8. $height			: Chiều cao của textbox				(Exp: "20" px)
    9. $maxlength		: Số ký tự trong textbox			(Exp: "100")
    10.$breakControl	: Chuỗi phân cách các textbox		(Exp: " - ")
    11.$add_html		: Code HTML thêm vào					(Exp: "onFocus=\"this.value=''\"")
    12.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function text($titleControl, $id, $name, $value, $title = '', $require = '0', $width = '', $height = '', $maxlength = '', $breakControl = ' - ', $add_html = '', $add_text = '')
    {
        $arrID = explode($this->ec, $id);
        $arrName = explode($this->ec, $name);
        $arrValue = explode($this->ec, $value);
        $arrTitle = explode($this->ec, $title);
        $arrWidth = explode($this->ec, $width);
        $arrHeight = explode($this->ec, $height);
        $arrMaxlength = explode($this->ec, $maxlength);
        $arrAdd_html = explode($this->ec, $add_html);
        $control = '';
        for ($i = 0; $i < count($arrID); $i++) {
            if ($breakControl == "title") {
                $control .= $arrTitle[$i] . '&nbsp;';
                $control .= '<input class="' . $this->class_form_control . '" type="text" title="' . $arrTitle[$i] . '" id="' . $arrID[$i] . '" name="' . $arrName[$i] . '" value="' . $this->replaceQ($arrValue[$i]) . '" style="width:' . $arrWidth[$i] . 'px; height:' . $arrHeight[$i] . 'px" maxlength="' . $arrMaxlength[$i] . '" ' . $arrAdd_html[$i] . '/>';
                $control .= " &nbsp; ";
            } else {
                $control .= '<input class="' . $this->class_form_control . '" type="text" title="' . $arrTitle[$i] . '" id="' . $arrID[$i] . '" name="' . $arrName[$i] . '" value="' . $this->replaceQ($arrValue[$i]) . '" style="width:' . $arrWidth[$i] . 'px; height:' . $arrHeight[$i] . 'px" maxlength="' . $arrMaxlength[$i] . '" ' . $arrAdd_html[$i] . '/>';
                if ($i < count($arrID) - 1) $control .= $breakControl;
            }
        }
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create password control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Password")
    2. $id				: ID của control						(Exp: "password_id")
    3. $name				: Tên của control						(Exp: "password")
    4. $value			: Giá trị của control				(Exp: "Password")
    5. $title			: Title của control					(Exp: "Enter password")
    6. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    7. $width			: Chiều rộng của passwordbox		(Exp: "150" px)
    8. $height			: Chiều cao của passwordbox		(Exp: "20" px)
    9. $maxlength		: Số ký tự trong passwordbox		(Exp: "100")
    10.$add_html		: Code HTML thêm vào					(Exp: "onFocus=\"this.value=''\"")
    11.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    */
    function password($titleControl, $id, $name, $value, $title = '', $require = '0', $width = '', $height = '', $maxlength = '', $add_html = '', $add_text = '')
    {
        $control = '<input class="' . $this->class_form_control . '" type="password" title="' . $title . '" id="' . $id . '" name="' . $name . '" value="' . $value . '" style="width:' . $width . 'px; height:' . $height . 'px" maxlength="' . $maxlength . '" ' . $add_html . '/>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create textarea control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Description")
    2. $id				: ID của control						(Exp: "description_id")
    3. $name				: Tên của control						(Exp: "description")
    4. $value			: Giá trị của control				(Exp: "My company is FinalStyle")
    5. $title			: Title của control					(Exp: "Your description")
    6. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    7. $width			: Chiều rộng của textarea			(Exp: "200" px)
    8. $height			: Chiều cao của textarea			(Exp: "100" px)
    9. $add_html		: Code HTML thêm vào					(Exp: "onFocus=\"this.value=''\"")
    10.$add_text		: Chuỗi text thêm vào sau control(Exp: "(dd/mm/yyyy)")
    11.$wysiwyg			: Có thêm WYSIWYG không				(Exp: bbcode("", "add", "id_description"))

    */
    function textarea($titleControl, $id, $name, $value, $title = '', $require = '0', $width = '', $height = '', $add_html = '', $add_text = '', $wysiwyg = '')
    {
        $control = $wysiwyg;
        $control .= '<textarea class="' . $this->class_form_control . '" title="' . $title . '" id="' . $id . '" name="' . $name . '" style="width:' . $width . 'px; height:' . $height . 'px" ' . $add_html . '>' . $this->replaceQ($value) . '</textarea>';
        $control .= $add_text;
        return $this->create_control($this->data_require($require, $titleControl, $id), $control);
    }

    /*
    --- Create wysiwyg control ---
    1. $titleControl	: Tiêu đề của control				(Exp: "Description")
    2. $id				: ID của control						(Exp: "description_id")
    3. $name				: Tên của control						(Exp: "description")
    4. $value			: Giá trị của control				(Exp: "My company is FinalStyle")
    5. $title			: Title của control					(Exp: "Your description")
    6. $require			: Dữ liệu bắt buộc nhập				(Exp: "1" -> require; "0" -> not require)
    7. $width			: Chiều rộng của textarea			(Exp: "200" px)
    8. $height			: Chiều cao của textarea			(Exp: "100" px)
    */
    function wysiwyg($titleControl, $id, $value, $basePath = '../../resource/ckeditor/', $width = '100%', $height = '450')
    {
        require_once($basePath . "ckeditor.php");
        $oFCKeditor = new CKeditor();
        $value = str_replace('\"', '"', $value);
        $value = str_replace("\'", "'", $value);
        $value = str_replace("\&quot;", "&quot;", $value);
        $value = str_replace("\\\\", "\\", $value);
        $oFCKeditor->Value = $value;
        $oFCKeditor->BasePath = $basePath;
        $oFCKeditor->Width = $width;
        $oFCKeditor->Height = $height;
        echo '<div class="' . $this->class_form_name . '" style="text-align:left; padding:5px; width:' . $width . '">' . $titleControl . '</div>';
        $oFCKeditor->editor($id, $value);
    }

    /*
    --- Create hidden control ---
    1. $id				: ID của control						(Exp: "action_id")
    2. $name				: Tên của control						(Exp: "action")
    3. $value			: Giá trị của control				(Exp: "insert")
    4. $add_html		: Code HTML thêm vào					(Exp: "onFocus=\"this.value=''\"")
    */
    function hidden($id, $name, $value, $add_html = '')
    {
        $control = '<input type="hidden" id="' . $id . '" name="' . $name . '" value="' . $this->replaceQ($value) . '" ' . $add_html . '/>';
        return $control;
    }

}

?>