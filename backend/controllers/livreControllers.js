const pool = require('../config/db');

//GET api livres: recupere tout les livres avec recherche et pagination
 const recupererLivres = async (req, res) => {
    try{
        const {titre, auteur} = req.query;
        //pagination: page 1 par defaut,10 resultat par page par defaut
        const page = parseInt(req.query.page) || 1;
        const limite = parseInt(req.query.limite)|| 10;
        const decalage = (page - 1) * limite;
        // requete dinamique selon les fitre ressu
        let conditions = [];
        let valeurs = [];
        let compteur = 1;
        if(titre){
            conditions.push(`l.titre ILIKE $${compteur}`);
            valeurs.push(`%${titre}%`);
            compteur++;
        }
        if(auteur){
            conditions.push(`a.nom ILIKE $${compteur}`);
            valeurs.push(`%${auteur}%`);
            compteur++;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join('AND')}` :'';
        //requete principale:les livres correspendant avec pagination
        const requteLivres= `SELECT l.id_livre, l.titre, l.annee_publication, l.statut, a.id_auteur, a.nom AS nom_auteur FROM livres l JOIN auteurs a ON l.id_auteur = a.id_auteur ${whereClause} ORDER BY l.id_livre LIMIT $${compteur} OFFSET $${compteur + 1}`;
        const valeursLivres = [...valeurs, limite, decalage];
        //requete pour le nombre totalde resultat .savoir combien de page existent
        const requeteTotal = `SELECT COUNT(*) FROM livres l JOIN auteurs a ON l.id_auteur = a.id_auteur ${whereClause}`;
        const [resultLivres, resultTotal] = await Promise.all([pool.query(requteLivres, valeursLivres), pool.query(requeteTotal, valeurs)]);
        const total = parseInt(resultTotal.rows[0].count);
        res.json({donnees: resultLivres.rows, pagination: {page, limite, total, totalPages: Math.ceil(total / limite)}});
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des livres`});     
    }
 };

//GET api livres par id: recupere un seul livre par son idantifiant
const recupererLivresParID = async (req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT l.id_livre, l.titre, l.annee_publication, l.statut, a.id_auteur, a.nom AS nom_auteur FROM livres l JOIN auteurs a ON l.id_auteur = a.id_auteur WHERE l.id_livre = $1',[id]);
        if(result.rows.length == 0){
        return res.status(404).json({error: `Livre pas trouver`});    
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la recuperation du livre"});
    }
};

//POST api livres: creer un nouvel livre
const creerLivres = async(req, res)=>{
    try{
        const {titre, id_auteur, annee_publication} = req.body;
        if(!titre || !id_auteur){
            return res.status(400).json({error:" Le titre et le l'auteur sont obligatoire"}); 
        }
        const result = await pool.query(`INSERT INTO livres (titre, id_auteur, annee_publication) VALUES($1, $2, $3) RETURNING *`,[titre, id_auteur, annee_publication]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la creation du livre"});
    }
};

//PUT api livres id: modifier un livre existant
const modifierLivres = async (req, res)=>{
    try{
        const {id} = req.params;
        const {titre, id_auteur, annee_publication} = req.body;
        const result = await pool.query(`UPDATE livres SET titre = $1, id_auteur = $2, annee_publication = $3 WHERE id_livre = $4 RETURNING *`, [titre, id_auteur, annee_publication, id]);
        if(result.rows.length == 0){
            return res.status(400).json({error:" Livre pas trouver"}); 
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la modification du livre"});
    }
};

//DELETE api livres id: Suprimer un livre
const suprimerLivres = async(req, res)=>{
    try{
        const {id} = req.params;
        const result = await pool.query(`DELETE FROM livres WHERE id_livre = $1 RETURNING *`, [id]);
        if(result.rows.length == 0){
            return res.status(404).json({error:" Livre pas trouver"}); 
        }
        res.json({message: "Livre suprimer avec secces"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Erreur lor de la supression du livre"});
    }
};

module.exports ={recupererLivres, recupererLivresParID, creerLivres, modifierLivres, suprimerLivres};
  

