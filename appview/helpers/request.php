<?php

function dd($data)
{
    echo '<pre style="background: #000; color: #fff; width: 100%; overflow: auto">';
    echo '<div>Your IP: ' . @$_SERVER['REMOTE_ADDR'] . '</div>';

    $debug_backtrace = debug_backtrace();
    // $debug = array_shift($debug_backtrace);

    foreach($debug_backtrace as $info) {
        echo '<div>Line: ' . $info['line'] . '->' . $info['file'] . '</div>';
    }

    if(is_array($data) || is_object($data))
    {
        print_r($data);die();
    }
    else {
        var_dump($data);die();
    }
    echo '</pre>';
}

if (!function_exists('getQueryString'))
{
    /**
     * Tra ve cac tham so query tren url
     *
     * @return string
     */
    function getQueryString()
    {
        return $_SERVER['QUERY_STRING'];
    }
}

if (!function_exists('getQueryUri'))
{
    /**
     * Tra ve cac tham so query tren url
     *
     * @return string
     */
    function getQueryUri()
    {
        return $_SERVER['REQUEST_URI'];;
    }
}

if(!function_exists('getFullUrl')) {

    /**
     *  Tra ve toan bo duong dan url
     *
     * @return string
     */
    function getFullUrl()
    {
        return 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://'
            . "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
    }
}

if(!function_exists('appendUrl'))
{
    /**
     * render ra url muốn append vào url phân tr
     *
     * @param array $append : mang truyen vao can append
     * @return str
     */
    function appendUrl($append= array(), $page= array())
    {
        $r = null;
        $urlUri  = getQueryUri();
        $dataUrl     = explode('?', $urlUri);
        $redirectUrl = $dataUrl[0] && $dataUrl[0] != '/' ? $dataUrl[0] : '';
        $urlQuerry   = isset($dataUrl[1]) ? $dataUrl[1] : '';
        parse_str($urlQuerry, $data);

        // check mảng append link để xuất ra link
        $appendLink =  array();
        $append     = $page ? array_merge($append, $page) : $append;

        foreach($append as $ka => $va)
        {
            if (preg_match('/^\d+$/', $ka))
                throw new Exception('Giá trị '.$va .' gán link có key= '. $ka . ' phải là một chuoi');

            if($va) $appendLink[urlencode($ka)]= urlencode($ka).'='.urlencode($va);
        }

        // check mang param query để thay đổi nếu có k
        if ($data)
        {
            foreach ($data as $k => $value)
            {
                if($appendLink)
                {
                    foreach ($appendLink as $ka => $va)
                    {
                        //nếu trùng key thì đổi value
                        if($k == $ka)
                        {
                            $r[$k]  = $appendLink[$ka];
                        }
                        // khác key thì thêm value
                        else
                        {
                            $r[$ka] = $appendLink[$ka];
                        }
                    }
                }
            }
        }
        $r = $r ? $r : $appendLink;
        return $redirectUrl .'?'.implode('&', $r);
    }
}

if(!function_exists('getTimeline'))
{
    /**
     * timelime 
     *
     * @param truyền ngày kết thúc vào
     * @return int
     */
    function getTimeline($end_date)
    {
        $return_date    = date('Y-m-d', $end_date);
        $pick_date      = date('Y-m-d h:i:s');
        $pick_date      = date_create($pick_date);
        $return_date    = date_create($return_date);
        $diff           = date_diff($pick_date,$return_date);
        $day = $diff->d;
        $month = $diff->m;

        $stringDate = 'Còn ' . $month . ' tháng ' . $day . ' ngày ';
        if($month == 0){
            $stringDate = 'Còn ' . $day . ' ngày ' . $diff->h . ' giờ';
        }

        if($day == 0){
            $stringDate = 'Còn ' . $diff->h . ' giờ';
        }    

        return $stringDate;
    }
}