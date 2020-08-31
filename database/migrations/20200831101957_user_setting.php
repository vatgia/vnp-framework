<?php


use Phinx\Migration\AbstractMigration;

class UserSetting extends AbstractMigration
{
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
    public function up()
    {

        $model = new \App\Models\Setting;
        $prefix = $model->prefix;

        $table = $this->table($model->table);
        $table->addColumn($prefix . '_user_id', ColumnTypes::INTEGER, [
            ColumnOptions::COMMENT => 'User id',
            ColumnOptions::DEFAULT => 0 //Setting của hệ thống
        ]);
        $table->removeIndex([$prefix . '_key']);
        $table->addIndex([$prefix . '_key', $prefix . '_user_id'], ['unique' => true]);

        $table->save();
    }

    public function down()
    {
        $model = new \App\Models\Setting;
        $prefix = $model->prefix;

        $table = $this->table($model->table);
        $table->removeIndex([$prefix . '_key', $prefix . '_user_id']);
        $table->addIndex([$prefix . '_key'], ['unique' => true]);
        $table->removeColumn($prefix . '_user_id');

        $table->save();
    }
}
