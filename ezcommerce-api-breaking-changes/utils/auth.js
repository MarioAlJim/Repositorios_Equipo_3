const crypto = require("crypto");
const userDao = require("../dataaccess/user-dao.js");
const log = require("./log.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userTypes = {
    CUSTOMER: 1,
    ADMIN: 2,
    ATTENDANT: 3,
    INVENTORY_MANAGER: 4
}

async function autheticateUser(username, password, isEmployee) {
    try {
        let user = await userDao.getUserByUsername(username);
        
        if(user != null && user.password == (await calculateSHA256Hash(password)) && user.active == 1) {
            if(isEmployee) {
                if(user.roleId == userTypes.ADMIN || user.roleId == userTypes.ATTENDANT || user.roleId == userTypes.INVENTORY_MANAGER) {
                    return true;
                }
            }
            else {
                if(user.roleId == userTypes.CUSTOMER) {
                    return true;
                }
            }
        } 
        return false;
    } 
    catch(err) {
        log.debug(`Failed to authenticate user: ${err.message}`);
        return false;
    }
};

async function calculateSHA256Hash(text) {
    const hashString = crypto.createHash("sha256");
    hashString.update(`${text}`);
    return hashString.digest("hex");
};

async function generateJsonWebToken(username) {
    try {
        let token = jwt.sign({ username }, process.env.TOKEN_SECRET_KEY, { expiresIn: "3h" });
        return token;
    } 
    catch(err) {
        throw new Error(err.message);
    }
};

function verifyJsonWebToken(token) {
    try {
        let username;
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, payload) => {
            if(err) {
                return null;
            }
            else {
                username = payload.username;
            }
        })
        return username;
    } 
    catch(error) {
        log.debug(error.message);
        return null;
    }
}

function getAuthTokenFromHeader(req) {
    let accessToken = req.headers['authorization'] || req.headers['x-access-token']; 
    if(!accessToken) {
        return null;
    }
    if(accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.slice(7, accessToken.lenght);
    }
    return accessToken;
}

async function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

async function sendEmail(email, otp) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EZCOMMERCE_EMAIL,
            pass: process.env.EZCOMMERCE_EMAIL_PASSWORD,
        },
    });

    var mailOptions = {
        from: process.env.EZCOMMERCE_EMAIL,
        to: email,
        subject: "EZCommerce: Contraseña de un solo uso",
        text: "Su contraseña de un solo uso es: " + otp,
    };

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                log.debug(error);
            } else {
                log.info("Email sent: " + info.response);
            }
        });
    } catch(error) {
        log.debug(`Failed to send email: ${err.message}`);
        throw new Error(error.message);
    }
}

module.exports = {
    userTypes,
    autheticateUser,
    calculateSHA256Hash,
    generateJsonWebToken,
    verifyJsonWebToken,
    getAuthTokenFromHeader,
    generateOTP,
    sendEmail
};
