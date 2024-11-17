USE FRQDataWarehouse
GO

CREATE TABLE League(
Lid int PRIMARY KEY,
Name varchar(50),
Founded int ,
SuperBowlEdition int)

CREATE TABLE Conference(
Cid int PRIMARY KEY,
Name varchar(50),
NoOfDivisions int,
Lid int FOREIGN KEY REFERENCES League(Lid))

CREATE TABLE Division(
Did int PRIMARY KEY,
Name varchar(50),
NoOfTeams int,
Cid int FOREIGN KEY REFERENCES Conference(Cid))

CREATE TABLE Team(
Tid int PRIMARY KEY,
City varchar(50),
Name varchar(50),
Wins int,
Losses int,
Did int FOREIGN KEY REFERENCES Division(Did))

CREATE TABLE Game(
Gid int PRIMARY KEY,
Date date,
Location varchar(50),
Broadcast varchar(50))

CREATE TABLE Plays_in(
Gid int FOREIGN KEY REFERENCES Game(Gid),
Tid int FOREIGN KEY REFERENCES Team(Tid),
CONSTRAINT pk_Games PRIMARY KEY(Gid, Tid))

CREATE TABLE Coach(
CHid int PRIMARY KEY,
Name varchar(50),
Type varchar(50),
Tid int FOREIGN KEY REFERENCES Team(Tid))

CREATE TABLE Player(
Pid int PRIMARY KEY IDENTITY,
Name varchar(50),
Position varchar(50),
Age int,
Number int,
Jersey varchar(50),
Tid int FOREIGN KEY REFERENCES Team(Tid))

CREATE TABLE Stats(
Sid int FOREIGN KEY REFERENCES Player(Pid),
Type varchar(50),
CONSTRAINT pk_PlayerStats PRIMARY KEY(Sid))

CREATE TABLE DStats(
DEFid int PRIMARY KEY,
Tackles int,
Sacks int,
Interceptions int,
Sid int FOREIGN KEY REFERENCES Stats(Sid))

CREATE TABLE OStats(
OFFid int PRIMARY KEY,
PassingYards int,
RushingYards int,
ReceivingYards int,
Touchdowns int,
Sid int FOREIGN KEY REFERENCES Stats(Sid))
