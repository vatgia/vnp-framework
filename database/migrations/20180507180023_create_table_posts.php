<?php


use Phinx\Migration\AbstractMigration;

class CreateTablePosts extends AbstractMigration
{

    public static $table = 'posts';
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-abstractmigration-class
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
//    public function change()
//    {
//
//    }

    public function up()
    {
        $table = $this->table(static::$table, ['id' => 'pos_id']);
        $table->addColumn('pos_title', ColumnTypes::STRING)
            ->addColumn('pos_rewrite', ColumnTypes::STRING)
            ->addColumn('pos_image', ColumnTypes::STRING)
            ->addColumn('pos_teaser', ColumnTypes::TEXT)
            ->addColumn('pos_content', ColumnTypes::TEXT)
            ->addColumn('pos_active', ColumnTypes::INTEGER, [
                ColumnOptions::DEFAULT => 1
            ])
            ->addColumn('pos_category_id', ColumnTypes::INTEGER)
            ->addColumn('pos_is_hot', ColumnTypes::INTEGER, [
                ColumnOptions::DEFAULT => 0
            ])
            ->addColumn('pos_show_home', ColumnTypes::INTEGER)
            ->addColumn('pos_seo_title', ColumnTypes::STRING, [
                ColumnOptions::NULL => true
            ])
            ->addColumn('pos_seo_keyword', ColumnTypes::TEXT, [
                ColumnOptions::NULL => true
            ])
            ->addColumn('pos_seo_description', ColumnTypes::TEXT, [
                ColumnOptions::NULL => true
            ])
            ->addColumn('pos_total_view', ColumnTypes::INTEGER, [
                ColumnOptions::LIMIT => 11,
                ColumnOptions::DEFAULT => 0
            ])
            ->addColumn('pos_type', ColumnTypes::VARCHAR)
            ->addColumn('pos_created_at', ColumnTypes::TIMESTAMP, [
                ColumnOptions::DEFAULT => 'CURRENT_TIMESTAMP'
            ])
            ->addColumn('pos_updated_at', ColumnTypes::TIMESTAMP, [
                ColumnOptions::NULL => true,
                ColumnOptions::UPDATE => 'CURRENT_TIMESTAMP'
            ])
            ->save();
    }

    public function down()
    {
        if ($this->hasTable(static::$table)) {
            $this->dropTable(static::$table);
        }
    }
}
