const path = require('path');
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/restaurants', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'restaurants.json');
  const data = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(data);
  res.render('restaurants', { restaurants: storedRestaurants });
});
app.get('/restaurants/:restaurant', (req, res) => {
  const restaurantId = req.params.restaurant;
  const filePath = path.join(__dirname, 'data', 'restaurants.json');
  const data = fs.readFileSync(filePath);
  const restaurantsData = JSON.parse(data);
  const restaurant = restaurantsData.find((r) => r.id === restaurantId);
  if (!restaurant) return res.render('404');
  res.render('restaurant-details', { restaurant });
});
app.get('/confirm', (req, res) => res.render('confirm'));
app.get('/recommend', (req, res) => res.render('recommend'));
app.post('/recommend', (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuidv4();
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

// 404 Requests Handler ('Must be after all routes')
app.use((req, res) => res.render('404'));

// 500 Server Errors Handlers
app.use((error, req, res, next) => res.render('500'));

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
