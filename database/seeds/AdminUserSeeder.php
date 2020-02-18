<?php


use Phinx\Seed\AbstractSeed;

class AdminUserSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     */
    public function run()
    {
        $data = [
            [
                'adm_loginname' => 'admin',
                'adm_password' => md5('123456'),
                'adm_name' => 'Nguyễn Thế Định',
                'adm_email' => 'ntdinh1987@gmail.com',
                'adm_address' => '102 Thái Thịnh - Đống Đa - Hà Nội',
                'adm_phone' => '0904022220',
                'adm_mobile' => '0904022220',
                'adm_date' => time(),
                'adm_isadmin' => 1,
                'adm_active' => 1,
                'adm_all_category' => 1,
                'adm_all_website' => 1,
            ]
        ];

        $posts = $this->table('admin_user');
        $posts->insert($data)
            ->save();
    }
}
