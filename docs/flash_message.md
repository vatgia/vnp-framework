# Flash Message

Đây là một tính năng rất hữu ích khi bạn muốn tạo một session tồn tại trong 1 phiên làm việc ngắn. Khi reload trang `flash message` sẽ biến mất.

`flash_message` được lưu trữ trong `$_SESSION['flash_message']` dưới dạng mảng.

Flash message thường được sử dụng trong công việc validate form.

## Cú pháp

    // Set flash message
    flash_message($key, $value)

    // Get flash message
    flash_message($key)

## Ví dụ

    // Cài đặt flash message
    flash_message('name_err', 'Vui lòng nhập tên');

    flash_message('age_err', 'Vui lòng nhập tuổi');

    flash_message('errors', [
      'name' => ['Vui lòng nhập tên'],
      'age' => [
        'Vui lòng nhập tuổi',
        'Tuổỉ phải là một số'
      ]
    ]);

    // Lấy ra flash message theo key
    flash_message('name_err'); // Return 'Vui lòng nhập tên'

    flash_message('age_err'); // Return 'Vui lòng nhập tuổi'


