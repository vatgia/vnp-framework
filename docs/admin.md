# Vật Giá Admin

Package chứa code admin

## Install

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

    vendor/bin/vnp admin:module directory "Module name"
    
Sau khi sử dụng command để tạo module.
- Vào Cấu hình module, lấy module id để thay thế vào file inc_security.php
- Sửa lại những tham số cần thiết

# Cách viết một module trong Admin

Code Module sẽ được lưu trữ trong `app/admin/modules`

## Bước 1: Đăng ký module

Vào đường dẫn sau để thêm mới một module: `http://localhost:3344/admin/resource/configadmin/configmodule.php`. Nhớ thay đổi đường dẫn cho phù hợp với cấu hình virtualhost của bạn.

![anh_hd_tao_module](https://image.prntscr.com/image/A-foHN2hTwyBPh_nWoaQjw.png)

## Bước 2: Viết code

### Cấu trúc một module

Ví dụ tạo một module tên là `products`. Tạo folder `products` trong `app/admin/modules`

    products
    |__inc_security.php: File bắt buộc, chứa một số thông tin của module và các biến dùng chung của module
    |__<views>: Thư mục chứa các file giao diện. `ten_file.blade.php`. Tên file trong thư mục này bắt buộc phần mở rộng phải là `blade.php`
    |__index.php: Danh sách sản phẩm
    |__add.php: Thêm sản phẩm
    |__edit.php: Sửa sản phẩm
    |__delete.php: Xóa sản phẩm
    |__active.php: Kích hoạt sản phẩm

### inc_security.php

Ví dụ về một file `inc_security.php` đơn giản. Những dòng code ở dưới là bắt buộc phải có trong file `inc_security.php`.

Hãy thay đổi `$module_id` và `$module_name` cho phù hợp với thông tin module của bạn.

    <?php
    require_once("../../bootstrap.php");
    require_once("../../resource/security/security.php");

    $module_id  = 66;
    $module_name= "Product";

    //Check user login...
    checkLogged();

    //Check access module...
    if(checkAccessModule($module_id) != 1) redirect($fs_denypath);

    // Template engine
    $template = new TemplateEngine(
      __DIR__ . '/templates'
    );

### index.php

Đây là file sẽ thực thi query lấy dữ liệu sản phẩm từ CSDL và đổ vào file giao diện chứa trong thư mục `templates` để hiển thị

Ví dụ:

    <?php

    require 'inc_security.php';

    $page = getValue('page', 'int', 'GET', 1);
    $pageSize = 30;

    $products = Product::join('categories_multi', 'pro_category_id = cat_id')
        ->where(1)
        ->pagination($page, $pageSize);

    echo $blade->view()->make('listing', [
        'product' => $products
    ] + get_defined_vars())->render();