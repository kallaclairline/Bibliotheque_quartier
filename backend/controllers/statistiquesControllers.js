const pool = require('../config/db');

//GET api statistiques: tableau de bord (totaux, livre le plus emprunte, adherent le plus actif)
const recupererStatistiques = async (req, res) => {
    try {
        const [totalLivres, totalAdherents, empruntsEnCours, empruntsEnRetard, livrePlusEmprunte, adherentPlusActif] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM livres'),
            pool.query('SELECT COUNT(*) FROM adherents'),
            pool.query('SELECT COUNT(*) FROM emprunts WHERE date_retour_effective IS NULL'),
            pool.query('SELECT COUNT(*) FROM emprunts WHERE date_retour_effective IS NULL AND date_retour_prevue < CURRENT_DATE'),
            pool.query(`SELECT l.titre, COUNT(*) AS nombre_emprunts FROM emprunts e JOIN livres l ON e.id_livre = l.id_livre GROUP BY l.id_livre, l.titre ORDER BY nombre_emprunts DESC  LIMIT 1`),
            pool.query(`SELECT ad.nom, COUNT(*) AS nombre_emprunts FROM emprunts e JOIN adherents ad ON e.id_adherent = ad.id_adherent GROUP BY ad.id_adherent, ad.nom ORDER BY nombre_emprunts DESC LIMIT 1`)
        ]);
        res.json({total_livres: parseInt(totalLivres.rows[0].count), total_adherents: parseInt(totalAdherents.rows[0].count), emprunts_en_cours: parseInt(empruntsEnCours.rows[0].count), emprunts_en_retard: parseInt(empruntsEnRetard.rows[0].count), livre_plus_emprunte: livrePlusEmprunte.rows[0] || null, adherent_plus_actif: adherentPlusActif.rows[0] || null});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lor de la recuperation des statistiques" });
    }
};

module.exports = {recupererStatistiques};