# Upload

## Code mẫu

    $upload = new upload('cat_icon', $fs_filepath, $fs_extension, $fs_filesize);
    if ($upload->common_error == '') {
        $file_name = $upload->file_name;
    } else {
        FlashMessage::error($upload->common_error);
    }

## Resize ảnh


    $upload->resize_image(ROOT . '/public/upload/news/', $upload->file_name, 1000, 1000, 99, '');