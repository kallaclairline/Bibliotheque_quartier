const { body } = require('express-validator');

const regleCreerLivre = [body('titre').trim().notEmpty().withMessage('Le titre est obligatoire'),
    body('id_auteur').notEmpty().withMessage('L\'auteur est obligatoire').isInt().withMessage('id_auteur doit être un nombre entier'),
    body('annee_publication').optional().isInt({ min: 0 }).withMessage('L\'année de publication doit être un nombre entier')];

module.exports = {regleCreerLivre};