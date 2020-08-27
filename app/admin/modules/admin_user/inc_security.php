<?
$module_id = 1;
//check security...
require_once("../../bootstrap.php");
require_once("../../resource/security/security.php");

//Check user login...
checkLogged();
//Check access module...
if (checkAccessModule($module_id) != 1) redirect($fs_denypath);

$fs_table = "admin_user";
$menu = new menu();
//$listAll 		= $menu->getAllChild("categories_multi","cat_id","cat_parent_id","0","","cat_id,cat_name,cat_order,cat_type,cat_parent_id,cat_has_child","cat_order ASC, cat_name ASC","cat_has_child");
$user_id = getValue("user_id", "int", "SESSION");


$array_web_server = array("192.168.1.145" => "Web 36 - 192.168.1.145 - 210.245.83.80",
    //"192.168.1.147"	=> "Web 40 - 192.168.1.147 - 210.245.83.81",
    "192.168.1.143" => "Web 37 - 192.168.1.143 - 210.245.83.66",
    "192.168.1.142" => "Web 19 - 192.168.1.142 - 210.245.80.33",
    "192.168.1.148" => "Web 41 - 192.168.1.148 - 210.245.83.83",
    "192.168.1.149" => "Web 42 - 192.168.1.149 - 210.245.83.86",
);
// Check restrict module
$array_slave_server = array("192.168.1.124" => "Web 12 (Master) - 192.168.1.124 - 210.245.80.5",
    "192.168.1.145" => "Web 36 (Slave) - 192.168.1.145 - 210.245.83.80",
    "192.168.1.143" => "Web 37 (Slave) - 192.168.1.143 - 210.245.83.66",
    "192.168.1.148" => "Web 41 (Slave) - 192.168.1.148 - 210.245.83.83",
    "192.168.1.149" => "Web 42 (Slave) - 192.168.1.149 - 210.245.83.86",
);
function ping($host, $port = 80, $timeout = 2, $retry = 0)
{
    $fsock = @fsockopen($host, $port, $errno, $errstr, $timeout);
    if (!$fsock) {
        $db_ini = new db_init();
        $db_ini->log($_SERVER["DOCUMENT_ROOT"] . "/ipstore/error_ping.cfn", $host);
        if ($retry < 3) {
            $retry++;
            sleep(1);

            return ping($host, $port, $timeout, $retry);
        }

        return FALSE;
    } else {
        return TRUE;
    }
}

$views = [
    dirname(__FILE__) . '/views',
    realpath(dirname(__FILE__) . '/../../resource/views'),
];
$cache = ROOT . '/ipstore';
$blade = new \Philo\Blade\Blade($views, $cache);

//var_dump(ping("210.245.80.999"));
?>