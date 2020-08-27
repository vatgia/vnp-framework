<?

/*
class upload
Developed by FinalStyle.com
*/

class upload
{

    /*
    Upload Function
    $upload_name		: Ten textbox upload vi du : new_picture
    $upload_path		: duong dan save file upload vi du : "../news_data/"
    $extension_list	: danh sach cac duoi mo rong duoc phep upload vi du : gif,jpg
    $limt_size			: dung luong gioi han (tinh bang Kbyte) vi du : 200 (KB)
    $check_image		: co kiem tra kieu image khi up load khong
    */
    var $common_error = "";
    var $warning_error = "";
    var $file_name = "";
    var $file_name_multi = array();
    var $file_size = 0;
    var $original_name = "";

    function __construct($upload_name, $upload_path, $extension_list, $limit_size, $check_image = 0, $prefix = "", $zip = 0)
    {

        // Nếu $upload_name == "" thì return luôn để phục vụ resize image
        if ($upload_name == "")
            return;
        if (is_array($_FILES[$upload_name]['name'])) {
            $this->upload_multi($upload_name, $upload_path, $extension_list, $limit_size, $check_image, $prefix, $zip);
            return;
        }
        //Validate upload file
        if (@!is_uploaded_file($_FILES[$upload_name]['tmp_name'])) {
            $this->common_error = "&bull; Không tìm thấy file tmp_name, file upload tạm (Có thể do file upload lớn hơn 2MB hoặc sai tên control upload file khi submit).<br>";
            return;
        }
        //Check file_size
        if (filesize($_FILES[$upload_name]['tmp_name']) > $limit_size * 1024) {
            $this->common_error = "&bull; Dung lượng file lớn hơn giới hạn cho phép: " . number_format($limit_size, 0, ".", ",") . " KB.<br />";
            $this->warning_error = $this->common_error;
            return;
        }
        //Check upload extension
        if ($this->checkExtension($_FILES[$upload_name]['name'], $extension_list) != 1) {
            $this->common_error = "&bull; Phần mở rộng của file không đúng, bạn chỉ upload được những file có phần mở rộng là: " . strtoupper($extension_list) . "<br />";
            $this->warning_error = $this->common_error;
            return;
        }

        //Check image type
        $check_name = false;
        if ($check_image != 0) {
            $check_name = $this->checkImageType($_FILES[$upload_name]['tmp_name'], $_FILES[$upload_name]['name']);
            if ($check_name === false) {
                $this->common_error = "&bull; Định dạng ảnh không đúng!.<br />";
                $this->warning_error = $this->common_error;
                return;
            }
        }

        //Generate new filename
        if ($check_name) {
            $name = explode(".", $_FILES[$upload_name]['name']);
            unset($name[count($name) - 2]);
            $check_name = implode(".", $name) . '.' . $check_name;
        } else {
            $check_name = $_FILES[$upload_name]['name'];
        }
        $new_filename = $this->generate_name($check_name, $prefix);

        $this->original_name = $check_name;
        $this->file_name = $new_filename;
        $this->file_size = @filesize($_FILES[$upload_name]['tmp_name']);

        //move upload file
        //@move_uploaded_file($_FILES[$upload_name]['tmp_name'],$upload_path . $new_filename);

        if ($zip == 1) {
            $zip = new ZipArchive();
            $zip_filename = substr($new_filename, 0, (strrpos($new_filename, "."))) . ".zip";
            if ($zip->open($upload_path . $zip_filename, ZIPARCHIVE::CREATE) !== TRUE) {
                exit("cannot open <$zip_filename>\n");
            }
            $zip->addFile($_FILES[$upload_name]['tmp_name'], $new_filename);
            $zip->close();
            $new_filename = $zip_filename;
            $this->file_name = $zip_filename;
        } else @move_uploaded_file($_FILES[$upload_name]['tmp_name'], $upload_path . $new_filename);

        //Check upload file path
        if ($this->check_path($upload_path, $new_filename) != 1) {
            $this->common_error = "&bull; Sai đường dẫn khi upload file.<br />";
            $this->warning_error = $this->common_error;
            return;
        }


    }

