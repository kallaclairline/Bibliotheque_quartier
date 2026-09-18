const {validationResult} = require('express-validator');

// Vérifie si des erreurs de validation ont été détectées par les règles définies avant lui.
// Si oui, bloque la requête et renvoie les erreurs. Sinon, laisse passer vers le controller.
const verifierValidation = (req, res, next) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
        return res.status(400).json({ erreurs: erreurs.array() });
    }
    next();
};

module.exports = verifierValidation;