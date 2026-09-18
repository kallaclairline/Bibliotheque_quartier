const express = require('express');
const route = express.Router();
const adherentController = require('../controllers/adherentsControllers');
const {regleCreerAdherent} = require('../middlewares/validationAdherent');
const verifierValidation = require('../middlewares/gestionValidation');
// route ver le controllers
route.get('/', adherentController.recupererAdherents);
route.get('/:id', adherentController.recupererAdherentsParID);
route.get('/:id/emprunts', adherentController.recupererHistoriqueEmprunts);
route.post('/', regleCreerAdherent, verifierValidation, adherentController.creerAdherents);
route.put('/:id', adherentController.modifierAdherent);
route.delete('/:id', adherentController.suprimerAdherent);
//exporter
module.exports = route;
