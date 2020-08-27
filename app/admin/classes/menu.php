<?

class menu
{
    var $menu;
    var $stt = -1;
    var $show_count = 0;
    var $arrayCatId = array();
    var $countId = 1;
    var $arrayParent = array();
    var $arrayCategory = array();
    var $level = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var $arrayCount = array();

    /*
    //nâng cấp bởi dinhtoan1905
    getAllChild : lay het menu con

    Parameter
    $table_name			: Ten bang
    $id_field			: truong id (vd:mnu_id)
    $parent_id_field	: truong parent_id (vd : mnu_parent_id)
    $parent_id			: id cua nu't cha
    $where_clause		: Menh de where trong cau query
    $field_list			: danh sach truong can lay cach nhau = dau ,
    $order_clause		: sap xep theo gi` (sql)
    $has_child_field	: ten truong xac nhan tree do co' con hay ko (vd: mnu_has_child)
    $update				: co update has_child vao database hay khong
    */
    function getAllChild($table_name, $id_field, $parent_id_field, $parent_id = 0, $where_clause = "1", $field_list, $order_clause, $has_child_field = 0, $update = 1, $level = 0, $callback = 0)
    {
        //select menu from database
        $db_category = new db_query("SELECT " . $id_field . "," . $parent_id_field . ", " . $field_list .
            " FROM " . $table_name .
            " WHERE " . $where_clause .
            " ORDER BY " . $parent_id_field . " ASC," . $order_clause);

        //gán toàn bộ nội dung từ bản select ra vào mảng
        foreach ($db_category->fetch() as $row) {
            if (intval($row[$id_field]) == intval($row[$parent_id_field])) {
                $db_ex = new db_execute("UPDATE " . $table_name . " SET " . $parent_id_field . " = 0 WHERE " . $id_field . " = " . $row[$id_field]);
                unset($db_ex);
            } else {
                $this->arrayCategory[$row[$parent_id_field]][$row[$id_field]] = $row;
                $this->arrayCategory[$row[$parent_id_field]][$row[$id_field]]["count"] = '';
            }
        }
        unset($db_category);

        //gọi hàm xử lý array sắp xếp theo đúng vị trí của từng record trả về giá trị 0 hoặc 1 để update hay không
        $this->sortLevel($this->arrayCategory, $parent_id);

        //trả về array menu
        return $this->menu;
        $this->arrayCategory = array();
    }

    /*
    //nâng cấp bởi dinhtoan1905
    sortLevel : Hàn sắp xếp các cấp con cho đúng vị trí

    Parameter
    $arrayCategory		: array chứa các mục
    $keystart			: nút cha
    $level				: Menh de where trong cau query
    */
    function sortLevel($arrayCategory, $keystart = 0, $level = -1)
    {


        //kiểm tra xem tồn tại record không
        if (array_key_exists($keystart, $arrayCategory)) {
            $level++;
            foreach ($arrayCategory[$keystart] as $key => $value) {

                //gán các phần tử cho array menu sắp xếp theo đúng vị trí
                //tang so thu tu
                $this->stt++;
                $this->menu[$this->stt] = $value;

                //gan level cho menu
                $this->menu[$this->stt]['level'] = $level;
                $this->level[$level]++;
                //thiet lap de biet day la` 1 nut cha
                if (array_key_exists($key, $arrayCategory)) {
                    $this->menu[$this->stt]["parent"] = 1;
                } else {
                    $this->menu[$this->stt]["parent"] = 0;
                }

                //de quy de lap lai, neu menu_id man trong array cac menu cha
                $this->sortLevel($arrayCategory, $key, $level);
            }
        }

    }

