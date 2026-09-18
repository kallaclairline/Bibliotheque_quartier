const express = require('express');
const route = express.Router();
const statistiquesController = require('../controllers/statistiquesControllers');

// route ver le controllers
route.get('/', statistiquesController.recupererStatistiques);

//exporter
module.exports = route;