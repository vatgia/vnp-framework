# Repositories

Đây là những file php chứa toàn bộ các xử lý logic, xử lý liên quan đến thêm, sửa, xóa dữ liệu. Đây được coi là nơi quan trọng nhất của một project

### Khai báo repo

Một thư mục repository sẽ là một tập hợp nhiều file php, mỗi file sẽ có 1 logic xử lý khác nhau nhưng đều liên quan đến một công việc cụ thể.


Giả sử ta có một repository lấy thông tin sản phẩm theo id bạn làm như sau:

- Bước 1: Tạo folder `products` trong thư mục `app/Repositories`. ***Trong folder `products` sẽ chứa các file xử lý liên quan đến duy nhất đối tượng Product đang nói tới ( Chú ý điều này )***

- Bước 2: Tạo một file `app/Repositories/products/get_by_id.php`. Tên file đặt làm sao cho dễ nhớ nhất có thể. Tất cả các file trong `repositories` đều tồn tại 1 biến `$input` là một array chứa các tham số đầu vào. Trong trường hợp này là `id`.

`app/repositories/products/get_by_id.php`
    
    $vars = null;
    $product_id = (int) input('id');
    //Hoặc
    $product_id = (int) ($input['id'] ?? 0);
    
    $product = Product::findById($product_id);

    // Bắt buộc phải return ra một mảng có key là vars chứa tất cả dữ liệu mà bạn muốn trả về.
    if($product)
    {
        $vars = transformer_item($product, new App/Transformers/ProductTranssformer, ['images', 'category']);
    }
    

    return [
      'vars' => $vars
      
    ];

- Bước 3: Tạo file `config.php` trong `app/Repositories/products` để đăng ký file `get_by_id` với hệ thống, và có nội dung như sau

`app/Repositories/products/config.php`

    return [
      'products/get_by_id' => [
        'title' => 'Lấy chi tiết một sản phẩm theo ID',
        'input' => [
            'title' => 'ID sản phẩm cần lấy',
            'rule' => 'required|integer'
        ]
      ]
    ];

### Sử dụng repo

    // Sử dụng hàm `repository` để lấy dữ liệu từ repo
    $response = repository('products/get_by_id')->get(['id' => 10]);
    
    if($response['vars'])
    {
        $product = collect($data['vars']);        
    }else{
        throw new \RuntimeException('Sản phẩm không tồn tại', 404);
    }
