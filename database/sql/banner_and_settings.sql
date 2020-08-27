-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2018 at 09:49 PM
-- Server version: 5.5.51-log
-- PHP Version: 7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_amall`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE IF NOT EXISTS `banner` (
  `ban_id` int(11) NOT NULL AUTO_INCREMENT,
  `ban_title` varchar(255) DEFAULT NULL,
  `ban_link` varchar(255) DEFAULT NULL,
  `ban_image` varchar(255) DEFAULT NULL,
  `ban_html` text,
  `ban_type` int(11) DEFAULT NULL,
  `ban_active` int(11) DEFAULT NULL,
  `ban_create_time` int(11) DEFAULT NULL,
  `ban_update_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`ban_id`)
) ENGINE=MyISAM AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `banner_slider`
--

CREATE TABLE IF NOT EXISTS `banner_slider` (
  `bsl_id` int(11) NOT NULL AUTO_INCREMENT,
  `bsl_sli_id` int(11) DEFAULT NULL,
  `bsl_ban_id` int(11) DEFAULT NULL,
  `bsl_full_time` int(11) DEFAULT NULL,
  `bsl_start_time` int(11) DEFAULT NULL,
  `bsl_end_time` int(11) DEFAULT NULL,
  `bsl_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`bsl_id`),
  KEY `index 1` (`bsl_sli_id`)
) ENGINE=MyISAM AUTO_INCREMENT=537 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings_website`
--

CREATE TABLE IF NOT EXISTS `settings_website` (
  `swe_id` int(11) NOT NULL AUTO_INCREMENT,
  `swe_key` varchar(255) DEFAULT NULL,
  `swe_value` text,
  `swe_type` varchar(255) DEFAULT NULL,
  `swe_create_time` int(11) DEFAULT NULL,
  `swe_update_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`swe_id`),
  UNIQUE KEY `swe_key` (`swe_key`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `slider`
--

CREATE TABLE IF NOT EXISTS `slider` (
  `sli_id` int(11) NOT NULL AUTO_INCREMENT,
  `sli_name` varchar(255) DEFAULT NULL,
  `sli_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sli_id`),
  KEY `sli_key` (`sli_key`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
