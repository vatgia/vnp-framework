SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_translate
-- ----------------------------
DROP TABLE IF EXISTS `admin_translate`;
CREATE TABLE `admin_translate` (
  `tra_keyword` varchar(255) CHARACTER SET utf8 NOT NULL,
  `tra_text` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `lang_id` int(11) DEFAULT NULL,
  `tra_source` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`tra_keyword`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `adm_id` int(11) NOT NULL AUTO_INCREMENT,
  `adm_loginname` varchar(100) DEFAULT NULL,
  `adm_password` varchar(100) DEFAULT NULL,
  `adm_name` varchar(255) DEFAULT NULL,
  `adm_email` varchar(255) DEFAULT NULL,
  `adm_address` varchar(255) DEFAULT NULL,
  `adm_phone` varchar(255) DEFAULT NULL,
  `adm_mobile` varchar(255) DEFAULT NULL,
  `adm_access_module` varchar(255) DEFAULT NULL,
  `adm_access_category` text,
  `adm_date` int(11) DEFAULT '0',
  `adm_isadmin` tinyint(1) DEFAULT '0',
  `adm_active` tinyint(1) DEFAULT '1',
  `lang_id` tinyint(1) DEFAULT '1',
  `adm_delete` int(11) DEFAULT '0',
  `adm_all_category` int(1) DEFAULT NULL,
  `adm_all_website` tinyint(1) DEFAULT '0',
  `adm_edit_all` int(1) DEFAULT '0',
  `admin_id` int(1) DEFAULT '0',
  PRIMARY KEY (`adm_id`),
  KEY `adm_date` (`adm_date`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 ROW_FORMAT=FIXED;

-- ----------------------------
-- Table structure for admin_user_category
-- ----------------------------
DROP TABLE IF EXISTS `admin_user_category`;
CREATE TABLE `admin_user_category` (
  `auc_admin_id` int(11) NOT NULL DEFAULT '0',
  `auc_category_id` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for admin_user_language
-- ----------------------------
DROP TABLE IF EXISTS `admin_user_language`;
CREATE TABLE `admin_user_language` (
  `aul_admin_id` int(11) NOT NULL DEFAULT '0',
  `aul_lang_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`aul_admin_id`,`aul_lang_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for admin_user_right
-- ----------------------------
DROP TABLE IF EXISTS `admin_user_right`;
CREATE TABLE `admin_user_right` (
  `adu_admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `adu_admin_module_id` int(11) NOT NULL DEFAULT '0',
  `adu_add` int(1) DEFAULT '0',
  `adu_edit` int(1) DEFAULT '0',
  `adu_delete` int(1) DEFAULT '0',
  PRIMARY KEY (`adu_admin_id`,`adu_admin_module_id`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for admin_user_website
-- ----------------------------
DROP TABLE IF EXISTS `admin_user_website`;
CREATE TABLE `admin_user_website` (
  `auw_user_id` int(11) NOT NULL DEFAULT '0',
  `auw_web_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`auw_user_id`,`auw_web_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `lang_id` int(11) NOT NULL DEFAULT '0',
  `lang_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lang_path` varchar(15) COLLATE utf8_unicode_ci DEFAULT 'home',
  `lang_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lang_domain` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`lang_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for modules
-- ----------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `mod_id` int(11) NOT NULL AUTO_INCREMENT,
  `mod_name` varchar(255) DEFAULT NULL,
  `mod_path` varchar(255) DEFAULT NULL,
  `mod_listname` varchar(255) DEFAULT NULL,
  `mod_listfile` varchar(255) DEFAULT NULL,
  `mod_order` int(11) DEFAULT '0',
  `mod_help` mediumtext,
  `lang_id` int(11) DEFAULT '1',
  `mod_checkloca` int(11) DEFAULT '0',
  PRIMARY KEY (`mod_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for queue
-- ----------------------------
DROP TABLE IF EXISTS `queue`;
CREATE TABLE `queue` (
  `que_id` int(11) NOT NULL AUTO_INCREMENT,
  `que_name` varchar(255) DEFAULT NULL,
  `que_payload` text,
  `que_created_at` datetime DEFAULT NULL,
  `que_updated_at` datetime DEFAULT NULL,
  `que_running` tinyint(1) DEFAULT '0',
  `que_running_at` int(11) DEFAULT '0',
  `que_attempts` int(11) DEFAULT NULL,
  `que_can_run_at` int(11) DEFAULT NULL,
  `que_can_run_local` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`que_id`),
  KEY `que_name_index` (`que_name`),
  KEY `can_run_at_index` (`que_can_run_at`),
  KEY `running_index` (`que_running`)
) ENGINE=InnoDB AUTO_INCREMENT=9380275 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for translate_display
-- ----------------------------
DROP TABLE IF EXISTS `translate_display`;
CREATE TABLE `translate_display` (
  `tra_keyword` varchar(255) NOT NULL DEFAULT '',
  `tra_text` varchar(255) DEFAULT NULL,
  `tra_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tra_keyword`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_right
-- ----------------------------
DROP TABLE IF EXISTS `user_right`;
CREATE TABLE `user_right` (
  `ur_code` int(11) unsigned NOT NULL DEFAULT '0',
  `ur_variable` varchar(30) DEFAULT NULL,
  `ur_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`ur_code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `use_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id cua vatgia.com',
  `use_id_vatgia` int(11) NOT NULL COMMENT 'id cua id.vatgia.com',
  `use_active` int(11) DEFAULT '0',
  `use_login` varchar(100) DEFAULT NULL,
  `use_loginname` varchar(100) DEFAULT NULL,
  `use_password` varchar(50) DEFAULT NULL,
  `use_birthdays` varchar(10) DEFAULT NULL,
  `use_gender` tinyint(2) NOT NULL,
  `use_city` int(11) DEFAULT '1',
  `use_phone` varchar(20) DEFAULT NULL,
  `use_email` varchar(100) DEFAULT NULL,
  `use_address` varchar(255) DEFAULT NULL,
  `use_date` int(11) DEFAULT '0',
  `use_group` int(11) DEFAULT '0',
  `use_name` varchar(255) DEFAULT NULL,
  `use_mobile` varchar(255) DEFAULT NULL,
  `use_hits` int(11) DEFAULT '1',
  `use_avatar` varchar(255) DEFAULT NULL,
  `use_idvg_access_token` varchar(255) DEFAULT NULL,
  `use_security` varchar(255) DEFAULT NULL,
  `use_supplier` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`use_id`),
  KEY `index` (`use_login`),
  KEY `index_email` (`use_email`)
) ENGINE=MyISAM AUTO_INCREMENT=5237048 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
