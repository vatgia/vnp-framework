# Repositories

Đây là những file php chứa toàn bộ các xử lý logic, xử lý liên quan đến thêm, sửa, xóa dữ liệu. Đây được coi là nơi quan trọng nhất của một project

### Khai báo repo

Một thư mục repository sẽ là một tập hợp nhiều file php, mỗi file sẽ có 1 xử lý khác nhau nhưng đều liên quan đến một đối tượng cụ thể. Đối tượng này gọi là `Root Model`.

**Chú ý: Một repo sẽ chỉ liên quan đến một Model cụ thể (Root Model)**

Trong tài liệu này là đối tượng `Product` hay model `Product`

Giả sử muốn một logic để lấy một sản phẩm theo id bạn làm như sau:

- Bước 1: Tạo folder `products` trong thư mục `app/repositories`. ***Trong folder `products` sẽ chứa các file xử lý liên quan đến duy nhất đối tượng Product đang nói tới ( Chú ý điều này )***

- Bước 2: Tạo một file `app/repositories/products/get_by_id.php`. Tên file đặt làm sao cho dễ nhớ nhất có thể. Tất cả các file trong `repositories` đều tồn tại 1 biến `$input` là một array chứa các tham số đầu vào. Trong trường hợp này là `id`.

`app/repositories/products/get_by_id.php`

    $productId = (int) $input['id];
    $product = Product::where('id = '. $productId)->select();

    // Bắt buộc phải return ra một mảng có key là vars chứa tất cả dữ liệu mà bạn muốn trả về. Trong trường hợp này tôi muốn trả về  biến $product

    return [
      'vars' => $product
    ];

- Bước 3: Tạo file `config.php` trong `app/repositories/products` để đăng ký file `get_by_id` với hệ thống, và có nội dung như sau

`app/repositories/products/config.php`

    return [
      'products/get_by_id' => [
        'title' => 'Lấy chi tiết một sản phẩm theo ID'
      ]
    ];

### Sử dụng repo

    // Sử dụng hàm `model` để lấy dữ liệu từ repo
    $data = model('products/get_by_id')->load(['id' => 10]);

    $product = $data['vars'];