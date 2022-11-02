CREATE DATABASE IF NOT EXISTS website;
FLUSH PRIVILEGES;
USE website;

CREATE TABLE users (
	name VARCHAR(32) NOT NULL,
	email VARCHAR(32) NOT NULL,
	password VARCHAR(512) NOT NULL,
	admin INT NOT NULL,
	communities VARCHAR(8192)
);

CREATE TABLE EX6 (
	userEmail INT NOT NULL,
	postContent VARCHAR(1024) NOT NULL,
	postDateTime DATETIME NOT NULL
);

CREATE TABLE EX5 (
	userId INT NOT NULL,
	postContent VARCHAR(1024) NOT NULL,
	postDateTime DATETIME NOT NULL
);
