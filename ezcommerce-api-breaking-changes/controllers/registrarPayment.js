const { paymentMethod } = require('../models');
const log = require('../utils/log.js');

const createPaymentMethod = async (description) => {
    try {
      const newPaymentMethod = await paymentMethod.create({
        description: description
      });
      return newPaymentMethod;
    } catch (error) {
      log.debug(`Failed to create payment method: ${error.message}`);
      throw new Error(error.message);
    }
  };
  
  // Llamada a la función createPaymentMethod
  createPaymentMethod('Tarjeta de Debito')
    .then((newPaymentMethod) => {
      console.log('Nuevo método de pago creado:', newPaymentMethod);
    })
    .catch((error) => {
      console.error('Error al crear el método de pago:', error);
    });
