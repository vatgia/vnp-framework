<?
function translate_text($variable)
{
    global $langAdmin;
    if (isset($langAdmin[md5(trim($variable))])) {
        if ($langAdmin[md5(trim($variable))] != '') {
            return $langAdmin[md5(trim($variable))];
        } else {
            return "";
        }
    } else {
        $db_ex = new db_query("REPLACE INTO admin_translate(tra_keyword,tra_text,tra_source) VALUES('" . md5(trim($variable)) . "','" . $variable . "','" . $variable . "')");
        unset($db_ex);
        return "-{" . $variable . "}-";
    }
}

function translate($variable)
{

    $variable = trim($variable);
    $variable = str_replace("\'", "'", $variable);
    $variable = str_replace("'", "''", $variable);
    global $lang_display;
    if (isset($lang_display[md5(trim($variable))])) {
        if ($lang_display[md5(trim($variable))] != '') {
            return $lang_display[md5(trim($variable))];
        } else {
            return "";
        }
    } else {

        $db_ex = new db_query("REPLACE INTO translate_display(tra_keyword,tra_text,tra_source) VALUES('" . md5(trim($variable)) . "','" . $variable . "','" . $variable . "')");
        unset($db_ex);
        return $variable;
    }
}

?>