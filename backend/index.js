const express = require('express')
var cors = require('cors')
const http = require("http")
const setupSocket = require('./socket/Socket');
const connectToDatabase = require('./db');
const app = express()

const port = 5000

const path = require('path');
const uploadsPath = path.join(__dirname, 'uploads');

// Use express.static to serve the files
app.use('/uploads', express.static(uploadsPath));

app.use(cors())
app.use(express.json());

connectToDatabase();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', require('./routes/authRoute'));
app.use('/friend', require('./routes/friendRequestRoute'));
app.use('/chat',require('./routes/MessageRoute'));
app.use('/post',require('./routes/PostRoutes'));

const server = http.createServer(app);

setupSocket(server);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});