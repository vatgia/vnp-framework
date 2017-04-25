<?php

use PHPUnit\Framework\TestCase;

class ConfigFunctionsTest extends TestCase {

    public function test_config_get()
    {


        app()->register('config', function () {
            return \VatGia\Config::load(ROOT . '/tests/config/');
        });

        $expect = 'Justin';
        $actual = config('test.person.info.name');
        $this->assertEquals($expect, $actual);


        $actual = config('test');

        $this->assertEquals($config, $actual);
    }

    public function test_array_get()
    {
        $array = [
            'person' => [
                'name' => 'Justin'
            ]
        ];

        $expect = 'Justin';
        $actual = array_get($array, 'person.name');

        $this->assertEquals($expect, $actual);
    }
}