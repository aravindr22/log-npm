const path = require("path");
const fs = require("fs");

const { generateAndFetchId } = require("./debugIdGenerator");
const { encryptData } = require("./encryption/encryptor");
const { logLocalWriter, logServerWriter } = require('./logWriter');
const config = require("../config/client-config");

const DEBUG_ID_HEADER = "x-debud-id";
let DEBUG_ID = "";
let fileStream = null;
let globalSource = null;
let clientInfo = {};

const logMiddleWare = (req, res, next) => {
    let debugId = res?.header[DEBUG_ID_HEADER] || req?.header[DEBUG_ID_HEADER] || generateAndFetchId(req);

    if (Array.isArray(debugId)) debugId = debugId[0];
    DEBUG_ID = debugId;

    console.log(`Request received with Debug ID: ${debugId}`);

    if (config?.enableFileLog === true) {
        const logsDir = path.resolve("logs");
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
        const logFilePath = path.join(logsDir, `${debugId}.log`);
        fileStream = fs.createWriteStream(logFilePath, { flags: "a" });
    }

    clientInfo = {
        host: req?.headers?.host,
        userAgent: req?.headers["user-agent"]
    }

    globalSource = config?.source || fetchSource(req);

    req.headers.debugId = debugId;
    res.setHeader(DEBUG_ID_HEADER, debugId);

    res.on("finish", () => {
        if (fileStream) {
            fileStream.end();
            console.log("Log file closed for Debug ID:", debugId);
        }
    });

    next();
};

const fetchSource = (req) => {
    const source = config?.source || req.url.replaceAll("/", "_").replace("_", "");
    return source.length > 0 ? source : config?.application_name ? config?.application_name : "unknown_source" ;
} 

const logger = (level, key, payload, toBeEncrypted) => {
    loggerWithSource(level, key, payload, globalSource, toBeEncrypted);
};

const loggerWithSource = (level, key, payload, source, toBeEncrypted) => {
    const logTime = new Date();
    let payloadData = payload;
    if (typeof payload === "string") {
        payloadData = JSON.parse(JSON.stringify(payload));
    }

    let maskedData;
    if (toBeEncrypted) {
        maskedData = encryptData(payloadData);
    } else {
        maskedData = payloadData;
    }


    const logData = {
        level,
        key,
        maskedData,
        DEBUG_ID,
        timestamp: logTime,
        source,
        clientInfo
    }

    logLocalWriter(fileStream, logData);
    logServerWriter(logData);
}

module.exports = {
    logger,
    loggerWithSource,
    logMiddleWare,
};
