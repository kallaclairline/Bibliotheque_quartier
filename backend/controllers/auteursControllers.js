const pool = require('../config/db');

//GET api auteur: recupere tout les auteur
 const recupererAuteurs = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM auteurs ORDER BY id_auteur');
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des auteurs`});
    }
 };

//GET api auteur par id: recupere un seul auteur par son idantifion
const recupererAuteursParID = async (req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM auteurs WHERE id_auteur =$1',[id]);
        if(result.rows.length == 0){
        return res.status(404).json({error: `Auteur pas trouver`});    
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la recuperation de l auteurs"});
    }
};

//POST api auteur: creer un nouvel auteur
const creerAuteurs = async(req, res)=>{
    try{
        const {nom, nationalite} = req.body;
        if(!nom){
            return res.status(400).json({error:" Le nom de l'auteur est obligatoire"}); 
        }
        const result = await pool.query(`INSERT INTO auteurs (nom, nationalite) VALUES($1, $2) RETURNING *`,[nom, nationalite]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la creation de l'auteurs"});
    }
};

//PUT api auteurs id: modifier un auteur existant
const modifierAuteurs = async (req, res)=>{
    try{
        const {id} = req.params;
        const {nom, nationalite} = req.body;
        const result = await pool.query(`UPDATE auteurs SET nom = $1, nationalite = $2 WHERE id_auteur = $3 RETURNING *`, [nom, nationalite, id]);
        if(result.rows.length == 0){
            return res.status(400).json({error:" Auteur pas trouver"}); 
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la modification de l'auteurs"});
    }
};

//DELETE api auteurs id: Suprimer un auteur
const suprimerAuteurs = async(req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query(`DELETE FROM auteurs WHERE id_auteur = $1 RETURNING *`, [id]);
        if(result.rows.length == 0){
            return res.status(404).json({error:" Auteur pas trouver"}); 
        }
        res.json({message: "Auteur suprimer avec secces"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la supression de l'auteurs"});
    }
};
module.exports ={recupererAuteurs, recupererAuteursParID, creerAuteurs, modifierAuteurs, suprimerAuteurs};
  

