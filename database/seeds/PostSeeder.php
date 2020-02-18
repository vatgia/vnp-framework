<?php


use Phinx\Seed\AbstractSeed;

class PostSeeder extends AbstractSeed
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

        $types = [
            'NEWS',
            'SUPPORT',
        ];
        $faker = Faker\Factory::create();
        $data = [];

        foreach ($types as $type) {

            for ($i = 0; $i <= 10; $i++) {

                $cat_id = 1;
                $title = $faker->paragraph;
                $data[] = [
                    'pos_title' => $title,
                    'pos_rewrite' => removeTitle($title),
                    'pos_image' => $faker->image(dirname(__FILE__) . '/../../public/upload/', 254, 169,
                        'technics', false),
                    'pos_teaser' => $faker->paragraph(2),
                    'pos_content' => $faker->paragraph(10),
                    'pos_active' => 1,
                    'pos_category_id' => $cat_id,
                    'pos_is_hot' => round(rand(0, 1)),
                    'pos_show_home' => round(rand(0, 1)),
                    'pos_type' => strtoupper($type)
                ];
            }
        }

        $table = $this->table('posts');
        $table->truncate();
        $table->insert($data)
            ->save();
    }
}
