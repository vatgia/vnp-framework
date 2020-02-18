# Validator

  Validate dữ liệu đầu vào, hỗ trợ custom thông báo lỗi

# Cài đặt

    composer require blackbear/validation

# Namespace

		use BlackBear\Validation\Validator;

# Ví dụ

		use BlackBear\Validation\Validator;

    $data = [
			'age' => 20,
			'email' => 'cong.itsoft@gmail.com'
		];
		$rules = [
			'age' => 'required',
			'email' => 'email|required'
		];
		$messages = [
			'age.required' => 'Please fill age',
			'email.email' => 'Please fill email'
		];

		$validator = new Validator($data, $rules, $messages);

    if ($validator->passes()) {
      echo 'Validate successful';
    } else {
      echo 'Validate fails'
    }

# Lấy thông báo lỗi

  Thông báo lỗi sẽ được lưu trữ dưới dạng 1 mảng

    $errors = $validator->getErrors();

# Add custom rule

		$validator = new Validator();

    // Thêm rule tên là bigger
		$validator->addExtension('bigger', function($attribue, $value) {
			return $value > $attribue[0];
		});

    // Sử dụng
    $data = [
			'age' => 20,
			'email' => 'cong.itsoft@gmail.com'
		];
		$rules = [
			'age' => 'required|bigger:18',
			'email' => 'email|required'
		];
		$messages = [
			'age.required' => 'Please fill age',
			'email.email' => 'Please fill email'
		];

    $validator->setData($data)
				    ->setRules($rules)
		        ->setMessages($messages);

    if ($validator->passes()) {
      echo 'Validate successful';
    } else {
      echo 'Validate fails'
    }

# Public method

`setData(array $data)`: Thêm data muốn validate

`setRules(array $rules)`: Cấu hình rule validate cho data

`setMessages(array $messages)`: Cấu hình thông báo lỗi

`passes()`: Kiểm tra data đã được validate thành công

`fails()`: Kiểm tra data đã được validate không thành công

# Default rules

`required`

`email`

`exception`

`ip`

`min`: min:20

`max`: max:20

`in_array`: in_array:1,2,3

`not_in_array`: not_in_array:1,2,3

`between`: between:10,100

`regexp`: regexp:/^([\d]+)$/

`url`

`int`

`float`

`double`

`boolean`

`nullable`

`equals`: equals:8

