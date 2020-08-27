<?
//mỡ đầu phần template 
function template_tab($array = array())
{
    global $module_id;
    $str = '';
    /**********------------------- Begin Template V3 - Do not Modify -------------------**********/
    $str .= '<div class="template2">';
    $str .= '	<div class="t1">';
    foreach ($array as $key => $value) {
        $str .= '		<div class="t2">';
        $str .= '			<div class="t3"><a href="' . $value . '">' . $key . '</a></div>';
        $str .= '		</div>';
    }
    $str .= '	</div>';
    $str .= '	<div class="t4">';
    $str .= '		<div>';
    $str .= '<div style="clear:both"></div>';

    return $str;
    /*----------..................... Start WEB CONTENT here ....................----------*/
}

//mỡ đầu phần template
function template_top($title = '', $search = '')
{
    global $module_id;
    $str = '';
    /**********------------------- Begin Template V3 - Do not Modify -------------------**********/
    $str .= '<div class="header box-header">
<!--    <h3 class="box-title">' . $title . '</h3>-->
';
    if ($search != '') {
        $str .= '<div class="search">' . $search . '</div>';
    }
    $str .= '</div>';

//	$str .= '<div style="clear:both"></div>';
    return $str;
    /*----------..................... Start WEB CONTENT here ....................----------*/
}

function template_bottom()
{
    global $module_id;
    $str = '';

    /*----------...................... End WEB CONTENT here .....................----------*/

    return $str;
    /**********------------------- End Template V3 - Do not Modify -------------------**********/
}

?>