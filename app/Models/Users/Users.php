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

    public $hidden = [
        'use_password',
        'use_security',
    ];


    /**
     * Tạo user vg from email
     * @param  string $email
     * @param  int $id
     * @return bool
     */
    public static function createUserFromDataIdVg($info)
    {
        $use_id_vatgia = (int)$info['id'];
        $use_id = (int)$info['id'];
        $use_active = 1;
        $use_group = 1;
        $use_email = $info['email'];
        $use_password = md5($info['email'] . '|' . $info['first_name']);
        $use_name = $info['first_name'] . ' ' . $info['last_name'];
        $use_phone = $info['phone'];
        $use_yahoo = '';
        $use_address = $info['address'];
        $use_birthdays = $info['dob'];
        $use_birthdays = strtotime($use_birthdays);
        $use_gender = ($info['gender'] == 'MALE') ? 1 : 0;
        $use_date = time();

        $use_idvg_access_token = $info['access_token'];
        $use_avatar = $info['avatar'];

        $myfrom = new \generate_form();
        $myfrom->add('use_id', 'use_id_vatgia', 1, 1, $use_id_vatgia);
        $myfrom->add('use_id_vatgia', 'use_id_vatgia', 1, 1, $use_id_vatgia);
        $myfrom->add('use_password', 'use_password', 0, 1, $use_password, 0, 'use_password');
        $myfrom->add('use_email', 'use_email', 0, 1, $use_email, 0, 'use_email');
        $myfrom->add('use_name', 'use_name', 0, 1, $use_name, 0, 'use_name');
        $myfrom->add('use_phone', 'use_phone', 0, 1, $use_phone, 0, 'use_phone');
        $myfrom->add('use_address', 'use_address', 0, 1, $use_address, 0, 'use_address');
        $myfrom->add('use_birthdays', 'use_birthdays', 0, 1, $use_birthdays, 0, 'use_birthdays');
        $myfrom->add('use_gender', 'use_gender', 1, 1, $use_gender, 0, 'use_gender');
        $myfrom->add('use_active', 'use_active', 1, 1, $use_active, 0, 'use_active');
        $myfrom->add('use_group', 'use_group', 1, 1, $use_group, 0, 'use_group');
        $myfrom->add('use_date', 'use_date', 1, 1, $use_date, 0, 'use_date');
        $myfrom->add('use_idvg_access_token', 'use_idvg_access_token', 0, 1, $use_idvg_access_token, 0, 'use_idvg_access_token');
        $myfrom->add('use_avatar', 'use_avatar', 0, 1, $use_avatar, 0, 'use_avatar');

        $myfrom->addTable('users');

        $myfrom->evaluate();
        $err = '';
        $err = $myfrom->checkdata();

        if (!$err || $err == '') {
            $new_user = new \db_execute_return();

            //Lưu thông tin vào bảng users_info
            if ($userId = $new_user->db_execute($myfrom->generate_replace_SQL())) {
                unset($new_user);

                return $userId;
            }
        }

        return false;
    }

}