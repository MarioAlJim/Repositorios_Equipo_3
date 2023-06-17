
function validateText(text, maxLength, minLength = 1, spacesAllowed = true) {
    if(!text || text.length < minLength || text.length > maxLength) {
        return false;
    }
    if(!spacesAllowed) {
        if(text.includes(' ')) {
            return false;
        }
    }
    return true;
}; 

function validateTextAlphaNumeric(text, maxLength, minLength = 1, spacesAllowed = true) {
    if(!validateText(text, maxLength, minLength, spacesAllowed)) {
        return false;
    }
    if(!text.match(/^[a-zA-Z0-9 ]+$/)) {
        return false;
    }
    return true;
};

function validateTextAlpha(text, maxLength, minLength = 1, spacesAllowed = true) {
    if(!validateText(text, maxLength, minLength, spacesAllowed)) {
        return false;
    }
    if(!text.match(/^[a-zA-Z ]+$/)) {
        return false;
    }
    return true;
};

function validateTextNumeric(text, maxLength, minLength = 1, spacesAllowed = true) {
    if(!validateText(text, maxLength, minLength, spacesAllowed)) {
        return false;
    }
    if(!text.match(/^[0-9]+$/)) {
        return false;
    }
    return true;
}

function validateEmail(email) {
    if(!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        return false;
    }
    return true;
}

function checkPasswordStrength(password) {
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+.])/)) {
        return false;
    }
    return true;
}

module.exports = {
    validateText,
    validateTextAlphaNumeric,
    validateTextAlpha,
    validateTextNumeric,
    validateEmail,
    checkPasswordStrength
}
