Command:

VNP Framework - 2017

## Bắt đầu 1 project

Tạo 1 folder với tên tương ứng với project mà bạn muốn. Bật cửa sổ cmd hoặc terminal. Cd vào project đó, chạy những lệnh bên dưới

    git init

    git submodule add ssh://git@gitlab.hoidap.vn:vnp-framework/app.git app` hoặc `git submodule add http://gitlab.hoidap.vn/vnp-framework/app.git app

    git submodule add ssh://git@gitlab.hoidap.vn:2012/vatgia-core-v2/libraries.git libraries` hoặc `git submodule add http://gitlab.hoidap.vn/vatgia-core-v2/libraries.git libraries

    git remote add origin ssh://git@gitlab.hoidap.vn:vnp-framework/view.git` hoặc `git remote add origin http://gitlab.hoidap.vn/vnp-framework/view.git

    git pull origin master

    cd app

    git pull origin master

    cd libraries

    git pull origin master

    composer install

**_Nếu trên môi trường production thì chạy_**


    composer install --no-dev

### Cấu trúc thư mục

```
- app
    - Models
    - Repositories
    - migration
    - ....
- appview
    - Controllers
    - Views
    - Helpers
    - ...
- libraries
- config
    - app.php
    - baokim.php
    - ....
- public
    - .htaccess
    - pages
    - js
    - css
- ipstore
- ipdberror
- vendor
- .env
- .env.api
- .env.example
- .env.api.example
```

## Migrations

1. Tạo migration

Bật cửa sổ cmd trong project hiện tại gõ lệnh sau:

        php migrate make:message

Trong đó: `message` là mô tả về đoạn sql bạn muốn chạy ví dụ:

        // Tạo bảng user
        php migrate make:create_user_table

Câu lệnh trên sẽ tạo 1 file dạng `Ymd_xyz` với `Ymd` là thời gian tạo file, `xyz` là tên file. File tạo ra là 1 file `.php` sẽ return ra câu lệnh sql với cú pháp sau:

        <?php

            return "câu_lệnh_sql";

2. Run migration

Chạy lệnh `php migrate` để bắt đầu chạy những file php chứa câu truy vấn, nếu file nào chưa được chạy thì sẽ chạy, file nào chạy rồi sẽ bỏ qua. Tên file sẽ được lưu vào bảng `migrations` để tránh chạy lại file đó.


## Hướng dẫn cho dev view

Gọi tắt dev view là `DV`. Một `DV` sẽ được quyền thao tác ở `Controller`, `View`, tất cả các file ở thư mục `public`.

Để lấy dữ liệu mong muốn, `DV` viết code trong `Controller` gọi đến `Model` để lấy dữ liệu, `Model` sẽ trả ra dữ liệu dạng mảng, `DV` dump mảng đó ra để hiểu rõ thông tin mình cần ( Sẽ có document mô tả về từng model và trường dữ liệu )

Ví dụ về việc thao tác với `Model` trong `Controller`

`HomeController`:

        public function renderHtml() {
            $params = [];
            $data = model()->loadModel($params, 'product/get_list_home_page');
            var_dump($data);
        }

Kết quả model trả về sẽ có dạng 1 mảng như sau:

        array(
            'vars' => array(
                // Some thing
            )
        );

Sau khi nhận data từ model chúng ta tiến hành đổ dữ liệu ra view bằng phương thức `renderView` như sau:

        public function renderHtml() {
            $params = [];
            $data = model()->loadModel($params, 'product/get_list_home_page');
            return view()->render('home/index', $data);
        }

Dữ liệu truyền qua `view` bắt buộc phải là dạng mảng, cấu trúc mảng tương tự như dữ liệu từ model trả về.

Muốn chia sẻ data với các view khác sử dụng hàm `share()` như sau:


        $dataShare = [
            'index' => 'value'
        ];
        view()->share($dataShare);

Sử dụng data trong file `layout` như sau:
Với data có dạng:

        $data = [
            'vars' => [
                'items' => [],
                'pagination' => []
            ]
        ];

Ta sẽ có biến `items` và `pagination` ở layout