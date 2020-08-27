<?
define('REDIS_SLAVE_TIMEOUT_CONNECT', 1);
define('REDIS_MASTER_TIMEOUT_CONNECT', 2);
define('REDIS_MASTER_PCONNECT', true);
define('REDIS_SLAVE_PCONNECT', true);

/**
 * Class redis
 * create 24/01/2013
 * dinhtoan1905
 */
class redis_store
{

    var $redis = false;
    var $is_master_connect = false;
    var $is_slave_connect = false;
    var $redis_master = false;
    var $master_host = "";
    var $slave_host = "";
    protected $redis_password = "";
    protected $time_load = 0;
    protected $list_check_online = array();

    /**
     * Ham khoi tao
     */
    function __construct()
    {
        global $redis_analyze_list;
        if (!isset($redis_analyze_list))
            $redis_analyze_list = "";
        $this->master_host = "127.0.0.1";
        $this->redis_password = "";
        $this->slave_host = "127.0.0.1";
        if ($_SERVER["SERVER_NAME"] != 'localhost') {
            $this->redis_password = "wlreovswrewlrls";
            $this->master_host = "192.168.1.155";
            $this->slave_host = "192.168.1.155";
        }
        //neu localhost thi connect chinh server tren may tes

    } //end function

    function getRedisHost($default_server = "192.168.1.18")
    {

        //N?u dã có server trong Const r?i thì return luôn
        if (defined("REDIS_CLIENT_IP"))
            return REDIS_CLIENT_IP;

        // IP server => Weight (Tr?ng s? quy d?nh xem server nào ch?u t?i nhi?u hon)
        $array_server = array(
            "192.168.1.18" => 1,
            "192.168.1.124" => 1,
        );

        //Loop array d? t?o array m?i, dàn d?u weight thành nh?ng ph?n t? d? l?y random
        $total_weight = 0;
        $new_array_server = array();

        //Bi?n array server thành 1 array ph?ng g?m n ph?n t?, n = t?ng tr?ng s?
        foreach ($array_server as $m_key => $m_value) {
            //Loop t? 0 d?n weight d? tao array
            for ($i = 0; $i < $m_value; $i++) {
                $total_weight++;
                $new_array_server[$total_weight] = $m_key;
            }
        }

        //N?u ko có server nào thì tr? v? server default
        if ($total_weight < 1)
            return $default_server;

        //B?t d?u l?y random
        $my_ape_client = rand(1, $total_weight);
        //Tr? v? server
        if (isset($new_array_server[$my_ape_client])) {
            //N?u chua có Const SLAVE_SERVER_IP thì gán b?ng const
            if (!defined("REDIS_CLIENT_IP"))
                define("REDIS_CLIENT_IP", $new_array_server[$my_ape_client]);
            return $new_array_server[$my_ape_client];
        } else
            return $default_server;

    } //end function

    //Hàm tính time
    function microtime_float()
    {
        list($usec, $sec) = explode(" ", microtime());
        return ((float)$usec + (float)$sec);
    }

    /**
     * check slow redis
     */
    protected function check_slow($start_time, $line)
    {
        $time_load = $this->microtime_float() - $start_time;
        if (doubleval($time_load) > 1) {
            $this->log("redis_slow", $time_load . " Line: " . $line);
        }
    }

    /**
     * Hàm ghi log
     */
    function log($filename, $content)
    {
//        $log_path = str_replace("classes\ads", "ipstore", dirname(__file__)) . "/";
        $log_path = ROOT . '/ipstore/';
        $handle = @fopen($log_path . $filename . ".cfn", "a");
        //N?u handle chua có m? thêm ../
        if (!$handle)
            $handle = @fopen($log_path . $filename . ".cfn", "a");

        @fwrite($handle, date("d/m/Y h:i:s A") . " " . @$_SERVER["REQUEST_URI"] . "\n" . $content . "\n");
        //fwrite($handle, date("d/m/Y h:i:s A") . "\n");
        @fclose($handle);

    } //end function

    /**
     * Ham kiem tra xem key co ton tai hay ko
     */
    function exists($key)
    {
        $start_time = $this->microtime_float();
        //neu connect khong thanh cong thi connect
        if (!$this->slave_connect()) {
            return (is_array($key)) ? array() : 0;
        } //if(!$this->redis)

        //neu khong phai la array thi return luon theo ham exists
        if (!is_array($key)) {
            $return = $this->redis->exists($key);
            $this->check_slow($start_time, __line__);
            return $return;
        } else {

            $arrayReturn = array();

            foreach ($key as $val) {
                $arrayReturn[$val] = $this->redis->exists($val);
            } //end foreach
            $this->check_slow($start_time, __line__);
            return $arrayReturn;
        }
    } //end function

