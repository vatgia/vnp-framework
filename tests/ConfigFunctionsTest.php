<?php

use PHPUnit\Framework\TestCase;

class ConfigFunctionsTest extends TestCase {

    public function test_config_get()
    {
        $expect = 'Justin';
        $actual = config_get('test.person.info.name');
        $this->assertEquals($expect, $actual);

        // Mảng config
        $config = [
            'person' => [
                'info' => [
                    'name' => 'Justin',
                    'age'  => 27
                ]
            ]
        ];

        $actual = config_get('test');

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