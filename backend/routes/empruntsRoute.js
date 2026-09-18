const express = require('express');
const route = express.Router();
const empruntsController = require('../controllers/empruntControllers');
const {regleCreerEmprunt} = require('../middlewares/validationEmprunts');
const verifierValidation = require('../middlewares/gestionValidation');
// route ver le controllers
route.get('/', empruntsController.obtenirTousEmprunts);
route.get('/encours', empruntsController.obtenirEmpruntsEncours);
route.get('/retard', empruntsController.obtenirEmpruntsEnRetard);
route.get('/adherent/:id', empruntsController.obtenirEmpruntsParAdherent);
route.post('/', regleCreerEmprunt, verifierValidation, empruntsController.creerEmprunt);
route.put('/:id/retour', empruntsController.enregistreRetour);
//exporter
module.exports = route;
