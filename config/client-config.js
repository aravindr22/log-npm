const path = require('path');

let config = null;

const readConfig = () => {
  const configPath = path.join(process.cwd(), 'log.config.json');
  try {
    config = require(configPath);
    console.log("Client-Config for log loaded successfully");
  } catch (error) {
    console.error("Error reading config file:", error);
  }
}

if (!config) {
  readConfig();
}

module.exports = config;