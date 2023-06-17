const brandDao = require("../dataaccess/brand-dao.js");
const log = require("../utils/log.js");
const validations = require("../utils/validations.js");
const messages = require("../localization/lang/en.js");

const consultAllBrands = async (req, res) => {
    try {
        let brands = await brandDao.getAllBrands();
        res.status(200).json(brands);
    } catch (err) {
        log.debug(`Failed to find brands: ${err.message}`);
        res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

const registerBrand = async (request, response) => {
    let name = request.params.name;

    if (!validations.validateTextAlphaNumeric(name, 50, 3, true)) {
        response.status(400).json({ message: messages.strings.BRAND_INVALID_NAME });
    } else {
        try {
            if (await brandDao.brandExistsByName(name.toUpperCase())) {
                response.status(400).json({ message: messages.strings.BRAND_DUPLICATED });
            } else {
                await brandDao.registerBrand(name.toUpperCase());
                response.status(200).json({ message: messages.strings.BRAND_POST });
            }
        } catch (err) {
            log.debug(`Failed to register brands: ${err.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    } 
};

const updateBrand = async (request, response) => {
    let brand = request.params.brand;
    const { name } = request.body;

    if (isNaN(brand)) {
        response.status(400).json({ message: messages.strings.BRAND_INVALID_BRANDID });
    } else if (!validations.validateTextAlphaNumeric(name, 50, 3, true)) {
        response.status(400).json({ message: messages.strings.BRAND_INVALID_NAME });
    } else {
        try {
            if(!await brandDao.brandExists(brand)) {
                response.status(400).json({ message: messages.strings.BRAND_NOT_FOUND });
            } else if(await brandDao.brandExistsByName(name.toUpperCase())) {
                response.status(400).json({ message: messages.strings.BRAND_DUPLICATED });
            } else {
                await brandDao.updateBrand(brand, name.toUpperCase());
                response.status(200).json({ message: messages.strings.BRAND_PUT });
            }
        } catch (error) {
            log.debug(`Failed to update brand: ${error.message}`);
            response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const getBrand = async (request, response) => {
    let id = request.params.id;

    if (isNaN(id)) {
        response.status(400).json({ message: messages.strings.BRAND_INVALID_BRANDID });
    }

    try {
        let brand = await brandDao.getBrandById(id);
        if (brand) {
            response.status(200).json(brand);
        } 
        else {
            response.status(404).json({ message: messages.strings.BRAND_NOT_FOUND });
        }
    }
    catch (error) {
        log.debug(`Failed to find brand: ${error.message}`);
        response.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

module.exports = {
    consultAllBrands,
    registerBrand,
    updateBrand,
    getBrand
};
