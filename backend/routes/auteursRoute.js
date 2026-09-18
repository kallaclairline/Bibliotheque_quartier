const express = require('express');
const route = express.Router();
const auteursController = require('../controllers/auteursControllers');
const {regleCreerAuteur} = require('../middlewares/validationAuteurs');
const verifierValidation = require('../middlewares/gestionValidation');
// route ver le controllers
route.get('/', auteursController.recupererAuteurs);
route.get('/:id', auteursController.recupererAuteursParID);
route.post('/', regleCreerAuteur, verifierValidation, auteursController.creerAuteurs);
route.put('/:id', auteursController.modifierAuteurs);
route.delete('/:id', auteursController.suprimerAuteurs);
//exporter
module.exports = route;
