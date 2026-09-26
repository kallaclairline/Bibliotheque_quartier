const pool = require('../config/db');

//GET api emprunt: recupere tout les emprunts avec nom adherent + titre livre
 const obtenirTousEmprunts = async (req, res) => {
    try{
        const result = await pool.query('SELECT e.id_emprunts, e.date_emprunts, e.date_retour_prevue, e.date_retour_effective, ad.id_adherent, ad.nom AS nom_adherent, l.id_livre, l.titre AS titre_livre FROM emprunts e JOIN adherents ad ON e.id_adherent = ad.id_adherent JOIN livres l ON e.id_livre = l.id_livre ORDER BY e.date_emprunts DESC ');
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des emprunts`});
    }
 };
 // Get api emprunts en-cour: emprunt non encore rendus
  const obtenirEmpruntsEncours = async (req, res) => {
    try{
        const result = await pool.query('SELECT e.id_emprunts, e.date_emprunts, e.date_retour_prevue, ad.id_adherent, ad.nom AS nom_adherent, l.id_livre, l.titre AS titre_livre FROM emprunts e JOIN adherents ad ON e.id_adherent = ad.id_adherent JOIN livres l ON e.id_livre = l.id_livre WHERE e.date_retour_effective IS NULL ORDER BY e.date_emprunts DESC ');
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des emprunts en cours`});
    }
 };
 // Get api emprunts en-retard: emprunt non rendus et date de retour prevue depasser
 const obtenirEmpruntsEnRetard = async (req, res) => {
    try{
        const result = await pool.query('SELECT e.id_emprunts, e.date_emprunts, e.date_retour_prevue, ad.id_adherent, ad.nom AS nom_adherent, l.id_livre, l.titre AS titre_livre FROM emprunts e JOIN adherents ad ON e.id_adherent = ad.id_adherent JOIN livres l ON e.id_livre = l.id_livre WHERE e.date_retour_effective IS NULL AND e.date_retour_prevue < CURRENT_DATE ORDER BY e.date_retour_prevue ASC ');
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Erreur lor de la recuperation des emprunts en retard`});
    }
 };

 // GET api/emprunts/adherent/:id : récupère l'historique d'un adhérent
const obtenirEmpruntsParAdherent = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT e.id_emprunts, e.date_emprunts, e.date_retour_prevue,
                    e.date_retour_effective,
                    ad.id_adherent, ad.nom AS nom_adherent,
                    l.id_livre, l.titre AS titre_livre
             FROM emprunts e
             JOIN adherents ad ON e.id_adherent = ad.id_adherent
             JOIN livres l ON e.id_livre = l.id_livre
             WHERE e.id_adherent = $1
             ORDER BY e.date_emprunts DESC`,
            [id]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erreur lors de la récupération de l'historique de l'adhérent"
        });
    }
};
 //POST api emprunts : cree un emprunt, verifie la disponibilite + met a jour le statut du livre
 const creerEmprunt = async(req, res)=>{
    const client = await pool.connect();
     try{
         const {id_adherent, id_livre, date_retour_prevue} = req.body;
         if(!id_adherent || !id_livre || !date_retour_prevue ){
            client.release();
             return res.status(400).json({error:" L'adherent, le livre et la date de retour prevue sont obligatoire"}); 
         }
         await client.query('BEGIN');

         // premiere etape: verifier que le livre existe et est disponible
         const livre = await client.query('SELECT * FROM livres WHERE id_livre = $1 FOR UPDATE', [id_livre]);
         if(livre.rows.length == 0 ){
            await client.query('ROLLBACK');
            client.release();
             return res.status(404).json({error:" Livre non trouver"}); 
         }
         if(livre.rows[0].statut == 'emprunte' ){
            await client.query('ROLLBACK');
            client.release();
             return res.status(409).json({error:" Ce livre est deja emprunte"}); 
         }
         // deuxieme etape : creer l'emprunt
         const nouvelEmprunt = await client.query('INSERT INTO emprunts (id_adherent, id_livre, date_retour_prevue) VALUES ($1, $2, $3) RETURNING *', [id_adherent, id_livre, date_retour_prevue]);
         // troisieme etape: metre a jour le status du livre a emprunte
          await client.query(`UPDATE livres SET statut = $1 WHERE id_livre = $2`, ['emprunte', id_livre]);
           await client.query('COMMIT');
           client.release();
         res.status(201).json(nouvelEmprunt.rows[0]);
     }catch(err){
        await client.query('ROLLBACK');
        client.release();
         console.error(err);
         res.status(500).json({error: "Erreur lor de la creation de l'emprunt"});
     }
 };
//PUT api emprunts id retour : enregistre le retour d'un livre
const enregistreRetour = async(req, res)=>{
    const client = await pool.connect();
    try{
        const {id} = req.params;
        await client.query('BEGIN');
        // premiere etape: verifier que le livre existe et est disponible
         const emprunt = await client.query('SELECT * FROM emprunts WHERE id_emprunts = $1', [id]);
         if(emprunt.rows.length == 0 ){
            await client.query('ROLLBACK');
            client.release();
             return res.status(404).json({error:" emprunt non trouver"}); 
         }

         if(emprunt.rows[0].date_retour_effective != null ){
            await client.query('ROLLBACK');
            client.release();
             return res.status(400).json({error:" Ce livre a deja ete rendu"}); 
         }
        // deuxieme etape : enregistre la date de retour
         const empruntMisAjour = await client.query('UPDATE emprunts SET date_retour_effective = CURRENT_DATE WHERE id_emprunts = $1 RETURNING *', [id]);
         // troisieme etape: metre a jour le status du livre a emprunte
          await client.query(`UPDATE livres SET statut = $1 WHERE id_livre = $2`, ['disponible', emprunt.rows[0].id_livre]);
           await client.query('COMMIT');
           client.release();
         res.json(empruntMisAjour.rows[0]);
     }catch(err){
        await client.query('ROLLBACK');
        client.release();
         console.error(err);
         res.status(500).json({error: "Erreur lor de l'enregitrement du retour "});
     }
    };
    module.exports = {obtenirTousEmprunts, obtenirEmpruntsEncours, obtenirEmpruntsEnRetard, obtenirEmpruntsParAdherent, creerEmprunt, enregistreRetour};