    function checkOnline($key)
    {
        $start_time = $this->microtime_float();
        //neu connect khong thanh cong thi connect
        if (!$this->slave_connect()) {
            return (is_array($key)) ? array() : 0;
        } //if(!$this->redis)

        //neu khong phai la array thi return luon theo ham exists
        if (!is_array($key)) {
            //neu user nay da check roi thi return luon
            if (isset($this->list_check_online[$key]))
                return $this->list_check_online[$key];

            $return = intval($this->redis->exists("online:" . md5("user_" . $key)));
            $this->list_check_online[$key] = $return;
            $this->check_slow($start_time, __line__);
            return $return;
        } else {

            $arrayReturn = array();

            foreach ($key as $val) {
                if (isset($this->list_check_online[$val])) {
                    $arrayReturn[$val] = $this->list_check_online[$val];
                } else {
                    $arrayReturn[$val] = intval($this->redis->exists("online:" . md5("user_" . $val)));
                    $this->list_check_online[$val] = $arrayReturn[$val];
                }
            } //end foreach
            $this->check_slow($start_time, __line__);
            return $arrayReturn;
        }
    }

    function set($key, $value, $ttl = 0)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)


        $this->redis_master->set($key, $value);
        if (intval($ttl) > 0)
            $this->redis_master->expire($key, $ttl);
        return true;
    }

    function expire($key, $time)
    {
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham sadd tu redis
        return $this->redis_master->expire($key, $time);
    }

    /**
     * Ham sadd
     */
    function sadd($key, $value)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham sadd tu redis
        return $this->redis_master->sadd($key, $value);

    } //end function

    /**
     * Tự động tăng giá trị 1 key
     */
    function incr($key, $amount = 1)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham incr tu redis
        return $this->redis_master->incr($key, $amount);
    }

    /**
     * Tự động giảm giá trị 1 key
     */
    function decr($key, $amount = 1)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham decr tu redis
        return $this->redis_master->decr($key, $amount);
    }

    /**
     * Lấy ra tất cả key từ Redis
     */
    function keys($pattern = '*')
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        return $this->redis_master->keys($pattern);
    }

    /**
     * lấy giá trị 1 key rồi reset giá trị về 0 luôn
     */
    function getset($key, $defalt_value = 0)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        return $this->redis_master->getset($key, 0);
    }

    /**
     * Lấy giá trị của 1 key
     */
    function get($key)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        return $this->redis_master->get($key);
    }

    /**
     * Lấy ra toàn bộ key
     */
    function scard($key)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        return $this->redis_master->scard($key);
    }

    /**
     * Xóa giá trị của 1 key
     */
    function delete($key)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham incr tu redis
        return $this->redis_master->delete($key);
    }

    /**
     * Ham get value cua 1 key
     * Parameters
     * Key: key
     * Return value
     * An array of elements, the contents of the set.
     */
    function sMembers($key)
    {
        //neu connect khong thanh cong thi connect
        $start_time = $this->microtime_float();
        if (!$this->slave_connect()) {
            return (is_array($key)) ? array() : null;
        } //if(!$this->redis)

        $data = $this->redis->sMembers($key);
        $this->check_slow($start_time, __line__);
        return $data;

    } //end function

    /**
     * Ham check xem key value ton tai hay ko
     */
    function sIsMember($key, $value)
    {
        //neu connect khong thanh cong thi connect
        if (!$this->slave_connect()) {
            return 0;
        } //if(!$this->redis)

        return $this->redis->sIsMember($key, $value);

    } //end function

    /**
     * Ham publish du lieu vao redis
     */
    function publish($channel, $string)
    {
        $start_time = $this->microtime_float();
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham publish tu redis
        $return = $this->redis_master->publish($channel, $string);
        $this->check_slow($start_time, __line__);
        return $return;

    }

    /**
     *
     */
    function lPush($key, $value)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham publish tu redis
        return $this->redis_master->lPush($key, $value);
    }

    /**
     * ham cap nhat va giu lai ket qua theo index tu $start den $end
     */
    function lTrim($key, $start, $end)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham publish tu redis
        return $this->redis_master->lTrim($key, $start, $end);
    }

    /**
     * Ham cap history chat cua user
     */
    function updateHistoryUserChat($my_id, $to_id)
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //chia nho cap luu history ra theo dang history_chat:level_1:my_id value la to_id
        $level_1 = $my_id % 1000;
        $arrayHistory = $this->lRange("history_chat:" . $level_1 . ":" . $my_id, 0, 20);
        if (!in_array($to_id, $arrayHistory)) {
            //xoa het nhung user thu 20 tro di
            $this->lTrim("history_chat:" . $level_1 . ":" . $my_id, 0, 19);
            return $this->lPush("history_chat:" . $level_1 . ":" . $my_id, $to_id);
        }

    } //end function

    function getInfo()
    {
        //neu master chua connect thi connect
        if (!$this->master_connect()) {
            return 0;
        } //if(!$this->redis_master)
        return $this->redis_master->info();
    }

    function getHistoryUserChat($my_id)
    {
        $start_time = $this->microtime_float();
        //neu master chua connect thi connect
        if (!$this->slave_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //chia nho cap luu history ra theo dang history_chat:level_1:my_id value la to_id
        $level_1 = $my_id % 1000;
        $arrayHistory = $this->lRange("history_chat:" . $level_1 . ":" . $my_id, 0, 20);
        //$this->log("redis_dump", json_encode($arrayHistory));
        $this->check_slow($start_time, __line__);
        return $arrayHistory;
    }

    /**
     * ham lay ra ket qua theo index tu $start den $end
     */
    function lRange($key, $start, $end)
    {
        //neu master chua connect thi connect
        if (!$this->slave_connect()) {
            return 0;
        } //if(!$this->redis_master)

        //goi ham publish tu redis
        return $this->redis->lRange($key, $start, $end);
    }

    /**
     * Truong hop ham nay duoc goi khi co lenh can tuong tac vao master
     */
    protected function master_connect()
    {
        if ($this->redis_master == "error") {
            return false;
        } elseif ($this->redis_master !== false) {
            return true;
        } //end if
        if (!class_exists("Redis")) {
            $this->log("redis_error", "Redis not found extension");
            $this->redis_master = "error";
            return false;
        }
        if ($this->is_master_connect) {
            return true;
        }
        $connect_function = (REDIS_MASTER_PCONNECT ? 'p' : '') . 'connect';
        try {
            $host = $this->master_host;
            $this->redis_master = new Redis();
            $this->redis_master->$connect_function($host, 6379, REDIS_MASTER_TIMEOUT_CONNECT);
            $this->redis_master->auth($this->redis_password); //mat khau connect toi server
            $this->is_master_connect = true;
            return true;
        } catch (exception $e) {
            $this->redis_master = "error";
            $this->log("redis_error_connect", $host . ":" . $e);
            return false;
        }
    } //end function

    /**
     * Ham nay duoc goi khi co lenh su dung den redis slave
     */
    protected function slave_connect()
    {
        if ($this->redis == "error") {
            return false;
        } elseif ($this->redis !== false) {
            return true;
        } //end if
        if (!class_exists("Redis")) {
            $this->log("redis_error", "Redis not found extension");
            $this->redis = "error";
            return false;
        }
        if ($this->is_slave_connect) {
            return true;
        }
        $connect_function = (REDIS_SLAVE_PCONNECT ? 'p' : '') . 'connect';
        try {

            $host = $this->slave_host;
            $this->redis = new Redis();
            $this->redis->$connect_function($host, 6379, REDIS_SLAVE_TIMEOUT_CONNECT);
            $this->redis->auth($this->redis_password); //mat khau connect toi server
            $this->is_slave_connect = true;
            return true;
        } catch (exception $e) {
            $this->redis = "error";
            $this->log("redis_error_connect", $host . ":" . $e);
            return false;
        }
    } //end function

    /**
     * Kiểm tra xem có thể connect Redis hay không?
     */
    public function test_connect()
    {
        if ($this->master_connect() || $this->slave_connect()) {
            return true;
        }
        return false;
    }

}
/*
require_once("../functions/functions.php");
$redis = new redis_store();
print_r($redis->getInfo());
//for($i = 0; $i < 10; $i++){
//$redis->lPush("history:1:1", rand(1,20));
//}
//print_r($redis->lTrim("history:1:1", 0, 10));

//$a = ($redis->lRange('history:1:1', 0, 9));
//echo implode("<br>", $a);
//*/
