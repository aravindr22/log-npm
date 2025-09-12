const path = require("path");
const fs = require("fs");

const { generateAndFetchId } = require("./debugIdGenerator");
const { encryptData } = require("./encryption/encryptor");
const config = require("../config/client-config");

const DEBUG_ID_HEADER = "x-debud-id";
let DEBUG_ID = "";
let fileStream = null;

const logMiddleWare = (req, res, next) => {
    let debugId = req.headers[DEBUG_ID_HEADER] || generateAndFetchId(req);

    if (Array.isArray(debugId)) debugId = debugId[0];
    req.debugId = debugId;
    DEBUG_ID = debugId;

    console.log(`Request received with Debug ID: ${debugId}`);

    if (config?.enableLocalLog) {
        const logsDir = path.resolve("logs");
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
        const logFilePath = path.join(logsDir, `${debugId}.log`);
        fileStream = fs.createWriteStream(logFilePath, { flags: "a" });
    }

    res.setHeader(DEBUG_ID_HEADER, debugId);

    res.on("finish", () => {
        if (fileStream) {
            fileStream.end();
            console.log("Log file closed for Debug ID:", debugId);
        }
    });

    next();
};

const logger = (level, key, payload, toBeEncrypted) => {
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

    if (config?.enableLocalLog) {
        console.log(DEBUG_ID, level, key, JSON.stringify(maskedData));
    }

    if (config?.enableLocalLog && fileStream) {
        let message = `[${Date.now()}]-[${level}] - ${key} : ${JSON.stringify(
            maskedData
        )}\n`;
        fileStream.write(message);
    }
};

module.exports = {
    logger,
    logMiddleWare,
};
