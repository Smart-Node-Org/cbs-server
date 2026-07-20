-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 11, 2022 at 02:06 PM
-- Server version: 5.7.33-0ubuntu0.16.04.1
-- PHP Version: 7.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cbs`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`admin`@`localhost` FUNCTION `getGDPYear` (`id_var` INT) RETURNS JSON NO SQL
begin
DECLARE d_var json;
select json_arrayagg(s) into d_var from (select json_object("year",cast(year as char),"tot_gdp",(SELECT sum(value) from gdp_annual where gdp_sub_id in (select id from gdp_sub where gdp_main_id=(select gdp_main_id from gdp_sub where id=ga.gdp_sub_id) and year=ga.year) ) ) as s from gdp_annual ga where gdp_sub_id in (select id from gdp_sub where gdp_main_id=id_var) GROUP BY year) as temp;
RETURN d_var;

end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_foriegn_products` (`year_var` YEAR, `ids_var` VARCHAR(2048)) RETURNS JSON NO SQL
BEGIN
declare x json;
select json_arrayagg(json_object("product",title,'export_import',export_import,"value_unit",COALESCE(value_unit,0),"value_SDG",COALESCE(value_SDG,0))) into x from foriegn_trade_products fp left join foriegn_trade_products_annual fpa on fp.id=fpa.product_id and year=year_var where find_in_set(fp.id,ids_var)  ;

RETURN x;

END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_gdp_states` (`state_id_var` INT, `year_var` YEAR, `sub_ids` TEXT) RETURNS JSON NO SQL
BEGIN
DECLARE x json;
select json_arrayagg(json_object("title",title,"value",COALESCE(value,0))) into x from gdp_sub left join gdp_annual on gdp_annual.gdp_sub_id=gdp_sub.id  and year=year_var and state=state_id_var where find_in_set(gdp_annual.gdp_sub_id,sub_ids);

RETURN x;

end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_sectoral_products` (`year_var` YEAR) RETURNS JSON NO SQL
BEGIN

DECLARE x json;
SELECT json_arrayagg(json_object("id",p.id,"product",title,"main_title",p.main_valueTitle,"main_value",(select sum(main_valueTitle) from product_annual paa where paa.product_id=p.id and year=year_var),"sub_title",p.sub_valueTiltle,"sub_value",(select sum(sub_valueTiltle) from product_annual paa where paa.product_id=p.id and year=year_var),"is_production",p.production,"production",(select sum(production) from product_annual paa where paa.product_id=p.id and year=year_var),"productivity",(select sum(productivity) from product_annual paa where paa.product_id=p.id and year=year_var))) into x from products p left join product_annual pa on p.id=pa.product_id and pa.year=year_var ;

RETURN x;

end$$

CREATE DEFINER=`root`@`localhost` FUNCTION `get_sectoral_products_states` (`year_var` INT, `state_var` INT) RETURNS JSON NO SQL
BEGIN

DECLARE x json;
SELECT json_arrayagg(json_object("id",p.id,"product",title,"main_title",p.main_valueTitle,"main_value",pa.main_valueTitle,"sub_title",p.sub_valueTiltle,"sub_value",pa.sub_valueTiltle,"is_production",p.production,"production",pa.production,"productivity",pa.productivity)) into x from products p left join product_annual pa on p.id=pa.product_id and pa.year=year_var and state_id=state_var ;

RETURN x;

end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `age_group`
--

