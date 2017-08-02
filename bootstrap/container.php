<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/3/16
 * Time: 7:56 AM
 */

$app->register('notFoundHandler', function () {
    return function ($e) {
        throw $e;
    };
});

$app->register('methodNotAllowHandler', function () {
    return function ($e) {
        throw $e;
    };
});

$app->register('errorHandler', function () {
    return function ($e) {
        throw $e;
    };
});

$app->register('phpErrorHandler', function () {
    return function ($e) {
        throw $e;
    };
});

$app->register('shutdown', function () use ($app) {
    return function () use ($app) {
        //Đóng tất cả kết nối tại đây
        if (db_init::$links) {
            foreach (db_init::$links as &$link) {
                @mysqli_close($link);
            }
        }

        //Hiển thị debug bar
        if (
            config('app.debugbar')
            && config('app.debug')
            && !$app->runningInConsole()
            && !defined('IS_API_CALL')
        ) {
            echo view('debug/debug_bar')->render();
        }
    };
});

$app->bind(\AppView\Repository\PostRepositoryInterface::class, \AppView\Repository\PostRepository::class);