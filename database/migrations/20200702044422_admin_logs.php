<?php


use Phinx\Migration\AbstractMigration;

class AdminLogs extends AbstractMigration
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
    public function change()
    {

        $model = new \App\Models\AdminLog();
        $prefix = $model->prefix;

        $table = $this->table($model->table, ['id' => $prefix . '_id']);
        $table->addColumn($prefix . '_admin_user_id', ColumnTypes::INTEGER, [
            ColumnOptions::COMMENT => 'Admin id'
        ]);
        $table->addColumn($prefix . '_action', ColumnTypes::VARCHAR, [
            ColumnOptions::COMMENT => 'Hành động (ADD|EDIT|DELETE|ACTIVE)'
        ]);
        $table->addColumn($prefix . '_record_id', ColumnTypes::INTEGER, [
            ColumnOptions::DEFAULT => 0
        ]);
        $table->addColumn($prefix . '_record_title', ColumnTypes::VARCHAR);
        timestamp_fields($table, $prefix);
        
        $table->save();

    }
}
