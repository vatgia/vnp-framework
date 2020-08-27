<?
include("../../publisher/initsession.php");
@session_start();
if (isset($_SESSION["logged"])) {
    $_SESSION["logged"] = "0";
    unset($_SESSION["logged"]);
}
if (isset($_SESSION["user_id"])) unset($_SESSION["user_id"]);
if (isset($_SESSION["userlogin"])) unset($_SESSION["userlogin"]);
if (isset($_SESSION["password"])) unset($_SESSION["password"]);
if (isset($_SESSION["isAdmin"])) unset($_SESSION["isAdmin"]);
if (isset($_SESSION["lang_path"])) unset($_SESSION["lang_path"]);
session_destroy();
session_unset();
?>
<script language="javascript">
    parent.location.href = "../login.php";
</script>
