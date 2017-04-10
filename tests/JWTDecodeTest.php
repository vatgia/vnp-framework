<?php

/**
 * Created by PhpStorm.
 * User: ADMIN
 * Date: 1/10/17
 * Time: 4:33 PM
 */
class JWTDecodeTest extends \PHPUnit\Framework\TestCase
{

    public function testDecode()
    {

        $token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJrZXlzIjp7ImlkIjo0MTh9LCJ1cGRhdGVkX3ZhbHVlcyI6eyJhY3RpdmUiOlswLDFdfSwidmFsdWVzIjp7InN0YXJ0X2RhdGUiOjE0ODM0NjI4MDAsImlkIjo0MTgsInByaWNlIjoxNjUwMDAuMCwiaXAiOjMwNzYxOTQ4MzAuMCwiYWN0aXZlIjoxLCJhZG1pbl9hY3RpdmVfdGltZSI6MTQ4MzUxODM4OCwiZXN0b3JlX2lkIjoxMzA1Mzc5LCJxdWFudGl0eSI6MSwicHJvZHVjdF9pZCI6NjA4MTc2NSwiZW5kX2RhdGUiOjE0ODg3MzMxOTksImFkbWluX2FjdGl2ZSI6MSwic2l6ZV9jb2xvcl9pZCI6bnVsbCwiY29tbWlzc2lvbiI6MTI1MDAuMCwiY2F0X3Jvb3QiOjkxMiwiY3JlYXRlX3RpbWUiOjE0ODM1MTgzODh9fQ.05BIFXfrhJX85pY6zA_5xvGYrcX3UFewN-wYKHgNUjINPOiZRvX';
        $key = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2VTE25Mw04buD253M3xu
F30H72cDa3JVvvEX6IgorPoVH0diO+7DfSRN62CDMrRPlhqA9Wib4/tUvpGHrA46
25sOXpVWjUmPXZQfsnYT1fq4/Q38/E/87VhEfWUD6tP2THCJoRlH0rbKMpE+q9B3
b/TBRHSYsuB88+WKrw0sfLwOSIUOY/Gxb3NiGoLbgT/xo77378zs6kTmzdejtQsf
tIA6OLxTUG3rpDMq6GtLW02VD0ETf7svkHUhh2Ay11twD3LoaY6viCpJofODQroM
I9krSzndBV25/ec9mgCxTuxmpvlHHAbngaiHySTrH3t2L1pPEajjnEGHFVJ7Lyoz
SQIDAQAB
-----END PUBLIC KEY-----';

        $decoded = \Firebase\JWT\JWT::decode($token, $key, array('RS256'));
        $decoded = json_encode($decoded);
        $decoded = json_decode($decoded, true);
        var_dump($decoded);
    }
}