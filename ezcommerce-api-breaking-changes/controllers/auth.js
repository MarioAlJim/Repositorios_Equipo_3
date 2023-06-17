const log = require("../utils/log.js");
const messages = require("../localization/lang/en.js");
const { autheticateUser, generateJsonWebToken } = require("../utils/auth.js");
const validations = require("../utils/validations.js");
const { userExistsByUsername, getUserByUsername } = require("../dataaccess/user-dao.js");

async function  loginEmployee(request, response) {
    let username = request.params.username;
    let { password } = request.body;

    try {
        if (!await userExistsByUsername(username)) {
            response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
        } else if (!await autheticateUser(username, password, true)) {
            response.status(401).json({ message: messages.strings.UNAUTHORIZED });
        } else {
            let token = await generateJsonWebToken(username);
            response.status(200).json({ username, token });
        }
    } catch (error) {
        log.debug(`Failed to login user: ${error.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
}

async function loginCustomer(request, response) {
    let username = request.params.username;
    let { password } = request.body;

    try {
        if (!await userExistsByUsername(username)) {
            response.status(404).json({ message: messages.strings.USER_NOT_FOUND });
        } else if (!await autheticateUser(username, password, false)) {
            response.status(401).json({ message: messages.strings.UNAUTHORIZED });
        } else {
            let token = await generateJsonWebToken(username);
            response.status(200).json({ username, token });
        }
    } catch (error) {
        log.debug(`Failed to login user: ${error.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
}

module.exports = {
    loginEmployee,
    loginCustomer
};
