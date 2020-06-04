// code away!
const server = require('./server.js');
require('dotenv').config()

const port = process.env.PORT || 8005;
server.listen(port, () => {
  console.log(`server is listening on ${port} bobby, today is 6/3/2020, goodluck and hardwork`);
});