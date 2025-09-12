const constants = require('./constants');

function generateAndFetchId (reqObj) {
    if(constants.REQ_DEBUG_KEY in reqObj) return reqObj[constants.REQ_DEBUG_KEY];

    const debugId = generateUniqueId(reqObj);
    reqObj[constants.REQ_DEBUG_KEY] = debugId;

    return debugId;
}

function generateUniqueId(reqObj) {
    const dateTime = new Date();
    const userAgent = Math.random().toString(36).substr(2, 10).toLowerCase() + new String( Math.ceil(Math.random() * 100000000));


    const minutesPart = dateTime.getMinutes();
    const secondsPart = dateTime.getSeconds();

    const timePart = minutesPart * secondsPart;
    
    const userAgentHash = Math.abs(hashString(userAgent)) % 1000000000; 

    const randomNumber = Math.ceil(Math.random() * 1000);
    const randomString2 = Math.random().toString(36).substr(2, 8).toLowerCase(); 

    const uniqueId = `${randomNumber}${timePart}${randomString2}${userAgentHash}`;

    return shuffleString(uniqueId).substr(0,10); 
}

const shuffleString = (inputString) => {
    const array = inputString.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array.join(''); 
}


const hashString = (str) => {
    let hash = Math.floor(Math.random() * 10);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }
    return hash;
}

module.exports = {
    generateAndFetchId
}