# Cấu trúc thư mục

### app
- `app`: Chứa toàn bộ `Models`, `Repositories` đây là trái tim của một project

- `app/Models`: Chứa các model là đại diện cho các bảng trong CSDL. [Đọc thêm](models.md)

- `app/Repositories`: Chứa các xử lý logic.
[Đọc thêm](repositories.md)

- `app/Transformers`: Chứa các class Format dữ liệu.
[Đọc thêm](transformers.md)

- `app/admin`: Chứa code của phần Admin

- `appview`: Chứa `Controllers`, `helpers`, `routes`

### appview
- `appview/routes`: Đây là nơi tiếp nhận và phân tích Request sau đó triệu gọi `Controllers`.
[Đọc thêm](routes.md)

- `appview/Controllers`: Chứa các controllers là nơi tiếp nhận Request và trả về Response tương ứng. [Đọc thêm](controllers.md)

- `appview/helpers`: Chứa các functions cần thiết khi dev `Controllers` và `views`

### database
- `database` chứa migrations của dự án
[Đọc thêm](database.md)


### public
- `public`: Chứa `index.php`, các file static `css`, `js`, `images`, `robots.txt`...

- `public/index.php`: Đón nhận mọi Request, khởi tạo Application và triệu gọi `routes` để phân tích Request

### views
- `resources\views`: Chứa các file giao diện, có cấu trúc `*.html.php`