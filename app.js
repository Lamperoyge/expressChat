var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const rsaWrapper = require('./client/Components/rsa-wrapper')
const aesWrapper = require('./client/Components/aes-wrapper')
rsaWrapper.initLoadServerKeys(__dirname);
rsaWrapper.serverExampleEncrypt();


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(__dirname + '/static'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.io = io;
  next();
});


let users = []
let sockets = []
io.on('connection', (socket) => {
  
  let encrypted = rsaWrapper.encrypt(rsaWrapper.clientPub, 'Hello RSA message from client to server');
  socket.emit('rsa server encrypted message', encrypted);
  socket.on('rsa client encrypted message', function(data) {
    console.log('server received RSA msg from client');
    console.log('Encrypted message is', '\n', data)
    console.log('Decrypted message', '\n', rsaWrapper.decrypt(rsaWrapper.serverPrivate,data))
  })
  let counter = 0;
  socket.on('sendMessage', function(data) {
    if(!users.includes(data.username)) {
      users.push(data.username)
    }
    io.emit('users', users)
    console.log(users)
    io.emit('receiveMsg', data)
  })
  socket.on('disconnect', function(data) {
    console.log(data)
    io.emit('user disconnected', data)
  })
  const aesKey = aesWrapper.generateKey();
  let encryptedAesKey = rsaWrapper.encrypt(rsaWrapper.clientPub, (aesKey.toString('base64')));
  socket.emit('send key from server to client', encryptedAesKey);
  socket.on('aes client encrypted message', function (data) {
    // console.log('Server received AES message from client', '\n', 'Encrypted message is', '\n', data);
    console.log('Decrypted message', '\n', aesWrapper.decrypt(aesKey, data));

    // Test send client dummy AES message
    let message = aesWrapper.createAesMessage(aesKey, 'Server AES message');
    socket.emit('aes server encrypted message', message);
  });
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
