/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50524
Source Host           : localhost:3306
Source Database       : dh_menu

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2015-01-29 11:31:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `cate`
-- ----------------------------
DROP TABLE IF EXISTS `cate`;
CREATE TABLE `cate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '菜品类目id',
  `name` varchar(20) DEFAULT NULL COMMENT '菜品类目名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cate
-- ----------------------------
INSERT INTO `cate` VALUES ('1', '工作餐炒菜');
INSERT INTO `cate` VALUES ('2', '凉菜');
INSERT INTO `cate` VALUES ('3', '汤类');
INSERT INTO `cate` VALUES ('4', '主食类');
INSERT INTO `cate` VALUES ('5', '经典小吃');
INSERT INTO `cate` VALUES ('6', '手工制饼');
INSERT INTO `cate` VALUES ('7', '水果');
INSERT INTO `cate` VALUES ('8', '饮料');
INSERT INTO `cate` VALUES ('9', '干果');

-- ----------------------------
-- Table structure for `food`
-- ----------------------------
DROP TABLE IF EXISTS `food`;
CREATE TABLE `food` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '菜id',
  `name` varchar(100) DEFAULT NULL COMMENT '菜名',
  `price` varchar(100) DEFAULT NULL COMMENT '菜价',
  `pic` varchar(1024) DEFAULT NULL COMMENT '菜的图片url',
  `rest_id` int(10) DEFAULT NULL COMMENT '菜所属的餐馆id',
  `like` int(10) DEFAULT '0' COMMENT '点赞个数',
  `fid` int(10) DEFAULT '0' COMMENT '菜的编码（可有可无）',
  `cate_id` int(10) DEFAULT NULL COMMENT '菜所属的分类的id',
  `order_num` int(10) DEFAULT '0' COMMENT '此菜已预定的次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of food
-- ----------------------------
INSERT INTO `food` VALUES ('1', '回锅鱼片', '20', null, '4', '0', '201', '1', '0');
INSERT INTO `food` VALUES ('2', '山珍日本豆腐', '18', '', '4', '0', '202', '1', '0');
INSERT INTO `food` VALUES ('3', '干锅象牙萝卜', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('4', '鱼香鸡丝', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('5', '白灼金菇肥牛', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('6', '芽菜碎米鸡', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('7', '香锅藕片', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('8', '香菇木耳炒白菜', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('9', '木须肉', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('10', '酸菜粉丝', '12', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('11', '酸辣土豆丝', '12', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('12', '麻婆豆腐', '10', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('13', '上汤菠菜', '12', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('14', '葱爆羊肉', '25', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('15', '肉沫酸豆角', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('16', '宫保鸡丁', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('17', '鲜椒炒鸡片', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('18', '豆豉鲮鱼炒黄豆嘴', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('19', '干锅土豆片', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('20', '乡味嫩牛肉', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('21', '松仁玉米', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('22', '蟹味菇炒牛肉', '25', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('23', '砂锅山药', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('24', '小炒牛肉', '25', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('25', '肉末小白菜', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('26', '锅仔山菌鱼腐', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('27', '水煮牛肉', '25', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('28', '蒜苗炒肉丝', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('29', '麻辣豆瓣鱼', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('30', '锅仔酸菜羊肉', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('31', '蚂蚁上树', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('32', '家常豆腐', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('33', '南茄烧豆角', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('34', '香椿炒鸡蛋', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('35', '茶树菇炒肉丝', '23', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('36', '青笋炒肉片', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('37', '香芹炒粉条', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('38', '辣子鸡丁', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('39', '牛腩顿时蔬', '23', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('40', '酱香茄子', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('41', '鱼香茄子', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('42', '葱爆木耳', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('43', '地三鲜', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('44', '榨菜炒肉丝', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('45', '泰椒土豆丝', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('46', '香菇肉丝', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('47', '牛腩焖扁豆', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('48', '青椒炒肉丝', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('49', '小碗牛肉', '25', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('50', '毛豆仁烧茄子丁', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('51', '百合炒牛肉', '23', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('52', '干锅手撕包菜', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('53', '干锅脆豆腐', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('54', '干锅白菜', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('55', '小炒有机菜花', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('56', '西红柿炒鸡蛋', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('57', '锅仔海米粉丝冻豆腐', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('58', '鱼香牛肉丝', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('59', '豌豆炒牛肉粒', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('60', '干煸豆角', '16', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('61', '京酱牛肉丝', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('62', '干锅杂菌', '23', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('63', '干锅千页豆腐', '20', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('64', '干锅鸡蛋干', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('65', '圆白菜炒粉条', '18', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('66', '韭菜炒鸡蛋', '13', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('67', '剁椒藕丁', '15', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('68', '凉瓜豆豉炒牛肉', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('69', '小炒鸭胸', '22', null, '4', '0', '0', '1', '0');
INSERT INTO `food` VALUES ('70', '四川泡菜', '8', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('71', '拌海带丝', '8', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('72', '果仁菠菜', '10', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('73', '拍黄瓜', '8', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('74', '皮蛋豆腐', '10', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('75', '香椿苗拌豆腐丝', '10', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('76', '凉拌腐竹', '8', null, '4', '0', '0', '2', '0');
INSERT INTO `food` VALUES ('77', '西红柿鸡蛋汤', '8', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('78', '酸辣汤', '8', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('79', '疙瘩汤', '12', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('80', '紫菜鸡蛋汤', '8', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('81', '酸菜粉丝汤', '8', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('82', '海米萝卜丝汤', '10', null, '4', '0', '0', '3', '0');
INSERT INTO `food` VALUES ('83', '泡菜炒饭', '12', null, '4', '0', '0', '4', '0');
INSERT INTO `food` VALUES ('84', '酱肉炒饭', '12', null, '4', '0', '0', '4', '0');
INSERT INTO `food` VALUES ('85', '米饭', '1', null, '4', '0', '0', '4', '0');

-- ----------------------------
-- Table structure for `home`
-- ----------------------------
DROP TABLE IF EXISTS `home`;
CREATE TABLE `home` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '餐馆的id',
  `name` varchar(100) DEFAULT NULL COMMENT '餐馆名称',
  `img_url` varchar(2048) DEFAULT NULL COMMENT '餐馆图片地址',
  `broad_content` text COMMENT '餐厅公告',
  `home_id` int(10) unsigned DEFAULT '0' COMMENT '餐馆所属的home的id',
  `address` varchar(100) DEFAULT NULL COMMENT '餐馆地址',
  `time` varchar(20) DEFAULT NULL COMMENT '餐馆营业时间',
  `type` varchar(20) DEFAULT NULL COMMENT '餐馆所属分类',
  `muslim` varchar(20) DEFAULT NULL COMMENT '餐馆是否是清真',
  `cate` tinytext COMMENT '此餐馆所拥有的菜品分类',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of home
-- ----------------------------
INSERT INTO `home` VALUES ('4', '东来顺【五道口店】优盛大厦A座5层', '/static/img/dls.jpg', '提示：<br>1、节假日不供应<br>2、请用餐之前出示员工证件或胸卡，方可用餐。<br>3、每点炒菜一道，送米饭一碗。（打包外卖除外）。<br>地址：<br>海淀区成府路28号五道口购物中心五层513号<br>电话：<br><b>010-62666199</b><br>', '1', '海淀区成府路28号五道口购物中心五层513号', '00:00-23:59', '快餐小吃', '清真食品', '1,2,3,4');

-- ----------------------------
-- Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增长id',
  `name` varchar(100) DEFAULT NULL COMMENT '确认订单的用户',
  `order` longtext COMMENT '订单内容，json字符串',
  `datetime` datetime NOT NULL COMMENT '下单日期',
  `time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('6', 'admin', '[{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"2\",\"name\":\"山珍日本豆腐\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-22 17:40:58', '1413970858');