    function upload_multi($upload_name, $upload_path, $extension_list, $limit_size, $check_image = 0, $prefix = "", $zip = 0)
    {

        // Nếu $upload_name == "" thì return luôn để phục vụ resize image
        if ($upload_name == "") return;
        //Validate upload file9
        for ($i = 0; $i <= (count($_FILES[$upload_name]['tmp_name']) - 1); $i++) {

            if (@!is_uploaded_file($_FILES[$upload_name]['tmp_name'][$i])) {
                $this->common_error = "Không tìm thấy file tmp_name, file upload tạm (Có thể do file upload lớn hơn 2MB hoặc sai tên control upload file khi submit)";
                return;
            }
            //Check file_size
            if (filesize($_FILES[$upload_name]['tmp_name'][$i]) > $limit_size * 1024) {
                $this->common_error = "Dung lượng file lớn hơn giới hạn cho phép " . number_format($limit_size, 0, ".", ",") . " KB";
                $this->warning_error = $this->common_error;
                return;
            }
            //Check upload extension
            if ($this->checkExtension($_FILES[$upload_name]['name'][$i], $extension_list) != 1) {
                $this->common_error = "Phần mở rộng của file không đúng, bạn chỉ upload được những file có phần mở rộng là " . strtoupper($extension_list);
                $this->warning_error = $this->common_error;
                return;
            }
            //Generate new filename
            $new_filename = $this->generate_name($_FILES[$upload_name]['name'][$i], $prefix);

            $this->original_name = $_FILES[$upload_name]['name'][$i];
            $this->file_name_multi[$i] = $new_filename;
            $this->file_size = @filesize($_FILES[$upload_name]['tmp_name'][$i]);

            //move upload file
            //@move_uploaded_file($_FILES[$upload_name]['tmp_name'],$upload_path . $new_filename);

            if ($zip == 1) {
                $zip = new ZipArchive();
                $zip_filename = substr($new_filename, 0, (strrpos($new_filename, "."))) . ".zip";
                if ($zip->open($upload_path . $zip_filename, ZIPARCHIVE::CREATE) !== TRUE) {
                    exit("cannot open <$zip_filename>\n");
                }
                $zip->addFile($_FILES[$upload_name]['tmp_name'][$i], $new_filename);
                $zip->close();
                $new_filename = $zip_filename;
                $this->file_name_multi[$i] = $zip_filename;
            } else @move_uploaded_file($_FILES[$upload_name]['tmp_name'][$i], $upload_path . $new_filename);
            //Check upload file path
            if ($this->check_path($upload_path, $new_filename) != 1) {
                $this->common_error = "Sai đường dẫn khi upload file";
                $this->warning_error = $this->common_error;
                return;
            }
            //Check image type
            if (($check_image != 0) && ($this->getExtension($this->file_name_multi[$i]) != "swf")) {
                if ($this->check_image($upload_path, $new_filename) != 1) {
                    $this->common_error = "Ảnh upload có phần mở rộng không phù hợp (Ví dụ: Ảnh GIF nhưng có phần mở rộng JPG)";
                    $this->warning_error = $this->common_error;
                    return;
                }
            }
        }
    }


    /*
    Show error for coder
    */
    function show_common_error()
    {
        return $this->common_error;
    }

    /*
    Show error for customer
    */
    function show_warning_error()
    {
        return $this->warning_error;
    }

    /*
    Get extension of file
    */
    function getExtension($filename)
    {
        $sExtension = substr($filename, (strrpos($filename, ".") + 1));
        $sExtension = strtolower($sExtension);
        return $sExtension;
    }

    /*
    Check extension file
    */
    function checkExtension($filename, $allowList)
    {
        $sExtension = $this->getExtension($filename);
        $allowArray = explode(",", $allowList);
        $allowPass = 0;
        for ($i = 0; $i < count($allowArray); $i++) {
            if ($sExtension == trim($allowArray[$i])) $allowPass = 1;
        }
        return $allowPass;
    }

    /*
    Check upload file path
    */
    function check_path($path, $filename)
    {
        if (@filesize($path . $filename) == 0) {
            @unlink($path . $filename);
            return 0;
        } else return 1;
    }

    /*
    Check image file type
    */
    function check_image($path, $filename)
    {
        $sExtension = $this->getExtension($filename);
        //Check image file type extensiton
        $checkImg = true;
        switch ($sExtension) {
            case "gif":
                $checkImg = @imagecreatefromgif($path . $filename);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                $checkImg = @imagecreatefromjpeg($path . $filename);
                break;
            case "png":
                $checkImg = @imagecreatefrompng($path . $filename);
                break;
        }
        if (!$checkImg) {
            $this->delete_file($path, $filename);
            return 0;
        }
        return 1;
    }

    /* Check Image Type */
    function checkImageType($filename, $file_ext)
    {
        $sExtension = $this->getExtension($file_ext);
        //Check image file type extensiton
        $info = getimagesize($filename);
        $mime = isset($info['mime']) ? $info['mime'] : '';
        switch ($mime) {
            case "image/jpeg":
                return "jpg";
                break;
            case "image/png":
                return "png";
                break;
            case "image/gif":
                return "gif";
                break;
            default  :
                return false;
                break;
        }
    }

