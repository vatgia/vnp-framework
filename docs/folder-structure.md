# Cấu trúc thư mục

### app:

Nơi chứa tất cả logic xử lý của hệ thống. Logic sẽ chỉ được xử lý trong thư mục `app` này.

- `app/Models`: Chứa các model là đại diện cho các bảng trong CSDL. [Đọc thêm](models.md)
- `app/Repositories`: Chứa các xử lý logic.
[Đọc thêm](repositories.md)
- `app/Transformers`: Chứa các class Format dữ liệu.
[Đọc thêm](transformers.md)
- `app/admin`: Chứa code của phần Admin


### appview

- `appview/Commands`: Chứa các lệnh tùy chính của hệ thống 
- `appview/Controllers`: Chứa các controllers là nơi tiếp nhận Request và trả về Response tương ứng. [Đọc thêm](controllers.md)
- `appview/Helpers`: Chứa các functions hoặc class helper cần thiết khi dev `Controllers` và `views`
- `appview/Middlewares`: Chứa các route fillter 
- `appview/Repository`: Chứa các class thao tác với Repositories trong thư mục app
- `appview/routes`: Đây là nơi tiếp nhận và phân tích Request sau đó gọi `Controllers` tương ứng. [Đọc thêm](routes.md)
- `appview/AppViewServiceProvider.php`: File đăng ký 1 số thứ cần thiết để chạy hệ thống như route, filter, command

### database
- `database` chứa migrations của dự án
[Đọc thêm](database.md)

### public

Thư mục được public ra internet. DocumentRoot của website cần phải được trỏ về thư mục này

- `public/index.php`: Nơi bắt đầu của mọi request
- `public/assets`: Chứa các file tĩnh như css, js, images
- `public/upload`: Các file upload cần được upload vào thư mục này


### resource
- `resources/views`: Chứa các file giao diện, có cấu trúc `*.html.php`
- `resource/lang`: Chứa các file ngôn ngữ (vn / en / ....)