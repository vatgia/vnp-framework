<?php

use App\Models\Users\Users;
use PHPUnit\Framework\TestCase;

/**
 * Created by PhpStorm.
 * User: apple
 * Date: 6/27/18
 * Time: 10:00
 */
class UpdateNullTest extends TestCase
{

    public function testUpdateNullValue()
    {
        $user = Users::findByID(88);

        $date = $user->date;

        $user->update([
            'use_date' => time()
        ]);

        $result = $user->update([
            'use_date' => null
        ]);

        $user->update([
            'use_date' => $date
        ]);

        $this->assertEquals('1', $result);
    }

}