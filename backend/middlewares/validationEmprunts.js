const { body } = require('express-validator');

const regleCreerEmprunt = [
    body('id_adherent').notEmpty().withMessage('L\'adhérent est obligatoire').isInt().withMessage('id_adherent doit être un nombre entier'),
    body('id_livre').notEmpty().withMessage('Le livre est obligatoire').isInt().withMessage('id_livre doit être un nombre entier'),
    body('date_retour_prevue').notEmpty().withMessage('La date de retour prévue est obligatoire').isDate().withMessage('La date de retour prévue doit être une date valide (AAAA-MM-JJ)')];

module.exports = { regleCreerEmprunt };