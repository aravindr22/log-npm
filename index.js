const {logger, logMiddleWare} = require('./helper/log');

const {
  LEVELS
} = require('./helper/constants');

const logInfo = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.INFO, key, payload, toBeEncrypted);
}

const logWarn = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.WARN, key, payload, reqObject, toBeEncrypted);
}

const logError = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.ERROR, key, payload, toBeEncrypted);
}

const logDebug = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.DEBUG, key, payload, toBeEncrypted);
}


module.exports = {
  logMiddleWare,
  logDebug,
  logError,
  logInfo,
  logWarn
};