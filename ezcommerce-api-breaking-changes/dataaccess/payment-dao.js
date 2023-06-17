const { paymentMethod } = require("../models");
const log = require("../utils/log.js");

const createPaymentMethod = async (description) => {
    try {
        const newPaymentMethod = await paymentMethod.create({
            description: description,
        });
        return newPaymentMethod;
    } catch (error) {
        log.debug(`Failed to create payment method: ${error.message}`);
        throw new Error(error.message);
    }
};

const getAllPaymentMethods = async () => {
    try {
        const paymentMethods = await paymentMethod.findAll();
        return paymentMethods;
    } catch (error) {
        log.debug(`Failed to get payment methods: ${error.message}`);
        throw new Error(error.message);
    }
};

const getPaymentMethodById = async (paymentMethodId) => {
    try {
        return await paymentMethod.findByPk(paymentMethodId);
    } catch (error) {
        log.debug(`Failed to get payment method by id: ${error.message}`);
        throw new Error(error.message);
    }
};

const updatePaymentMethod = async (paymentMethodId, description) => {
    try {
        const updatedPaymentMethod = await paymentMethod.update(
            { description: description },
            { where: { id: paymentMethodId } }
        );
        return updatedPaymentMethod;
    } catch (error) {
        log.debug(`Failed to update payment method: ${error.message}`);
        throw new Error(error.message);
    }
};

const deletePaymentMethod = async (paymentMethodId) => {
    try {
        const deletedPaymentMethod = await paymentMethod.destroy({
            where: { id: paymentMethodId },
        });
        return deletedPaymentMethod;
    } catch (error) {
        log.debug(`Failed to delete payment method: ${error.message}`);
        throw new Error(error.message);
    }
};

module.exports = {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod,
};
