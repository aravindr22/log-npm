const {logger, loggerWithSource, logMiddleWare: logMiddleWareInit} = require('./helper/log');

const {
  LEVELS
} = require('./helper/constants');

const logInfo = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.INFO, key, payload, toBeEncrypted);
}

const logWarn = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.WARN, key, payload, toBeEncrypted);
}

const logError = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.ERROR, key, payload, toBeEncrypted);
}

const logDebug = (key, payload, toBeEncrypted = false) => {
  logger(LEVELS.DEBUG, key, payload, toBeEncrypted);
}

const logInfoWithSource = (key, payload, source, toBeEncrypted = false) => {
  loggerWithSource(LEVELS.INFO, key, payload, source, toBeEncrypted);
}

const logWarnWithSource = (key, payload, source, toBeEncrypted = false) => {
  loggerWithSource(LEVELS.WARN, key, payload, source, toBeEncrypted);
}

const logErrorWithSource = (key, payload, source, toBeEncrypted = false) => {
  loggerWithSource(LEVELS.ERROR, key, payload, source, toBeEncrypted);
}

const logDebugWithSource = (key, payload, source, toBeEncrypted = false) => {
  loggerWithSource(LEVELS.DEBUG, key, payload, source, toBeEncrypted);
}

module.exports = {
  logMiddleWareInit,
  logDebug,
  logError,
  logInfo,
  logWarn,
  logDebugWithSource,
  logErrorWithSource,
  logInfoWithSource,
  logWarnWithSource
};