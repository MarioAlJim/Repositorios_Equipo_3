const { readdirSync } = require('fs');

const defaultLang = process.env.LANG || 'en-US'; 
const languages = [];
const languagesFiles = readdirSync('localization/lang/').filter(file => file.endsWith('.js'));

for(const file of languagesFiles) {
    const lang = require(`./lang/${file}`);
    languages.push(lang);
}

module.exports = {
    /**
     * Get localizated string
     * @param {String} languageId 
     * @param {String} string 
     * @param  {...Any} args 
     * @returns {String}
     */
    getString: (string, ...args) => {
        const lang = languages.find(lang => defaultLang.startsWith(lang.id));
        const value = lang?.strings[string]; 
        switch(typeof value) {
            case 'function':
                return value(...args);

            case 'undefined':
                return `$${string}`;
            
            default:
                return value;
        }
    }
}
