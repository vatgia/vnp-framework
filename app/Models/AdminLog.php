<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyễn <ntdinh1987@gmail.com>
 * Date: 7/2/20
 * Time: 11:44
 */

namespace App\Models;


use VatGia\Model\Model;

class AdminLog extends Model
{

    public $table = 'admin_logs';
    public $prefix = 'adl';

    public function admin()
    {

        return $this->hasOne(
            __FUNCTION__,
            AdminUser::class,
            'adm_id',
            'adl_admin_user_id'
        );
    }
}