    /*
    Generate file name
    */
    function generate_name($filename, $prefix = "")
    {
        $name = "";
        for ($i = 0; $i < 3; $i++) {
            $name .= chr(rand(97, 122));
        }
        $today = getdate();
        if ($prefix == "") $name .= $today[0];
        else $name = $prefix . $name . $today[0];
        $ext = substr($filename, (strrpos($filename, ".") + 1));
        return $name . "." . $ext;
    }

    function check_image_file_size($path, $filename, $maxSize)
    {
        $filesize = @filesize($path . $filename);
        if ($filesize > $maxSize * 1024) return 0;
        else return 1;
    }

    function check_image_size($path, $filename, $widthCheck, $heightCheck, $type = 0)
    {
        //Get new dimensions
        list($width, $height) = @getimagesize($path . $filename);
        if ($type == 0) {
            if ($width <= $widthCheck && $height <= $heightCheck) return 1;
        } else {
            if ($width >= $widthCheck && $height >= $heightCheck) return 1;
        }
        return 0;
    }

    /*
    Resize image 2: tự động resize theo tỉ lệ (140x100, 140x140, 140x180)
    */
    function resize_image_2($path, $filename, $arrWidth, $arrHeight, $ratio, $quality, $type = "small_", $new_path = "")
    {
        //Get new dimensions
        list($width, $height) = getimagesize($path . $filename);
        $new_width = $arrWidth[1];
        $new_height = $arrHeight[1];
        if ($width != 0 && $height != 0) {
            $percentWidth = intval(($width / $height) * 100);
            $percentHeight = intval(($height / $width) * 100);
            if (($percentWidth - $percentHeight) >= $ratio) {
                $new_width = $arrWidth[0];
                $new_height = $arrHeight[0];
            } elseif (($percentHeight - $percentWidth) >= $ratio) {
                $new_width = $arrWidth[2];
                $new_height = $arrHeight[2];
            }
        }
        $this->resize_image($path, $filename, $new_width, $new_height, $quality, $type, $new_path);
    }

    /*
    Resize image
    */
    function resize_image($path, $filename, $maxwidth, $maxheight, $quality, $type = "small_", $new_path = "")
    {
        $sExtension = $this->getExtension($filename);
        //Load library extensiton in php.ini
        if (!extension_loaded("gd")) {
            if (strtoupper(substr(PHP_OS, 0, 3) == "WIN")) dl("php_gd2.dll");
            else dl("gd2.so");
        }
        //Get new dimensions
        list($width, $height) = getimagesize($path . $filename);
        if ($width != 0 && $height != 0) {
            if ($maxwidth / $width > $maxheight / $height) $percent = $maxheight / $height;
            else $percent = $maxwidth / $width;
        }
        $new_width = $width * $percent;
        $new_height = $height * $percent;
        //Resample
        $image_p = imagecreatetruecolor($new_width, $new_height);
        //Check extension file for create new image

        switch ($sExtension) {
            case "gif":
                $image = imagecreatefromgif($path . $filename);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                $image = imagecreatefromjpeg($path . $filename);
                break;
            case "png":
                $image = imagecreatefrompng($path . $filename);
                break;
        }
        //Copy and resize part of an image with resampling
        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
        // Output
        // check new_path, nếu new_path tồn tại sẽ save ra đó, thay path = new_path
        if ($new_path != "") $path = $new_path;

        switch ($sExtension) {
            case "gif":
                imagegif($image_p, $path . $type . $filename);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                imagejpeg($image_p, $path . $type . $filename, $quality);
                break;
            case "png":
                imagepng($image_p, $path . $type . $filename);
                break;
        }
        imagedestroy($image_p);
    }

    /**
     * Function create image
     */
    function create_image($path, $filename)
    {
        $sExtension = $this->getExtension($filename);
        //Check image file type extensiton
        $image = false;
        switch ($sExtension) {
            case "gif":
                $image = @imagecreatefromgif($path . $filename);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                $image = @imagecreatefromjpeg($path . $filename);
                break;
            case "png":
                $image = @imagecreatefrompng($path . $filename);
                break;
        }
        if (!$image) {
            $this->delete_file($path, $filename);
        }
        return $image;
    }

    /**
     * Function output_image
     */
    function output_image($image_source, $path, $filename, $quality)
    {
        $sExtension = $this->getExtension($filename);
        switch ($sExtension) {
            case "gif":
                imagegif($image_source, $path . $filename, $quality);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                imagejpeg($image_source, $path . $filename, $quality);
                break;
            case "png":
                imagepng($image_source, $path . $filename, $quality);
                break;
        }
    }

