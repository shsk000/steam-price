CREATE DATABASE game;
use game;

create table games_app_list (
    appid INT NOT NULL,
    name VARCHAR(400) NOT NULL,
    latest_price_versionid INT,
    primary key (appid),
    creation_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modification_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) engine=InnoDB DEFAULT CHARSET=utf8mb4;

create table games_price_list (
  versionid INT NOT NULL AUTO_INCREMENT,
  appid INT NOT NULL,
  initial INT NOT NULL,
  final INT NOT NULL,
  discount_percent INT NOT NULL,
  final_formatted VARCHAR(100) NOT NULL,
  creation_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (versionid)
) engine=InnoDB DEFAULT CHARSET=utf8mb4;

