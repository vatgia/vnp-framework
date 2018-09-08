<?php

use PHPUnit\Framework\TestCase;

/**
 * Created by PhpStorm.
 * User: apple
 * Date: 6/23/18
 * Time: 11:05
 */
class RedisTest extends TestCase
{

    public function testConnect()
    {
        $client = new Predis\Client([
            'scheme' => 'tcp',
            'host' => 'redis',
            'port' => 6379,
        ]);
        $client->set('foo', 'bar');
        $value = $client->get('foo');

        $this->assertEquals('bar', $value);
    }
}