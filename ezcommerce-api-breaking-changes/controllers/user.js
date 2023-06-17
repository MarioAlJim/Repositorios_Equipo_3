const userDao = require("../dataaccess/user-dao.js");
const log = require("../utils/log.js");
const { calculateSHA256Hash, verifyToken, sendEmail, generateOTP } = require("../utils/auth.js");
const validations = require("../utils/validations.js");
const moment = require("moment");
const messages = require("../localization/lang/en.js");
const authMiddleware = require('../middlewares/auth.js');

async function createUser(request, response) {
    let username = request.params.username;
    const { name, paternalSurname, maternalSurname, birthdate, email, phone, password, role } = request.body;

    if (!validations.validateTextAlpha(name, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_NAME });
    } else if (!validations.validateTextAlpha(paternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PATERNAL_SURNAME });
    } else if (!validations.validateTextAlpha(maternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_MATERNAL_SURNAME });
    } else if (!moment(birthdate, "YYYY-MM-DD", true).isValid()) {
        log.debug(`Invalid birthdate: ${birthdate}`);
        response.status(400).json({ message: messages.strings.USER_INVALID_BIRTHDATE });
    } else if (!validations.validateEmail(email, 100)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_EMAIL });
    } else if (!validations.validateTextNumeric(phone, 15)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PHONE });
    } else if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else if (!validations.validateText(password, 50, 6, false) || !validations.checkPasswordStrength(password)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PASSWORD });
    } else if (typeof role !== "number" || role < 2 || role > 4) {
        response.status(400).json({ message: messages.strings.USER_INVALID_ROLEID });
    } else {
        try {
            if (await userDao.userExistsByUsername(username)) {
                response.status(400).json({ message: messages.strings.USER_DUPLICATED });
            } else {
                let passwordHash = await calculateSHA256Hash(password);
                let otp = "000000";
                await userDao.createUser(name, paternalSurname, maternalSurname, birthdate, email, phone, username, passwordHash, otp, role);
                await userDao.activateUser(username, otp);
                response.status(201).json({ message: messages.strings.USER_POST });
            }
        } catch (error) {
            log.debug(`Failed to create user: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

async function deleteUser(request, response) {
    let username = request.params.username;

    if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else {
        try {
            if (!await userDao.userExistsByUsername(username)) {
                response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
            } else {
                let result = await userDao.deleteUser(username);
                if(result) {
                    response.status(201).json({ message: messages.strings.USER_DELETE });
                }
                else {
                    response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
                }
            }
        } catch (error) {
            log.debug(`Failed to delete user: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

async function updateUser(request, response) {
    let currentUsername = request.params.username;
    let {name, paternalSurname, maternalSurname, birthdate, email, phone, username, password, role} = request.body;

    if (!validations.validateTextAlpha(name, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_NAME });
    } else if (!validations.validateTextAlpha(paternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PATERNAL_SURNAME });
    } else if (!validations.validateTextAlpha(maternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_MATERNAL_SURNAME });
    } else if (!moment(birthdate, "YYYY-MM-DD", true).isValid()) {
        response.status(400).json({ message: messages.strings.USER_INVALID_BIRTHDATE });
    } else if (!validations.validateEmail(email, 100)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_EMAIL });
    } else if (!validations.validateTextNumeric(phone, 15)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PHONE });
    } else if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else if (password != '' && (!validations.validateText(password, 50, 6, false) || !validations.checkPasswordStrength(password))) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PASSWORD });
    } else if (typeof role !== "number" || role < 2 || role > 4) {
        response.status(400).json({ message: messages.strings.USER_INVALID_ROLEID });
    } else {
        try {
            let passwordHash = '';
            if(password != '') {
                passwordHash = await calculateSHA256Hash(password);
            }
            if (!await userDao.userExistsByUsername(currentUsername)) {
                response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
            } else if(await userDao.userExistsByUsername(username)) {
                response.status(400).json({ message: messages.strings.USER_DUPLICATED });
            } else {
                await userDao.updateUser(currentUsername, name, paternalSurname, maternalSurname, birthdate, email, phone, username, passwordHash, role);
                response.status(200).json({ message: messages.strings.USER_PUT });
            }
        } catch (err) {
            log.debug(`Failed to update user: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

async function getUsers(request, response) {
    try {
        let users = await userDao.getUsers();
        response.status(200).json(users);
    } 
    catch (err) {
        log.debug(`Failed to get users: ${err.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
}

async function getUser(request, response) {
    let username = request.params.username;

    if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else {
        try {
            if (!await userDao.userExistsByUsername(username)) {
                response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
            } else {
                let user = await userDao.getPersonByUsername(username);
                response.status(200).json(user);
            }
        } catch (err) {
            log.debug(`Failed to get user: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

async function createCustomer(request, response) {
    let username = request.params.username;
    const { name, paternalSurname, maternalSurname, birthdate, email, phone, password } = request.body;

    if (!validations.validateTextAlpha(name, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_NAME });
    } else if (!validations.validateTextAlpha(paternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PATERNAL_SURNAME });
    } else if (!validations.validateTextAlpha(maternalSurname, 50)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_MATERNAL_SURNAME });
    } else if (!moment(birthdate, "YYYY-MM-DD", true).isValid()) {
        log.debug(`Invalid birthdate: ${birthdate}`);
        response.status(400).json({ message: messages.strings.USER_INVALID_BIRTHDATE });
    } else if (!validations.validateEmail(email, 100)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_EMAIL });
    } else if (!validations.validateTextNumeric(phone, 15)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PHONE });
    } else if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else if (!validations.validateText(password, 50, 6, false) || !validations.checkPasswordStrength(password)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_PASSWORD });
    } else {
        try {
            if (await userDao.userExistsByUsername(username)) {
                response.status(400).json({ message: messages.strings.USER_DUPLICATED });
            } else {
                let passwordHash = await calculateSHA256Hash(password);
                let otp = await generateOTP();
                await userDao.createUser(name, paternalSurname, maternalSurname, birthdate, email, phone, username, passwordHash, otp, 1);
                await sendEmail(email, otp);
                response.status(201).json({ message: messages.strings.USER_POST });
            }
        } catch (error) {
            log.debug(`Failed to create user: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

const activateUser = async (request, response) => {
    let username = request.params.username;
    let { otp } = request.body;

    if (!validations.validateTextAlphaNumeric(username, 20, 4, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_USERNAME });
    } else if (!validations.validateTextNumeric(otp, 6, 6, false)) {
        response.status(400).json({ message: messages.strings.USER_INVALID_OTP });
    } else {
        try {
            if (!(await userDao.userExistsByUsername(username))) {
                response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
            } else if(!await userDao.activateUser(username, otp)) {
                response.status(400).json({ message: messages.strings.USER_NOT_ACTIVATED });
            } else {
                response.status(200).json({ message: messages.strings.USER_ACTIVATED });
            }
        } catch (err) {
            log.debug(`Failed to activate user: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUser,
    createCustomer,
    activateUser,
    getUsers
};
