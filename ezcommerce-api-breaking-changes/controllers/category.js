const categoryDao = require('../dataaccess/category-dao.js');
const log = require('../utils/log.js');
const validations = require('../utils/validations.js');
const { verifyToken } = require("../utils/auth.js");
const messages = require('../localization/lang/en.js');

const consultAllCategories = async (req, res) => {
        try {
            let categories = await categoryDao.getAllCategories();
            res.status(200).json(categories);
        } 
        catch(err) {
            log.debug(`Failed to find category: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR  });
        }
};

const registerCategory = async (req, res) => {
    const { description } = req.body;
    if(!validations.validateText(description, 50)) {
        res.status(400).json({ message: messages.strings.CATEGORY_INVALID_DESCRIPTION });
        return;
    } else {
        try {
            let category = await categoryDao.registerCategory(description);
            res.status(200).json({ category, message: 'Successful category registration'});
        } 
        catch(err) {
            log.debug(`Failed to register category: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR  });
        }
    }
};

const getCategory = async (req, res) => {
    const { id } = req.params;
    if(isNaN(id)) {
        res.status(400).json({ message: messages.strings.CATEGORY_INVALID_CATEGORYID });
        return;
    } 
    else {
        try {
            let category = await categoryDao.getCategory(id);
            if(category) {
                res.status(200).json(category);
            }
            else {
                res.status(404).json({ message: messages.strings.CATEGORY_NOT_FOUND });
            }
        } 
        catch(err) {
            log.debug(`Failed to find category: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR  });
        }
    }
}

module.exports = {
    consultAllCategories,
    registerCategory,
    getCategory
}