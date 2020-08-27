<?php
error_reporting(E_ALL);
require_once dirname(__FILE__) . '/bootstrap.php';

require_once("resource/security/ipcheck.php");
require_once("resource/security/functions.php");

$username = getValue("username", "str", "POST", "", 1);
$password = getValue("password", "str", "POST", "", 1);
$action = getValue("action", "str", "POST", "");
$ip = $_SERVER['REMOTE_ADDR'];

if (!checkIpLogin()) {
    die("<h3 align='center'>Ban chua co quyen truy cap vao trang nay.</h3>");
}

if ($action == "login") {

    $user_id = 0;
    $user_id = checkLogin($username, $password);

    if ($user_id != 0) {
        $isAdmin = 0;
        $db_isadmin = new db_query("SELECT adm_isadmin FROM admin_user WHERE adm_id = " . $user_id);
        $row = $db_isadmin->fetch(true);

        if ($row["adm_isadmin"] != 0) $isAdmin = 1;
        //Set SESSION
        $_SESSION["logged"] = 1;
        $_SESSION["user_id"] = $user_id;
        $_SESSION["userlogin"] = $username;
        $_SESSION["password"] = md5($password);
        $_SESSION["isAdmin"] = $isAdmin;
//		$_SESSION["lang_id"]			= $row["lang_id"];
//		$_SESSION["lang_id"] 		= get_curent_language();
//		$_SESSION["lang_path"] 		= get_curent_path();

        //$_SESSION["checsum"]			= md5($user_id . "|" . $username . "|" . md5($password) . "|" . $key_checksum);
        unset($db_isadmin);
    }
}

//Check logged
$logged = getValue("logged", "int", "SESSION", 0);
if ($logged) {
    header('Location: index.php');
    exit;
}

?><!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AdminLTE 2 | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link rel="stylesheet" href="resource/adminlte/bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="resource/adminlte/dist/css/AdminLTE.min.css">
    <!-- iCheck -->
    <link rel="stylesheet" href="resource/adminlte/plugins/iCheck/square/blue.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>

    <![endif]-->
</head>
<body class="hold-transition login-page"
      style="height: auto; background-image: url(resource/images/bg.jpg); background-size: cover">
<div class="login-box">
    <div class="login-logo">
        <a href="/">
            <img src="http://static.vatgia.com/20170125/cache/css/v5/logo.svg"/>
        </a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body" style="background: rgba(255, 255, 255, 0.6);">
        <p class="login-box-msg">Sign in to start your session</p>

        <form action="" method="post">
            <input name="action" value="login" type="hidden">
            <div class="form-group has-feedback">
                <input name="username" id="username" type="text" class="form-control" placeholder="Username">
                <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input name="password" id="password" type="password" class="form-control" placeholder="Password">
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="checkbox icheck">
                        <label>
                            <input id="toogle_password" type="checkbox"> Hide/Show Password
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-8">
                    <div class="checkbox icheck">
                        <label>
                            <input type="checkbox"> Remember Me
                        </label>
                    </div>
                </div>
                <!-- /.col -->
                <div class="col-xs-4">
                    <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
                </div>
                <!-- /.col -->
            </div>
        </form>

    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<!-- jQuery 2.2.3 -->
<script src="resource/adminlte/plugins/jQuery/jquery-2.2.3.min.js"></script>
<!-- Bootstrap 3.3.6 -->
<script src="resource/adminlte/bootstrap/js/bootstrap.min.js"></script>
<!-- iCheck -->
<script src="resource/adminlte/plugins/iCheck/icheck.min.js"></script>
<script>
    $(function () {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
        $('#toogle_password').on('ifChanged', function () {
            if ($('#password').attr('type') == 'password') {
                $('#password').attr('type', 'text');
            } else {
                $('#password').attr('type', 'password');
            }
        });
    });
</script>
</body>
</html>