    /*
    getAllChild_no_hasChildField : lay het menu con nhung ko co truong hasChild

    Parameter
    $table_name			: Ten bang
    $id_field			: truong id (vd:mnu_id)
    $parent_id_field	: truong parent_id (vd : mnu_parent_id)
    $parent_id			: id cua nu't cha
    $where_clause		: Menh de where trong cau query
    $field_list			: danh sach truong can lay cach nhau = dau ,
    $order_clause		: sap xep theo gi` (sql)
    */
    function getAllChild_no_hasChildField_2level($table_name, $id_field, $parent_id_field, $parent_id, $where_clause = "1", $field_list, $order_clause, $has_child_field, $level = 0, $callback = 0)
    {
        //select menu from database
        $db_menu = new db_query("SELECT " . $field_list . ", " . $has_child_field . " " .
            "FROM " . $table_name . " " .
            "WHERE " . $parent_id_field . " = " . $parent_id . " AND " . $where_clause . " " .
            "ORDER BY " . $order_clause);
        //lap de lay menu
        while ($row = mysql_fetch_array($db_menu->result)) {
            //tang so thu tu
            $this->stt++;

            //break field_list in to array
            $field_list_arr = explode(",", $field_list);
            //gan gia tri menu vao array
            for ($i = 0; $i < count($field_list_arr); $i++) {
                $this->menu[$this->stt][$field_list_arr[$i]] = $row[$field_list_arr[$i]];
            }
            //gan level cho menu
            $this->menu[$this->stt]["level"] = $level;

            //de quy de lap lai, lap o level 1
            if ($callback == 0) {
                $this->getAllChild_no_hasChildField_2level($table_name, $id_field, $parent_id_field, $row[$id_field], $where_clause, $field_list, $order_clause, $has_child_field, $level + 1, 1);
            }
        }

        if ($callback == 0) {
            $db_menu->close();
        }
        unset($db_menu);
        //tra ve gia tri menu
        if ($callback == 0) return $this->menu;
    }


    /*
    getChild : lay menu con

    Parameter
    $table_name			: Ten bang
    $id_field			: truong id (vd:mnu_id)
    $parent_id_field	: truong parent_id (vd : mnu_parent_id)
    $parent_id			: id cua nu't cha
    $where_clause		: Menh de where trong cau query
    $field_list			: danh sach truong can lay cach nhau = dau ,
    $order_clause		: sap xep theo gi` (sql)
    */
    function getChild($table_name, $id_field, $parent_id_field, $parent_id, $where_clause = "1", $field_list, $order_clause, $has_child_field)
    {
        //select menu from database
        $db_menu = new db_query("SELECT " . $field_list . ", " . $has_child_field . " " .
            "FROM " . $table_name . " " .
            "WHERE " . $parent_id_field . "=" . $parent_id . " AND " . $where_clause . " " .
            "ORDER BY " . $order_clause);
        //thiet lap $has_child_field = 0 khi menu ko co con
        if (mysql_num_rows($db_menu->result) == 0) {
            $db_update = new db_query("UPDATE " . $table_name . " SET " . $has_child_field . "=0 WHERE " . $id_field . "=" . $parent_id);
        }
        //lap de lay menu
        while ($row = mysql_fetch_array($db_menu->result)) {
            //tang so thu tu
            $this->stt++;

            //break field_list in to array
            $field_list_arr = explode(",", $field_list);
            //gan gia tri menu vao array
            for ($i = 0; $i < count($field_list_arr); $i++) {
                $this->menu[$this->stt][$field_list_arr[$i]] = $row[$field_list_arr[$i]];
            }
            //gan level cho menu
            $this->menu[$this->stt]["level"] = 0;

        }

        $db_menu->close();
        unset($db_menu);
        //tra ve gia tri menu

        return $this->menu;
    }


