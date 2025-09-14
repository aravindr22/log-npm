const axios = require('axios');

const config = require("../config/client-config");
const { BASE_SERVER_URL } = require("../config/server-config");

const logLocalWriter = (fileStream, logData) => {
    if (config?.enableLocalLog) {
        console.log(logData.DEBUG_ID, logData.source, logData.level, logData.key, JSON.stringify(logData.maskedData));
    }


    if (config?.enableFileLog && fileStream) {
        let message = `[${logData.DEBUG_ID}]-[${logData.source}]-[${logData.level}] - ${logData.key} : ${JSON.stringify(
            logData.maskedData
        )}\n`;
        fileStream.write(message);
    }
}

const logServerWriter = async (logData) => {
    try {
        if(config?.enableServerLog === false) return;

        const data = {
            key: logData.key,
            message: logData.maskedData,
            level: logData.level,
            source: logData.source,
            timestamp: logData?.timestamp,
            clientInfo: logData?.clientInfo
        };

        const headers = {
            'Content-Type': 'application/json',
            'x-debug-id': logData.DEBUG_ID,
            'x-api-key': config?.apiKey || ""
        };

        await axios.post(`${BASE_SERVER_URL}/log-service/log`, data, { headers });

    } catch (error) {
        console.error("Error sending log to server:", error.message);
    }
}

module.exports = {
    logLocalWriter,
    logServerWriter
};