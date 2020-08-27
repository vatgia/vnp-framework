<?
$isAdmin = isset($_SESSION["isAdmin"]) ? intval($_SESSION["isAdmin"]) : 0;
?>
<div class="header_index">
    <table cellpadding="0" cellspacing="0" width="100%" style="padding-right: 10px;">
        <tr>
            <td style="display: block;padding:6px;height:30px;">
                <img height="30" src="/themes/v2/img/myad_logo.png"/>
            </td>
            <td style="font-size:14px;">Chào mừng bạn đến với trang quản trị website myad.vn</td>
            <td align="right">
                <a href="#">Hi!
                    <span id="acc_name">
               <?= getValue("userlogin", "str", "SESSION", "") ?>
               </span>
                </a>
                <span class="line_1">|</span>
                <span id="acc1" class="infoacc">
               <?= translate_text("Thông tin tài khoản") ?>
                    <span class="sourceacc" style="display: none;">resource/profile/myprofile.php</span>
            </span>
                <span class="line_1">|</span>
                <?
                //kiem tra xem neu la o tren localhost thi moi co quyen cau hinh
                $url = $_SERVER['SERVER_NAME'];
                if ($isAdmin == 1 && ($url == "localhost" || strpos($url, "192.168.1") !== false)) {
                    ?>
                    <span id="acc2" class="infoacc">
               <?= translate_text("Website Settings") ?>
                        <span class="sourceacc" style="display: none;">resource/configadmin/configmodule.php</span>
            </span>
                    <span class="line_1">|</span>
                    <?
                }
                ?>
                <a href="resource/logout.php"><?= translate_text("Logout") ?></a>
            </td>
        </tr>
    </table>
</div>