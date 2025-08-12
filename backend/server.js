const http = require('http');
const app = require('../backend/app');
const port = 5000;

const server = http.createServer(app)
server.listen(port,()=>{
    console.log('app is running on port '+ port)
})