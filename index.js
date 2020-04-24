const app = require('express')();
const body = require('body-parser');
const multer = require('multer')
const { wrap } = require('./src/profiler');

const getHandler = (req, res) => res.send('On get request');
const postHandler = (req, res) => {
  console.log(`Has body: ${Object.keys(req.body).length !== 0 ? 'Yes' : 'No'}`);
  res.send('On post request');
};
const uploadHandler = (req, res) => {
  console.log(`Has body: ${Object.keys(req.body).length !== 0 ? 'Yes' : 'No'}`);
  console.log(`Has file: ${Object.hasOwnProperty.call(req, 'file') ? 'Yes' : 'No'}`);
  res.send('On file upload');
};
const putHandler = (req, res) => res.send('On put request');
const authMiddlewareFake = (req, res, next) => setTimeout(() => next(), 100);
const upload = multer({ dest: './src/uploads/' });

app.use(wrap(body.json()));
app.get('/get', wrap(getHandler));
app.post('/post', wrap(authMiddlewareFake), wrap(postHandler));
app.put('/put', wrap(authMiddlewareFake), wrap(putHandler));
app.post('/upload', wrap(authMiddlewareFake), wrap(upload.single('avatar')), wrap(uploadHandler));

app.listen(3001);
