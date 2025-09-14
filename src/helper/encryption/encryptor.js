const readKeysAndCheck = (key) => {
    const clientConfig = require('../../config/client-config');

    if(clientConfig && clientConfig?.keys && Array.isArray(clientConfig.keys) && clientConfig.keys.length > 0){
        if(clientConfig.keys.includes(key)) {
            return true;
        }
    }

    return false;
} 

const encryptObject = (payload) => {
    let encryptedObj = {};

    for (let key in payload) {
        if (payload.hasOwnProperty(key)) {
            let value = payload[key];

            if (readKeysAndCheck(key)) {
                value = '****';
            }

            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    encryptedObj[key] = value.map(item => encryptObject(item));
                } else {
                    encryptedObj[key] = encryptObject(value);
                }
            } else {
                encryptedObj[key] = value;
            }
        }
    }

    return encryptedObj;
}

const encryptString = (payload) => {
    return payload.replace(/./g, '*');
}

const encryptArray = (payload) => {
    let encryptArray = [];
    for(let obj of payload){
        let encryptedPayload;
        if(typeof obj === 'string') {
            encryptedPayload = encryptString(obj);
        } else if(typeof obj === 'number') {
            encryptedPayload = obj;
        } else if(typeof obj === 'object') {
            encryptedPayload = encryptObject(obj);
        } else {
            encryptedPayload = encryptString(String(obj));
        }

        encryptArray.push(encryptObject);
    }

    return encryptArray;
}

const encryptData = (payload) => {
    if(Array.isArray(payload)) {
        return encryptArray(payload);
    } else if(typeof payload === 'object') {
        return encryptObject(payload);
    } else if(typeof payload === 'string') {
        return encryptString(payload);
    } else if(typeof payload === 'number') {
        return payload;
    } else {
        return payload;
    }
}

module.exports = {
    encryptData
}