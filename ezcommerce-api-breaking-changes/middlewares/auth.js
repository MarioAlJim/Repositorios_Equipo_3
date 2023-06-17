const jwt = require('jsonwebtoken');
const { getPersonByUsername, getUserByUsername } = require('../dataaccess/user-dao');
const { userTypes, verifyJsonWebToken, getAuthTokenFromHeader } = require('../utils/auth');
const messages = require('../localization/lang/en.js');
const log = require('../utils/log.js');

async function verifyCustomerAuthToken(req, res, next) {
    try {
        let accessToken = getAuthTokenFromHeader(req);
        if(!accessToken) {
            res.status(401).json({ message: "Access denied, token?" });
            return;
        }

        let username = await verifyJsonWebToken(accessToken);
        if(username) {
            next();
        }
        else {
            res.status(401).json({ message: "Access denied, token expired or is invaid" });
        }
    } 
    catch(error) {
        log.debug(`Failed to verify customer auth token: ${error.message}`);
        res.status(418).json({ message: "Quack" });
    }
}

async function verifyEmployeeAuthToken(req, res, next) {
    try {
        let accessToken = getAuthTokenFromHeader(req);
        if(!accessToken) {
            res.status(401).json({ message: "Access denied, token?" });
            return;
        }

        let username = await verifyJsonWebToken(accessToken);
        if(username) {
            let user = await getUserByUsername(username);
            if(user.roleId == userTypes.ADMIN || user.roleId == userTypes.ATTENDANT || user.roleId == userTypes.INVENTORY_MANAGER) {
                next();
            }
            else {
                res.status(401).json({ message: messages.strings.UNAUTHORIZED });
            }
        }
        else {
            res.status(401).json({ message: "Access denied, token expired or is invaid" });
        }
    } 
    catch(error) {
        log.debug(`Failed to verify employee auth token: ${error.message}`);
        res.status(418).json({ message: "Quack" });
    }
}

async function verifyAdminAuthToken(req, res, next) {
    try {
        let accessToken = getAuthTokenFromHeader(req);
        if(!accessToken) {
            res.status(401).json({ message: "Access denied, token?" });
            return;
        }

        let username = await verifyJsonWebToken(accessToken);
        if(username) {
            let user = await getUserByUsername(username);
            if(user.roleId == userTypes.ADMIN) {
                next();
            }
            else {
                res.status(401).json({ message: messages.strings.UNAUTHORIZED });
            }
        }
        else {
            res.status(401).json({ message: "Access denied, token expired or is invaid" });
        }
    } 
    catch(error) {
        log.debug(`Failed to verify admin auth token: ${error.message}`);
        res.status(418).json({ message: "Quack" });
    }
}


module.exports = {
    verifyAdminAuthToken,
    verifyEmployeeAuthToken,
    verifyCustomerAuthToken
}
