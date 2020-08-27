<?
$users = array('log' => 'checkloi');
$realm	= "Check Log";
function check_authen(){
	global $realm;
	if ( empty($_SERVER['PHP_AUTH_DIGEST']) ) {
	    header('HTTP/1.1 401 Unauthorized');
	    header('WWW-Authenticate: Digest realm="'.$realm.'",qop="auth",nonce="'.uniqid().'",opaque="'.md5($realm).'"');	
	    die('Text to send if user hits Cancel button');
	}
}
// function to parse the http auth header
function http_digest_parse($txt)
{
    // protect against missing data
    $needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
    $data = array();
    $keys = implode('|', array_keys($needed_parts));

    preg_match_all('@(' . $keys . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

    foreach ($matches as $m) {
        $data[$m[1]] = $m[3] ? $m[3] : $m[4];
        unset($needed_parts[$m[1]]);
    }

    return $needed_parts ? false : $data;
}

check_authen();

// analyze the PHP_AUTH_DIGEST variable
if (!($data = http_digest_parse($_SERVER['PHP_AUTH_DIGEST'])) ||
    !isset($users[$data['username']])){
		die("Xin loi ban ko co quyen");
    }
// generate the valid response
$A1 = md5($data['username'] . ':' . $realm . ':' . $users[$data['username']]);
$A2 = md5($_SERVER['REQUEST_METHOD'].':'.$data['uri']);
$valid_response = md5($A1.':'.$data['nonce'].':'.$data['nc'].':'.$data['cnonce'].':'.$data['qop'].':'.$A2);

if ($data['response'] != $valid_response){
		die("Xin loi ban ko co quyen");
}
$file_log = "/var/log/php_error_log";
$file_error_sql = "../ipstore/error_sql.cfn";
$key = isset($_POST["key"]) ? $_POST["key"] : "";
if($key == md5("lfjdslfjdslls|" . $_SERVER['REMOTE_ADDR'])){
	@file_put_contents($file_error_sql, "");
	header("location: error_log.php");
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml" lang="vn-VI">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<h1>Cập nhật nhật log lúc tại IP(<?=@apache_getenv("SERVER_ADDR");?>) : <?=date("H:i:s", filemtime($file_log))?></h1>
<style type="text/css">
	body{
		background: black;
		color: #FFFFFF;
		font-family: Arial;
		font-size: 13px;
	}
</style>
</head>
<body>
<?
if(file_exists($file_log)){
$output = @file($file_log, FILE_SKIP_EMPTY_LINES);
?>
<table border="0" cellpadding="5">
    <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Client</th>
        <th>Message</th>
    </tr>
<?
    foreach($output as $line) {
    	// sample line: [Wed Oct 01 15:07:23 2008] [error] [client 76.246.51.127] PHP 99. Debugger->handleError() /home/gsmcms/public_html/central/cake/libs/debugger.php:0
    	preg_match('~^\[(.*?)\]~', $line, $date);
    	if(empty($date[1])) {
    		continue;
    	}
    	preg_match('~\] \[([a-z]*?)\] \[~', $line, $type);
    	preg_match('~\] \[client ([0-9\.]*)\]~', $line, $client);
    	preg_match('~\] (.*)$~', $line, $message);
    	?>
    <tr>
        <td nowrap="nowrap" valign="top"><?=$date[1]?></td>
        <td><?=$type[1]?></td>
        <td><?=$client[1]?></td>
        <td nowrap="nowrap"><?=str_replace("PHP Notice", "<b style='color: red;'>PHP Notice</b>", $message[1])?></td>
    </tr>
    	<?
    }
?>
</table>
<?
}
?>
<h1>Log error SQL</h1>
<?
if(file_exists($file_error_sql)){
$output = @file($file_error_sql, FILE_SKIP_EMPTY_LINES);
?>
<table border="0" cellpadding="5">
    <tr>
        <th>Loi SQL</th>
    </tr>
<?
    foreach($output as $line) {
    	?>
    <tr>
        <td nowrap="nowrap" valign="top"><?=$line?></td>
    </tr>
    	<?
    }
?>
</table>
<?
}
?>
<form method="post">
	<input type="hidden" name="key" value="<?=md5("lfjdslfjdslls|" . $_SERVER['REMOTE_ADDR'])?>" />
	<input type="submit" value="Xóa Log SQL" />
</form>
</body>
</html>

