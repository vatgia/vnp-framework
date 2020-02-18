## Database Migrations

[Full Document](http://docs.phinx.org/en/latest/intro.html)

### Lưu ý khi sử dụng: 

- Folder database là 1 repository riêng. 
- Trước khi push code. Nếu có sự thay đổi về database cần phải push trong thư mục datanbase trước

### 1 số thao tác cơ bản

- Tạo 1 thay đổi mới: ```vendor/bin/phinx create AddColumnCommissionMoneyTableOrders```
- Chạy migrate: ```vendor/bin/phinx migrate```
- Rollback: ```vendor/bin/phinx rollback```