<?


function convertDateFromDB($date, $sep = "-")
{
    $arrDate = explode("-", $date);
    $strReturn = "";
    if (count($arrDate) == 3) {
        $strReturn = $arrDate[2] . $sep . $arrDate[1] . $sep . $arrDate[0];
    }
    return $strReturn;
}

?>


<?
function postedTimer($minutes)
{
    $msg = "";
    if ($minutes < 1) {
        $msg = "khoảng 1 phút trước";
    } else if ($minutes >= 1 && $minutes < 60) {
        $msg = round($minutes) . " phút trước";
    } else if ($minutes >= 60 && $minutes < 1140) {
        $msg = round($minutes / 60) . " giờ trước";
    } else {
        $msg = round($minutes / (60 * 24)) . " ngày trước";
    }

    return $msg;
}

?>
<?
function str_totime($string = "", $putformat = "d/m/Y")
{
    if ($string == "") return 0;
    global $lang_id;
    $lang_id = $lang_id ? $lang_id : 0;
    $time = 0;
    $array_time_format_vn = array(1);

    $string = str_replace("-", "/", $string);
    $array = explode("/", $string);

    if (isset($array[0]) && isset($array[1]) && isset($array[2])) {
        $year = intval($array[2]);
        if (in_array($lang_id, $array_time_format_vn)) {
            $month = intval($array[1]);
            $day = intval($array[0]);
        } else {
            $month = intval($array[0]);
            $day = intval($array[1]);
        }

        if (checkdate($month, $day, $year)) {
            $time = strtotime($month . "/" . $day . "/" . $year);
        }
    }

    return intval($time);
}