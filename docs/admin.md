# Vật Giá Admin

Package chứa code admin

## Install

Lưu ý: Nếu project chưa có thư mục admin tại đường dẫn app/admin thì ta cài đặt package admin như sau:

- Cài đặt package admin qua composer
    
        composer require vatgia/admin
    
- Thêm ```AdminServiceProvider``` vào ```config/app.php```

        'providers' => [
            ...
            \VatGia\Admin\AdminServiceProvider::class,
        ],

- Chạy command để copy thư mục admin
    
        vendor/bin/vnp admin:publish
    
- Sau đó vào admin để chạy composer
    
        cd app/admin
        
        composer install
    
## Upgarde admin code

    vendor/bin/vnp admin:upgrade
    
## Create admin module

Thêm trực tiếp trong file `database/seeds/ModuleSeeder.php`
    
Sau đó ta cd vào thư mục database chạy lệnh
    
    `vendor/bin/phinx seed:run -s ModuleSeeder`
    

##Cách public thư mục admin

### Hệ điều hành Linux - Centos - Ubuntu

    cd public
    ln -s admin ../app/admin
    
### Window

Sử dụng cmd bằng quyền Administrator

    cd public
    mklink /j admin ../app/admin


# Cách viết một module trong Admin

Tạo 1 thư mục trong  `app/admin/modules`
Ví dụ `app/admin/modules/products`

## Cấu trúc một module

Ví dụ tạo một module tên là `products`. Tạo folder `products` trong `app/admin/modules`

    products
    |__inc_security.php: File bắt buộc, chứa một số thông tin của module và các biến dùng chung của module
    |__<views>: Thư mục chứa các file giao diện. `ten_file.blade.php`. Tên file trong thư mục này bắt buộc phần mở rộng phải là `blade.php`
    |__listing.php: Danh sách sản phẩm
    |__add.php: Thêm sản phẩm
    |__edit.php: Sửa sản phẩm
    |__delete.php: Xóa sản phẩm
    |__active.php: Kích hoạt sản phẩm

## inc_security.php

Ví dụ về một file `inc_security.php` đơn giản. Những dòng code ở dưới là bắt buộc phải có trong file `inc_security.php`.

Hãy thay đổi `$module_id` và `$module_name` cho phù hợp với thông tin module của bạn.

    <?
    require_once("../../bootstrap.php");
    require_once("../../resource/security/security.php");
    
    $module_id = 12;
    $module_name = "Cấu hình website";
    
    //Check user login...
    checkLogged();
    
    //Check access module...
    if (checkAccessModule($module_id) != 1) redirect($fs_denypath);
    
    //Declare prameter when insert data
    $fs_table = "settings_website";
    $id_field = "swe_id";
    //$name_field = "swe_name";
    $break_page = "{---break---}";
    $fs_insert_logo = 0;
    $editor_path = '../../resource/ckeditor/';
    $model = App\Models\Setting::class;
    
    $views = [
        dirname(__FILE__) . '/views',
        realpath(dirname(__FILE__) . '/../../resource/views')
    ];
    $cache = ROOT . '/ipstore';
    $blade = new \Philo\Blade\Blade($views, $cache);
    
    ?>

## listing.php

Đây là file sẽ thực thi query lấy dữ liệu sản phẩm từ CSDL và đổ vào file giao diện chứa trong thư mục `views` để hiển thị

Ví dụ:

    <?php

    require 'inc_security.php';

    $page = getValue('page', 'int', 'GET', 1);
    $page_size = 30;

    $products = Product::mustHave(['category'])
        ->where('pro_active', '=', 1)
        ->pagination($page, $pageSize)
        ->all();

    echo $blade->view()->make('listing', [
        'product' => $products
    ] + get_defined_vars())->render();