const productDao = require("../dataaccess/product-dao.js");
const log = require("../utils/log.js");
const validations = require("../utils/validations.js");
const messages = require("../localization/lang/en.js");

const consultAllProducts = async (req, res) => {
    try {
        let products = await productDao.consultAllProducts();
        products = products.map(product => {
            return {
                id: product.id,
                inventory: product.inventory,
                model: product.productModel,
                price: product.price,
                size: product.size,
                brandId: product.brandId,
                categoryId: product.categoryId
            }
        });
        res.status(200).json(products);
    } 
    catch (err) {
        log.debug(`Failed to consult product: ${err.message}`);
        res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

const registerProduct = async (req, res) => {
    const { inventory, model, price, size, brandId, categoryId } = req.body;

    if (typeof inventory !== "number" || inventory < 1 || inventory > 999) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_INVENTORY });
    } 
    else if (!validations.validateTextAlphaNumeric(model, 50)) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_MODEL });
    } 
    else if (typeof price !== "number" || price < 1 || price > 19999) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_PRICE });
    } 
    else if (typeof size !== "number" || size < 1 || size > 50) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_SIZE });
    } 
    else if (typeof brandId !== "number") {
        res.status(400).json({ message: messages.strings.BRAND_INVALID_BRANDID });
    } 
    else if (typeof categoryId !== "number") {
        res.status(400).json({ message: messages.strings.CATEGORY_INVALID_CATEGORYID });
    } 
    else {
        try {
            let newProduct = await productDao.registerProduct(inventory, model, price, size, brandId, categoryId);
            if(newProduct) {
                res.status(200).json({ newProduct, message: messages.strings.PRODUCT_POST });
            }
            else {
                res.status(400).json({ message: messages.strings.PRODUCT_ALREADY_EXISTS });
            }
        } 
        catch (err) {
            log.debug(`Failed to register product: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
};

const getProduct = async (req, res) => {
    let productId = req.params.id;

    if (isNaN(productId)) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_PRODUCTID });
    } 
    else {
        productId = parseInt(productId);
        try {
            if (!(await productDao.productExistsById(productId))) {
                res.status(404).json({ message: messages.strings.PRODUCT_NOT_FOUND });
            } 
            else {
                let product = await productDao.consultProductsById(productId);
                let eep = {
                    id: product.id,
                    inventory: product.inventory,
                    model: product.productModel,
                    price: product.price,
                    size: product.size,
                    brandId: product.brandId,
                    categoryId: product.categoryId
                }
                res.status(200).json(eep);
            }
        } 
        catch (err) {
            log.debug(`Failed to get product: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

const updateProduct = async (req, res) => {
    let productId = req.params.id;
    const { inventory, model, price, size, brandId, categoryId } = req.body;

    if (typeof inventory !== "number" || inventory < 1 || inventory > 999) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_INVENTORY });
    } 
    else if (!validations.validateTextAlphaNumeric(model, 50)) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_MODEL });
    } 
    else if (typeof price !== "number" || price < 1 || price > 19999) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_PRICE });
    } 
    else if (typeof size !== "number" || size < 1 || size > 50) {
        res.status(400).json({ message: messages.strings.PRODUCT_INVALID_SIZE });
    } 
    else if (typeof brandId !== "number") {
        res.status(400).json({ message: messages.strings.BRAND_INVALID_BRANDID });
    } 
    else if (typeof categoryId !== "number") {
        res.status(400).json({ message: messages.strings.CATEGORY_INVALID_CATEGORYID });
    }

    else {
        try {
            if (!(await productDao.productExistsById(productId))) {
                log.debug(`Failed to update product: ${productId}`);
                res.status(404).json({ message: messages.strings.PRODUCT_NOT_FOUND });
            } 
            else {
                let product = await productDao.updateProductById(productId, inventory, model, price, size, brandId, categoryId);
                res.status(200).json({ product, message: messages.strings.PRODUCT_PUT });
            }
        } 
        catch (err) {
            log.debug(`Failed to update product: ${err.message}`);
            res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
        }
    }
}

const deleteProduct = async (req, res) => {
    let productId = req.params.id;

    try {
        if (!(await productDao.productExistsById(productId))) {
            res.status(404).json({ message: messages.strings.PRODUCT_NOT_FOUND });
        } 
        else {
            await productDao.deleteProductById(productId);
            res.status(200).json({ message: messages.strings.PRODUCT_DELETE });
        }
    } 
    catch (err) {
        log.debug(`Failed to delete product: ${err.message}`);
        res.status(500).json({ message: messages.strings.INTERAL_SERVER_ERROR });
    }
};

module.exports = {
    consultAllProducts,
    registerProduct,
    getProduct,
    updateProduct,
    deleteProduct
};
