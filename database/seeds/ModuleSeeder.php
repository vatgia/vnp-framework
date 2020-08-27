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
