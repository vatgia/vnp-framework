# Full document [Gump](https://github.com/Wixel/GUMP)

Ở framework này. Chủ yếu ta sẽ validate input tại file config của repository

Ví dụ:

    'inbox/detail' => [
        'title' => 'Chi tiết cuộc chat',
        'input' => [
            'user_id' => [
                'title' => 'User id',
                'rule' => 'required|integer' //Bắt buộc truyền và phải là số nguyên
            ],
            'classified_id' => [
                'title' => 'id tin đăng',
                'rule' => 'required|integer' //Bắt buộc truyền và phải là số nguyên
            ],
            'append_mes' => [
                'title' => 'Lấy các tin mới gửi',
                'rule' => 'integer', //Không bắt buộc truyền nhưng phải là số nguyên
                'default' => 0 //Giá trị mặc định
            ],
        ]
    ]
    

Hoặc ta có thể validate tại controller bằng cách như sau

    $gump = new GUMP();

    // set validation rules
    $gump->validation_rules([
        'username'    => 'required|alpha_numeric|max_len,100|min_len,6',
        'password'    => 'required|max_len,100|min_len,6',
        'email'       => 'required|valid_email',
        'gender'      => 'required|exact_len,1|contains,m;f',
        'credit_card' => 'required|valid_cc'
    ]);
    
    // set field-rule specific error messages
    $gump->set_fields_error_messages([
        'username'      => ['required' => 'Tên đăng nhập là bắt buộc'],
        'email'         => ['valid_email' => 'Email không đúng định dạng']
    ]);
 
    $valid_data = $gump->run($_POST);
    
    if ($gump->errors()) {
        var_dump($gump->get_readable_errors()); // ['Field <span class="gump-field">Somefield</span> is required.'] 
        // or
        var_dump($gump->get_errors_array()); // ['field' => 'Field Somefield is required']
    } else {
        var_dump($valid_data);
    }