    /*
    getOpenNode : Lay menu cua 1 nu't nao do

    Parameter
    $table_name			: Ten bang
    $id_field			: truong id (vd:mnu_id)
    $parent_id_field	: truong parent_id (vd : mnu_parent_id)
    $parent_id			: id cua nu't cha
    $where_clause		: Menh de where trong cau query
    $field_list			: danh sach truong can lay cach nhau = dau ,
    $order_clause		: sap xep theo gi` (sql)
    $array_parent_node: mang cac nut cha
    */
    function getOpenNode($table_name, $id_field, $parent_id_field, $parent_id, $where_clause = "1", $field_list, $order_clause, $has_child_field, $array_parent_node, $level = 0, $callback = 0)
    {
        //select menu from database
        $db_menu = new db_query("SELECT " . $field_list . ", " . $has_child_field . " " .
            "FROM " . $table_name . " " .
            "WHERE " . $parent_id_field . "=" . $parent_id . " AND " . $where_clause . " " .
            "ORDER BY " . $order_clause);
        //lap de lay menu
        while ($row = mysql_fetch_array($db_menu->result)) {
            //tang so thu tu
            $this->stt++;

            //break field_list in to array
            $field_list_arr = explode(",", $field_list);
            //gan gia tri menu vao array
            for ($i = 0; $i < count($field_list_arr); $i++) {
                $this->menu[$this->stt][$field_list_arr[$i]] = $row[$field_list_arr[$i]];
            }
            //gan level cho menu
            $this->menu[$this->stt]["level"] = $level;
            $this->menu[$this->stt]["parent"] = 0;

            //de quy de lap lai, neu menu_id man trong array cac menu cha
            if (array_search($row[$id_field], $array_parent_node) !== false) {
                //thiet lap de biet day la` 1 nut cha
                $this->menu[$this->stt]["parent"] = 1;
                $this->getOpenNode($table_name, $id_field, $parent_id_field, $row[$id_field], $where_clause, $field_list, $order_clause, $has_child_field, $array_parent_node, $level + 1, 1);
            }
        }

        if ($callback == 0) {
            $db_menu->close();
        }
        unset($db_menu);
        //tra ve gia tri menu
        if ($callback == 0) return $this->menu;
    }


    /*
    getAllParent : Lay ta ca cac nut cha

    $table_name			: Ten bang
    $id_field			: truong id (vd:mnu_id)
    $parent_id_field	: truong parent_id (vd : mnu_parent_id)
    $id					: id cua nu't can lay danh sach cha
    */
    function getAllParent($table_name, $id_field, $parent_id_field, $id)
    {
        $count_var = 0;
        $array_parent_node[$count_var] = 0;
        $finish = false;
        $current_id = $id;
        while (!$finish) {
            $db_getparent = new db_query ("SELECT " . $parent_id_field . " " .
                "FROM " . $table_name . " " .
                "WHERE " . $id_field . "=" . $current_id);
            if ($row = mysql_fetch_array($db_getparent->result)) {
                $count_var++;
                $array_parent_node[$count_var] = $current_id;
                $current_id = $row[$parent_id_field];
            } else {
                $finish = true;
            }
        }
        return $array_parent_node;
    }

    //get all parent list
    function getAllParentList($table_name, $id_field, $name_field, $parent_id_field, $id, $seperate_str, $class_link = "link_title", $modlue = "product", $type_list = 0, $lang_path, $con_extenstion, $con_mod_rewrite)
    {
        $count_var = 0;
        $parent_list = "";
        $finish = false;
        $current_id = $id;
        $iCat = 0;
        if (isset($_GET["iCat"])) $iCat = $_GET["iCat"];
        while (!$finish) {
            $db_getparent = new db_query ("SELECT " . $parent_id_field . ",cat_type," . $name_field . " " . (($modlue == '') ? ',cat_type' : '') .
                " FROM " . $table_name . " " .
                " WHERE " . $id_field . "=" . $current_id);
            if ($row = mysql_fetch_array($db_getparent->result)) {
                $count_var++;
                $link = createLink("cat", array('module' => (($modlue == '') ? $row["cat_type"] : $modlue), "title" => $row[$name_field], "iCat" => $current_id), $lang_path, $con_extenstion, $con_mod_rewrite);
                $link_cat = createLink("cat", array('module' => (($modlue == '') ? $row["cat_type"] : $modlue), "title" => $row[$name_field], "iCat" => $iCat), $lang_path, $con_extenstion, $con_mod_rewrite);
                //ghep vao chuoi str
                if ($parent_list == "") {
                    if ($type_list == 1 && $row["cat_type"] == "raovat") {
                        $parent_list = "<a href=\"" . $link . "\" class=\"" . $class_link . "\">" . gt($row[$name_field]) . "</a>";
                    } else {
                        $parent_list = "" . $row[$name_field] . "";

                    }
                } else {
                    if ($type_list == 0) {
                        $parent_list = "<a href=\"" . $link . "\" class=\"" . $class_link . "\">" . gt($row[$name_field]) . "</a>" . $seperate_str . "<b>" . $parent_list . "</b>";
                    } else {
                        $parent_list = "<a href=\"" . $link . "\" class=\"" . $class_link . "\">" . gt($row[$name_field]) . "</a>" . $seperate_str . "<a href=\"" . $link_cat . "\" class=\"" . $class_link . "\">" . $parent_list . "</a>";
                    }
                }

                $current_id = $row[$parent_id_field];
            } else {
                $finish = true;
            }
        }
        return $parent_list;
    }

