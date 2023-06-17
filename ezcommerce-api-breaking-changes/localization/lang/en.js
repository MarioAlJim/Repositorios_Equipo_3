module.exports = {
    name: 'English',
    id: 'en',
    aliases: ['en-US', 'en-GB'],
    strings: {
        USER_NOT_FOUND_OR_AUTHENTICATED: "User not found or authenticated.",
        USER_NOT_FOUND: "User not found.",
        USER_DUPLICATED: "User already signed up.",
        USER_POST: "User posted successfully.",
        USER_ACTIVATED: "User activated succesfully.",
        USER_NOT_ACTIVATED: "User not activated. Wrong OTP or user was already activated.",
        USER_PUT: "User updated successfully.",
        USER_DELETE: "User deleted successfully.",
        USER_LOGED_IN: "Welcome back!",
        USER_INVALID_USERID: "Invalid user id: must be a number",
        USER_INVALID_NAME: "Invalid name: must be between 1 and 50 characters",
        USER_INVALID_PATERNAL_SURNAME: "Invalid paternal surname: must be between 1 and 50 characters",
        USER_INVALID_MATERNAL_SURNAME: "Invalid maternal surname: must be between 1 and 50 characters",
        USER_INVALID_BIRTHDATE: "Invalid birthdate: must follow the format YYYY-MM-DD",
        USER_INVALID_EMAIL: "Invalid email: must be between 1 and 100 characters",
        USER_INVALID_PHONE: "Invalid phone: must be 15 characters long",
        USER_INVALID_USERNAME: "Invalid username: must be between 4 and 20 characters and not contain spaces",
        USER_INVALID_PASSWORD: "Invalid password: must be between 6 and 50 characters, and must contain at least one number, one lowercase letter, one uppercase letter, and one special character. No spaces allowed.",
        USER_INVALID_ROLEID: "Invalid roleId: must be a number",
        USER_INVALID_OTP: "Invalid otp: must be 6 characters and not contain spaces",
        PERSON_INVALID_PERSONID: "Invalid person id: must be a number between 2 and 4",
      
        PURCHASE_NOT_FOUND: "Purchase not found.",
        PURCHASE_POST: "Purchase posted successfully.",
        PURCHASE_DELETE: "Purchase deleted successfully.",
        PURCHASE_INVALID_PURCHASEID: "Invalid purchase id: must be a number",
        PURCHASE_INVALID_QUANTITY: "Invalid quantity: must be a number between 1 and 99",

        PRODUCT_NOT_FOUND: "Product not found.",
        PRODUCT_POST: "Product posted successfully.",
        PRODUCT_PUT: "Product updated successfully.",
        PRODUCT_DELETE: "Product deleted successfully.",
        PRODUCT_NOT_ENOUGH_STOCK: "Not enough product stock",
        PRODUCT_INVALID_PRODUCTID: "Invalid product id: must be a number",
        PRODUCT_INVALID_INVENTORY: "Invalid inventory: must be a number between 1 and 999",
        PRODUCT_INVALID_MODEL: "Invalid model: must be between 1 and 50 characters",
        PRODUCT_INVALID_PRICE: "Invalid price: must be a number between 1 and 19999",
        PRODUCT_INVALID_SIZE: "Invalid size: must be a number between 1 and 50",
        PRODUCT_ALREADY_EXISTS: "Product already exists",
      
        REFUND_NOT_FOUND: "Refund not found.",
        REFUND_POST: "Refund posted successfully.",
        REFUND_PUT: "Refund updated successfully.",
        REFUND_DELETE: "Refund deleted successfully.",
        REFUND_DUPLICATED: "Refund already exists",
        REFUND_INVALID_REQUESTID: "Invalid request id: must be a number",
        REFUND_INVALID_STATUS: "Invalid status: must be -1 or 1",
        REFUND_INVALID_REASON: "Invalid reason: must be between 20 and 500 characters",

        BRAND_NOT_FOUND: "Brand not found.",
        BRAND_POST: "Brand posted successfully.",
        BRAND_PUT: "Brand updated successfully.",
        BRAND_DELETE: "Brand deleted successfully.",
        BRAND_DUPLICATED: "Brand already exists.",
        BRAND_INVALID_BRANDID: "Invalid brand id: must be a number",
        BRAND_INVALID_NAME: "Invalid name: must be between 3 and 50 characters",

        CATEGORY_INVALID_CATEGORYID: "Invalid category id: must be a number",
        CATEGORY_INVALID_DESCRIPTION: "Invalid description: must be between 1 and 50 characters",
        CATEGORY_NOT_FOUND: "Category not found.",
      
        PAYMENT_METHOD_NOT_FOUND: "Payment method not found.",
        PAYMENT_METHOD_INVALID_PAYMENT_METHODID: "Invalid payment method id: must be a number",

        UNAUTHORIZED: "User not authorized",
        FORBIDDEN: "Forbidden resource.",
        INTERAL_SERVER_ERROR: "Something went wrong. Try again later.",
    }
}