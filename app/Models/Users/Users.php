<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 11/15/16
 * Time: 2:34 PM
 */

namespace App\Models\Users;


use VatGia\Model\Model;

class Users extends Model
{
    public $table = 'users';
    public $prefix = 'use';

    public $soft_delete = true;

    public $hidden = [
        'use_password',
        'use_security',
    ];

}