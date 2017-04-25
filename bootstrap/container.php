<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/3/16
 * Time: 7:56 AM
 */

$app->register('debug', function () {
    $debug = new \VatGia\Helpers\Debug();
    return $debug;
});

$app->register('model', function () {
    return new \VatGia\Model;
});

$app->register('view', function () {
    return new \VatGia\View;
});

$app->register('shutdown', function () {
    return function () {

        //Đóng tất cả kết nối tại đây
        if (db_init::$links) {
            foreach (db_init::$links as $link) {
                @mysqli_close($link);
            }
        }

        //Hiển thị debug bar
//        include ROOT . '/appview/views/debug/footer.html.php';

    };
});

$config = model()->loadModel([], 'config/index');

//User
$app->register('user', function () use ($config) {
    return $config['vars']['user'];
});

//Config from db