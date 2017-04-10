<?php

/**
 * Created by PhpStorm.
 * User: ADMIN
 * Date: 1/3/17
 * Time: 5:03 PM
 */
class RevenueReportTest extends \PHPUnit\Framework\TestCase
{

    public function testGetData()
    {
        $data = model()->loadModel([
            'publisher_id' => 88
        ], 'publishers/revenue_report');
        var_dump($data);
    }

}