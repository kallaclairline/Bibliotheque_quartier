const pool = require('../config/db');

//GET api adherents: recupere tout les adherents
 const recupererAdherents = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM adherents ORDER BY id_adherent');
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des adherents`});
    }
 };

//GET api adherents par id: recupere un seul adherent par son idantifiant
const recupererAdherentsParID = async (req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM adherents WHERE id_adherent =$1', [id]);
        if(result.rows.length == 0){
        return res.status(404).json({error: `Adherent pas trouver`});    
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la recuperation de l'adherent"});
    }
};

//POST api adherents: creer un nouvel adherent
const creerAdherents = async(req, res)=>{
    try{
        const {nom, contact} = req.body;
        if(!nom || !contact){
            return res.status(400).json({error:" Le nom et le contact de l'adherent est obligatoire"}); 
        }
        const result = await pool.query(`INSERT INTO adherents (nom, contact) VALUES($1, $2) RETURNING *`, [nom, contact]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la creation de l'adherent"});
    }
};

//PUT api adherents id: modifier un adherent existant
const modifierAdherent = async (req, res)=>{
    try{
        const {id} = req.params;
        const {nom, contact} = req.body;
        const result = await pool.query(`UPDATE adherents SET nom = $1, contact = $2 WHERE id_adherent = $3 RETURNING *`, [nom, contact, id]);
        if(result.rows.length == 0){
            return res.status(400).json({error:" Adherent pas trouver"}); 
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la modification de l'adherent"});
    }
};

//DELETE api adherents id: Suprimer un adherent
const suprimerAdherent = async(req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query(`DELETE FROM adherents WHERE id_adherent = $1 RETURNING *`, [id]);
        if(result.rows.length == 0){
            return res.status(404).json({error:" Adherent pas trouver"}); 
        }
        res.json({message: "Adherent suprimer avec secces"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la supression de l'adherent"});
    }
};

//GET api adherentid id emprunts: historique des emprunts d'un adherent en cour et passee
const recupererHistoriqueEmprunts = async (req, res) => {
     try{
        const {id} = req.params;
        const result = await pool.query(`SELECT e.id_emprunts, l.titre, e.date_emprunts, e.date_retour_prevue, e.date_retour_effective FROM emprunts e
             JOIN livres l ON e.id_livre = l.id_livre WHERE e.id_adherent = $1 ORDER BY e.date_emprunts DESC`, [id]);
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la recuperation de lhystrique des emprunts"});
    }
};
module.exports ={recupererAdherents, recupererAdherentsParID, creerAdherents, modifierAdherent, suprimerAdherent, recupererHistoriqueEmprunts};
  

