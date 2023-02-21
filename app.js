const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const mongoose = require('mongoose');
const Data = require('./data');
const { db } = require('./data');
const dbConfig = require('./db.config.js');

const app = express();

// Configuration de l'application parler avec le backend simplifier
app.set('view engine', 'ejs');
//L'endroit ou y a le Js, les images et le css 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Connection error:', error);
});

// Route pour afficher le formulaire de recherche ( afficher la première page )
app.get('/', (req, res) => {
  res.render('index');
});

// Route pour afficher les résultats de recherche ( Après le submit )
app.post('/', (req, res) => {
  const keyword = req.body.keyword;

  axios.get(`https://fr.wikipedia.org/w/api.php?action=opensearch&search=${keyword}&format=json`)
    .then(response => {
      const responseData = response.data;

      const items = responseData[1].map((name, index) => ({
        name: name,
        description: responseData[2][index],
        link: responseData[3][index]
      }));

      // Stocker les données dans MongoDB
      const data = new Data({
        keyword: keyword,
        items: items
      });

      data.save().then(() => {
        console.log('Data saved:', data);
        res.render('results', { keyword: keyword, items: items });
      }).catch((error) => {
        console.log('Error saving data:', error);
        res.render('error');
      });
    })
    .catch(error => {
      console.log('API error:', error);
      res.render('error');
    });
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Server started');
});