INSERT INTO `order` VALUES ('7', 'admin', '[{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"2\",\"name\":\"山珍日本豆腐\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-22 17:44:43', '1413971083');
INSERT INTO `order` VALUES ('8', 'admin', '[{\"id\":\"85\",\"name\":\"米饭\",\"price\":\"1\",\"like\":\"0\",\"cart\":\"5\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"admin\"]}]', '2014-10-22 17:46:03', '1413971163');
INSERT INTO `order` VALUES ('9', 'admin', '[{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-22 18:05:00', '1413972300');
INSERT INTO `order` VALUES ('10', 'admin', '[{\"id\":\"2\",\"name\":\"山珍日本豆腐\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"3\",\"name\":\"干锅象牙萝卜\",\"price\":\"15\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"4\",\"name\":\"鱼香鸡丝\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"5\",\"name\":\"白灼金菇肥牛\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"3\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-22 18:07:23', '1413972443');
INSERT INTO `order` VALUES ('11', 'admin', '[{\"id\":\"83\",\"name\":\"泡菜炒饭\",\"price\":\"12\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"admin\"]},{\"id\":\"84\",\"name\":\"酱肉炒饭\",\"price\":\"12\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"admin\"]},{\"id\":\"85\",\"name\":\"米饭\",\"price\":\"1\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"admin\"]}]', '2014-10-22 18:18:42', '1413973122');
INSERT INTO `order` VALUES ('12', 'admin', '[{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"2\",\"name\":\"山珍日本豆腐\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-23 11:22:21', '1414034541');
INSERT INTO `order` VALUES ('14', 'admin', '[{\"id\":\"1\",\"name\":\"回锅鱼片\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"3\",\"name\":\"干锅象牙萝卜\",\"price\":\"15\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"4\",\"name\":\"鱼香鸡丝\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]}]', '2014-10-23 15:27:02', '1414049222');
INSERT INTO `order` VALUES ('15', 'admin', '[{\"id\":\"40\",\"name\":\"酱香茄子\",\"price\":\"15\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"luhongtao\"]},{\"id\":\"44\",\"name\":\"榨菜炒肉丝\",\"price\":\"20\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"jacklau\"]},{\"id\":\"77\",\"name\":\"西红柿鸡蛋汤\",\"price\":\"8\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"汤类\",\"orderp\":[\"Strong\"]},{\"id\":\"23\",\"name\":\"砂锅山药\",\"price\":\"22\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"51\",\"name\":\"百合炒牛肉\",\"price\":\"23\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"Strong\"]},{\"id\":\"85\",\"name\":\"米饭\",\"price\":\"1\",\"like\":\"0\",\"cart\":\"5\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"Strong\",\"jacklau\"],\"num\":\"1\"},{\"id\":\"71\",\"name\":\"拌海带丝\",\"price\":\"8\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"凉菜\",\"orderp\":[\"Strong\"]},{\"id\":\"12\",\"name\":\"麻婆豆腐\",\"price\":\"10\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"65\",\"name\":\"圆白菜炒粉条\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"jacklau\"]}]', '2014-12-23 11:48:33', '1419306513');
INSERT INTO `order` VALUES ('16', 'admin', '[{\"id\":\"19\",\"name\":\"干锅土豆片\",\"price\":\"18\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"10\",\"name\":\"酸菜粉丝\",\"price\":\"12\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"Nickw\"]},{\"id\":\"66\",\"name\":\"韭菜炒鸡蛋\",\"price\":\"13\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"Nickw\"]},{\"id\":\"51\",\"name\":\"百合炒牛肉\",\"price\":\"23\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"admin\"]},{\"id\":\"82\",\"name\":\"海米萝卜丝汤\",\"price\":\"10\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"汤类\",\"orderp\":[\"Nickw\"]},{\"id\":\"85\",\"name\":\"米饭\",\"price\":\"1\",\"like\":\"0\",\"cart\":\"4\",\"ordernum\":\"0\",\"cate_name\":\"主食类\",\"orderp\":[\"admin\",\"luhongtao\",\"zhangran\"],\"num\":\"1\"},{\"id\":\"56\",\"name\":\"西红柿炒鸡蛋\",\"price\":\"15\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"luhongtao\"]},{\"id\":\"33\",\"name\":\"南茄烧豆角\",\"price\":\"15\",\"like\":\"0\",\"cart\":\"1\",\"ordernum\":\"0\",\"cate_name\":\"工作餐炒菜\",\"orderp\":[\"flyer\"]}]', '2014-12-24 11:50:12', '1419393012');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户唯一id',
  `name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `pass` varchar(100) DEFAULT NULL COMMENT '用户密码，md5加密存储',
  `email` varchar(100) DEFAULT NULL COMMENT '用户注册email',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('3', '12345', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('5', '123456', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('6', '1234567', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('7', '12345678', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('9', '123456789', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('10', 'seaaa', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('11', 'rrrrr', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('12', 'eeeee', '202cb962ac59075b964b07152d234b70', null);
INSERT INTO `user` VALUES ('13', 'qqqqq', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('14', '123456789abc', '6512bd43d9caa6e02c990b0a82652dca', null);
INSERT INTO `user` VALUES ('15', 'ttttt', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('16', '666666', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('17', 'admin', 'c20ad4d76fe97759aa27a0c99bff6710', null);
INSERT INTO `user` VALUES ('18', 'Nickw', 'e10adc3949ba59abbe56e057f20f883e', null);
INSERT INTO `user` VALUES ('19', 'Strong', 'e10adc3949ba59abbe56e057f20f883e', null);
INSERT INTO `user` VALUES ('20', 'xiaoning', 'e10adc3949ba59abbe56e057f20f883e', null);
INSERT INTO `user` VALUES ('21', 'ellvas', 'c4ca4238a0b923820dcc509a6f75849b', null);
INSERT INTO `user` VALUES ('22', 'yanyan', 'd54d97bf0b15f3de811c0284229c1d94', null);
INSERT INTO `user` VALUES ('23', 'yanchao', '3ac0da33b7ff07907452ff3610da7d65', null);
INSERT INTO `user` VALUES ('24', 'jacklau', '96e79218965eb72c92a549dd5a330112', null);
INSERT INTO `user` VALUES ('25', 'zzzzz', '95ebc3c7b3b9f1d2c40fec14415d3cb8', null);
INSERT INTO `user` VALUES ('26', 'zhangran', '62c8ad0a15d9d1ca38d5dee762a16e01', null);
INSERT INTO `user` VALUES ('27', 'abcdefg', 'e10adc3949ba59abbe56e057f20f883e', null);
INSERT INTO `user` VALUES ('28', 'luhongtao', '2f1a8d1ce9ff54558d8aff8eb4b072af', null);
INSERT INTO `user` VALUES ('29', 'flyer', '2441c6f6623291846e5abbc3312be31a', null);
INSERT INTO `user` VALUES ('30', 'simple', 'e10adc3949ba59abbe56e057f20f883e', null);
