<?
$users = array('aff_vg' => 'facebook_google');
$realm = "dev.affiliate.vatgia.vn";

function check_authen()
{
    global $realm;
    if (empty($_SERVER['PHP_AUTH_DIGEST'])) {
        @header('HTTP/1.1 401 Unauthorized');
        @header('WWW-Authenticate: Digest realm="' . $realm . '",qop="auth",nonce="' . uniqid() . '",opaque="' . md5($realm) . '"');
        die('Text to send if user hits Cancel button');
    }
}

// function to parse the http auth header
function http_digest_parse($txt)
{
    // protect against missing data
    $needed_parts = array('nonce' => 1, 'nc' => 1, 'cnonce' => 1, 'qop' => 1, 'username' => 1, 'uri' => 1, 'response' => 1);
    $data = array();
    $keys = implode('|', array_keys($needed_parts));

    preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

    foreach ($matches as $m) {
        $data[$m[1]] = $m[3] ? $m[3] : $m[4];
        unset($needed_parts[$m[1]]);
    }

    return $needed_parts ? false : $data;
}


//Pass fake login
$pass_fake = 'jdfhkjdhfdkhdkf';
//Kiem tra xem ip nay co duoc phep vao admin hay khong
$ip = $_SERVER['REMOTE_ADDR'];
$ip_fake = $_SERVER['REMOTE_ADDR'];
$check_ip = 0;
$mod_file = 0;

if (!checkIpLogin()) {
    die("<h3 align='center'>Ban chua co quyen truy cap vao trang nay.</h3>");
}


// require_once("../../../classes/form.php");
// require_once("../../../functions/functions.php");
// require_once("../../../functions/file_functions.php");
// require_once("../../../functions/date_functions.php");
// require_once("../../../functions/resize_image.php");
// require_once("../../../functions/simple_html_dom.php");
// require_once("../../../functions/ads/ads_functions.php");
// require_once("../../../functions/translate.php");
// require_once("../../../functions/pagebreak.php");
// require_once("../../../classes/generate_form.php");
// require_once("../../../classes/form.php");
// require_once("../../../classes/html_cleanup.php");
// require_once("../../../classes/upload.php");
// require_once("../../../classes/tinyMCE.php");
// require_once("../../../classes/menu.php");
// require_once("../../../classes/create_category.php");
// require_once("grid.php");

//$wys_path				= "../../resource/wysiwyg_editor/";
//require_once($wys_path . "fckeditor.php");

require_once("template.php");
$admin_id = getValue("user_id", "int", "SESSION");
$lang_id = getValue("lang_id", "int", "SESSION");;

//phan khai bao bien dung trong admin
$fs_stype_css = "../css/css.css";
$fs_template_css = "../css/template.css";
$fs_border = "#f9f9f9";
$fs_bgtitle = "#DBE3F8";
$fs_imagepath = "../../resource/images/";
$fs_scriptpath = "../../resource/js/";
$fs_denypath = "../../error.php";
$wys_cssadd = array();
$wys_cssadd = "/css/all.css";
$sqlcategory = "";
//phan include file css

$load_header = '<link href="../../resource/css/css.css" rel="stylesheet" type="text/css">';
//$load_header 			.= '<link href="../../resource/css/css1.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/style.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/template.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/grid.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/thickbox.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/calendar.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/js/jwysiwyg/jquery.wysiwyg.css" rel="stylesheet" type="text/css">';
$load_header .= '<link href="../../resource/css/datatables.min.css" rel="stylesheet" type="text/css">';

//phan include file script
$load_header .= '<script language="javascript" src="../../resource/js/jquery.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/bootstrap/js/bootstrap.min.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/grid.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/library.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/thickbox.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/calendar.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/tooltip.jquery.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/jquery.jeditable.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/swfObject.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/jwysiwyg/jquery.wysiwyg.js"></script>';
//$load_header 			.= '<script language="javascript" src="../../resource/js/windowProm/windowprompt.js"></script>';
$load_header .= '<script language="javascript" src="../../resource/js/datatables.min.js"></script>';

