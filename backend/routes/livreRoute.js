const express = require('express');
const route = express.Router();
const livresController = require('../controllers/livreControllers');
const {regleCreerLivre} = require('../middlewares/validationLivres');
const verifierValidation = require('../middlewares/gestionValidation');
// route ver le controllers
route.get('/', livresController.recupererLivres);
route.get('/:id', livresController.recupererLivresParID);
route.post('/', regleCreerLivre, verifierValidation, livresController.creerLivres);
route.put('/:id', livresController.modifierLivres);
route.delete('/:id', livresController.suprimerLivres);
//exporter
module.exports = route;
