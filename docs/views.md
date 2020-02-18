# Views

Tất cả views được tạo trong `resources\views` với định dạng `[file_name].html.php`

### Ví dụ

`resources/views/test.html.php`

    <h1> This is H1 </h1>
    <p><?php echo $name ?></p>

### Sử dụng view

    view($viewName)->render($data)

    view('test')->render(['name' => 'Ali'])

- `$viewName` là đường dẫn của view tính từ `resources/views`

- `$data` là mảng dữ liệu với key sẽ là biến ở trong view

### Share các biến dùng chung cho view

    view()->share('variable_name', 'variable_value')
    
    view()->share('logo_img', 'http://vnp-framework.dev/assets/images/logo.png');
    
### Thêm view từ 1 thư mục khác.

    view()->addNamespace('namespace', 'view/path');
    
    view()->addNamespace('Admin', ''app/admin/views);
    
    view('Admin::test')->render();