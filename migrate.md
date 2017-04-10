# Hướng dẫn sử dụng migration

##1. Tạo file query trong thư mục migrations

Tên file là đuôi .php. Ví dụ: `create_test_table.php`

        <?php

        return "CREATE TABLE tests(
            id int(11) auto_increment primary key,
            name varchar(255)
        )";


##2. Chạy migrate

Bật terminal hoặc cmd lên. Cd vào thư mục gốc của project. Chạy lệnh sau

        php migrate

##3. Chú ý

Các file đã chạy được lưu trong bảng migrations