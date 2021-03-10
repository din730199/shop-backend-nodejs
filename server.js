const express = require('express');
const app = express();
const body_parser = require('body-parser');
const ProductModel = require('./db/model/Product');
const PORT = process.env.PORT || 3000;
const connectDB = require('./db/index');
const path = require('path');
const server = require('http').Server(app);
const cors = require('cors');
app.use(cors());
server.listen(PORT);

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('hello');
  socket.on('search', async (keyword) => {
    let docOrigin = await ProductModel.find().populate('productType', 'name');

    if (keyword) {
      let doc = docOrigin.filter((value, index) => {
        let line = value.name + value.productType.name;

        let l = change_alias(line);
        let k = change_alias(keyword);

        if (l.toLowerCase().indexOf(k.toLowerCase()) != -1) {
          return value;
        }
      });

      io.emit('search', {
        doc: doc,
      });
    } else {
      io.emit('search', {
        doc: docOrigin,
      });
    }
  });
});

connectDB();
app.use(body_parser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/users', require('./routers/users/index'));
app.use('/api/productType', require('./routers/productType/index'));
app.use('/api/product', require('./routers/product/index'));
app.use('/api/bill', require('./routers/bill/index'));

app.get('/', (req, res) => {
  res.send('Welcome');
});

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  );
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
}
