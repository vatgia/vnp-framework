<?php

use PHPUnit\Framework\TestCase;
use SuperClosure\Serializer;

/**
 * Created by PhpStorm.
 * User: apple
 * Date: 7/1/18
 * Time: 10:18
 */
class CacheRouteTest extends TestCase
{

    public function testCacheRouteUsingSuperClosure()
    {

        $route_data = app('route')->getData();

//        $serilizer = new Serializer();
//
//        $cache_data = $serilizer->serialize($route_data);

        $cache_data = serialize($route_data);

//        dd($cache_data);
    }

}