$load_header .= '<link href="../../resource/js/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">';
$load_header .= '<script src="../../resource/js/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js"></script>';

$load_header .= '<link href="../../resource/js/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>';
$load_header .= '<script src="../../resource/js/jquery-ui/jquery-ui.min.js"></script>';

$fs_change_bg = 'onMouseOver="this.style.background=\'#DDF8CC\'" onMouseOut="this.style.background=\'#FEFEFE\'"';


//Admin city security
$fs_error = "../../error.php";

$userlogin = getValue("userlogin", "str", "SESSION", "", 1);
$password = getValue("password", "str", "SESSION", "", 1);
$lang_id = getValue("lang_id", "int", "SESSION", 1);

$db_admin_user = new db_query("SELECT *
							 FROM admin_user
							 WHERE 
							 	adm_loginname='" . $userlogin . "' 
							 	AND adm_password='" . $password . "' 
							 	AND adm_active=1");

$admin_id = 0;
$is_admin = 0;
//Check xem user co ton tai hay khong
if ($row = $db_admin_user->fetch(true)) {
    $admin_id = intval($row["adm_id"]);
    $is_admin = $row["adm_isadmin"];
}
unset($db_admin_user);


function admin_lte_header()
{
    $header = <<<HEADER
<link rel="stylesheet" href="../../resource/adminlte/bootstrap/css/bootstrap.min.css">
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
<!-- Ionicons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
<!-- Theme style -->
<!-- Select2 -->
<link rel="stylesheet" href="../../resource/adminlte/plugins/select2/select2.min.css">
<!-- iCheck -->
<link rel="stylesheet" href="../../resource/adminlte/plugins/iCheck/square/blue.css">
<link rel="stylesheet" href="../../resource/adminlte/plugins/iCheck/minimal/blue.css">
    
<link rel="stylesheet" href="../../resource/adminlte/dist/css/AdminLTE.min.css">
<!-- AdminLTE Skins. Choose a skin from the css/skins folder instead of downloading all of them to reduce the load. -->
<link rel="stylesheet" href="../../resource/adminlte/dist/css/skins/_all-skins.min.css">
<link rel="stylesheet" href="../../resource/adminlte/plugins/pace/pace.min.css">
<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
HEADER;

    return $header;
}


function admin_lte_footer()
{
    $footer = <<<FOOTER
<!-- jQuery 2.2.3 -->
<script src="../../resource/adminlte/plugins/jQuery/jquery-2.2.3.min.js"></script>
<!-- Bootstrap 3.3.6 -->
<script src="../../resource/adminlte/bootstrap/js/bootstrap.min.js"></script>
<!-- SlimScroll -->
<script src="../../resource/adminlte/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="../../resource/adminlte/plugins/fastclick/fastclick.js"></script>
<!-- AdminLTE App -->
<script src="../../resource/adminlte/dist/js/app.min.js"></script>
<!-- AdminLTE for demo purposes -->
<script src="../../resource/adminlte/dist/js/demo.js"></script>
<!--<link rel="stylesheet" type="text/css" media="screen" href="../../resource/css/jquery-ui.css"/>-->
<!--<script src="../../resource/js/jquery-ui-1.8.1.custom.min.js" type="text/javascript"></script>-->
<!-- PACE -->
<script src="../../resource/adminlte/plugins/pace/pace.min.js"></script>

<!-- Select2 -->
<script src="../../resource/adminlte/plugins/select2/select2.full.min.js"></script>
<script src="../../resource/adminlte/plugins/iCheck/icheck.min.js"></script>
<script>
  $(function () {
    //Initialize Select2 Elements
    $(".select2").select2();
    
    //iCheck for checkbox and radio inputs
    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
      checkboxClass: 'icheckbox_minimal-blue',
      radioClass: 'iradio_minimal-blue'
    });
    
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
      checkboxClass: 'icheckbox_minimal-red',
      radioClass: 'iradio_minimal-red'
    });
    
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
    
  });
  
</script>

FOOTER;

    return $footer;
}

?>
