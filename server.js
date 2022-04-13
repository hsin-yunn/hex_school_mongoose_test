const http = require('http');
const mongoose = require('mongoose');
const Room = require('./models/room');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
console.log(DB, 'DB');

// mongoose
//   .connect('mongodb://localhost:27017/hotel')
//   .then(() => {
//     console.log('連線成功');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
mongoose
  .connect(DB)
  .then(() => {
    console.log('連線成功');
  })
  .catch((err) => {
    console.log(err);
  });

// schema
// const roomSchema = new mongoose.Schema(
//   {
//     name: String,
//     price: {
//       type: Number,
//       required: [true, '價格必填'],
//     },
//     rating: Number,
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       select: false,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//       select: false,
//     },
//   },
//   {
//     versionKey: false,
//     // timestamps:true
//   },
// );

//model
// const Room = mongoose.model('Room', roomSchema);

//new model
// const restRoom = new Room({
//   name: '讚讚房間5',
//   price: 1000,
//   rating: 4.5,
// });

//create Room
// restRoom
//   .save()
//   .then((data) => {
//     console.log(data, '建立成功');
//   })
//   .catch((err) => {
//     console.log(err, '建立失敗');
//   });

const requestListener = async function (req, res) {
  const header = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };

  //body
  let body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    const todos = await Room.find();
    res.writeHeader(200, header);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      }),
    );
    res.end();
  } else if (req.url == '/todo' && req.method == 'POST') {
    req.on('end', async function () {
      try {
        const data = JSON.parse(body);
        const todo = await Room.create(data);
        console.log(todo, 'todo');
        res.writeHeader(200, header);
        res.write(
          JSON.stringify({
            status: 'success',
            data: todo,
          }),
        );
        res.end();
      } catch (err) {
        console.log('error');
        res.writeHeader(400, header);
        res.write(
          JSON.stringify({
            status: 'failed',
            message: err,
          }),
        );
        res.end();
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    await Room.deleteMany({});
    res.writeHeader(200, header);
    res.write(
      JSON.stringify({
        status: 'success',
        data: [],
      }),
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const _id = req.url.split('/').pop();
    try {
      await Room.findByIdAndDelete(_id);
      res.writeHeader(200, header);
      res.write(
        JSON.stringify({
          status: 'success',
          message: 'data is deleted',
        }),
      );
      res.end();
    } catch (err) {
      res.writeHeader(400, header);
      res.write(
        JSON.stringify({
          status: 'failed',
          message: err,
        }),
      );
      res.end();
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', async function () {
      const _id = req.url.split('/').pop();
      try {
        const data = JSON.parse(body);
        const result = await Room.findByIdAndUpdate(_id, data, { new: true });
        res.writeHeader(200, header);
        res.write(
          JSON.stringify({
            status: 'success',
            data: result,
          }),
        );
        res.end();
      } catch (err) {
        res.writeHeader(400, header);
        res.write(
          JSON.stringify({
            status: 'failed',
            message: err,
          }),
        );
        res.end();
      }
    });
  } else if (req.method === 'OPTIONS') {
    //OPTIONS
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHeader(404, header);
    res.write(
      JSON.stringify({
        status: 'failed',
        message: 'page not found',
      }),
    );
  }
};

const server = http.createServer(requestListener);

server.listen('3000');
