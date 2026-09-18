const { body } = require('express-validator');

const regleCreerAdherent = [body('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
     body('contact').trim().notEmpty().withMessage('Le contact est obligatoire')];

module.exports = {regleCreerAdherent};