## Database Migrations

[Full Document](http://docs.phinx.org/en/latest/intro.html)

### Lưu ý khi sử dụng

Để sử dụng database migration. 

    cd database
    composer install //Cài đặt các package cần thiết
    vendor/bin/phinx migrate //Chạy migrate các database cơ bản

### 1 số thao tác cơ bản

- Tạo 1 thay đổi mới: ```vendor/bin/phinx create CreateTableNews
- Chạy migrate: ```vendor/bin/phinx migrate```
- Rollback: ```vendor/bin/phinx rollback```
 

### Cấu trúc 1 file migrate cơ bản

    <?php


    use Phinx\Migration\AbstractMigration;
    
    class Inbox extends AbstractMigration
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
    
            $model = new \App\Models\Inbox();
            $prefix = $model->prefix;
    
            $table = $this->table($model->table, ['id' => $prefix . '_id']);
            $table->addColumn($prefix . '_message', ColumnTypes::TEXT, [
                ColumnOptions::COMMENT => 'Nội dung tin nhắn'
            ]);
            $table->addColumn($prefix . '_receiver_id', ColumnTypes::INTEGER, [
                ColumnOptions::COMMENT => 'Người nhận'
            ]);
            $table->addColumn($prefix . '_sender_id', ColumnTypes::INTEGER, [
                ColumnOptions::COMMENT => 'Người gửi'
            ]);
            $table->addColumn($prefix . '_classified_id', ColumnTypes::INTEGER, [
                ColumnOptions::COMMENT => 'Tin nhắn gắn với tin đăng nào',
                ColumnOptions::DEFAULT => 0
            ]);
            $table->addColumn($prefix . '_read', ColumnTypes::INTEGER, [
                ColumnOptions::COMMENT => 'Đã đọc?',
                ColumnOptions::DEFAULT => 0,
                ColumnOptions::LIMIT => \Phinx\Db\Adapter\MysqlAdapter::INT_TINY
            ]);
            timestamp_fields($table, $prefix); //Tạo các trường như created_at - updated_at - deleted_at
            
            $table->save();
        }
    }

