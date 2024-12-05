CREATE TABLE user (
    ideusr VARCHAR(5) PRIMARY KEY,
    lgn VARCHAR(50),
    lnm VARCHAR(50),
    fnm VARCHAR(50),
    pwd VARCHAR(255),
    tempclearpwd VARCHAR(255)
);

CREATE TABLE doctor (
    ideusr VARCHAR(5) PRIMARY KEY,
    FOREIGN KEY (ideusr) REFERENCES user(ideusr) ON DELETE CASCADE
);

CREATE TABLE patient (
    ideusr VARCHAR(5) PRIMARY KEY,
    FOREIGN KEY (ideusr) REFERENCES user(ideusr) ON DELETE CASCADE
);

CREATE TABLE employee (
    ideemp VARCHAR(5) PRIMARY KEY,
    adr VARCHAR(255),
    pstcde VARCHAR(20),
    cty VARCHAR(255),
    hredte DATETIME,
    FOREIGN KEY (ideemp) REFERENCES user(ideusr) ON DELETE CASCADE
);

CREATE TABLE visitor (
    ideemp VARCHAR(5) PRIMARY KEY,
    FOREIGN KEY (ideemp) REFERENCES employee(ideemp) ON DELETE CASCADE
);

CREATE TABLE accountant (
    ideemp VARCHAR(5) PRIMARY KEY,
    FOREIGN KEY (ideemp) REFERENCES employee(ideemp) ON DELETE CASCADE
);

CREATE TABLE region (
    idergn INT PRIMARY KEY,
    nmergn VARCHAR(255)
);

CREATE TABLE regional_manager (
    ideemp VARCHAR(5) PRIMARY KEY,
    idergn INT NOT NULL,
    FOREIGN KEY (ideemp) REFERENCES employee(ideemp) ON DELETE CASCADE,
    FOREIGN KEY (idergn) REFERENCES region(idergn)
);

CREATE TABLE resource (
    idersc INT AUTO_INCREMENT PRIMARY KEY,
    nmersc VARCHAR(255),
    tpe ENUM('file', 'folder'),
    sze DECIMAL(25,2),
    lstmod DATETIME,
    ideusr VARCHAR(5) NOT NULL,
    ideprt INT,
    FOREIGN KEY (ideusr) REFERENCES user(ideusr),
    FOREIGN KEY (ideprt) REFERENCES resource(ideprt)
);

CREATE TABLE type_right (
    idergt INT AUTO_INCREMENT PRIMARY KEY,
    nmergt VARCHAR(255)
);

CREATE TABLE access_resource (
    ideacs INT AUTO_INCREMENT PRIMARY KEY,
    isglbl BOOLEAN DEFAULT FALSE,
    dtecre DATETIME DEFAULT CURRENT_TIMESTAMP,
    idergt INT NOT NULL,
    idersc INT NOT NULL,
    ideusr VARCHAR(5) NOT NULL,
    FOREIGN KEY (idergt) REFERENCES type_right(idergt),
    FOREIGN KEY (idersc) REFERENCES resource(idersc),
    FOREIGN KEY (ideusr) REFERENCES user(ideusr)
);

CREATE TABLE exclusion_resource (
    ideexl INT AUTO_INCREMENT PRIMARY KEY,
    ideacs INT NOT NULL,
    ideusr VARCHAR(5) NOT NULL,
    FOREIGN KEY (ideacs) REFERENCES access_resource(ideacs),
    FOREIGN KEY (ideusr) REFERENCES user(ideusr)
);