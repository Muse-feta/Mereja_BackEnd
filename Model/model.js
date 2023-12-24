const userTable = ` CREATE TABLE IF NOT EXISTS user(
    userid INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(userid)   
)`;

module.exports = { userTable}