const express = require('express');
const bodyParser = require('body-parser');
const {
    logInfo, 
    logMiddleWare
} = require('./index');

const app = express();

app.use(bodyParser.json())
app.use(logMiddleWare);

app.get('/', async (req, res) => {
  logInfo("LOG", '🔧 Processing /');
  await new Promise(resolve => setTimeout(resolve, 100));
  logInfo("LOG", '✅ Done');
  res.send('Hello with traceable logs!');
});

app.post('/', async (req, res) => {
  logInfo("LOG", req.body, true);
  logInfo("LOG", "number", true);
  res.send('Hello with traceable logs!');
});

app.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));