<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <?php
    echo admin_lte_header();
    ?>
    @yield('header')
    <style>
        td {
            vertical-align: middle !important;
        }
    </style>
</head>
<body style="background: #ecf0f5;">
@yield('content')
<?php
echo admin_lte_footer();
?>
@yield('script')
</body>
</html>