CREATE TABLE `age_group` (
  `id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `age_group`
--

INSERT INTO `age_group` (`id`, `title`) VALUES
(1, '0 - 4'),
(2, '5 - 9'),
(3, '10 -  14');

-- --------------------------------------------------------

--
-- Table structure for table `cbs_departments`
--

CREATE TABLE `cbs_departments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cbs_departments`
--

INSERT INTO `cbs_departments` (`id`, `title`, `created`, `updated`) VALUES
(1, 'social', '2020-12-17 12:01:02', '2020-12-17 12:01:02'),
(2, 'ecnomic', '2020-12-17 12:01:02', '2020-12-17 12:01:02'),
(3, 'SDJ', '2020-12-17 12:33:23', '2020-12-17 12:33:23');

-- --------------------------------------------------------

--
-- Table structure for table `cpi_products`
--

CREATE TABLE `cpi_products` (
  `id` int(11) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_products`
--

INSERT INTO `cpi_products` (`id`, `unit`, `name`, `created`) VALUES
(3, 'Kg', 'Apple', '2020-12-23 11:48:02'),
(4, 'Kg', 'Mango', '2020-12-23 11:49:03'),
(6, 'kg', 'Banana', '2021-02-06 12:12:17');

-- --------------------------------------------------------

--
-- Table structure for table `cpi_product_community`
--

CREATE TABLE `cpi_product_community` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_product_community`
--

INSERT INTO `cpi_product_community` (`id`, `product_id`, `month`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(8, 3, 1, 2013, 2007, 378, 213, 75, 674, 54, 9387, 2345, 897, 897, 879),
(9, 3, 0, 2013, 2007, 378, 213, 75, 674, 54, 9387, 2345, 897, 897, 879),
(10, 3, 2, 2013, 2007, 489, 2497, 7623, 81267, 4278, 347, 2378, 2378, 478, 9348),
(11, 3, 3, 2013, 2007, 238, 218, 849, 7849, 748, 233, 438, 74, 3749, 47),
(12, 3, 4, 2013, 2007, 383, 2783, 37, 9478, 739, 748, 8289, 938, 3839, 749),
(13, 3, 5, 2013, 2007, 390, 823, 389, 379, 672, 237, 8389, 489, 489, 923),
(14, 3, 6, 2013, 2007, 383, 7490, 738, 729, 27839, 9238, 370, 72349, 748, 84),
(15, 3, 8, 2013, 2007, 390, 8923, 9784, 8923, 7834, 7934, 94, 8743, 8734, 78934),
(16, 3, 7, 2013, 2007, 894, 233, 766, 66, 676, 434, 443, 88, 987, 9889),
(17, 3, 9, 2013, 2007, 849, 749, 78340, 7340, 8943, 749, 730, 7840, 7893, 9824),
(18, 3, 10, 2013, 2007, 932, 492, 874, 9123, 923, 9823, 892, 9823, 784, 8973),
(19, 3, 11, 2013, 2007, 378, 2389, 872, 87623, 894, 478, 32678, 8764, 7623, 864),
(20, 3, 12, 2013, 2007, 9023, 2, 2378, 8923, 897234, 23, 478, 7823, 7824, 78234);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_product_section`
--

CREATE TABLE `cpi_product_section` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_product_section`
--

INSERT INTO `cpi_product_section` (`id`, `product_id`, `month`, `standard_year`, `year`, `urban_standard`, `urban_ongoing`, `rural_standard`, `rural_ongoing`) VALUES
(14, 6, 6, 2008, 1973, 7865, 4567, 8765, 3456),
(16, 3, 1, 2007, 2013, 1200, 2900, 8230, 839),
(17, 3, 0, NULL, 2013, NULL, NULL, NULL, NULL),
(18, 3, 2, 2007, 2013, 830, 830, 640, 1000),
(19, 3, 3, 2007, 2013, 4500, 380, 8300, 8490),
(20, 3, 4, 2007, 2013, 1200, 390, 3930, 9430),
(21, 3, 5, 2007, 2013, 3200, 3111, 3340, 7490),
(22, 3, 7, 2007, 2013, 3100, 4330, 3200, 3209),
(23, 3, 6, 2007, 2013, 8329, 8749, 7823, 78234),
(24, 3, 8, 2007, 2013, 1898, 897, 7869, 7698),
(25, 3, 9, 2007, 2013, 8932, 9723, 7823, 7563),
(26, 3, 10, 2007, 2013, 238, 2378, 723, 8972),
(27, 3, 11, 2007, 2013, 2839, 2378, 43867, 2389),
(28, 3, 12, 2007, 2013, 9432, 872, 784, 8734);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_states_community`
--

CREATE TABLE `cpi_states_community` (
  `id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_states_community`
--

INSERT INTO `cpi_states_community` (`id`, `state_id`, `month`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(11, 10, 4, 1966, 2008, 9868687, 645, 456, 55, 56767, 675456, 6, 456, 56, 654545),
(13, 2, 1, 2012, 2007, 8732, 7823, 673, 7623, 267, 7823, 8912, 894, 783, 1237),
(14, 2, 0, 2012, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 2, 2, 2012, 2007, 832, 8973, 98, 86768, 5678, 72, 67, 675, 56478, 56),
(16, 2, 3, 2012, 2007, 874, 872, 9812, 9823, 9823, 7823, 8723, 874, 67823, 67823),
(17, 2, 4, 2012, 2007, 8723, 9812, 9734, 873, 874, 7823, 7923, 761, 843, 8723),
(22, 2, 6, 2012, 2007, 87, 465, 78, 67, 67, 768, 54, 5, 534, 645),
(23, 2, 5, 2012, 2007, 876, 8, 89, 7876, 6, 786, 6, 56, 78, 89),
(24, 2, 7, 2012, 2007, 7832, 638, 63737, 836, 736, 6728, 6271, 63725, 735, 83628),
(25, 2, 8, 2012, 2007, 7839, 5426, 53825, 43748, 68726, 627, 739, 983628, 628, 8736),
(26, 2, 9, 2012, 2007, 738, 638, 538, 4845, 36, 6738, 638, 448, 35, 83459),
(27, 2, 10, 2012, 2007, 82389, 7878, 78, 896, 6578, 537, 56, 56, 569, 677),
(28, 2, 11, 2012, 2007, 783, 453, 456, 5467, 6, 675, 6567, 657, 5456, 578),
(29, 2, 12, 2012, 2007, 89, 554, 434, 434, 445, 7676, 6767, 676, 67, 87),
(30, 2, 1, 2013, 2007, 78, 67, 67657, 689, 60, 6455, 656, 689, 667, 667),
(31, 2, 0, 2013, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 2, 3, 2013, 2007, 76, 76, 76, 78, 766, 56, 65, 67, 76, 565),
(33, 2, 2, 2013, 2007, 8776, 7, 7, 56675, 45, 56456, 56, 56765, 45675, 78),
(34, 2, 4, 2013, 2007, 7894, 89, 98, 89, 98, 87, 98, 98, 98, 0),
(35, 2, 5, 2013, 2007, 828, 537, 5387, 87, 897, 637, 6238, 56, 643, 536),
(36, 2, 6, 2013, 2007, 37, 987, 876, 9876, 987634, 456, 2345, 2345, 234, 5876),
(37, 2, 8, 2013, 2007, 456, 456, 456, 8763, 345, 765, 876, 87645, 987, 987),
(38, 2, 7, 2013, 2007, 567, 456, 487, 9876, 9876, 87, 76523, 345, 3456, 234),
(39, 2, 9, 2013, 2007, 748, 6556, 78, 78, 67, 766, 433, 4334, 4334, 44),
(40, 2, 10, 2013, 2007, 8393, 8687, 7667, 676, 67, 839, 989, 898, 988, 9889),
(41, 2, 11, 2013, 2007, 784, 1675, 6513, 6752, 789879, 78263, 9782, 9871, 56, 7656),
(42, 2, 12, 2013, 2007, 839, 678, 765, 7433, 34567, 7678, 655, 456, 56788765, 87654),
(45, 2, 0, 2012, 2007, 8732, 7823, 673, 7623, 267, 7823, 8912, 894, 783, 1237),
(46, 10, 0, 1966, 2008, 100000, 645, 456, 55, 56767, 675456, 6, 456, 56, 654545);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_states_section`
--

CREATE TABLE `cpi_states_section` (
  `id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `Month` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `standard_year` double DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_states_section`
--

INSERT INTO `cpi_states_section` (`id`, `state_id`, `Month`, `year`, `standard_year`, `urban_standard`, `rural_standard`, `urban_ongoing`, `rural_ongoing`) VALUES
(11, 10, 8, 1961, 2008, 879, 8978, 67867, 8989),
(13, 2, 1, 2012, 2007, 180, 320, 200, 330),
(14, 2, 0, 2012, NULL, NULL, NULL, NULL, NULL),
(15, 2, 2, 2012, 2007, 320, 380, 211, 839),
(16, 2, 3, 2012, 2007, 849, 7639, 784, 728),
(17, 2, 4, 2012, 2007, 849, 423, 784, 2345),
(18, 2, 5, 2012, 2007, 25, 435, 654, 766),
(19, 2, 6, 2012, 2007, 767, 788, 564, 453),
(20, 2, 7, 2012, 2007, 8723, 8723, 9823, 32678),
(21, 2, 8, 2012, 2007, 7623, 984, 652, 6453),
(22, 2, 9, 2012, 2007, 7823, 983, 7612, 567),
(23, 2, 10, 2012, 2007, 783, 982, 563, 645),
(24, 2, 11, 2012, 2007, 7923, 3341, 2342, 3424),
(25, 2, 12, 2012, 2007, 8367, 3478, 2367, 2378),
(26, 2, 1, 2013, 2007, 2337, 6347, 7287, 6537),
(27, 2, 0, 2013, NULL, NULL, NULL, NULL, NULL),
(28, 2, 2, 2013, 2007, 7623, 7812, 5612, 5612),
(29, 2, 3, 2013, 2007, 873, 8712, 7623, 762),
(30, 2, 4, 2013, 2007, 4378, 45, 7665, 76456),
(31, 2, 5, 2013, 2007, 5342, 45, 345, 356),
(32, 2, 6, 2013, 2007, 8734, 8723, 652, 65124),
(33, 2, 7, 2013, 2007, 8743, 9823, 6723, 6753),
(34, 2, 8, 2013, 2007, 97834, 783, 7623, 652),
(35, 2, 9, 2013, 2007, 987, 34, 564, 978),
(36, 2, 10, 2013, 2007, 38723, 87389, 78238, 8723),
(37, 2, 11, 2013, 2007, 326, 651278, 5627, 56),
(38, 2, 12, 2013, 2007, 8734, 645, 76, 65);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_sudan_community`
--

CREATE TABLE `cpi_sudan_community` (
  `id` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `year` year(4) NOT NULL,
  `standard_year` double DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_sudan_community`
--

INSERT INTO `cpi_sudan_community` (`id`, `month`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(1, 1, 2012, 2007, 188, 191, 194, 205, 211, 188, 191, 194, 205, 211),
(2, 0, 2012, 2007, 22210, 2891, 7349, 7839, 8766, 930, 7309, 8734, 7660, 8799),
(3, 2, 2012, 2007, 919, 201, 400, 320, 990, 191, 210, 930, 320, 99),
(4, 3, 2012, 2007, 230, 780, 940, 520, 440, 310, 500, 940, 540, 100),
(5, 4, 2012, 2007, 110, 320, 530, 980, 983, 210, 100, 320, 333, 100),
(6, 5, 2012, 2007, 900, 120, 300, 410, 930, 200, 222, 309, 93, 847),
(7, 6, 2012, 2007, 820, 784, 209, 784, 200, 840, 211, 834, 90, 311),
(8, 7, 2012, 2007, 220, 843, 423, 42, 763, 930, 523, 653, 73, 542),
(9, 8, 2012, 2007, 33, 423, 233, 24, 54, 234, 523, 123, 678, 786),
(10, 9, 2012, 2007, 440, 390, 1000, 383, 8300, 210, 783, 328, 1200, 830),
(11, 10, 2012, 2007, 1200, 3289, 783, 980, 9830, 2100, 430, 6010, 829, 830),
(12, 11, 2012, 2007, 3100, 220, 930, 830, 893, 830, 1200, 849, 983, 131),
(13, 12, 2012, 2007, 450, 600, 8329, 783, 781, 320, 580, 398, 762, 6723),
(14, 1, 2013, 2007, 270, 281, 290, 290, 830, 270, 281, 390, 990, 6200),
(16, 2, 2013, 2007, 287, 732, 921, 834, 120, 389, 281, 840, 990, 990),
(17, 3, 2013, 2007, 873, 239, 756, 675, 908, 786, 54, 453, 243, 432),
(18, 4, 2013, 2007, 100, 2000, 983, 287, 740, 120, 8309, 730, 400, 983),
(19, 5, 2013, 2007, 1100, 3320, 739, 1300, 749, 2100, 9830, 739, 972, 639),
(20, 6, 2013, 2007, 783, 120, 849, 782, 730, 787, 930, 7849, 930, 738),
(21, 8, 2013, 2007, 983, 652, 546, 860, 782, 542, 876, 547, 772, 762),
(22, 7, 2013, 2007, 382, 628, 629, 6298, 629, 638, 698, 629, 940, 432),
(23, 9, 2013, 2007, 537, 988, 129, 740, 632, 653, 698, 949, 7329, 983),
(24, 10, 2013, 2007, 783, 8728, 290, 542, 762, 7863, 37, 628, 5627, 762),
(25, 11, 2013, 2007, 783, 8728, 290, 542, 762, 7863, 37, 628, 5627, 762),
(26, 12, 2013, 2007, 676, 4, 4365, 65, 643, 657, 67, 34, 43, 5544),
(27, 0, 2012, 2007, 100, 298, 234, 23, 344, 200, 12, 455, 34, 665),
(28, 0, 2013, 2007, 100, 298, 234, 23, 344, 200, 12, 455, 34, 665);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_sudan_section`
--

CREATE TABLE `cpi_sudan_section` (
  `id` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `standard_year` double DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_sudan_section`
--

INSERT INTO `cpi_sudan_section` (`id`, `month`, `year`, `standard_year`, `urban_standard`, `rural_standard`, `urban_ongoing`, `rural_ongoing`) VALUES
(2, 1, 2012, 2007, 178, 198, 178, 198),
(3, 0, 2012, NULL, NULL, NULL, NULL, NULL),
(4, 2, 2012, 2007, 182, 201, 182, 201),
(5, 3, 2012, 2007, 185, 204, 185, 204),
(6, 4, 2012, 2007, 195, 215, 195, 215),
(7, 5, 2012, 2007, 201, 222, 201, 222),
(8, 6, 2012, 2007, 221, 243, 221, 243),
(9, 7, 2012, 2007, 235, 258, 235, 258),
(10, 8, 2012, 2007, 244, 265, 244, 265),
(11, 9, 2012, 2007, 244, 269, 244, 269),
(12, 10, 2012, 2007, 242, 268, 242, 268),
(13, 12, 2012, 2007, 244, 272, 244, 272),
(14, 11, 2012, 2007, 242, 268, 242, 268),
(15, 1, 2013, 2007, 257, 283, 257, 283),
(16, 0, 2013, NULL, NULL, NULL, NULL, NULL),
(17, 2, 2013, 2007, 269, 244, 269, 244),
(18, 3, 2013, 2007, 273, 302, 273, 302),
(19, 4, 2013, 2007, 274, 306, 274, 306),
(20, 6, 2013, 2007, 279, 310, 279, 310),
(21, 7, 2013, 2007, 290, 321, 290, 321),
(22, 8, 2013, 2007, 302, 329, 302, 329),
(23, 9, 2013, 2007, 313, 347, 313, 347),
(24, 10, 2013, 2007, 343, 374, 343, 374),
(25, 11, 2013, 2007, 352, 386, 352, 386),
(26, 12, 2013, 2007, 282, 392, 282, 392),
(27, 0, 2012, 2007, 123, 234, 234, 100),
(28, 0, 2013, 2007, 265, 723, 45, 468);

-- --------------------------------------------------------

--
-- Table structure for table `cpi_years`
--

CREATE TABLE `cpi_years` (
  `id` int(11) NOT NULL,
  `year` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cpi_years`
--

INSERT INTO `cpi_years` (`id`, `year`) VALUES
(1, 1959),
(2, 1960),
(3, 1961),
(4, 1962),
(5, 1963),
(6, 1964),
(7, 1965),
(8, 1966),
(9, 1967),
(10, 1968),
(11, 1969),
(12, 1970),
(13, 1971),
(14, 1972),
(15, 1973),
(16, 1974),
(17, 1975),
(18, 1976),
(19, 1977),
(20, 1978),
(21, 1979),
(22, 1980),
(23, 1981),
(24, 1982),
(25, 1983),
(26, 1984),
(27, 1985),
(28, 1986),
(29, 1987),
(30, 1988),
(31, 1989),
(32, 1990),
(33, 1991),
(34, 1992),
(35, 1993),
(36, 1994),
(37, 1995),
(38, 1996),
(39, 1997),
(40, 1998),
(41, 1999),
(42, 2000),
(43, 2001),
(44, 2002),
(45, 2003),
(46, 2004),
(47, 2005),
(48, 2006),
(49, 2007),
(50, 2008),
(51, 2009),
(52, 2010),
(53, 2011),
(54, 2012),
(55, 2013),
(56, 2014),
(57, 2015),
(58, 2016),
(59, 2017),
(60, 2018),
(61, 2019),
(62, 2020),
(63, 2021),
(64, 2022),
(65, 2023),
(66, 2024),
(67, 2025),
(68, 2026),
(69, 2027),
(70, 2028),
(71, 2029),
(72, 2030),
(73, 2031),
(74, 2032),
(75, 2033),
(76, 2034),
(77, 2035),
(78, 2036),
(79, 2037),
(80, 2038),
(81, 2039),
(82, 2040);

-- --------------------------------------------------------

--
-- Table structure for table `departments_publications`
--

CREATE TABLE `departments_publications` (
  `id` int(11) NOT NULL,
  `title` varchar(25) NOT NULL,
  `title_ar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments_publications`
--

INSERT INTO `departments_publications` (`id`, `title`, `title_ar`) VALUES
(1, 'social', ''),
(8, 'Economic', ''),
(9, 'SDJ', 'التنمية البشرية');

-- --------------------------------------------------------

--
-- Table structure for table `foriegn_trade`
--

CREATE TABLE `foriegn_trade` (
  `id` float NOT NULL,
  `export` float NOT NULL,
  `import` float NOT NULL,
  `re_export` float NOT NULL,
  `export_qty_index` float NOT NULL,
  `export_value_index` float NOT NULL,
  `import_qty_index` float NOT NULL,
  `import_value_index` float NOT NULL,
  `year` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `foriegn_trade`
--

INSERT INTO `foriegn_trade` (`id`, `export`, `import`, `re_export`, `export_qty_index`, `export_value_index`, `import_qty_index`, `import_value_index`, `year`) VALUES
(5, 776999, 67889, 86690, 7689, 8768990, 767, 8876, 2035);

-- --------------------------------------------------------

--
-- Table structure for table `foriegn_trade_countries`
--

CREATE TABLE `foriegn_trade_countries` (
  `id` int(11) NOT NULL,
  `country` varchar(255) NOT NULL,
  `export` int(11) NOT NULL,
  `import` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `re_export` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `foriegn_trade_countries`
--

INSERT INTO `foriegn_trade_countries` (`id`, `country`, `export`, `import`, `year`, `re_export`) VALUES
(1, 'Albania', 21, 2, 1991, 13),
(2, 'Cambodia', 12, 223, 2008, 33),
(3, 'Afghanistan', 112, 22, 2040, 12),
(4, 'Afghanistan', 1223, 976, 2020, 323),
(6, 'Bahrain', 212, 21, 2021, 21),
(7, 'Algeria', 5778, 6756, 2020, 688);

-- --------------------------------------------------------

--
-- Table structure for table `foriegn_trade_products`
--

CREATE TABLE `foriegn_trade_products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `export_import` tinyint(1) NOT NULL,
  `unit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `foriegn_trade_products`
--

INSERT INTO `foriegn_trade_products` (`id`, `title`, `export_import`, `unit`) VALUES
(2, 'rice', 1, 'sdg'),
(4, 'wheat', 1, 'kg'),
(5, 'cotton', 0, 'gntar'),
(6, 'simsim', 0, 'kg');

-- --------------------------------------------------------

--
-- Table structure for table `foriegn_trade_products_annual`
--

CREATE TABLE `foriegn_trade_products_annual` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `value_unit` int(11) NOT NULL,
  `value_SDG` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `foriegn_trade_products_annual`
--

INSERT INTO `foriegn_trade_products_annual` (`id`, `product_id`, `year`, `value_unit`, `value_SDG`) VALUES
(85, 2, 2020, 33, 22),
(86, 2, 2019, 16, 45),
(87, 4, 2020, 1, 2),
(88, 6, 2020, 56, 22),
(89, 6, 2019, 13, 22),
(90, 5, 2021, 11, 22),
(91, 6, 2021, 12, 56);

-- --------------------------------------------------------

--
-- Table structure for table `foriegn_trade_years`
--

CREATE TABLE `foriegn_trade_years` (
  `id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `export` float NOT NULL,
  `import` float NOT NULL,
  `re_export` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `foriegn_trade_years`
--

INSERT INTO `foriegn_trade_years` (`id`, `year`, `export`, `import`, `re_export`) VALUES
(1, 1987, 22, 20, 22),
(3, 1989, 121, 22, 22),
(4, 1990, 6555, 566, 5666),
(5, 1990, 10000, 8000, 1000);

-- --------------------------------------------------------

--
-- Table structure for table `gdp_annual`
--

CREATE TABLE `gdp_annual` (
  `id` int(11) NOT NULL,
  `gdp_sub_id` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `year` year(4) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gdp_annual`
--

INSERT INTO `gdp_annual` (`id`, `gdp_sub_id`, `state`, `value`, `year`, `created`, `updated`) VALUES
(389, 1, 2, '10000', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(390, 2, 2, '2000', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(391, 3, 2, '3000', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(392, 1, 3, '4000', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(393, 2, 3, '454', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(394, 3, 3, '4575', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(395, 1, 4, '3454', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(396, 2, 4, '5675', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(397, 3, 4, '7776', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(398, 1, 5, '6655', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(399, 2, 5, '7656', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(400, 3, 5, '775', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(401, 1, 6, '7754', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(402, 2, 6, '765', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(403, 3, 6, '767', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(404, 1, 7, '4466', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(405, 2, 7, '556', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(406, 3, 7, '6556', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(407, 1, 8, '556', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(408, 2, 8, '445', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(409, 3, 8, '445', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(410, 1, 9, '4453', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(411, 2, 9, '5675', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(412, 3, 9, '775', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(413, 1, 10, '5775', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(414, 2, 10, '556', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(415, 3, 10, '566', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(416, 1, 11, '567', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(417, 2, 11, '556', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(418, 3, 11, '554', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(419, 1, 12, '335', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(420, 2, 12, '45634', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(421, 3, 12, '567', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(422, 1, 13, '4564', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(423, 2, 13, '5567', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(424, 3, 13, '4567', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(425, 1, 14, '4546', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(426, 2, 14, '446', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(427, 3, 14, '456', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(428, 1, 15, '345', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(429, 2, 15, '356', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(430, 3, 15, '2345', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(431, 1, 16, '356', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(432, 2, 16, '3456', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(433, 3, 16, '5654', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(434, 1, 17, '456', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(435, 2, 17, '45', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(436, 3, 17, '3467', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(437, 1, 18, '5665', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(438, 2, 18, '555', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(439, 3, 18, '456', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(440, 1, 19, '452', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(441, 2, 19, '555', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(442, 3, 19, '4333', 2013, '2021-01-20 07:43:56', '2021-01-20 07:43:56'),
(443, 1, 2, '3000', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(444, 2, 2, '5000', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(445, 3, 2, '4456', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(446, 1, 3, '8999', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(447, 2, 3, '8876', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(448, 3, 3, '45323', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(449, 1, 4, '4435', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(450, 2, 4, '345', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(451, 3, 4, '3533', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(452, 1, 5, '3332', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(453, 2, 5, '687', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(454, 3, 5, '665', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(455, 1, 6, '5443', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(456, 2, 6, '3455', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(457, 3, 6, '4453', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(458, 1, 7, '3342', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(459, 2, 7, '444', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(460, 3, 7, '5546', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(461, 1, 8, '5553', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(462, 2, 8, '353', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(463, 3, 8, '3532', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(464, 1, 9, '45663', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(465, 2, 9, '3453', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(466, 3, 9, '3533', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(467, 1, 10, '3353', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(468, 2, 10, '5553', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(469, 3, 10, '5333', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(470, 1, 11, '6777', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(471, 2, 11, '77', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(472, 3, 11, '7734', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(473, 1, 12, '3444', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(474, 2, 12, '4345', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(475, 3, 12, '4553', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(476, 1, 13, '3544', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(477, 2, 13, '3355', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(478, 3, 13, '3543', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(479, 1, 14, '5533', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(480, 2, 14, '535', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(481, 3, 14, '5335', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(482, 1, 15, '5664', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(483, 2, 15, '4546', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(484, 3, 15, '3644', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(485, 1, 16, '5545', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(486, 2, 16, '54665', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(487, 3, 16, '57', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(488, 1, 17, '866', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(489, 2, 17, '833', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(490, 3, 17, '2344', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(491, 1, 18, '2332', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(492, 2, 18, '433', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(493, 3, 18, '9080', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(494, 1, 19, '6786', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(495, 2, 19, '6675', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(496, 3, 19, '5556', 2014, '2021-02-11 08:07:45', '2021-02-11 08:07:45'),
(497, 1, 2, '5556', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(498, 2, 2, '6446', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(499, 3, 2, '4664', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(500, 1, 3, '4644', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(501, 2, 3, '4664', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(502, 3, 3, '3343', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(503, 1, 4, '8878', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(504, 2, 4, '7887', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(505, 3, 4, '9886', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(506, 1, 5, '6688', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(507, 2, 5, '3454', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(508, 3, 5, '3533', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(509, 1, 6, '3445', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(510, 2, 6, '3353', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(511, 3, 6, '3553', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(512, 1, 7, '3533', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(513, 2, 7, '5335', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(514, 3, 7, '3535', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(515, 1, 8, '3355', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(516, 2, 8, '4523', 2015, '2021-02-11 08:12:33', '2021-02-11 08:12:33'),
(517, 3, 8, '7654', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(518, 1, 9, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(519, 2, 9, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(520, 3, 9, '454', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(521, 1, 10, '5646', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(522, 2, 10, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(523, 3, 10, '4644', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(524, 1, 11, '2344', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(525, 2, 11, '3243', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(526, 3, 11, '3444', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(527, 1, 12, '3443', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(528, 2, 12, '4435', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(529, 3, 12, '3553', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(530, 1, 13, '3545', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(531, 2, 13, '4643', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(532, 3, 13, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(533, 1, 14, '5644', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(534, 2, 14, '4646', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(535, 3, 14, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(536, 1, 15, '4644', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(537, 2, 15, '7456', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(538, 3, 15, '46446', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(539, 1, 16, '4565', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(540, 2, 16, '64464', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(541, 3, 16, '4455', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(542, 1, 17, '455', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(543, 2, 17, '4646', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(544, 3, 17, '4564', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(545, 1, 18, '6446', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(546, 2, 18, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(547, 3, 18, '6554', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(548, 1, 19, '4664', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(549, 2, 19, '6447', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34'),
(550, 3, 19, '6646', 2015, '2021-02-11 08:12:34', '2021-02-11 08:12:34');

-- --------------------------------------------------------

--
-- Table structure for table `gdp_main`
--

CREATE TABLE `gdp_main` (
  `id` int(11) NOT NULL,
  `title` varchar(25) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gdp_main`
--

INSERT INTO `gdp_main` (`id`, `title`, `updated`, `created`) VALUES
(1, 'services sector', '2020-12-30 10:08:52', NULL),
(2, 'Minister', '2021-01-02 08:09:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gdp_main_annual`
--

CREATE TABLE `gdp_main_annual` (
  `id` int(11) NOT NULL,
  `gdp_main_id` int(11) NOT NULL,
  `tot_gdp` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gdp_main_annual`
--

INSERT INTO `gdp_main_annual` (`id`, `gdp_main_id`, `tot_gdp`, `year`, `created`, `updated`) VALUES
(1, 1, 46656, 2015, '2020-12-30 10:09:03', '2020-12-30 10:09:03'),
(2, 1, 7777, 2016, '2020-12-30 10:09:29', '2020-12-30 10:09:29'),
(3, 1, 567, 2017, '2020-12-30 10:09:44', '2020-12-30 10:09:44'),
(4, 1, 98387, 2018, '2020-12-30 10:09:59', '2020-12-30 10:09:59'),
(5, 1, 7828, 2019, '2020-12-30 10:10:13', '2020-12-30 10:10:13'),
(6, 1, 7828, 2020, '2020-12-30 10:10:24', '2020-12-30 10:10:24'),
(7, 2, 45546, 2016, '2021-01-02 08:10:16', '2021-01-02 08:10:16'),
(8, 2, 6876, 2015, '2021-01-02 08:10:41', '2021-01-02 08:10:41'),
(9, 2, 674677, 2014, '2021-01-02 08:10:56', '2021-01-02 08:10:56'),
(11, 2, 9000, 2017, '2021-01-02 12:02:44', '2021-01-02 12:02:44'),
(12, 1, 4654, 2021, '2021-01-02 12:30:32', '2021-01-02 12:30:32'),
(13, 2, 5666, 2018, '2021-01-03 06:43:31', '2021-01-03 06:43:31'),
(14, 2, 67555, 2019, '2021-01-03 06:43:46', '2021-01-03 06:43:46'),
(15, 2, 67986, 2020, '2021-01-03 06:44:02', '2021-01-03 06:44:02'),
(16, 2, 73678, 2021, '2021-01-03 06:44:12', '2021-01-03 06:44:12');

-- --------------------------------------------------------

--
-- Table structure for table `gdp_sub`
--

CREATE TABLE `gdp_sub` (
  `id` int(11) NOT NULL,
  `gdp_main_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gdp_sub`
--

INSERT INTO `gdp_sub` (`id`, `gdp_main_id`, `title`, `created`, `updated`) VALUES
(1, 1, 'electrical', '2020-12-30 10:08:52', '2020-12-30 10:08:52'),
(2, 1, 'transportation', '2020-12-30 10:08:52', '2020-12-30 10:08:52'),
(3, 1, 'civil', '2020-12-30 10:08:52', '2020-12-30 10:08:52'),
(4, 2, 'social', '2021-01-02 08:09:53', '2021-01-02 08:09:53'),
(5, 2, 'animal', '2021-01-02 08:09:53', '2021-01-02 08:09:53'),
(6, 2, 'gomer', '2021-01-02 08:09:53', '2021-01-02 08:09:53');

-- --------------------------------------------------------

--
-- Table structure for table `indicators`
--

CREATE TABLE `indicators` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `unit` varchar(11) DEFAULT NULL,
  `unit_ar` varchar(255) DEFAULT NULL,
  `cycle_type` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `shown` tinyint(1) DEFAULT '0',
  `shown_in_home` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `indicators`
--

INSERT INTO `indicators` (`id`, `title`, `title_ar`, `icon`, `unit`, `unit_ar`, `cycle_type`, `type_id`, `department_id`, `shown`, `shown_in_home`, `created`, `updated`) VALUES
(3, 'Cement', 'اسمنت', 'fas fa-angle-double-up', 'جنيه', 'جنيه', 0, 2, 1, 0, 1, '2020-12-22 06:57:00', '2022-01-11 11:22:27'),
(4, 'Gold', 'الذهب', 'fas fa-life-ring', 'دولار', 'دولار', 1, NULL, 1, 1, 0, '2020-12-28 06:15:54', '2022-01-11 11:32:42'),
(5, 'Skewer', ' سيخ', 'fas fa-anchor', 'جنيه', 'جنيه', 1, 2, 1, 1, 1, '2021-02-08 06:31:33', '2021-08-22 09:23:22'),
(6, 'Dollar', 'الدولار', 'fas fa-dollar-sign', 'جنيه', 'جنيه', 0, 3, 1, 1, 1, '2021-02-11 06:12:48', '2021-08-22 09:25:03'),
(7, 'Euro', 'اليورو', 'fas fa-euro-sign', 'جنيه', 'جنيه', 0, 3, 1, 1, 1, '2021-02-11 06:14:22', '2021-03-04 08:29:05'),
(8, 'Sugar', 'السكر', 'fab fa-superpowers', 'شوال', 'شوال', 1, 4, 1, 1, 1, '2021-02-14 04:48:18', '2021-02-14 06:10:41'),
(9, 'Oil', 'الزيت', 'fas fa-arrow-down', 'Litre', 'لتر', 1, 4, 1, 0, 1, '2021-02-17 11:45:39', '2022-01-11 11:23:23'),
(10, 'Gross Domestic Product at Current Price   ', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(11, 'Gross Domestic Product at Constanr Prices  ', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(12, 'Gross National Product at Current Price ', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(13, 'National Income', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(14, 'Disposable Income', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(15, 'Total Consumption Expenditure', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(16, 'Total Demand', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(17, 'Invetsment', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 1, '2022-01-11 11:28:13', '2022-01-11 11:32:02'),
(18, 'Saving', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(19, 'Current Trans.', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(20, 'Population ^(000.000)', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:30:25'),
(21, 'G.D.P Per.Capita SDG.', 'null', 'fas fa-angle-double-up', 'null', 'null', 5, 6, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:42:09'),
(22, 'National Income Per.Capita', 'null', 'fas fa-angle-double-up', 'null', 'null', 5, 6, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:41:38'),
(23, 'Growth rate', 'null', 'fas fa-angle-double-up', 'null', 'null', 5, 6, 1, 0, 0, '2022-01-11 11:28:13', '2022-01-11 11:42:46'),
(24, ' consumer price index', 'null', 'fas fa-angle-double-up', 'null', 'null', 5, 5, 1, 0, 0, '2022-01-11 11:52:30', '2022-01-11 11:55:17'),
(25, 'Inflation rates', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:52:30', '2022-01-11 11:54:23'),
(26, 'Years', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:52:30', '2022-01-11 11:54:26'),
(27, ' consumer price index_1', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, 1, 0, 0, '2022-01-11 11:52:30', '2022-01-11 11:54:28'),
(28, 'Inflation rates_1', NULL, 'fas fa-angle-double-up', NULL, NULL, 5, NULL, NULL, 0, 0, '2022-01-11 11:52:30', '2022-01-11 11:52:30');

-- --------------------------------------------------------

--
-- Table structure for table `indicators_cycles`
--

CREATE TABLE `indicators_cycles` (
  `id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `cycle` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `indicators_cycles`
--

INSERT INTO `indicators_cycles` (`id`, `indicator_id`, `value`, `cycle`, `created`, `updated`) VALUES
(2, 3, 1000, '2020-12-27', '2020-12-27 07:39:39', '2020-12-27 07:39:39'),
(7, 3, 1400, '2021-01-01', '2020-12-28 04:28:29', '2020-12-28 04:28:29'),
(8, 4, 1200, '2020-12-1', '2020-12-28 06:16:33', '2020-12-28 06:16:33'),
(9, 6, 450, '2021-02-10', '2021-02-11 06:15:01', '2021-02-11 06:15:01'),
(10, 6, 360, '2021-02-11', '2021-02-11 06:15:42', '2021-02-11 06:15:42'),
(11, 7, 650, '2021-02-10', '2021-02-11 06:16:23', '2021-02-11 06:16:23'),
(12, 7, 570, '2021-02-11', '2021-02-11 06:16:45', '2021-02-11 06:16:45'),
(13, 8, 9000, '2021-02-2', '2021-02-14 06:58:16', '2021-02-14 06:58:16'),
(14, 9, 700, '2021-02-3', '2021-02-17 11:46:36', '2021-02-17 11:46:36'),
(15, 7, 700, '2021-03-04', '2021-03-04 08:31:02', '2021-03-04 08:31:02'),
(16, 6, 445, '', '2021-08-22 09:25:58', '2021-08-22 09:25:58'),
(17, 10, 10478, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(18, 11, 11, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(19, 12, 10485, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(20, 13, 9568, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(21, 14, 9614, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(22, 15, 9890, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(23, 16, 11299, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(24, 17, 1409, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(25, 18, -276, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(26, 19, 46, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(27, 20, 28, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(28, 21, 376, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(29, 22, 343, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13'),
(30, 23, 12, 'undefined', '2022-01-11 11:28:13', '2022-01-11 11:28:13');

-- --------------------------------------------------------

--
-- Table structure for table `indicator_types`
--

CREATE TABLE `indicator_types` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `indicator_types`
--

INSERT INTO `indicator_types` (`id`, `title`, `title_ar`, `department_id`, `created`, `updated`) VALUES
(2, 'Building Materials', 'مواد البناء', 1, '2020-12-22 06:55:39', '2021-02-14 06:37:08'),
(3, 'Currency Prices', 'اسعار العملات', 1, '2021-02-11 06:11:30', '2021-02-14 06:37:52'),
(4, 'Glosary', 'المواد التموينية', 1, '2021-02-14 04:46:56', '2021-02-14 06:38:41'),
(5, 'CPI', 'CPI', 1, '2022-01-11 11:40:40', '2022-01-11 11:40:40'),
(6, 'GDP', 'GDP', 1, '2022-01-11 11:41:23', '2022-01-11 11:41:23'),
(7, 'Foreign Trade', 'Foreign Trade', 1, '2022-01-11 11:43:27', '2022-01-11 11:43:27');

-- --------------------------------------------------------

--
-- Table structure for table `inflation_product_community`
--

CREATE TABLE `inflation_product_community` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_product_community`
--

INSERT INTO `inflation_product_community` (`id`, `product_id`, `month`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(2, 5, 8, 1972, 2007, 496786, 6565, 434, 3234, 2667, 767, 545, 676, 67653434, 43436787),
(3, 3, 10, 1972, 2007, 509162, 6597, 34758, 3668, 3102, 1509, 979, 7441, 67660201, 100000);

-- --------------------------------------------------------

--
-- Table structure for table `inflation_product_section`
--

CREATE TABLE `inflation_product_section` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `Month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_product_section`
--

INSERT INTO `inflation_product_section` (`id`, `product_id`, `Month`, `year`, `standard_year`, `urban_standard`, `rural_standard`, `urban_ongoing`, `rural_ongoing`) VALUES
(2, 5, 4, 2021, 2007, 3244, 434536345, 34252345, 45367457),
(3, 5, 6, 1973, 2007, 675, 6554, 6778, 8787);

-- --------------------------------------------------------

--
-- Table structure for table `inflation_states_community`
--

CREATE TABLE `inflation_states_community` (
  `id` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `state_id` int(11) NOT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_states_community`
--

INSERT INTO `inflation_states_community` (`id`, `month`, `state_id`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(2, 9, 2, 1974, 2007, 666, 765, 6778, 6778, 67878, 787, 453445, 5645, 45453, 4545);

-- --------------------------------------------------------

--
-- Table structure for table `inflation_states_section`
--

CREATE TABLE `inflation_states_section` (
  `id` int(11) NOT NULL,
  `state_id` int(11) DEFAULT NULL,
  `Month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_states_section`
--

INSERT INTO `inflation_states_section` (`id`, `state_id`, `Month`, `year`, `standard_year`, `urban_standard`, `rural_standard`, `urban_ongoing`, `rural_ongoing`) VALUES
(4, 3, 8, 1969, 2007, 6756, 6765, 76576, 67),
(5, 3, 7, 1962, 2007, -27665, 56765, 787, 8789);

-- --------------------------------------------------------

--
-- Table structure for table `inflation_sudan_community`
--

CREATE TABLE `inflation_sudan_community` (
  `id` int(11) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `l1_standard` double DEFAULT NULL,
  `l2_standard` double DEFAULT NULL,
  `l3_standard` double DEFAULT NULL,
  `l4_standard` double DEFAULT NULL,
  `l5_standard` double DEFAULT NULL,
  `l1_ongoing` double DEFAULT NULL,
  `l2_ongoing` double DEFAULT NULL,
  `l3_ongoing` double DEFAULT NULL,
  `l4_ongoing` double DEFAULT NULL,
  `l5_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_sudan_community`
--

INSERT INTO `inflation_sudan_community` (`id`, `month`, `year`, `standard_year`, `l1_standard`, `l2_standard`, `l3_standard`, `l4_standard`, `l5_standard`, `l1_ongoing`, `l2_ongoing`, `l3_ongoing`, `l4_ongoing`, `l5_ongoing`) VALUES
(2, 5, 1974, 2008, 21222, 2333, 39400, 423, 1111111, 2000, 29300, 4949, 240, 333333);

-- --------------------------------------------------------

--
-- Table structure for table `inflation_sudan_section`
--

CREATE TABLE `inflation_sudan_section` (
  `id` int(11) NOT NULL,
  `Month` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `standard_year` year(4) DEFAULT NULL,
  `urban_standard` double DEFAULT NULL,
  `rural_standard` double DEFAULT NULL,
  `urban_ongoing` double DEFAULT NULL,
  `rural_ongoing` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inflation_sudan_section`
--

INSERT INTO `inflation_sudan_section` (`id`, `Month`, `year`, `standard_year`, `urban_standard`, `rural_standard`, `urban_ongoing`, `rural_ongoing`) VALUES
(1, 6, 1973, 2008, 2222222, 333333, 11111, 4444444);

-- --------------------------------------------------------

--
-- Table structure for table `info`
--

CREATE TABLE `info` (
  `id` int(11) NOT NULL,
  `vision` text NOT NULL,
  `goal` text NOT NULL,
  `mission` text NOT NULL,
  `visionar` text NOT NULL,
  `missionar` text NOT NULL,
  `goalar` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `info`
--

INSERT INTO `info` (`id`, `vision`, `goal`, `mission`, `visionar`, `missionar`, `goalar`) VALUES
(1, 'Hi National Leadership for The Development of Statistics, a reference for reliable high-quality statistical data and one of the best statistical bodies in the world.', '[\"Promoting statistical advocacy.\",\"Institutional and organizational development.\",\"Human resources management and development.\",\"Infrastructure development.\",\"Use of information technology in the production of statistics.\",\"Data development and management.\",\"Improving cooperation and coordination in the administrative statistics system through the national statistical system.\",\"Data publishing policy.\",\"Coordination of censuses and surveys.\",\"Statistical auditing and review.\"]', 'To provide updated and value-added statistical products and services that are accurate, timely, inclusive and credible, in accordance with the best global standards and practices, and lead in the development of the statistical sector to support decision-making.', 'undefined', 'تقديم منتجاتٍ وخدماتٍ إحصائيةٍ محُدَّثةٍ ذاتِ قيمةٍ مضافة تتميز بالدقة والآنية والشمولية والمصداقية، وفقًا لأفضل المعايير والممارسات العالمية، والريادة في تطوير القطاع الإحصائي لدعم اتخاذ القرار.', '[\"تعزيز المناصرة الإحصائية.\",\"التطوير المؤسسي والتنظيمي.\",\"إدارة وتنمية الموارد البشرية.\",\"تطوير البنية التحتية.\",\"استخدام تكنلوجيا المعلومات في عمليات انتاج الاحصائيات.\",\"تطوير وإدارة البيانات.\",\"تحسين التعاون والتنسيق في نظام الإحصاءآت الادارية عبر النظام الإحصائي الوطني.\",\"سياسة ونشر البيانات.\",\"تنسيق التعدادات والمسوح.\",\"التدقيق والمراجعة الإحصائية.\"]');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `action` int(11) NOT NULL,
  `tab` varchar(255) NOT NULL,
  `table_id` int(11) NOT NULL,
  `descr` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cretaed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `national_accounts_indicators`
--

CREATE TABLE `national_accounts_indicators` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `national_accounts_indicators_values`
--

CREATE TABLE `national_accounts_indicators_values` (
  `id` int(11) NOT NULL,
  `nat_id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `img` text NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `body_en` text,
  `body_ar` text,
  `shown` tinyint(1) DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `img`, `title_en`, `title_ar`, `body_en`, `body_ar`, `shown`, `created`, `updated`) VALUES
(11, '1608804862660.jpg', 'Export prices', 'undefined', 'The Producer Price Index increased by 0.2 percent between October and November 2020. Prices increased by 0.8 percent on the domestic market and decreased by 0.6 percent on the export market. On the import market, prices remained unchanged. The annual rate according to the Producer Price Index was -4.4 percent in November 2020', 'undefined', 1, '2020-12-24 10:14:26', '2021-12-27 11:38:56'),
(12, '1608804985717.jpg', 'Export and import prices remained low in November 2020', 'undefined', 'The Producer Price Index increased by 0.2 percent between October and November 2020. Prices increased by 0.8 percent on the domestic market and decreased by 0.6 percent on the export market. On the import market, prices remained unchanged. The annual rate according to the Producer Price Index was -4.4 percent in November 2020', 'undefined', 1, '2020-12-24 10:16:38', '2021-01-26 08:11:14'),
(13, '1608805127667.jpg', 'sustainable development goals in sudan', 'undefined', 'The global agenda on sustainable development is best expressed through the SDGs, what one can best describe as the ultimate measure of progress which is about prosperity for people and planet.', 'undefined', 1, '2020-12-24 10:18:53', '2021-01-26 08:11:20'),
(15, '1608805764077.jpeg', 'The General Authority for Statistics opinion and comments of the public  Statistics Law', 'undefined', 'Based on the principles of openness and transparency, the General Authority for Statistics is inviting the public to express their opinions and suggestions regarding the proposed statistics law via e-mail (SLR@stats.gov.sa), before 09/04/1442 AH corresponding to 24/11/2020....', 'undefined', 1, '2020-12-24 10:29:35', '2020-12-24 10:30:26'),
(16, '1608805935495.jpg', 'World Statistics Day', 'undefined', 'Under the economic slogan in their economies and their importance in their commercial economies.', 'undefined', 1, '2020-12-24 10:32:49', '2020-12-24 10:42:10'),
(17, '17_1610959706271.jpg', 'sustainable deve', 'undefined', 'Based on the principles of openness and transparency, the General Authority for Statistics is inviting the public to express their opinions and suggestions regarding the proposed statistics law via e-mail (SLR@stats.gov.sa), before 09/04/1442 AH corresponding to 24/11/2020....', 'undefined', 1, '2020-12-24 10:41:21', '2021-01-26 08:11:27'),
(20, '1640605725659.png', 'SDJ', 'التنمية المستدامة', 'In 2015 all UN member states adopted the Sustainable Development Goals (SDGs), also known as the Global Goals, as a global call to action to end', 'اعتمدت جميع الدول الأعضاء في الأمم المتحدة في عام 2015 أهداف التنمية المستدامة (SDGs) ، والتي تُعرف أيضًا باسم الأهداف العالمية ، باعتبارها دعوة عالمي', 0, '2021-12-27 11:48:46', '2021-12-27 11:50:24');

-- --------------------------------------------------------

--
-- Table structure for table `organiztion_chart`
--

CREATE TABLE `organiztion_chart` (
  `id` int(11) NOT NULL,
  `img` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position_job` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `organiztion_chart`
--

INSERT INTO `organiztion_chart` (`id`, `img`, `name`, `position_job`) VALUES
(2, '2_.jpeg', 'Abd Allah NoorAldaiem', 'IT Department Manager'),
(3, '3_.jpg', 'Kamal Ali', 'Social Department Manager'),
(4, '4_.jpg', 'Leena AL-Sheak', 'Minister of Social Development'),
(5, '5_.jpg', 'Dr.Ali Abas', 'AL Manager'),
(6, '6_.jpg', 'Alalm Abdelghany', 'Economic Department Manger');

-- --------------------------------------------------------

--
-- Table structure for table `population`
--

CREATE TABLE `population` (
  `id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `age_group_id` int(11) NOT NULL,
  `rural_male_value` int(11) NOT NULL,
  `rural_female_value` int(10) NOT NULL,
  `urban_male_value` int(10) NOT NULL,
  `urban_female_value` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `population`
--

INSERT INTO `population` (`id`, `state_id`, `year`, `age_group_id`, `rural_male_value`, `rural_female_value`, `urban_male_value`, `urban_female_value`) VALUES
(1, 1, 2020, 1, 1, 2, 3, 4),
(2, 1, 2020, 2, 5, 6, 7, 8),
(3, 1, 2020, 3, 9, 10, 11, 12),
(4, 2, 2020, 1, 1, 8, 50, 16),
(5, 2, 2020, 2, 17, 188, 19, 20),
(6, 2, 2020, 3, 21, 22, 35, 24),
(7, 3, 2020, 1, 78, 27, 27, 28),
(8, 3, 2020, 2, 29, 30, 31, 32),
(9, 3, 2020, 3, 33, 34, 35, 36),
(10, 4, 2020, 1, 37, 38, 39, 40),
(11, 4, 2020, 2, 80, 42, 43, 44),
(12, 4, 2020, 3, 45, 46, 47, 48),
(13, 5, 2020, 1, 49, 50, 51, 52),
(14, 5, 2020, 2, 53, 54, 55, 56),
(15, 5, 2020, 3, 57, 58, 59, 60),
(16, 6, 2020, 1, 61, 63, 64, 64),
(17, 6, 2020, 2, 65, 66, 67, 68),
(18, 6, 2020, 3, 69, 70, 71, 72),
(19, 7, 2020, 1, 73, 74, 75, 76),
(20, 7, 2020, 2, 77, 78, 79, 80),
(21, 7, 2020, 3, 81, 82, 83, 84),
(22, 8, 2020, 1, 85, 86, 87, 88),
(23, 8, 2020, 2, 89, 90, 91, 92),
(24, 8, 2020, 3, 93, 94, 95, 96),
(25, 9, 2020, 1, 97, 98, 99, 100),
(26, 9, 2020, 2, 101, 102, 103, 104),
(27, 9, 2020, 3, 105, 106, 107, 108),
(28, 10, 2020, 1, 109, 110, 111, 112),
(29, 10, 2020, 2, 113, 114, 115, 116),
(30, 10, 2020, 3, 117, 118, 119, 120),
(31, 11, 2020, 1, 121, 122, 123, 124),
(32, 11, 2020, 2, 125, 126, 127, 128),
(33, 11, 2020, 3, 129, 130, 131, 132),
(34, 12, 2020, 1, 133, 134, 135, 136),
(35, 12, 2020, 2, 137, 138, 139, 140),
(36, 12, 2020, 3, 141, 142, 143, 144),
(37, 13, 2020, 1, 145, 146, 147, 148),
(38, 13, 2020, 2, 149, 150, 151, 152),
(39, 13, 2020, 3, 153, 154, 155, 156),
(40, 14, 2020, 1, 157, 158, 160, 160),
(41, 14, 2020, 2, 161, 162, 163, 164),
(42, 14, 2020, 3, 165, 166, 167, 168),
(43, 15, 2020, 1, 169, 170, 171, 172),
(44, 15, 2020, 2, 173, 174, 175, 176),
(45, 15, 2020, 3, 177, 178, 179, 180),
(46, 16, 2020, 1, 181, 182, 183, 184),
(47, 16, 2020, 2, 185, 186, 187, 188),
(48, 16, 2020, 3, 189, 190, 191, 192),
(49, 17, 2020, 1, 193, 194, 195, 196),
(50, 17, 2020, 2, 197, 198, 199, 200),
(51, 17, 2020, 3, 201, 202, 700, 204),
(52, 18, 2020, 1, 205, 206, 207, 208),
(53, 18, 2020, 2, 209, 210, 211, 212),
(54, 18, 2020, 3, 213, 214, 215, 216),
(55, 19, 2020, 1, 217, 218, 219, 220),
(56, 19, 2020, 2, 221, 222, 223, 223),
(57, 19, 2020, 3, 224, 225, 226, 227);

-- --------------------------------------------------------

--
-- Table structure for table `population_data`
--

CREATE TABLE `population_data` (
  `id` int(11) NOT NULL,
  `state_id` int(11) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  `growth_rate` double DEFAULT NULL,
  `life_excp` double DEFAULT NULL,
  `cbr` double DEFAULT NULL,
  `cdr` double DEFAULT NULL,
  `literacy_male` double DEFAULT NULL,
  `literacy_female` double DEFAULT NULL,
  `dr` double DEFAULT NULL,
  `un_emp` double DEFAULT NULL,
  `mics` double DEFAULT NULL,
  `imr` double DEFAULT NULL,
  `tfr` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `population_data`
--

INSERT INTO `population_data` (`id`, `state_id`, `year`, `growth_rate`, `life_excp`, `cbr`, `cdr`, `literacy_male`, `literacy_female`, `dr`, `un_emp`, `mics`, `imr`, `tfr`) VALUES
(2, 3, 2020, 66666, 555, 444, 333, 222, 111, 999, 888, 777, 90990, 989),
(3, 2, 2021, 55, 87, 9879, 879854, 65, 465, 42, 487745, 185, 254, 875462);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sector_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `main_valueTitle` varchar(50) NOT NULL,
  `sub_valueTiltle` varchar(50) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `production` tinyint(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sector_id`, `title`, `main_valueTitle`, `sub_valueTiltle`, `unit`, `production`, `created`, `updated`) VALUES
(2, 3, 'Cotton', 'Implanted', 'Harvested', 'tons', 1, '2020-12-29 14:22:32', '2020-12-30 07:04:07'),
(3, 3, 'Bean', 'Implanted', 'Harvested', 'tons', 0, '2020-12-30 07:09:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_annual`
--

CREATE TABLE `product_annual` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `state_id` int(11) NOT NULL,
  `main_valueTitle` double NOT NULL,
  `sub_valueTiltle` double NOT NULL,
  `production` int(11) DEFAULT NULL,
  `productivity` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_annual`
--

INSERT INTO `product_annual` (`id`, `product_id`, `year`, `state_id`, `main_valueTitle`, `sub_valueTiltle`, `production`, `productivity`, `created`, `updated`) VALUES
(1, 2, 2020, 2, 500000, 6000, 234, 12, '2020-12-30 13:52:44', '2021-02-07 12:51:07'),
(2, 2, 2020, 5, 3000, 1000, 0, 0, '2020-12-31 12:54:38', '2021-01-11 00:49:43'),
(3, 3, 2021, 2, 7800, 899, 0, 0, '2020-12-31 13:03:19', '2021-01-11 02:43:23'),
(4, 2, 2021, 3, 1111, 22, 97, 7426, '2020-12-31 13:43:15', '2021-01-05 08:32:01');

-- --------------------------------------------------------

--
-- Table structure for table `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `img` text NOT NULL,
  `file` text NOT NULL,
  `year` year(4) NOT NULL,
  `department` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `publications`
--

INSERT INTO `publications` (`id`, `title`, `title_ar`, `img`, `file`, `year`, `department`, `created`, `updated`) VALUES
(31, 'MUX 2021', 'population 1977', '_1608711325657.jpg', '_1608711325656.pdf', 2020, 1, '2020-12-23 08:15:25', '2021-01-10 13:34:58'),
(35, 'MUX 2021', 'population 1977', '_1608712479657.jpg', '_1608712479656.pdf', 2020, 1, '2020-12-23 08:34:39', '2021-01-10 13:34:58'),
(37, 'MUX 2021', 'population 1977', '_1608713477183.jpg', '_1608713477182.docx', 2020, 1, '2020-12-23 08:51:17', '2021-01-10 13:34:58'),
(39, 'MUX 2021', 'population 1977', '_1608713790422.jpg', '_1608713790421.pdf', 2020, 1, '2020-12-23 08:56:30', '2021-01-10 13:34:58'),
(43, 'MUX 2021', 'population 1977', '_1608810619048.jpg', '_1608810619047.pdf', 2020, 1, '2020-12-24 11:50:19', '2021-01-10 13:34:58'),
(44, 'MUX 2021', 'population 1977', '_1609154772067.jpg', '_1609154772066.pdf', 2020, 1, '2020-12-28 11:26:12', '2021-01-10 13:34:58'),
(45, 'MUX 2021', 'population 1977', '_1609156697316.jpg', '_1609156697315.pdf', 2020, 1, '2020-12-28 11:58:17', '2021-01-10 13:34:58'),
(46, 'MUX 2021', 'population 1977', '_1609325401221.jpg', '_1609325401220.pdf', 2020, 1, '2020-12-30 10:50:01', '2021-01-10 13:34:58'),
(48, 'MUX 2021', 'population 1977', '_1609325530886.jpg', '_1609325530885.pdf', 2020, 1, '2020-12-30 10:52:10', '2021-01-10 13:34:58'),
(49, 'MUX 2021', 'population 1977', '_1609405063532.png', '_1609405063531.pdf', 2020, 1, '2020-12-31 08:57:43', '2021-01-10 13:34:58'),
(51, 'MUX 2021', 'population 1977', '_1609409568817.jpg', '_1609409568816.pdf', 2020, 1, '2020-12-31 10:12:48', '2021-01-10 13:34:58'),
(52, 'MUX 2021', 'population 1977', '_1609409693329.jpg', '_1609409693328.pdf', 2020, 1, '2020-12-31 10:14:53', '2021-01-10 13:34:58'),
(53, 'MUX 2021', 'population 1977', '_1609409693340.jpg', '_1609409693339.pdf', 2020, 1, '2020-12-31 10:14:53', '2021-01-10 13:34:58'),
(55, 'MUX 2021', 'population 1977', '_1609410220379.jpg', '_1609410220378.pdf', 2020, 1, '2020-12-31 10:23:40', '2021-01-10 13:34:58'),
(56, 'MUX 2021', 'population 1977', '_1609412109912.jpg', '_1609412109911.pdf', 2020, 1, '2020-12-31 10:55:09', '2021-01-10 13:34:58'),
(57, 'MUX 2021', 'population 1977', '_1609414647301.jpg', '_1609414647300.pdf', 2020, 1, '2020-12-31 11:37:27', '2021-01-10 13:34:58'),
(58, 'MUX 2021', 'population 1977', '_1609415217543.jpeg', '_1609415217542.pdf', 2020, 1, '2020-12-31 11:46:57', '2021-01-10 13:34:58'),
(59, 'MUX 2021', 'population 1977', '_1609415569575.jpg', '_1609415569574.pdf', 2020, 1, '2020-12-31 11:52:49', '2021-01-10 13:34:58'),
(60, 'MUX 2021', 'population 1977', '_1609415773759.jpg', '_1609415773758.pdf', 2020, 1, '2020-12-31 11:56:13', '2021-01-10 13:34:58'),
(62, 'MUX 2021', 'population 1977', '_1609415897544.jpg', '_1609415897543.pdf', 2020, 1, '2020-12-31 11:58:17', '2021-01-10 13:34:58'),
(64, 'Foreign trade', 'Foreign trade', '_1610439274700.pdf', '_1610439274699.jpg', 2021, 7, '2021-01-12 08:14:34', NULL),
(65, 'Foreign trade2', 'Foreign trade2', '_1610439716801.pdf', '_1610439716800.jpg', 2021, 7, '2021-01-12 08:21:56', NULL),
(66, 'Foreign trade 2021', 'Foreign trade 2021', '_1610440240774.pdf', '_1610440240773.jpeg', 2021, 7, '2021-01-12 08:30:40', NULL),
(72, 'POPULATION INDICATORS', 'مؤشرات  التعداد السكاني', '_1613036075347.jpg', '_1613036075346.pdf', 2021, 1, '2021-02-11 09:34:35', NULL),
(75, 'POPULATION PROJECTION', 'الإسقاط السكاني', '_1613037509383.png', '_1613037509382.pdf', 2021, 1, '2021-02-11 09:58:29', NULL),
(76, 'Statistical Year Book CPI', 'الكتاب الاحصائي الارقام القياسية', '_1640604556255.PNG', '_1640604556254.docx', 2021, 8, '2021-12-27 11:29:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` int(11) NOT NULL,
  `title` varchar(25) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `title`, `created`, `updated`) VALUES
(3, 'Agricultural', '2020-12-15 07:28:49', '2020-12-29 12:13:59'),
(5, 'gta', '2020-12-15 07:49:09', NULL),
(6, 'hdh', '2020-12-15 14:15:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sectors_annual`
--

CREATE TABLE `sectors_annual` (
  `id` int(11) NOT NULL,
  `sector_id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `Contribution_rate` int(11) NOT NULL,
  `growth_rate` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sectors_annual`
--

INSERT INTO `sectors_annual` (`id`, `sector_id`, `year`, `Contribution_rate`, `growth_rate`, `created`, `updated`) VALUES
(4, 3, 2019, 50, 311, '2020-12-30 12:10:33', '2021-01-05 03:58:03'),
(5, 2, 2021, 70, 21, '2020-12-30 12:11:18', '2021-01-04 06:26:49'),
(6, 3, 2021, 30, 98, '2020-12-30 12:12:58', '2021-01-04 06:26:44'),
(7, 2, 2019, 50, 15, '2021-01-05 03:57:51', NULL),
(8, 3, 2021, 90, 10, '2021-12-28 11:55:28', NULL),
(9, 3, 2020, 90, 10, '2021-12-28 11:56:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finish_time` timestamp NULL DEFAULT NULL,
  `ip` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `socket_id` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `client_os_name` varchar(255) NOT NULL,
  `client_os_version` varchar(255) NOT NULL,
  `client_browser_name` varchar(255) NOT NULL,
  `client_browser_version` varchar(255) NOT NULL,
  `client_device` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `start_time`, `finish_time`, `ip`, `token`, `socket_id`, `user_type`, `location`, `client_os_name`, `client_os_version`, `client_browser_name`, `client_browser_version`, `client_device`) VALUES
(5833, 0, '2021-03-04 07:04:48', NULL, '::ffff:77.111.247.8', NULL, '-xJtcPO4lXgZVQPLAAAe', NULL, 'Europe/Vaduz', 'Windows', '10', 'Opera', '74.0', 'Desktop'),
(5834, 0, '2021-03-04 07:21:31', '2021-03-04 07:30:11', '::ffff:196.202.131.114', NULL, '2xZigHYJ1D1oAXOpAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '88', 'Desktop'),
(5835, 0, '2021-03-04 07:21:57', '2021-03-04 07:29:13', '::ffff:196.223.157.18', NULL, '4tHZD3CoaUxv3oOKAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5836, 0, '2021-03-04 07:29:16', '2021-03-04 07:30:11', '::ffff:196.202.131.114', NULL, 'lidbQ_DuOa2HlRnYAAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5837, 0, '2021-03-04 07:30:16', '2021-03-04 07:31:17', '::ffff:196.202.131.114', NULL, '9jg0n9-2Negxm7S7AAAF', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '88', 'Desktop'),
(5838, 0, '2021-03-04 07:30:16', '2021-03-04 07:45:32', '::ffff:196.202.131.114', NULL, 'Gj8BbbX94uXcApQaAAAG', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5839, 0, '2021-03-04 07:31:06', '2021-03-04 07:58:41', '::ffff:196.202.131.114', NULL, 'YwmRqxWFnvsuPh2yAAAH', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '88', 'Desktop'),
(5840, 0, '2021-03-04 07:45:35', '2021-03-04 08:02:20', '::ffff:196.202.131.114', NULL, 'WjIbWzv00p5tYAwJAAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5841, 0, '2021-03-04 07:48:10', '2021-03-04 07:50:42', '::ffff:196.202.131.114', NULL, '6bd90YSBM-2po5mPAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5842, 0, '2021-03-04 07:50:46', '2021-03-04 07:53:05', '::ffff:196.223.157.18', NULL, 'wpTxIE_X7xgaI1twAAAK', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5843, 0, '2021-03-04 07:53:07', '2021-03-04 07:58:30', '::ffff:196.202.131.114', NULL, 'soA4n9w1KLvIteZkAAAL', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5844, 0, '2021-03-04 07:58:43', NULL, '::ffff:196.223.157.18', NULL, '12pUUW4gMZmfSP8oAAAM', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '88', 'Desktop'),
(5845, 0, '2021-03-04 07:58:56', NULL, '::ffff:196.223.157.18', NULL, 'rCRIWi2bYC0R8pcbAAAN', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5846, 0, '2021-03-04 08:02:26', NULL, '::ffff:196.223.157.18', NULL, 'KAGndEQu2e3iuuuPAAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5847, 0, '2021-03-04 08:05:38', '2021-03-04 09:21:38', '::ffff:196.223.157.18', NULL, 'TTCiCqhtpkmGXOXNAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5848, 0, '2021-03-04 08:05:38', '2021-03-04 09:06:43', '::ffff:196.202.131.114', NULL, 'Y58vEkrIibqTQQQSAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '88', 'Desktop'),
(5849, 0, '2021-03-04 08:05:38', '2021-03-04 08:29:10', '::ffff:196.202.131.114', NULL, 'KTub3vkGqaPuCTRAAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5850, 0, '2021-03-04 08:29:12', '2021-03-04 08:31:04', '::ffff:196.202.131.114', NULL, 'HFK_E2SbC6VSKtXrAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5851, 0, '2021-03-04 08:31:09', '2021-03-04 09:07:11', '::ffff:196.223.157.18', NULL, 'B0_WaUe8nPFd8dGLAAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5852, 0, '2021-03-04 09:07:13', '2021-03-04 09:07:43', '::ffff:196.202.131.114', NULL, 'OPSpUR8QejL4YloyAAAF', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5853, 0, '2021-03-04 09:07:20', '2021-03-04 09:07:24', '::ffff:196.202.131.114', NULL, '_UEn_jh9iaON1V_fAAAH', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5854, 0, '2021-03-04 09:07:26', '2021-03-04 09:07:26', '::ffff:196.202.131.114', NULL, '8o16xSmamkb-Z6KlAAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5855, 0, '2021-03-04 09:07:29', '2021-03-04 09:07:29', '::ffff:196.223.157.18', NULL, 'SKkx3aUTroiqxqyoAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5856, 0, '2021-03-04 09:07:35', '2021-03-04 09:07:37', '::ffff:196.202.131.114', NULL, 'hmbIeP3y2tgGri2pAAAM', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5857, 0, '2021-03-04 09:07:39', '2021-03-04 09:08:09', '::ffff:196.202.131.114', NULL, '6TLtHXmmrd5nlUMPAAAN', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5858, 0, '2021-03-04 09:07:42', '2021-03-04 09:07:55', '::ffff:196.202.131.114', NULL, 'Yf8-HIbN2KouGxR2AAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5859, 0, '2021-03-04 09:07:57', '2021-03-04 09:07:57', '::ffff:196.223.157.18', NULL, 'tCZNkteyl5v3FiofAAAP', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5860, 0, '2021-03-04 09:07:59', '2021-03-04 09:08:00', '::ffff:196.202.131.114', NULL, 'zaXxk3XSRGHqxUseAAAQ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5861, 0, '2021-03-04 09:08:02', '2021-03-04 09:08:44', '::ffff:196.202.131.114', NULL, 't0661Hyca-VbHPvMAAAR', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5862, 0, '2021-03-04 09:08:46', '2021-03-04 09:08:46', '::ffff:196.202.131.114', NULL, 'L04s6M6xSL8kO00NAAAS', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5863, 0, '2021-03-04 09:08:48', '2021-03-04 09:08:49', '::ffff:196.202.131.114', NULL, 'mMOivJjgtRzYRgllAAAT', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5864, 0, '2021-03-04 09:08:50', '2021-03-04 09:08:55', '::ffff:196.202.131.114', NULL, 'kZzXxGqI1N86QF35AAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5865, 0, '2021-03-04 09:08:56', '2021-03-04 09:09:02', '::ffff:196.202.131.114', NULL, 'S25d9FnfbP6MBO5SAAAV', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5866, 0, '2021-03-04 09:09:04', '2021-03-04 09:09:07', '::ffff:196.223.157.18', NULL, 'c0mBeVluOERgYRYaAAAW', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5867, 0, '2021-03-04 09:09:08', '2021-03-04 09:09:11', '::ffff:196.223.157.18', NULL, 'hzyUr23FWn-klkBwAAAX', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5868, 0, '2021-03-04 09:09:13', '2021-03-04 09:21:39', '::ffff:196.223.157.18', NULL, '2JhVLFCJ7Vqha6TTAAAY', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.182', 'Desktop'),
(5869, 0, '2021-03-04 09:59:13', '2021-03-04 10:13:48', '::ffff:102.143.200.235', NULL, 'baZRSWMRM5sZ2RyyAAAZ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Firefox', '86.0', 'Desktop'),
(5870, 0, '2021-03-04 10:15:42', '2021-03-04 10:16:12', '::ffff:102.143.200.235', NULL, 'PCgrFh7bo5mR6kCJAAAc', NULL, 'Africa/Khartoum', 'Windows', '10', 'Firefox', '86.0', 'Desktop'),
(5871, 0, '2021-03-09 13:42:27', NULL, '::ffff:102.181.56.131', NULL, 'U2xklZGLRDjho6wlAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5872, 0, '2021-03-09 13:42:52', '2021-03-09 13:45:11', '::ffff:102.181.56.131', NULL, 'oc_hL9O2JvJhWLchAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5873, 0, '2021-03-09 13:45:26', NULL, '::ffff:102.181.56.131', NULL, 'bggfW0m9fi8o2pBmAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5874, 0, '2021-03-09 13:46:30', '2021-03-09 14:12:58', '::ffff:102.181.56.131', NULL, 'wiTga3q2rzyMtnoAAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5875, 0, '2021-03-09 14:13:29', '2021-03-09 14:16:36', '::ffff:102.143.206.103', NULL, 'A27oLGuXwXCvY5XxAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5876, 0, '2021-03-09 14:16:47', '2021-03-09 14:17:41', '::ffff:102.143.206.103', NULL, 'fvmcgVbpVj3nSvNUAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5877, 0, '2021-03-09 14:17:49', '2021-03-09 14:23:44', '::ffff:102.143.206.103', NULL, 'vU6m38JYJrLzjTDkAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5878, 0, '2021-03-09 14:24:13', '2021-03-09 14:24:43', '::ffff:102.143.206.103', NULL, 'oKRvq_P1peBR9TW1AAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5879, 0, '2021-03-09 14:24:41', '2021-03-09 14:26:02', '::ffff:102.143.206.103', NULL, '2Hmd_gaIGn4wPMrXAAAF', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5880, 0, '2021-03-09 14:26:38', '2021-03-09 14:27:08', '::ffff:102.143.206.103', NULL, '6pJ099jg6ic-hcEQAAAG', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5881, 0, '2021-03-09 14:27:18', '2021-03-09 14:27:47', '::ffff:102.143.206.103', NULL, 'u5Uce181jDfKl2u5AAAH', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5882, 0, '2021-03-09 14:28:03', '2021-03-09 14:28:36', '::ffff:102.143.206.103', NULL, 'dWy2ncuuJVEWqN6BAAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5883, 0, '2021-03-09 14:28:25', '2021-03-09 15:43:48', '::ffff:102.181.56.131', NULL, 'vdhpIwICdwwhlITXAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5884, 0, '2021-03-09 15:45:05', '2021-03-09 17:17:24', '::ffff:102.181.56.131', NULL, 'FTA7hvjRs6DU9UxTAAAK', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5885, 0, '2021-03-10 06:33:34', '2021-03-10 06:34:20', '::ffff:102.143.202.72', NULL, 'YJonL6iGMyxnc9vFAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5886, 0, '2021-03-10 12:00:23', '2021-03-10 12:00:53', '::ffff:102.143.202.72', NULL, 'WlP3KwvUC493B3rRAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5887, 0, '2021-03-10 12:01:25', '2021-03-10 12:01:55', '::ffff:102.143.202.72', NULL, 'qjNauByYpySId-73AAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5888, 0, '2021-03-10 12:02:18', '2021-03-10 12:02:48', '::ffff:102.143.202.72', NULL, 'tpT1KQsDvw7N5NTaAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5889, 0, '2021-03-10 12:04:09', '2021-03-10 12:05:11', '::ffff:102.143.202.72', NULL, 'eW1tOp_tqC5ZllozAAAG', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5890, 0, '2021-03-10 12:06:59', '2021-03-10 12:07:32', '::ffff:102.143.202.72', NULL, 'mM6TJ1qUoSZ_FPeHAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5891, 0, '2021-03-10 12:08:31', '2021-03-10 12:09:06', '::ffff:102.143.202.72', NULL, 'ZbKMyLrr6IpZtoSxAAAK', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5892, 0, '2021-03-10 12:09:22', '2021-03-10 12:09:54', '::ffff:102.143.202.72', NULL, 'oR1qkg45ipfgYuSvAAAL', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5893, 0, '2021-03-10 12:10:34', '2021-03-10 12:11:05', '::ffff:102.143.202.72', NULL, 'e-Mxonhx899QRH-AAAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5894, 0, '2021-03-10 12:11:41', '2021-03-10 12:12:25', '::ffff:102.143.202.72', NULL, 'FRGDp9hojId_RIzyAAAP', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5895, 0, '2021-03-10 12:12:38', NULL, '::ffff:102.143.202.72', NULL, '9CIWYQv5PoiM1swsAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5896, 0, '2021-03-10 12:12:42', NULL, '::ffff:102.143.202.72', NULL, '9CIWYQv5PoiM1swsAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5897, 0, '2021-03-10 12:13:22', '2021-03-10 12:14:16', '::ffff:102.143.202.72', NULL, 'dQ50M4yboOZYeZw5AAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5898, 0, '2021-03-10 12:16:58', '2021-03-10 12:18:41', '::ffff:102.143.202.72', NULL, '3P916zgAzCvdk1mwAAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5899, 0, '2021-03-10 12:20:34', '2021-03-10 12:33:20', '::ffff:102.143.202.72', NULL, 'DzbHyDALFLgZla96AAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5900, 0, '2021-03-10 12:20:35', '2021-03-10 12:33:20', '::ffff:102.143.202.72', NULL, 'DzbHyDALFLgZla96AAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5901, 0, '2021-03-10 12:33:26', '2021-03-10 12:36:44', '::ffff:102.143.202.72', NULL, 'h8HOxBzAi_fMeqbvAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5902, 0, '2021-03-10 12:36:57', '2021-03-10 12:37:22', '::ffff:102.143.202.72', NULL, 'AaE6zr0TXk1p4ADVAAAK', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5903, 0, '2021-03-10 12:37:49', '2021-03-10 12:38:19', '::ffff:102.143.202.72', NULL, '0bUoCLcTOw6nFSAhAAAL', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5904, 0, '2021-03-10 12:38:39', '2021-03-10 12:39:09', '::ffff:102.143.202.72', NULL, 'nRrZ731roynbHMJ1AAAM', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5905, 0, '2021-03-10 12:39:11', '2021-03-10 12:40:07', '::ffff:102.143.202.72', NULL, 'c-WhFGenxlyOm7qGAAAN', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5906, 0, '2021-03-10 12:40:35', '2021-03-10 12:41:05', '::ffff:102.143.202.72', NULL, 'TkZ2NfU9ub8BAtcdAAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5907, 0, '2021-03-10 12:41:04', '2021-03-10 12:41:34', '::ffff:102.143.202.72', NULL, '9PMWp7YijGjzF4grAAAP', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5908, 0, '2021-03-10 12:41:40', '2021-03-10 12:42:12', '::ffff:102.143.202.72', NULL, 'FlSYdDks1HXJd5DJAAAQ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5909, 0, '2021-03-10 12:42:33', '2021-03-10 12:43:03', '::ffff:102.143.202.72', NULL, 'Nhxw6mr9rotwmfE4AAAR', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5910, 0, '2021-03-10 12:43:02', '2021-03-10 12:44:50', '::ffff:102.143.202.72', NULL, 'h9gnIDQJmBd8Hv1pAAAS', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5911, 0, '2021-03-10 12:44:59', '2021-03-10 12:46:22', '::ffff:102.143.202.72', NULL, 'eiUXQWw41wBHQCGvAAAT', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5912, 0, '2021-03-10 12:46:26', '2021-03-10 12:48:14', '::ffff:102.143.202.72', NULL, '4CkKVdVoiBSBZGa-AAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5913, 0, '2021-03-10 12:48:22', '2021-03-10 12:50:34', '::ffff:102.143.202.72', NULL, 'fhACmINjucirPj2qAAAV', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5914, 0, '2021-03-10 12:50:57', '2021-03-10 12:51:27', '::ffff:102.143.202.72', NULL, 'N2bAg0Sqxjq_XNhTAAAW', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5915, 0, '2021-03-10 12:51:22', '2021-03-10 12:52:10', '::ffff:102.143.202.72', NULL, 'YfldWHe3rzwduHceAAAX', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5916, 0, '2021-03-10 12:52:48', '2021-03-10 12:54:36', '::ffff:102.143.202.72', NULL, 'xXDB7RSkxj1E0J2BAAAZ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5917, 0, '2021-03-10 12:55:01', '2021-03-10 13:07:53', '::ffff:102.143.202.72', NULL, 'jzv1vg8lkNDvErHaAAAa', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5918, 0, '2021-03-10 13:08:10', '2021-03-10 13:09:28', '::ffff:102.143.202.72', NULL, 'JomYh3H-9lWzbH0-AAAb', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5919, 0, '2021-03-10 13:09:50', '2021-03-10 13:10:38', '::ffff:102.143.202.72', NULL, 'PjRBPzbfafxxE815AAAc', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5920, 0, '2021-03-10 13:10:58', '2021-03-10 13:11:28', '::ffff:102.143.202.72', NULL, '5UgcJU8dmz9tSsQNAAAd', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5921, 0, '2021-03-10 13:11:19', '2021-03-10 13:12:20', '::ffff:102.143.202.72', NULL, '7YmQOSnOInMJjpNRAAAe', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5922, 0, '2021-03-10 13:12:30', '2021-03-10 13:12:56', '::ffff:102.143.202.72', NULL, 'ce5NqhdgltEf-t2OAAAf', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5923, 0, '2021-03-10 13:13:02', '2021-03-10 13:13:40', '::ffff:102.143.202.72', NULL, 'q1SI4bY0uAJFfI8vAAAg', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5924, 0, '2021-03-10 13:13:56', '2021-03-10 13:16:16', '::ffff:102.143.202.72', NULL, 'd-hHnbuZOYzk8M3BAAAh', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5925, 0, '2021-03-10 13:16:20', '2021-03-10 13:45:49', '::ffff:102.143.202.72', NULL, '_sKvUO3u0AWNEbRPAAAi', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '88.0.4324.190', 'Desktop'),
(5926, 0, '2021-03-13 07:09:27', '2021-03-13 07:09:57', '::ffff:102.143.222.18', NULL, 'cGxDNt6-uMckfGN1AAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5927, 0, '2021-03-13 07:09:54', '2021-03-13 07:10:25', '::ffff:102.143.222.18', NULL, 'vct_hNNK72y4EgA-AAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5928, 0, '2021-03-13 07:10:33', NULL, '::ffff:197.252.19.47', NULL, 'Vi4cToNy7My0tQrEAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5929, 0, '2021-03-13 07:27:17', '2021-03-13 07:45:04', '::ffff:197.252.19.47', NULL, '_iA8egqlQ55GKjIuAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5930, 0, '2021-03-13 07:44:50', '2021-03-13 07:45:44', '::ffff:102.143.222.18', NULL, '3bWgFB0bCFqdZ7nkAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5931, 0, '2021-03-13 07:45:50', '2021-03-13 07:52:09', '::ffff:102.143.222.18', NULL, 'plL0u7R1xnKp60K3AAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5932, 0, '2021-03-13 07:52:39', '2021-03-13 07:53:09', '::ffff:102.143.222.18', NULL, 'A6eSNYSPzzlNyCO4AAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5933, 0, '2021-03-13 07:55:03', '2021-03-13 07:55:30', '::ffff:102.143.222.18', NULL, 'ubT5PyZ9usk9Qy-SAAAH', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5934, 0, '2021-03-13 07:55:39', '2021-03-13 07:56:09', '::ffff:102.143.222.18', NULL, 'ELkE5VtCEpbGWOnyAAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5935, 0, '2021-03-13 07:56:10', '2021-03-13 07:58:13', '::ffff:102.143.222.18', NULL, 'YPOEqTJrjXOTdAosAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5936, 0, '2021-03-13 08:00:14', '2021-03-13 08:01:35', '::ffff:102.143.222.18', NULL, '-nwSvfCOULouVqVNAAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5937, 0, '2021-03-13 08:02:27', '2021-03-13 08:02:57', '::ffff:102.143.222.18', NULL, 'nBMzcCrCdV-dACkZAAAQ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5938, 0, '2021-03-13 08:03:31', '2021-03-13 08:03:37', '::ffff:102.181.31.222', NULL, 'Udi-nxA0HImfAG-XAAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5939, 0, '2021-03-13 08:03:41', '2021-03-13 08:06:27', '::ffff:102.181.31.222', NULL, 'ul0KR4JFUVCxJYBbAAAV', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5940, 0, '2021-03-13 08:06:31', '2021-03-13 08:06:44', '::ffff:102.181.31.222', NULL, 'lJgcKNMfQP2_IIWLAAAW', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5941, 0, '2021-03-13 08:06:48', '2021-03-13 08:24:58', '::ffff:102.181.31.222', NULL, 'Me57mYjkh4KCaXvJAAAX', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5942, 0, '2021-03-13 08:25:09', '2021-03-13 08:37:12', '::ffff:102.181.31.222', NULL, 'ucIOJNVxXdiN-NuSAAAZ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5943, 0, '2021-03-13 08:37:17', '2021-03-13 08:40:21', '::ffff:102.181.31.222', NULL, 'HLlF1Vnqr7d_58GUAAAa', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5944, 0, '2021-03-13 08:40:45', '2021-03-13 08:57:45', '::ffff:102.181.31.222', NULL, '4C77qUYiwHvJKiAmAAAb', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5945, 0, '2021-03-13 08:57:48', '2021-03-13 09:06:37', '::ffff:102.181.31.222', NULL, 'OBx1wgOf7iVX36TuAAAc', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5946, 0, '2021-03-13 09:06:41', NULL, '::ffff:102.181.31.222', NULL, 'g3gGd38SjBecoReuAAAd', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5947, 0, '2021-03-13 10:04:50', '2021-03-13 10:07:02', '::ffff:102.143.222.18', NULL, 'CBC0kGPVX3zN4xubAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5948, 0, '2021-03-13 10:17:39', '2021-03-13 10:19:00', '::ffff:102.143.222.18', NULL, 'qM7TEeDTGUhOvZmcAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5949, 0, '2021-03-13 10:19:20', '2021-03-13 10:20:27', '::ffff:102.143.222.18', NULL, 'kLTrx5nrC7xb6aNeAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5950, 0, '2021-03-13 10:20:31', '2021-03-13 10:20:47', '::ffff:102.143.222.18', NULL, 'vyxMxGeFoJFWSIUcAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5951, 0, '2021-03-13 10:20:55', '2021-03-13 10:24:06', '::ffff:102.143.222.18', NULL, 'Fs__0Ye5t_b8qhGbAAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5952, 0, '2021-03-13 11:10:14', '2021-03-13 11:16:42', '::ffff:102.143.222.18', NULL, 'HslRHy_8z5hbghk0AAAF', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5953, 0, '2021-03-13 11:16:58', '2021-03-13 11:17:18', '::ffff:102.143.222.18', NULL, 'xZvJoD4omKhafWtDAAAG', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5954, 0, '2021-03-13 11:17:38', '2021-03-13 11:21:16', '::ffff:102.143.222.18', NULL, '4hZiaCw-8fhd4rjoAAAH', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5955, 0, '2021-03-13 11:21:30', '2021-03-13 11:22:00', '::ffff:102.143.222.18', NULL, 'eCyvNKKnelkxIfcRAAAI', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5956, 0, '2021-03-13 11:22:00', '2021-03-13 11:22:36', '::ffff:102.143.222.18', NULL, 'wqbLw92v-qDHIa3qAAAJ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5957, 0, '2021-03-13 11:22:53', '2021-03-13 11:23:23', '::ffff:102.143.222.18', NULL, 'w6hmRjkQ3X_X-4DKAAAK', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5958, 0, '2021-03-13 11:23:12', '2021-03-13 11:24:06', '::ffff:102.143.222.18', NULL, '4mCgMd4-pFQm2gydAAAL', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5959, 0, '2021-03-13 11:24:30', '2021-03-13 11:25:00', '::ffff:102.143.222.18', NULL, 'DeJNobBrtPES6r-XAAAM', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5960, 0, '2021-03-13 11:24:57', '2021-03-13 11:25:26', '::ffff:102.143.222.18', NULL, 'Z7bABSO-8V-F0L6rAAAN', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5961, 0, '2021-03-13 11:27:10', '2021-03-13 11:27:40', '::ffff:102.143.222.18', NULL, 'B2nUyo3c3QSZwE3wAAAQ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5962, 0, '2021-03-13 11:27:38', '2021-03-13 11:28:28', '::ffff:102.143.222.18', NULL, '5vyoOv4UrkvyqQtYAAAR', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5963, 0, '2021-03-13 11:28:32', '2021-03-13 11:29:02', '::ffff:102.143.222.18', NULL, 'nXsAiKoa4OG0PrASAAAT', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5964, 0, '2021-03-13 11:29:19', '2021-03-13 11:29:49', '::ffff:102.143.222.18', NULL, 'O_temAGQLM7HrjLaAAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5965, 0, '2021-03-13 11:29:47', '2021-03-13 11:30:20', '::ffff:102.143.222.18', NULL, '0T7U5UkDLSSqoBsYAAAV', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5966, 0, '2021-03-13 11:30:38', '2021-03-13 11:31:08', '::ffff:102.143.222.18', NULL, 'vkbLBoRu7jHwj69aAAAW', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5967, 0, '2021-03-13 11:31:17', '2021-03-13 11:31:47', '::ffff:102.143.222.18', NULL, 'mhGX0QINHwLRTeNQAAAX', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5968, 0, '2021-03-13 11:31:55', '2021-03-13 11:32:25', '::ffff:102.143.222.18', NULL, '0rk66rJLTmiqoWwiAAAY', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5969, 0, '2021-03-13 11:32:12', '2021-03-13 11:32:28', '::ffff:102.143.222.18', NULL, 'AAP38ZWk1FMPXi4uAAAZ', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5970, 0, '2021-03-13 11:33:04', '2021-03-13 11:33:57', '::ffff:102.143.222.18', NULL, 'TiNS6YAGUa6VA3L1AAAa', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5971, 0, '2021-03-13 11:34:20', '2021-03-13 11:34:50', '::ffff:102.143.222.18', NULL, 'VK1OywNDfqZ54smOAAAb', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5972, 0, '2021-03-13 11:34:47', '2021-03-13 11:35:17', '::ffff:102.143.222.18', NULL, 'OAYcvNmIhOjya13NAAAc', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5973, 0, '2021-03-13 11:35:40', '2021-03-13 11:36:10', '::ffff:102.143.222.18', NULL, 'PwDbFbemzLz1BOKSAAAd', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5974, 0, '2021-03-13 11:35:55', '2021-03-13 11:36:20', '::ffff:102.143.222.18', NULL, 'dvDACfpIS9iyLq8jAAAe', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5975, 0, '2021-03-13 11:36:34', '2021-03-13 11:39:16', '::ffff:102.143.222.18', NULL, 'JB3KF0NIG4E2Myh1AAAf', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5976, 0, '2021-03-13 11:39:31', '2021-03-13 11:40:01', '::ffff:102.143.222.18', NULL, '-138pFk9Dx4WFFF6AAAg', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5977, 0, '2021-03-13 11:40:09', '2021-03-13 11:40:39', '::ffff:102.143.222.18', NULL, 'hJotH9wuSmoscA2aAAAh', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5978, 0, '2021-03-13 11:40:39', '2021-03-13 11:42:01', '::ffff:102.143.222.18', NULL, 'HRCgXw13qzS4dUvqAAAi', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5979, 0, '2021-03-13 11:42:14', '2021-03-13 11:42:44', '::ffff:102.143.222.18', NULL, 'S4uumsDkUtBP5Dc-AAAj', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5980, 0, '2021-03-13 11:42:49', '2021-03-13 11:43:42', '::ffff:102.143.222.18', NULL, '57dk-8X8hGYEUvzEAAAk', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5981, 0, '2021-03-13 11:43:59', '2021-03-13 11:44:29', '::ffff:102.143.222.18', NULL, '6NxTDLFMuUgcRUjFAAAl', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5982, 0, '2021-03-13 11:44:33', '2021-03-13 11:44:58', '::ffff:102.143.222.18', NULL, 'gR5__ueZa3tCE0nsAAAm', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5983, 0, '2021-03-13 11:45:18', '2021-03-13 11:50:42', '::ffff:102.143.222.18', NULL, '-W8zFZ6zDfGT7mJBAAAn', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5984, 0, '2021-03-13 11:50:58', '2021-03-13 11:51:28', '::ffff:102.143.222.18', NULL, 'beDTJFa-yKufNbUJAAAo', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5985, 0, '2021-03-13 11:51:16', '2021-03-13 11:53:12', '::ffff:102.143.222.18', NULL, 'MGH6BXygPvuTVl-TAAAp', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5986, 0, '2021-03-13 11:53:17', '2021-03-13 12:06:25', '::ffff:102.143.222.18', NULL, 'PZMW3dkicFWsl16DAAAq', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5987, 0, '2021-03-13 12:06:41', '2021-03-13 12:17:55', '::ffff:102.143.222.18', NULL, 'D4uAxA_DO7mDqFQIAAAr', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5988, 0, '2021-03-13 12:18:13', '2021-03-13 12:18:43', '::ffff:102.143.222.18', NULL, '_w55P_BEyM1PwhP0AAAs', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5989, 0, '2021-03-13 12:18:37', '2021-03-13 12:19:07', '::ffff:102.143.222.18', NULL, 'w5R37Bh3_soCd-WvAAAt', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5990, 0, '2021-03-13 12:20:21', '2021-03-13 12:36:30', '::ffff:102.143.222.18', NULL, 'HpyrbYmSNx09LmioAAAv', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5991, 0, '2021-03-13 12:38:53', '2021-03-13 12:39:36', '::ffff:102.143.222.18', NULL, 'GiY96pE4HEdszafBAAAz', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5992, 0, '2021-03-13 12:39:06', '2021-03-13 12:39:36', '::ffff:102.143.222.18', NULL, 'GiY96pE4HEdszafBAAAz', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5993, 0, '2021-03-13 12:39:17', '2021-03-13 12:39:46', '::ffff:102.143.222.18', NULL, 'zwf4PYs-DSSfwZaqAAA0', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5994, 0, '2021-03-13 12:40:07', '2021-03-13 12:40:37', '::ffff:102.143.222.18', NULL, '-3KSXksAZG45ax6QAAA1', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5995, 0, '2021-03-13 12:40:34', '2021-03-13 12:41:04', '::ffff:102.143.222.18', NULL, 'gw3DdMHmXXt-11d5AAA2', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5996, 0, '2021-03-13 12:41:14', '2021-03-13 12:41:44', '::ffff:102.143.222.18', NULL, 'jmiiUyGZeBaThTJjAAA3', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5997, 0, '2021-03-13 12:41:52', '2021-03-13 12:42:22', '::ffff:102.143.222.18', NULL, '0LnZsEbAWG1SMDhPAAA4', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5998, 0, '2021-03-13 12:42:34', '2021-03-13 12:43:04', '::ffff:102.143.222.18', NULL, 'PKbuDqyYeVZZFeQPAAA5', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(5999, 0, '2021-03-13 12:43:45', '2021-03-13 12:45:41', '::ffff:102.143.222.18', NULL, 'kqTT_GyQ41dAHRFCAAA7', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(6000, 0, '2021-03-13 12:45:46', '2021-03-13 12:51:07', '::ffff:102.143.222.18', NULL, 'U7M5mx9isoGeAokFAAA8', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(6001, 0, '2021-03-13 12:51:10', NULL, '::ffff:102.143.222.18', NULL, 'yLJQTDItOm31xIbcAAA9', NULL, 'Africa/Khartoum', 'Windows', '10', 'Edge', '89', 'Desktop'),
(6002, 0, '2021-06-07 16:21:35', '2021-06-07 16:24:23', '::ffff:198.16.76.27', NULL, '9bNPA6kSTd7K0uJbAAAA', NULL, 'Europe/Amsterdam', 'Windows', '10', 'Chrome', '91.0.4472.77', 'Desktop'),
(6003, 0, '2021-06-07 16:24:26', '2021-06-07 16:28:51', '::ffff:198.16.76.27', NULL, 'S64vrsPZwaYcxX97AAAB', NULL, 'Europe/Amsterdam', 'Windows', '10', 'Chrome', '91.0.4472.77', 'Desktop'),
(6004, 0, '2021-06-07 17:12:34', '2021-06-07 17:13:09', '::ffff:198.16.76.27', NULL, 'kRDZG4RLCn6ZY5WuAAAD', NULL, 'Europe/Amsterdam', 'Windows', '10', 'Chrome', '91.0.4472.77', 'Desktop'),
(6005, 0, '2021-06-07 17:13:15', '2021-06-07 17:23:56', '::ffff:198.16.66.196', NULL, 'HHvlEMZNCP50UTHaAAAE', NULL, 'Europe/Amsterdam', 'Windows', '10', 'Chrome', '91.0.4472.77', 'Desktop'),
(6006, 0, '2021-07-26 18:48:16', '2021-07-26 18:49:13', '::ffff:102.126.17.161', NULL, 'ID1fmFoztoCvUf1EAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '90.0.4430.212', 'Desktop'),
(6007, 0, '2021-12-28 19:30:01', '2021-12-28 19:31:00', '::ffff:102.143.203.163', NULL, 'XsIjdKpCIFUIjwfaAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6008, 0, '2021-12-29 03:29:28', '2021-12-29 03:29:58', '::ffff:102.143.203.163', NULL, 'fqaXg5na9KjuEdRAAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6009, 0, '2021-12-29 03:30:34', '2021-12-29 03:30:35', '::ffff:102.181.1.233', NULL, 'CjszvdtK3cPrnXfNAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6010, 0, '2021-12-29 03:30:36', NULL, '::ffff:102.181.1.233', NULL, '6tPQEqj_dsBRzbKJAAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6011, 0, '2021-12-29 03:31:57', '2021-12-29 03:46:50', '::ffff:102.181.1.233', NULL, 'NYrcqsB7tx3rE7QbAAAA', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6012, 0, '2021-12-29 03:47:17', '2021-12-29 03:47:19', '::ffff:102.181.1.233', NULL, 'ChCF-D2Qhs32wN_bAAAB', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6013, 0, '2021-12-30 14:39:33', '2021-12-30 14:41:55', '::ffff:102.143.192.156', NULL, 'AsrHm70IfWeKcun2AAAT', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6014, 0, '2021-12-30 14:42:10', '2021-12-30 14:42:40', '::ffff:102.143.192.156', NULL, 'YVINRm9wAWL8hQOwAAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6015, 0, '2021-12-31 11:23:27', '2021-12-31 11:23:45', '::ffff:102.143.218.236', NULL, 'mrxce-gJ131FVXrWAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6016, 0, '2021-12-31 11:24:50', '2021-12-31 11:25:29', '::ffff:102.143.218.236', NULL, 'NhNulkmM0Olwb8H5AAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6017, 0, '2021-12-31 11:27:49', '2021-12-31 11:29:49', '::ffff:102.143.218.236', NULL, 'f5l3pJva9NxbcEwXAAAC', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6018, 0, '2021-12-31 12:04:01', NULL, '::ffff:102.181.32.15', NULL, '3OJafBteDpoK2G4BAAAD', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6019, 0, '2021-12-31 12:04:37', NULL, '::ffff:102.181.32.15', NULL, 'oY8Z3aEL350jMqy7AAAE', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6020, 0, '2021-12-31 12:14:50', '2021-12-31 12:41:00', '::ffff:102.181.32.15', NULL, 'LLU9pbctM5BgIzBkAAAO', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6021, 0, '2021-12-31 12:41:04', '2021-12-31 12:42:51', '::ffff:102.181.32.15', NULL, 'ql9b-slU_laSTyJLAAAR', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6022, 0, '2021-12-31 12:42:53', '2021-12-31 12:43:36', '::ffff:102.181.32.15', NULL, 'nHsc5efGA89cYVWqAAAS', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6023, 0, '2021-12-31 12:43:38', '2021-12-31 12:47:19', '::ffff:102.181.32.15', NULL, '97fhfP0mtf9_jW4vAAAT', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6024, 0, '2021-12-31 12:47:21', NULL, '::ffff:102.181.32.15', NULL, 'Zrf_wAMVmD05A4b9AAAU', NULL, 'Africa/Khartoum', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6025, 0, '2021-12-31 16:50:27', NULL, '::ffff:127.0.0.1', NULL, 'L7SUDeznEouF-_SnAAAB', NULL, 'Sudan', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6026, 0, '2021-12-31 16:50:36', NULL, '::ffff:102.181.32.15', NULL, 'kAgVoI8b3yhvkES3AAAD', NULL, 'SD', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6027, 0, '2021-12-31 16:53:48', NULL, '::ffff:127.0.0.1', NULL, 'L-RRWQXTpsLAmbCCAAAD', NULL, 'Sudan', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6028, 0, '2021-12-31 16:53:51', NULL, '::ffff:102.181.32.15', NULL, 'o2eVwHb_9P_Dsys5AAAE', NULL, 'SD', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6029, 0, '2021-12-31 16:55:33', '2021-12-31 16:57:25', '::ffff:127.0.0.1', NULL, '1rlOqDGfHjsZsu-6AAAA', NULL, 'Sudan', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6030, 0, '2021-12-31 16:55:34', '2021-12-31 16:57:28', '::ffff:102.181.32.15', NULL, '2UMw_sf1lNfH1w5SAAAB', NULL, 'SD', 'Windows', '10', 'Chrome', '96.0.4664.110', 'Desktop'),
(6031, 0, '2022-01-11 11:17:00', '2022-01-11 11:17:42', '::ffff:102.181.30.171', NULL, 'jQDoFtjHOW3z2QpfAAAB', NULL, 'SD', 'Windows', '10', 'Chrome', '97.0.4692.71', 'Desktop'),
(6032, 0, '2022-01-11 11:32:09', '2022-01-11 11:32:45', '::ffff:102.181.30.171', NULL, 'wfmb19GBLu7Q3V45AAAE', NULL, 'SD', 'Windows', '10', 'Chrome', '97.0.4692.71', 'Desktop'),
(6033, 0, '2022-01-11 11:32:47', '2022-01-11 11:32:50', '::ffff:102.181.30.171', NULL, 'TeXvm7ssRCsEYSjSAAAH', NULL, 'SD', 'Windows', '10', 'Chrome', '97.0.4692.71', 'Desktop'),
(6034, 0, '2022-01-11 11:32:51', '2022-01-11 11:47:39', '::ffff:102.181.30.171', NULL, 'qSUuvFRwkku1M3taAAAI', NULL, 'SD', 'Windows', '10', 'Chrome', '97.0.4692.71', 'Desktop');

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `img` text NOT NULL,
  `title_en` varchar(25) DEFAULT NULL,
  `title_ar` varchar(25) DEFAULT NULL,
  `body_en` text,
  `body_ar` text,
  `shown` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slides`
--

INSERT INTO `slides` (`id`, `img`, `title_en`, `title_ar`, `body_en`, `body_ar`, `shown`, `created`, `updated`) VALUES
(2, '1606826055892.jpg', 'Break News !!!!', 'undefined', 'ncnvsurhmd vsnjbg b vbnvsbeluvmefvjhjvsjhvi9oujhjfskhdviusrhyyrijsldvhvsu', 'undefined', 1, '2020-12-01 12:34:16', '2020-12-17 10:33:56'),
(4, '1606827204016.jpg', 'wd zaher', 'undefined', 'he is good person,quiet and   silent ,always help us to improve our coding skill', 'undefined', 1, '2020-12-01 12:53:24', '2020-12-17 10:33:56'),
(6, '1606830005794.jpg', 'momen', 'undefined', 'nacbca cv gavfkackfgavguacwgatycagtcadu', 'undefined', 1, '2020-12-01 13:40:07', '2020-12-17 10:33:56');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `long_itude` double DEFAULT NULL,
  `lat_itude` double DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `tell` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `long_itude`, `lat_itude`, `address`, `tell`, `email`) VALUES
(2, 'Khartoum', 32.582184, 15.542042, 'nasa', 988890900, 'yahoo666@gmail.com'),
(3, 'Northen', 346643, 2345332, 'uoiuh', 988890900, 'yahoo666@gmail.com'),
(4, 'North Kordofan', NULL, NULL, NULL, NULL, NULL),
(5, 'Kassala', 36.395652, 15.455801, 'street 12,Kassala, KH 535022', 98876557, 'kassala999@gmail.com'),
(6, 'Blue Nile', NULL, NULL, NULL, NULL, NULL),
(7, 'North Darfur', NULL, NULL, NULL, NULL, NULL),
(8, 'South Darfur', NULL, NULL, NULL, NULL, NULL),
(9, 'South Kordofan', NULL, NULL, NULL, NULL, NULL),
(10, 'Gezira', NULL, NULL, NULL, NULL, NULL),
(11, 'White Nile', 1301584510, 3206586920, 'غرب مبني اتحاد الفنانين- مدينة كوسني', 129297301, 'cbskosti@gmail.com'),
(12, 'River Nile', NULL, NULL, NULL, NULL, NULL),
(13, 'Red Sea', 32.582184, 15.582042, 'PortSudan', 9987776, 'm7medZahert867@gmail.com'),
(14, 'Al Qadarif', NULL, NULL, NULL, NULL, NULL),
(15, 'Sennar', NULL, NULL, NULL, NULL, NULL),
(16, 'West Darfur', NULL, NULL, NULL, NULL, NULL),
(17, 'Central Darfur', NULL, NULL, NULL, NULL, NULL),
(18, 'East Darfur', NULL, NULL, NULL, NULL, NULL),
(19, 'West Kordofan', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `user`, `pass`, `created`, `updated`) VALUES
(1, 'mohammed zahir', 'm.zahir', '$2a$10$T.0r7cRaCZCFvI25BiPtTOkHe2C/kSEuMTEY3ScnXBTH5sZKkyVUS', '2020-12-17 13:18:07', '2020-12-31 11:15:11'),
(10, 'mohnned', 'mohanned', '$2a$10$PSRAeT0Xmg9rUL26Ot5OAea4iRjAn.ekGIwnlzX49Mv36h4KtLPM2', '2020-12-18 16:54:15', '2020-12-19 09:04:51'),
(13, 'ahmed faisal', 'ahmed', '$2a$10$0yU78S8wvrJqqUsAE5zfsOrjlWrPyIRL9ocixv.s/U/EPpB8dUGda', '2020-12-18 16:57:03', '2020-12-31 10:42:51'),
(14, 'Admin', 'admin', '$2a$10$Bln6/KRcXmhnOtdKDEdyAO0OYAJVdvgZd8msFfSSJsrYrZla/4cMu', '2020-12-18 18:29:04', '2022-01-05 13:41:03'),
(15, 'momen khaleel', 'momen', '$2a$10$QDJDDMQWy88nm5mvJPJUTOeFPS6t5MsAd6rvbzOQtbKSkshZEWZHa', '2020-12-18 18:37:46', '2020-12-19 08:02:17'),
(20, 'ahmed okasha', 'ahmd', '$2a$10$1/.L3QXuxhqNQ7RsApLvZ.55oOYksS22TTMO.xP22fT0y0.7Pmv.y', '2020-12-20 08:51:48', '2020-12-20 08:51:48'),
(21, 'Musab Abdelrhman Hassan Eltaib', 'musab Eltaib', '$2a$10$yS0Y0A2XtIVLKWVuKsaPy.lAMjDlRmsW0sjPwI8DAJLzLnTSsFA5a', '2020-12-20 14:24:55', '2020-12-20 14:24:55'),
(22, 'Musab Abdelrhman Hassan Eltaib', 'musab', '$2a$10$cwhsk.9/rslx0y1fzGIgX.hqX6U5rFBrh0Lr9qTeS4W1UnX84QQ16', '2020-12-24 11:39:38', '2020-12-24 11:39:38'),
(23, 'ahmed osman', 'ahmed_osman', '$2a$10$b8jqsbV6UYRFjM6J13TfgOIdSBWLjWJ163MGuStfGvSgN9FxC/xzm', '2020-12-30 14:16:55', '2020-12-30 14:16:55');

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`id`, `user_id`, `department_id`, `created`) VALUES
(3, 5, 1, '2020-12-17 13:28:59'),
(4, 3, 2, '2020-12-17 13:28:59'),
(5, 8, 1, '2020-12-17 13:38:02'),
(6, 8, 2, '2020-12-17 13:38:02'),
(7, 8, 3, '2020-12-17 13:38:02'),
(8, 9, 1, '2020-12-17 13:40:32'),
(9, 9, 2, '2020-12-17 13:40:32'),
(10, 9, 3, '2020-12-17 13:40:32'),
(13, 14, 1, '2020-12-18 18:29:04'),
(14, 14, 2, '2020-12-18 18:29:04'),
(15, 14, 3, '2020-12-18 18:29:04'),
(18, 16, 1, '2020-12-18 18:40:05'),
(28, 17, 1, '2020-12-19 09:00:38'),
(30, 10, 1, '2020-12-19 09:04:51'),
(31, 10, 2, '2020-12-19 09:04:51'),
(32, 10, 3, '2020-12-19 09:04:51'),
(33, 20, 1, '2020-12-20 08:51:48'),
(34, 20, 2, '2020-12-20 08:51:48'),
(35, 21, 1, '2020-12-20 14:24:55'),
(36, 21, 2, '2020-12-20 14:24:55'),
(37, 21, 3, '2020-12-20 14:24:55'),
(38, 22, 1, '2020-12-24 11:39:38'),
(39, 23, 1, '2020-12-30 14:16:55'),
(40, 23, 2, '2020-12-30 14:16:55'),
(44, 13, 1, '2020-12-31 10:42:51'),
(45, 13, 2, '2020-12-31 10:42:51'),
(46, 1, 1, '2020-12-31 11:15:11'),
(47, 24, 1, '2020-12-31 12:19:22'),
(48, 24, 2, '2020-12-31 12:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `visitors_exports`
--

CREATE TABLE `visitors_exports` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `dept_id` int(11) NOT NULL,
  `format` int(11) NOT NULL COMMENT '0 excel, 1 word, 2 pdf ',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `visitors_exports`
--

INSERT INTO `visitors_exports` (`id`, `session_id`, `title`, `dept_id`, `format`, `created`) VALUES
(1, 1162, 'MUX 2021', 1, 2, '2021-01-16 12:40:54'),
(2, 1165, 'MUX 2021', 1, 2, '2021-01-16 12:41:38'),
(3, 1165, 'MUX 2021', 1, 2, '2021-01-16 12:43:11'),
(4, 1166, 'MUX 2021', 1, 2, '2021-01-16 12:44:43'),
(5, 1168, 'MUX 2021', 1, 2, '2021-01-16 12:45:20'),
(6, 1171, 'MUX 2021', 1, 1, '2021-01-16 12:46:29'),
(7, 1171, 'MUX 2021', 1, 2, '2021-01-16 12:47:28'),
(8, 1171, 'MUX 2021', 1, 2, '2021-01-16 12:47:52'),
(9, 1382, 'MUX 2021', 1, 2, '2021-01-18 19:02:05'),
(10, 1393, 'MUX 2021', 1, 2, '2021-01-18 19:11:18'),
(11, 1435, 'statistics', 8, 3, '2021-01-18 19:41:48'),
(12, 2006, 'MUX 2021', 1, 2, '2021-01-24 08:47:42'),
(13, 2046, 'MUX 2021', 1, 2, '2021-01-24 10:38:47'),
(14, 2110, 'MUX 2021', 1, 2, '2021-01-25 11:30:47'),
(15, 2147, 'MUX 2021', 1, 2, '2021-01-25 12:09:20'),
(16, 2414, 'MUX 2021', 1, 2, '2021-01-26 09:45:38'),
(17, 3625, 'MUX 2021', 1, 2, '2021-01-28 07:06:13'),
(18, 3625, 'MUX 2021', 1, 2, '2021-01-28 07:06:33'),
(19, 3626, 'statistics', 8, 3, '2021-01-28 07:10:47'),
(20, 3627, 'statistics', 8, 3, '2021-01-28 07:14:05'),
(21, 3627, 'MUX 2021', 1, 2, '2021-01-28 07:14:49'),
(22, 3637, 'MUX 2021', 1, 2, '2021-01-28 07:42:36'),
(23, 5036, 'POPULATION PROJECTION', 1, 2, '2021-02-17 11:19:26'),
(24, 5232, 'MUX 2021', 1, 2, '2021-03-03 12:15:18'),
(25, 5838, 'MUX 2021', 1, 2, '2021-03-04 07:36:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `age_group`
--
ALTER TABLE `age_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cbs_departments`
--
ALTER TABLE `cbs_departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_products`
--
ALTER TABLE `cpi_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_product_community`
--
ALTER TABLE `cpi_product_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_product_section`
--
ALTER TABLE `cpi_product_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_states_community`
--
ALTER TABLE `cpi_states_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_states_section`
--
ALTER TABLE `cpi_states_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_sudan_community`
--
ALTER TABLE `cpi_sudan_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_sudan_section`
--
ALTER TABLE `cpi_sudan_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cpi_years`
--
ALTER TABLE `cpi_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `year` (`year`);

--
-- Indexes for table `departments_publications`
--
ALTER TABLE `departments_publications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foriegn_trade`
--
ALTER TABLE `foriegn_trade`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foriegn_trade_countries`
--
ALTER TABLE `foriegn_trade_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foriegn_trade_products`
--
ALTER TABLE `foriegn_trade_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foriegn_trade_products_annual`
--
ALTER TABLE `foriegn_trade_products_annual`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `foriegn_trade_years`
--
ALTER TABLE `foriegn_trade_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gdp_annual`
--
ALTER TABLE `gdp_annual`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maun2` (`gdp_sub_id`);

--
-- Indexes for table `gdp_main`
--
ALTER TABLE `gdp_main`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gdp_main_annual`
--
ALTER TABLE `gdp_main_annual`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gdp_sub`
--
ALTER TABLE `gdp_sub`
  ADD PRIMARY KEY (`id`),
  ADD KEY `main` (`gdp_main_id`);

--
-- Indexes for table `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `indicators_cycles`
--
ALTER TABLE `indicators_cycles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `indicator_types`
--
ALTER TABLE `indicator_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_product_community`
--
ALTER TABLE `inflation_product_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_product_section`
--
ALTER TABLE `inflation_product_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_states_community`
--
ALTER TABLE `inflation_states_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_states_section`
--
ALTER TABLE `inflation_states_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_sudan_community`
--
ALTER TABLE `inflation_sudan_community`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inflation_sudan_section`
--
ALTER TABLE `inflation_sudan_section`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `info`
--
ALTER TABLE `info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `national_accounts_indicators`
--
ALTER TABLE `national_accounts_indicators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `national_accounts_indicators_values`
--
ALTER TABLE `national_accounts_indicators_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organiztion_chart`
--
ALTER TABLE `organiztion_chart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `population`
--
ALTER TABLE `population`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `population_data`
--
ALTER TABLE `population_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_annual`
--
ALTER TABLE `product_annual`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sectors_annual`
--
ALTER TABLE `sectors_annual`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user` (`user`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitors_exports`
--
ALTER TABLE `visitors_exports`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `age_group`
--
ALTER TABLE `age_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cbs_departments`
--
ALTER TABLE `cbs_departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cpi_products`
--
ALTER TABLE `cpi_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cpi_product_community`
--
ALTER TABLE `cpi_product_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `cpi_product_section`
--
ALTER TABLE `cpi_product_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `cpi_states_community`
--
ALTER TABLE `cpi_states_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `cpi_states_section`
--
ALTER TABLE `cpi_states_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `cpi_sudan_community`
--
ALTER TABLE `cpi_sudan_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `cpi_sudan_section`
--
ALTER TABLE `cpi_sudan_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `cpi_years`
--
ALTER TABLE `cpi_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `departments_publications`
--
ALTER TABLE `departments_publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `foriegn_trade`
--
ALTER TABLE `foriegn_trade`
  MODIFY `id` float NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `foriegn_trade_countries`
--
ALTER TABLE `foriegn_trade_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `foriegn_trade_products`
--
ALTER TABLE `foriegn_trade_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `foriegn_trade_products_annual`
--
ALTER TABLE `foriegn_trade_products_annual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `foriegn_trade_years`
--
ALTER TABLE `foriegn_trade_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gdp_annual`
--
ALTER TABLE `gdp_annual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=551;

--
-- AUTO_INCREMENT for table `gdp_main`
--
ALTER TABLE `gdp_main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `gdp_main_annual`
--
ALTER TABLE `gdp_main_annual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `gdp_sub`
--
ALTER TABLE `gdp_sub`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `indicators_cycles`
--
ALTER TABLE `indicators_cycles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `indicator_types`
--
ALTER TABLE `indicator_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inflation_product_community`
--
ALTER TABLE `inflation_product_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inflation_product_section`
--
ALTER TABLE `inflation_product_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inflation_states_community`
--
ALTER TABLE `inflation_states_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inflation_states_section`
--
ALTER TABLE `inflation_states_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inflation_sudan_community`
--
ALTER TABLE `inflation_sudan_community`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inflation_sudan_section`
--
ALTER TABLE `inflation_sudan_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `info`
--
ALTER TABLE `info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `national_accounts_indicators`
--
ALTER TABLE `national_accounts_indicators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `national_accounts_indicators_values`
--
ALTER TABLE `national_accounts_indicators_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `organiztion_chart`
--
ALTER TABLE `organiztion_chart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `population`
--
ALTER TABLE `population`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `population_data`
--
ALTER TABLE `population_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_annual`
--
ALTER TABLE `product_annual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `sectors`
--
ALTER TABLE `sectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sectors_annual`
--
ALTER TABLE `sectors_annual`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6035;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `visitors_exports`
--
ALTER TABLE `visitors_exports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gdp_annual`
--
ALTER TABLE `gdp_annual`
  ADD CONSTRAINT `maun2` FOREIGN KEY (`gdp_sub_id`) REFERENCES `gdp_sub` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
