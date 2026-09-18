// demarage du server express: pont d'entre de l'application
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;  

// les Middlware global
app.use(cors()); // autorise le fontend a appelle  cette api
app.use(morgan('dev')); //logging de chaque requete resu
app.use(express.json()); // lui permet a express de lire le json envoyer dans le corps des requetes

// route de test pour verifier que le server fonctionne
app.get('/', (req, res) => {
    res.json({message: `Le server de API gestion bibliotheque fonctionne`});
}
);

//Route de l'application
app.use('/api/auteurs', require('./routes/auteursRoute'));
app.use('/api/adherents', require('./routes/adherentsRoute'));
app.use('/api/livres', require('./routes/livreRoute'));      
app.use('/api/emprunts', require('./routes/empruntsRoute'));
app.use('/api/statistiques', require('./routes/statistiqueRoute')); 

// Middlware de gestion d'erreur
app.use((req, res) => {
    res.status(404).json({err: `Route non trouver`});
}
);
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).json({error:` Erreur interne du serveur`});
}
); 
// Demarage du serveur 
app.listen(PORT, () =>{
    console.log(`server demare sur http://localhost: ${PORT}`);
}
);
