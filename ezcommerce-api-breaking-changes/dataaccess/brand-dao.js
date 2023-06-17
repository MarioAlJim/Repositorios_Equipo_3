const {brand} = require('../models');
const log = require('../utils/log.js');

const registerBrand = async (name) => {
    try {
        let newBrand = await brand.create({
            name
        });

        brand.sync();
    
        return newBrand;
    }
    catch(error) {
        log.debug(`Failed to create brand: ${error.message}`);
        throw new Error(error.message);
    }
};

const getBrandById = async (id) => {
    try {
        let targetBrand = await brand.findOne({
            where: {
                id
            }
        });

        return targetBrand;
    }
    catch(error) {
        log.debug(`Failed to get brand: ${error.message}`);
        throw new Error(error.message);
    }
};

const brandExists = async (id) => {
    try {
        let targetBrand = await getBrandById(id);

        return targetBrand !== null;
    }
    catch(error) {
        log.debug(`Failed to find brand: ${error.message}`);
        throw new Error(error.message);
    }
};

const brandExistsByName = async (name) => {
    try {
        let targetBrand = await brand.findOne({
            where: {
                name
            }
        });
        
        return targetBrand !== null;
    } catch(error) {
        log.debug(`Failed to find brand: ${error.message}`);
        throw new Error(error.message);
    }
}

const updateBrand = async (id, name) => {
    try {
        let targetBrand = await getBrandById(id);

        if(targetBrand !== null) {
            let affectedRows = await targetBrand.update({
                name
            });

            await targetBrand.save();
            return affectedRows !== 0;
        }

        return false;
    }
    catch(error) {
        log.debug(`Failed to update brand: ${error.message}`);
        throw new Error(error.message);
    }
};

const getAllBrands = async () => {
    const brandsFound = [];
    try {
        const newBrand = await brand.findAll();
        newBrand.forEach(brand => {
            brandsFound.push(brand);
        });
    }
    catch(err) {
        log.debug(`Failed to consult brand: ${err.message}`);
        throw new Error(err.message);
    }
    return brandsFound;
};

module.exports = {
    registerBrand,
    getBrandById,
    getAllBrands,
    brandExists,
    updateBrand,
    brandExistsByName
}