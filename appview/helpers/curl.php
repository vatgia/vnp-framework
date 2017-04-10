<?php

if( ! function_exists('curl_get_content_authen') ) {
    /**
     * Curl get content with auth digest, method GET
     * @param  string $username
     * @param  string $password
     * @param  string $url
     * @param  array  $params
     * @return text
     */
    function curl_get_content_authen($username, $password, $url, array $params = array()) {
        $options = array(
            CURLOPT_URL            => $url,
            CURLOPT_HEADER         => false,
            CURLOPT_VERBOSE        => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,    // for https
            CURLOPT_USERPWD        => $username . ":" . $password,
            CURLOPT_HTTPAUTH       => CURLAUTH_DIGEST
        );

        $ch = curl_init();
        curl_setopt_array( $ch, $options );

        $response  = curl_exec( $ch );

        if(curl_errno($ch))
        {
            throw new Exception(curl_error($ch), 500);
        }

        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($status_code != 200)
        {
            throw new Exception("Response with Status Code [" . $status_code . "].", $status_code);
        }

        return $response;
    }
}