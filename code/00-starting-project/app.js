const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(htmlFilePath);
});

app.get('/about', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'about.html');
  res.sendFile(htmlFilePath);
});

app.get('/restaurants', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');
  res.sendFile(htmlFilePath);
});

app.get('/recommend', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
  res.sendFile(htmlFilePath);
});

app.get('/confirm', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
  res.sendFile(htmlFilePath);
});

app.post('/recommend', (req, res) => {
  const restaurant = req.body;

  const filePath = path.join(__dirname, 'data', 'restaurants.json');

  const data = fs.readFileSync(filePath);
  const restaurantsData = JSON.parse(data);
  restaurantsData.push(restaurant);

  fs.writeFile(filePath, JSON.stringify(restaurantsData), (err) => {
    if (err) {
      return res.statusCode(500).send('Internal Server Error');
    } else {
      res.redirect('/confirm');
    }
  });
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