    // lay cap cha cao nhat dang select
    function getParentid($table_name, $id_field, $parent_id_field, $id)
    {
        $current_id = $id;
        $finish = false;
        while (!$finish) {
            $db_getparent = new db_query ("SELECT " . $parent_id_field .
                " FROM " . $table_name . " " .
                " WHERE " . $id_field . "=" . $current_id . " AND " . $parent_id_field . "<>0");
            if ($row = mysql_fetch_array($db_getparent->result)) {
                $current_id = $row[$parent_id_field];
            } else {
                $finish = true;
            }
        }//end while
        return $current_id;
    }//end function

    //gan du lieu vao mot array (dinhtoan1905)
    function getArray($table_name, $id_field, $parent_id_field, $where_clause = "1")
    {
        $db_getparent = new db_query ("SELECT " . $parent_id_field . ',' . $id_field .
            " FROM " . $table_name . " " .
            " WHERE " . $where_clause);
        foreach ($db_getparent->fetch() as $row) {
            if ($row[$parent_id_field] == 0) {
                $this->arrayCount[$row[$id_field]] = 0;
            } else {
                $this->arrayCatId[$row[$id_field]] = $row[$parent_id_field];
            }
        }
        unset($db_getparent);
    }


    //lay category cap cha cao nhat (dinhtoan1905)
    function getCatcha($id)
    {
        while (@array_key_exists($id, $this->arrayCatId)) {
            $id = $this->arrayCatId[$id];
        }
        return $id;
    }

    //lay tat ca cap con (dinhtoan1905)
    function getAllChildId($id)
    {
        $strreturn = $id;
        $arrayreturn = array();
        $array = $this->arrayCatId;
        $finish = @in_array($id, $this->arrayCatId);
        while ($finish) {
            $finish = false;

            foreach ($array as $key => $value) {
                if ($value == $id) {
                    $strreturn .= ',' . intval($key);
                    $this->countId++;
                    $arrayreturn[$key] = 0;
                    unset($array[$key]);
                }
            }

            foreach ($arrayreturn as $key1 => $value1) {
                foreach ($array as $key => $value) {
                    if ($value == $key1) {
                        $strreturn .= ',' . intval($key);
                        $this->countId++;
                        $arrayreturn[$key] = 0;
                        unset($array[$key]);
                        $finish = true;
                    }
                }
                unset($arrayreturn[$key1]);
            }
        }//end while
        unset($arrayreturn);
        unset($array);
        return $strreturn;
    }

