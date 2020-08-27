<?
function check_image($path, $filename)
{
    $sExtension = getExtension($filename);
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
        delete_file($path, $filename);
        return 0;
    }
    return 1;
}

?>
<?
function resize_image($path, $filename, $maxwidth, $maxheight, $quality, $type = "small_", $new_path = "")
{
    $sExtension = substr($filename, (strrpos($filename, ".") + 1));
    $sExtension = strtolower($sExtension);

    // Get new dimensions
    list($width, $height) = getimagesize($path . $filename);
    if ($width != 0 && $height != 0) {
        if ($maxwidth / $width > $maxheight / $height) $percent = $maxheight / $height;
        else $percent = $maxwidth / $width;
    }

    $new_width = $width * $percent;
    $new_height = $height * $percent;

    // Resample
    $image_p = imagecreatetruecolor($new_width, $new_height);
    //check extension file for create
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

function croped_image($path, $filename, $width, $height, $new_width, $new_height, $start_width, $start_height, $quality = 100, $type = "s_", $new_path = "", $new_filename = "")
{

    $percent = 1;
    $sExtension = substr($filename, (strrpos($filename, ".") + 1));
    $sExtension = strtolower($sExtension);
    $image = '';
    //echo $sExtension . "<br>";
    //echo $sExtension . "<br>";

    // Resample
    $image_p = imagecreatetruecolor($new_width, $new_height);
    //check extension file for create
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
    imagecopyresampled($image_p, $image, 0, 0, $start_width, $start_height, $new_width, $new_height, $width, $height);
    //imagecopyresampled($newImage,$source,0,0,$start_width,$start_height,$newImageWidth,$newImageHeight,$width,$height);
    // Output

    // check new_path, nếu new_path tồn tại sẽ save ra đó, thay path = new_path
    if ($new_path != "") $path = $new_path;
    if ($new_filename != '') $filename = $new_filename;
    $new_filename = $path . $type . $filename;
    switch ($sExtension) {
        case "gif":
            imagegif($image_p, $new_filename);
            break;
        case $sExtension == "jpg" || $sExtension == "jpe" || $sExtension == "jpeg":
            imagejpeg($image_p, $new_filename, $quality);
            break;
        case "png":
            imagepng($image_p, $new_filename);
            break;
    }
    imagedestroy($image_p);
    return $type . $filename;
}

?>