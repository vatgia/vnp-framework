### Các bước sử dụng migration

- Chạy composer để lấy các package: ```composer install```
- Tạo migration: ```vendor/bin/phinx create NewChange```
- Chạy migrate: ```vendor/bin/phinx migrate```
- Rollback migrate: ```vendor/bin/phinx rollback```

### Tham khảo: http://docs.phinx.org/en/latest/commands.html#the-breakpoint-command

***Lưu ý: Trước khi push code lên thật. Cần pull repo database về để check xem có thay đổi database hay không. Nếu có phải pull repo database trước rồi chạy migrate để tránh lỗi***