    /*
    Function tạo ảnh logo cty trên ảnh sản phẩm
    */
    function image_overlap($path, $filename, $foreground_path, $quality = 97)
    {

        // Nếu tồn tại foreground thì mới overlap
        if (file_exists($foreground_path)) {

            $background = $this->create_image($path, $filename);
            if (!$background) return;

            // Chèn ảnh overlap vào
            $foreground = imagecreatefrompng($foreground_path);
            $insertWidth = imagesx($foreground);
            $insertHeight = imagesy($foreground);
            $imageWidth = imagesx($background);
            $imageHeight = imagesy($background);
            $overlapX = 0;
            $overlapY = 0;

            imagecolortransparent($foreground, imagecolorat($foreground, 0, 0));
            imagecopy($background, $foreground, $overlapX, $overlapY, 0, 0, $insertWidth, $insertHeight);

            $this->output_image($background, $path, $filename, $quality);

            // Hủy biến để giải phóng bộ nhớ
            unset($background);
            unset($foreground);

        }
    }

    /*
    Delete file
    */
    function delete_file($path, $filename)
    {
        $arrPrefix = array("small50_", "small_", "normal_", "medium_", "");
        foreach ($arrPrefix as $value) {
            if (file_exists($path . $value . $filename)) @unlink($path . $value . $filename);
        }
    }

}

?>
<?

class createImageAndLogo
{
    var $img_logo = '';
    var $img_pic = '';

    var $dpx = 5;
    var $dpy = 5;
    var $alowcreate = 1;

    /*
    Get extension of file
    */
    function getExtension($filename)
    {
        $sExtension = substr($filename, (strrpos($filename, ".") + 1));
        $sExtension = strtolower($sExtension);
        return $sExtension;
    }

    function __construct($pic_file, $align)
    {
        $logo_file = "../../images/logo.png";
        if (!file_exists($pic_file)) return;
        if (!file_exists($logo_file)) return;

        $sExtension = $this->getExtension($pic_file);
        switch ($sExtension) {
            case "gif":
                $this->img_pic = imagecreatefromgif($pic_file);
                $logo_file = "../../images/logo.gif";
                $this->img_logo = imagecreatefromgif($logo_file);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                $this->img_pic = imagecreatefromjpeg($pic_file);
                $this->img_logo = imagecreatefrompng($logo_file);
                break;
            case "png":
                $this->img_pic = imagecreatefrompng($pic_file);
                $this->img_logo = imagecreatefrompng($logo_file);
                break;
            default:
                $this->alowcreate = 0;
                break;
        }
        if ($this->alowcreate == 0) return;
        //vị trí ảnh cần chèn
        // note: $align | 1 = top left, 2 = top right, 3 = bottom right, 4 = bottom left, 5 = bottom center, 6 = top center, 7 center
        switch ($align) {
            case 1:
                $this->dpy = 5;
                $this->dpx = 5;
                break;
            case 2:
                $this->dpy = 5;
                $this->dpx = imagesx($this->img_pic) - (imagesx($this->img_logo) + 5);
                break;
            case 3:
                $this->dpy = imagesy($this->img_pic) - (imagesy($this->img_logo) + 5);
                $this->dpx = imagesx($this->img_pic) - (imagesx($this->img_logo) + 5);
                break;
            case 4:
                $this->dpy = imagesy($this->img_pic) - (imagesy($this->img_logo) + 5);
                $this->dpx = 5;
                break;
            case 5:
                $this->dpy = imagesy($this->img_pic) - (imagesy($this->img_logo) + 5);
                $dc = imagesx($this->img_pic) / 2;
                $dc2 = imagesx($this->img_logo) / 2;
                $this->dpx = $dc - $dc2;
                break;
            case 6:
                $this->dpy = 5;
                $dc = imagesx($this->img_pic) / 2;
                $dc2 = imagesx($this->img_logo) / 2;
                $this->dpx = $dc - $dc2;
                break;
            case 7:
                $this->dpy = imagesy($this->img_pic) / 2 - imagesy($this->img_logo) / 2;
                $this->dpx = imagesx($this->img_pic) / 2 - imagesx($this->img_logo) / 2;
                break;
            default:
                $this->dpy = 5;
                $this->dpx = 5;
                break;
        }
        //chèn logo vào ảnh

        $sx = imagesx($this->img_logo);
        $sy = imagesy($this->img_logo);

        imagecopy($this->img_pic, $this->img_logo, $this->dpx, $this->dpy, 0, 0, $sx, $sy);

        //phần lưu ảnh
        switch ($sExtension) {
            case "gif":
                imagegif($this->img_pic, $pic_file);
                break;
            case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
                imagejpeg($this->img_pic, $pic_file, 100);
                break;
            case "png":
                imagepng($this->img_pic, $pic_file);
                break;
        }
        imagedestroy($this->img_pic);
    }
}

?>