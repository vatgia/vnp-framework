<?php

use PHPUnit\Framework\TestCase;
use VatGia\Cache\Facade\Cache;

/**
 * Created by PhpStorm.
 * User: apple
 * Date: 9/8/18
 * Time: 11:18
 */
class MemcachedTest extends TestCase
{

    public function testConnect()
    {
        Cache::put('memcached_test_key', 1, 2);
        $value = Cache::get('memcached_test_key');
        $this->assertEquals(1, $value);

        sleep(3);
        $value = Cache::get('memcached_test_key');
        $this->assertEquals(null, $value);
    }

}