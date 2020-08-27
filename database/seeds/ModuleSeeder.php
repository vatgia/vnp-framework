<?php


use Phinx\Seed\AbstractSeed;

class ModuleSeeder extends AbstractSeed
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
                'mod_id' => 1,
                'mod_name' => 'Quản trị viên',
                'mod_path' => 'admin_user',
                'mod_listname' => 'Danh sách|Thêm mới',
                'mod_listfile' => 'listing.php|add.php',
            ],
            [
                'mod_id' => 25,
                'mod_name' => 'Lịch sử quản trị viên',
                'mod_path' => 'admin_logs',
                'mod_listname' => 'Danh sách',
                'mod_listfile' => 'listing.php',
            ],
            [
                'mod_id' => 13,
                'mod_name' => 'Media',
                'mod_path' => 'sliders',
                'mod_listname' => 'Danh sách banner|Thêm mới banner|Thêm banner vào vị trí hiển thị',
                'mod_listfile' => 'listing.php|add_banner.php|add_banner_slider.php',
            ],
            [
                'mod_id' => 27,
                'mod_name' => 'Cấu hình',
                'mod_path' => 'settings',
                'mod_listname' => 'Danh sách',
                'mod_listfile' => 'listing.php',
            ],
            [
                'mod_id' => 16,
                'mod_name' => 'File hệ thống',
                'mod_path' => 'files',
                'mod_listname' => 'Danh sách',
                'mod_listfile' => 'listing.php',
            ],
        ];

        $posts = $this->table('modules');
        $posts->truncate();
        $posts->insert($data)
            ->save();
    }
}
