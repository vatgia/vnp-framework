<?php

if (!function_exists('url')) {
    /**
     * Tao link voi ham URL
     * @return string
     */
    function url($module = "", $row = array())
    {
        $strlink = null;

        switch ($module) {
            case "category":
                $strlink = ROOT_PATH . $row["iCat"] . '/' . removeTitle($row["nTitle"]) . '.html';
                break;

            case "static":
                $strlink = '';
                break;

            // Đăng nhập
            case "login":
                return "/login";
        }

        return $strlink;
    }
}


/**
 * Url register
 * @return url
 */
function url_register()
{
    $urlRegister = 'https://id.vatgia.com/v2/dang-ky/vatgia/tai-khoan-thuong?service=vatgia&amp;_cont=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . '/pages/idvg_callback.php?refer=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']));
    return $urlRegister;
}


/**
 * Url login
 * @return url
 */
function url_login()
{
    $urlLogin = 'https://id.vatgia.com/dang-nhap/oauth?&client_id=affiliate&_cont=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . '/login/idvg-callback?refer=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']));

    return $urlLogin;
}

/**
 * Url login cashback
 * @return url
 */
function url_login_cashback()
{
    $urlLogin = 'https://id.vatgia.com/dang-nhap/oauth?&client_id=affiliate&_cont=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . '/cashback/login/idvg-callback?refer=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']));

    return $urlLogin;
}

/**
 * Url register cashback
 * @return url
 */
function url_register_cashback()
{
    $urlRegister = 'https://id.vatgia.com/v2/dang-ky/vatgia/tai-khoan-thuong?service=vatgia&amp;_cont=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . '/pages/cashback/idvg_callback.php?refer=' . urlencode('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']));
    return $urlRegister;
}

/**
 * Url danh mục
 * @param $iCat
 * @param $title
 * @return string
 */
function url_list_affiliate($iCat, $title)
{
    $title = removeTitle($title);
    $title = cut_string($title, 50);
    $link = "/" . $iCat . "/" . $title . ".html";
    return $link;
}

/**
 * Url create link
 * @param  int $afp_id
 * @param  int $sub_partner_id
 * @return url
 */
function url_create_link($afp_id)
{
    return '/create-link/' . (int)$afp_id;
}

/**
 * 404 url
 * @return url
 */
function url_404()
{
    return '/not-found.html';
}

/**
 * Url post
 * @param  int $id
 * @param  string $slug
 * @return string
 */
function url_post($id, $slug)
{
    return '/blog/' . $id . '-' . $slug;
}


/**
 * Url post category
 * @param  int $id
 * @param  string $slug
 * @return string
 */
function url_post_category($id, $slug)
{
    return '/blog/category/' . $id . '-' . $slug;
}


/**
 * Url share link, affiliate detail link
 * @param  int $id
 * @return string
 */
function url_share_link($afp_id, $publisher_id)
{
    $break = '{--break--}';
    $hash = $afp_id . $break . $publisher_id;
    $hash = base64_url_encode($hash);
    return 'http://' . $_SERVER['HTTP_HOST'] . '/aff/' . $hash;
}


if (!function_exists('decode_hash_url_share_link')) {
    /**
     * Decode hash url share link
     * @param $hash
     * @return array
     */
    function decode_hash_url_share_link($hash)
    {
        $break = '{--break--}';
        $hashDecoded = base64_url_decode($hash);
        $data = explode($break, $hashDecoded);

        return [
            'afp_id' => isset($data[0]) ? (int)$data[0] : 0,
            'publisher_id' => isset($data[1]) ? (int)$data[1] : 0,
            'domain' => isset($data[2]) ? $data[2] : ''
        ];
    }
}


/**
 * Get url image post
 * @param $image
 * @param null $default
 * @return mixed
 */
function url_image_post($image, $default = null)
{
    if (filter_var($image, FILTER_VALIDATE_URL)) {
        return $image;
    }

    $path = ROOT . '/public/uploads/posts/' . $image;
    if (is_file($path)) {
        return config('app.app_uri') . '/uploads/posts/' . $image;
    }

    return $default;
}


/**
 * Get url image post
 * @param $image
 * @param null $default
 * @return mixed
 */
function url_image_shop($image, $default = null)
{
    if (filter_var($image, FILTER_VALIDATE_URL)) {
        return $image;
    }

    $path = ROOT . '/public/uploads/dashboard/settings/' . $image;
    if (is_file($path)) {
        return config('app.app_uri') . '/uploads/dashboard/settings/' . $image;
    }

    return $default;
}

/**
 * Url category shop
 * @param $iCat
 * @param $title
 * @param $idPub
 * @return string
 */
function url_category_shop($iCat, $title, $slug)
{
    $title = removeTitle($title);
    $title = cut_string($title, 50);
    $link = "/shop/" . $slug . '/' . $iCat . "-" . $title . ".html";
    return $link;
}

if (!function_exists('url_product_estore_vatgia')) {
    /**
     * Link chi tiết sản phẩm của một gian hàng trên vật giá
     * @param  str $estore_name Slug gian hàng
     * @param  int $productId Id sản phẩm
     * @return str
     */
    function url_product_estore_vatgia($estore_name, $productId)
    {
        return "http://vatgia.com/" . $estore_name . "&module=product&view=detail&record_id=" . $productId;
    }
}

if (!function_exists('url_click_count')) {
    /**
     * Url đếm số lượng click vào link share
     * @param $afp_id
     * @param $publisher_id
     * @return string
     */
    function url_click_count($afp_id, $publisher_id, array $params = array())
    {
        $break = '{--break--}';
        $hash = $afp_id . $break . $publisher_id;
        $hash = base64_url_encode($hash);

        $link = 'http://' . $_SERVER['HTTP_HOST'] . '/aff/c/' . $hash;

        if ($params) {
            $link .= '?' . http_build_query($params);
        }

        return $link;
    }
}