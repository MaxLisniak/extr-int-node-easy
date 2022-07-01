CREATE TABLE insurances (
    id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    effectiveDate DATE NOT NULL,
    duration INT NOT NULL,
    amount DEC(10 , 2 ) NOT NULL,
    PRIMARY KEY(id)
);