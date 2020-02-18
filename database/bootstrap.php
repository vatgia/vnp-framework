<?php
/**
 * Created by PhpStorm.
 * User: ntdinh1987
 * Date: 3/19/18
 * Time: 20:57
 */

use VatGia\LoadEnv;

LoadEnv::load(realpath(dirname(__FILE__) . '/../'));

require_once '../bootstrap/bootstrap.php';

class ColumnTypes
{
    const BIG_INTEGER = 'biginteger';
    const BINARY = 'binary';
    const BOOLEAN = 'boolean';
    const CHAR = 'char';
    const DATE = 'date';
    const DATETIME = 'datetime';
    const DECIMAL = 'decimal';
    const FLOAT = 'float';
    const INTEGER = 'integer';
    const VARCHAR = 'string';
    const STRING = 'string';
    const TEXT = 'text';
    const TIME = 'time';
    const TIMESTAMP = 'timestamp';
    const UUID = 'uuid';
    const ENUM = 'enum';
    const SET = 'set';
    const BLOB = 'blob';
}

class ColumnOptions
{
    const LIMIT = 'limit';
    const LENGTH = 'length'; //Alias of limit
    const DEFAULT = 'default';
    const NULL = 'null';
    const AFTER = 'after';
    const COMMENT = 'comment';

    //For decimal

    //Độ chính xác
    const PRECISION = 'precision';
    //Tỷ lệ
    const SCALE = 'scale';

    //enable or disable the unsigned option (only applies to MySQL)
    const SIGNED = 'signed';

    //For integer and big integer

    //enable or disable automatic incrementing
    const IDENTITY = 'identity';

    //For timestamp columns

    //set an action to be triggered when the row is updated (use with CURRENT_TIMESTAMP)
    const UPDATE = 'update';

    const CREATED_AT_OPTIONS = [
        'default' => 'CURRENT_TIMESTAMP'
    ];

    const UPDATED_AT_OPTIONS = [
        'null' => true,
        'update' => 'CURRENT_TIMESTAMP'
    ];

    const DELETED_AT_OPTIONS = [
        'null' => true,
    ];
}

function timestamp_fields(Phinx\Db\Table &$table, $prefix)
{
    if (!$table->exists() || !$table->hasColumn($prefix . '_created_at')) {
        $table->addColumn($prefix . '_created_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::DEFAULT => 'CURRENT_TIMESTAMP'
        ]);
    } else {
        $table->changeColumn($prefix . '_created_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::DEFAULT => 'CURRENT_TIMESTAMP'
        ]);
    }
    if (!$table->exists() || !$table->hasColumn($prefix . '_updated_at')) {
        $table->addColumn($prefix . '_updated_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::NULL => true,
            ColumnOptions::UPDATE => 'CURRENT_TIMESTAMP'
        ]);
    } else {
        $table->changeColumn($prefix . '_updated_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::NULL => true,
            ColumnOptions::UPDATE => 'CURRENT_TIMESTAMP'
        ]);
    }
    if (!$table->exists() || !$table->hasColumn($prefix . '_deleted_at')) {
        $table->addColumn($prefix . '_deleted_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::NULL => true,
        ]);
    } else {
        $table->changeColumn($prefix . '_deleted_at', ColumnTypes::TIMESTAMP, [
            ColumnOptions::NULL => true,
        ]);
    }

    return $table;
}