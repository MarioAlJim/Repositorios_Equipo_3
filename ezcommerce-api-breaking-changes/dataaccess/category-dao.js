const {category} = require('../models');
const log = require('../utils/log.js');

const registerCategory = async (description) => {
    try {
        let newCategory = await category.create({
            description
        });

        category.sync();

        return newCategory;
    }
    catch(err) {
        log.debug(`Failed to create category: ${err.message}`);
        throw new Error(err.message);
    }
};

const getAllCategories = async () => {
    const categoriesFound = [];
    try {
        let categories = await category.findAll();
        categories.forEach(category => {
            categoriesFound.push(category);
        });
    }
    catch(err) {
        log.debug(`Failed to consult all categories: ${err.message}`);
        throw new Error(err.message);
    }
    return categoriesFound;
};

const getCategory = async (id) => {
    try {
        let categoryFound = await category.findOne({ where: { id: id } });
        return categoryFound;
    }
    catch(err) {
        log.debug(`Failed to find category: ${err.message}`);
        throw new Error(err.message);
    }
};

module.exports = {
    registerCategory,
    getAllCategories,
    getCategory
}