<?php

/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 4/25/2017
 * Time: 11:54 AM
 */
class ConnectDBTest extends \PHPUnit\Framework\TestCase
{
    public function testConnect()
    {
        mysqli_connect(
            'localhost:6604',
            'root',
            '123456',
            'vnpdatabase'
        );
    }
}