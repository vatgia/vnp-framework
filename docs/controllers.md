# Controllers

### Tạo Controller

Tất cả controller được tạo trong `appview/Controllers`

    <?php

    namespace AppView\Controllers;

    use VatGia\ControllerBase;

    class PostController extends ControllerBase
    {
    
        public function detail($id)
        {
            $post = $this->postRepository->detail($id);
            
            return view('post_detail')->render(compact('post'));
        }

    }
    

Có thể tạo route như sau để trỏ về Controller trên như sau

    Route::get(['/posts/{id}', 'post_detail'], [AppView\Controllers\PostController::class, 'detail']);


`Controller` chỉ có nhiệm vụ 

- nhận request 
- gọi các repository xử lý tương ứng 
- trả về view tương ứng 

Tuyệt đối không được xử lý logic tại `Controller`