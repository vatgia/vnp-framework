<?php

require_once 'bootstrap.php';

require_once("resource/security/ipcheck.php");
require_once("resource/security/functions.php");

ob_start("callback");

//Chống bot truy cập
$denyconnect = new denyconnect();

function authenticate()
{
    header('WWW-Authenticate: Basic realm="Authentication System"');
    header('HTTP/1.0 401 Unauthorized');
    echo "You must enter a valid login ID and password to access this resource\n";
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'];

if (checkIpLogin()) {
    redirect("login.php");
} else {
    $uip = getValue("uip", "str", "POST", "", 2);
    $uip = removeHTML($uip);
    if ($uip != "") {
        //Insert IP vao CSDL
        $db_ex = new db_execute("INSERT INTO resetip(ip) VALUES(" . ip2long($uip) . ")");
        unset($db_ex);
        redirect("login.php");
    }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Reset IP</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body>
<div align="center">
    <?
    $auth_user = "";
    $auth_pwd = "";

    if (isset($_SERVER['PHP_AUTH_USER']))
        $auth_user = $_SERVER['PHP_AUTH_USER'];
    if (isset($_SERVER['PHP_AUTH_PW']))
        $auth_pwd = $_SERVER['PHP_AUTH_PW'];

    if ($auth_user != "adminmyad" || $auth_pwd != "vatgiatang5") {
        authenticate();
    } else {
        ?>
        <form action="resetip.php" method="post">
            <label>Nhập vào IP của bạn <strong><?= $ip ?></strong></label>
            <input type="text" id="uip" name="uip"/>
            <input type="submit" value="Add"/>
        </form>
        <?
    }
    ?>
</div>
</body>
</html>
<?
ob_end_flush();
?>
