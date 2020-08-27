# Flash Message

Đây là một tính năng rất hữu ích khi bạn muốn tạo một session tồn tại trong 1 phiên làm việc ngắn. Khi reload trang `flash messages` sẽ biến mất.

`flash_messages` được lưu trữ trong `$_SESSION['flash_messages']` dưới dạng mảng.

Flash message thường được sử dụng trong công việc validate form.

## Cú pháp

    // Set flash message
    VatGia\Helpers\Facade\FlashMessage::success('Thành công', url_back());
    VatGia\Helpers\Facade\FlashMessage::error('Thất bại', url_back());




