const { product, productCategoryBrand } = require('../models');
const log = require('../utils/log.js');

const productExists = async (model, brandId, categoryId) => { 
    try {
        const productFound = await product.findOne({ where: { productModel: model, brandId: brandId, categoryId: categoryId } });
        if(productFound) {
            return true;
        }
        return false;
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

const registerProduct = async (inventory, model, price, size, brandId, categoryId) => {
    try {
        if(!await productExists(model, brandId, categoryId)) {

            let newProduct = await product.create({
                inventory, 
                productModel: model, 
                price, 
                size,
                brandId,
                categoryId
            });

            product.sync();
        
            return newProduct;
        }
        else {
            return null;
        }
    }
    catch(err) {
        log.debug(`Failed to create product: ${err.message}`);
        throw new Error(err.message);
    }
}

const consultAllProducts = async () => {
    const productsFound = [];
    try {
        const products = await product.findAll();
        products.forEach((productCategoryBrand) => {
            productsFound.push(productCategoryBrand);
        });
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
    return productsFound;
}

const productExistsById = async (productId) => {
    try {
        const productFound = await product.findByPk(productId);
        if(productFound) {
            return true;
        }
        return false;
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

const consultProductsById = async (productId) => {
    try {
        return await product.findByPk(productId);
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

const updateProductById = async (productId, inventory, model, price, size, brandId, categoryId) => {
    try {
        let productFound = await product.findByPk(productId);
        if(productFound) {
            productFound.inventory = inventory;
            productFound.productModel = model;
            productFound.price = price;
            productFound.size = size;
            productFound.brandId = brandId;
            productFound.categoryId = categoryId;
            await productFound.save();
            return productFound;
        }
        return null;
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

const deleteProductById = async (productId) => {
    try {
        let productFound = await product.findByPk(productId);
        if(productFound) {
            await productFound.destroy();
            return true;
        }
        return false;
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
};

const enoughStock = async(productId, quantity) => {
    try {
        let product = await consultProductsById(productId); 
        if((product.inventory - quantity) < 0) {
            return false;
        }
        return true;
    }catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

const sellProduct = async(productId, quantity) => {
    try {
        let product = await consultProductsById(productId);
        let totalCost = product.price * quantity;
        let newInventory = product.inventory - quantity;

        let affectedRows = await product.update({
            inventory: newInventory
        });

        await product.save();
        return totalCost;
    }
    catch(err) {
        log.debug(`Failed to find products: ${err.message}`);
        throw new Error(err.message);
    }
}

module.exports = {
    registerProduct,
    consultAllProducts,
    consultProductsById,
    enoughStock,
    sellProduct,
    productExistsById,
    updateProductById,
    deleteProductById
}