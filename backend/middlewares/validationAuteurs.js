const { body } = require('express-validator');
const regleCreerAuteur = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est obligatoire')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
    body('nationalite')
        .optional()
        .isString().withMessage('La nationalité doit être un texte')
];
module.exports = {regleCreerAuteur};