    /*
        dinhtoan1905
        ham tinh count cua san pham
        ham nay chi chay sau khi goi ham getArray
    */
    function getCountCategory($table_name, $cat_field, $where_clause = "1")
    {
        $db_count = new db_query("SELECT count(*) AS count," . $cat_field . "
										  FROM 	" . $table_name . "
										  WHERE " . $where_clause . "
										  GROUP BY " . $cat_field . "
										  ");
        $arrayCountTem = array();
        while ($row = mysql_fetch_assoc($db_count->result)) {
            if ($row["count"] > 0) $arrayCountTem[$row[$cat_field]] = $row["count"];
        }
        unset($db_count);
        //phan tinh count cho cac cap con
        foreach ($this->arrayCatId as $key => $value) {
            $arrayCount[$key] = 0;
            //neu la cap cuoi cung thi gan luon count
            if (array_key_exists($key, $arrayCountTem)) {
                $arrayCount[$key] = $arrayCountTem[$key];
            } else {
                $array = explode(",", $this->getAllChildId($key));
                foreach ($array as $id => $iCat) {
                    $arrayCount[$key] = $arrayCount[$key] + (isset($arrayCountTem[$iCat]) ? $arrayCountTem[$iCat] : 0);
                }
                unset($array);
            }
            if ($arrayCount[$key] == 0) unset($arrayCount[$key]);
        }
        //phan tinh count cho cap cao nhat
        foreach ($this->arrayCount as $key => $value) {
            $arrayCount[$key] = 0;
            //neu la cap cuoi cung thi gan luon count
            if (array_key_exists($key, $arrayCountTem)) {
                $arrayCount[$key] = $arrayCountTem[$key];
            } else {
                $array = explode(",", $this->getAllChildId($key));
                foreach ($array as $id => $iCat) {
                    $arrayCount[$key] = $arrayCount[$key] + (isset($arrayCountTem[$iCat]) ? $arrayCountTem[$iCat] : 0);
                }
                unset($array);
            }
            if ($arrayCount[$key] == 0) unset($arrayCount[$key]);
        }
        unset($arrayCountTem);

        return $arrayCount;
    }

    /*
    dinhtoan1905
    tao ra javascript multi combobox
    vi du
    $mymenu = new menu();
    echo $mymenu->getComboxJava("categories_multi","cat_id","cat_name","cat_parent_id"," cat_type = 'product'");
    $arrayParent = $mymenu->arrayParent;
    */
    function getComboxJava($table_name, $id_field, $name_field, $parent_id_field, $where_clause = "1")
    {
        $db_getparent = new db_query("SELECT " . $name_field . ',' . $id_field . ',' . $parent_id_field .
            " FROM " . $table_name . " " .
            " WHERE " . $where_clause .
            " ORDER BY " . $parent_id_field . " ASC");


        $i = -1;
        $cat_parent = -1;
        $return = '<script language="javascript"> /* dinhtoan1905@gmail.com  */ var listdb = new Array();';
        while ($row = mysql_fetch_array($db_getparent->result)) {
            if ($row[$parent_id_field] == 0) {
                $this->arrayParent[$row[$id_field]] = $row[$name_field];
            } else {
                if ($cat_parent != $row[$parent_id_field]) {
                    $i = -1;
                    $cat_parent = $row[$parent_id_field];
                    $return .= 'listdb[' . $row[$parent_id_field] . '] = new Array();' . chr(13);
                }
                $i++;
                $return .= 'listdb[' . $row[$parent_id_field] . '][' . $i . '] = new Array(' . $row[$id_field] . ',"' . htmlspecialchars($row[$name_field]) . '");' . chr(13);
            }
        }
        //phan xu ly javascript
        $return .= '
						function setCities(thanpho,quan,valuequan) {
						var newElem;
						var chooser 	= document.getElementById(thanpho);
						var where 		= (navigator.appName == "Microsoft Internet Explorer") ? -1 : null;
						var cityChooser = document.getElementById(quan);
						var value0  	= cityChooser.options[0].value;
						var text0	  	= cityChooser.options[0].innerHTML;
						while (cityChooser.options.length) {
							cityChooser.remove(0);
						}
						var choice = chooser.options[chooser.selectedIndex].value;
						/* document.getElementById("iCat").value = choice; */
						var db = listdb[choice];
						if (choice != "") {
								newElem = document.createElement("option");
								newElem.text = text0;
								newElem.value = value0;
								cityChooser.add(newElem, where);
								if(db != undefined){
									for (var i = 0; i < db.length; i++) {
										newElem = document.createElement("option");
										newElem.text = db[i][1];
										newElem.value = db[i][0];
										cityChooser.add(newElem, where);
										if(valuequan == db[i][0]) cityChooser.options[i].selected = true;
									}
							   }
						}
					} </script>';
        unset($db_getparent);
        return $return;
    }
}

?>