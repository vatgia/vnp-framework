# Luồng đi của Request

-> Request 

-> public/index.php 

-> Create Application (Đọc thêm bên dưới)

-> Dispatch Routes 

-> Call Controllers 

-> Get data from Repositories 

-> Render Views 

-> Response

### Create Application

Nắm được các bước khởi tạo framework thì ta sẽ biết được thứ tự các thành phần được load . 
Từ đó sử dụng 1 cách hợp lý.

Ví dụ: ```Config``` được load trước ```Translation```. Vì vậy ta không thể sử dụng ```Translation``` trong các file ```config```.

Quá trình khởi tạo hệ thống bao gồm các bước như sau:
- Load Env: Load các biến môi trường từ file ```.env```
- Register Core Service Providers: Đăng ký các services cần thiết để khởi tạo hệ thống
    - Debug
    - Config
    - Route
- Register App Service Providers: Đăng ký các service trong file ```config/app.php```
    
    
        \AppView\AppViewServiceProvider::class,
        \VatGia\Admin\AdminServiceProvider::class,
        \VatGia\Cache\CacheServiceProvider::class,
        \VatGia\Api\ApiServiceProvider::class,
        \VatGia\Queue\QueueServiceProvider::class,
        \VatGia\Helpers\Translation\TranslationServiceProvider::class
        
    Thứ tự load từ trên xuống dưới.
    Ta có thể đăng ký thêm những service tự định nghĩa. [Đọc thêm](service_provider.md).
    
    
- Boot Core Service Providers: Các thành phần khởi tạo hệ thống
    - Model
    - View
- Boot App Service Providers: Các thành phần khởi tạo đăng ký trong file ```config/app.php```



**Mọi Request cần phải đến `public/index.php` vì vậy khi cấu hình Xampp cần phải tạo VirtualHost cần phải trỏ DocumentRoot đến `public/index.php`**