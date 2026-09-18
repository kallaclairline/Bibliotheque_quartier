const API_URL = "https://bibliotheque-quartier.onrender.com/api";
let pageLivre = 1;
const limiteLivre = 10;
let totalPagesLivre = 1;
// AFFICHER LES LIVRES AVEC PAGINATION
async function afficherLivres() {
    try {
        const response = await fetch(`${API_URL}/livres?page=${pageLivre}&limite=${limiteLivre}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des livres");
        }
        const data = await response.json();
        totalPagesLivre = data.pagination.totalPages;
        const listeLivres = document.getElementById("liste-livres");
        listeLivres.innerHTML = "";

        data.donnees.forEach(livre => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td>${livre.titre}</td>
                <td>${livre.nom_auteur}</td>
                <td>${livre.annee_publication || "-"}</td>
                <td>${livre.statut}</td>
                <td>
                    <button onclick = "modifierLivre(${livre.id_livre})">Modifier</button>
                    <button onclick = "supprimerLivre(${livre.id_livre})">Supprimer</button>
                </td> `;
            listeLivres.appendChild(ligne);
        });
        //metre a jour l'affichage de la page 
        document.getElementById("page-livre").textContent = `Page ${data.pagination.page} / ${data.pagination.totalPages}`;
    // activer desactiver les bouton
    document.getElementById("btn-precedent-livre").disabled = pageLivre ===1;
    document.getElementById("btn-suivant-livre").disabled = pageLivre === data.pagination.totalPages; 
// BOUTON PAGE PRECEDENT
document.getElementById("btn-precedent-livre").addEventListener("click", function() {
    if(pageLivre >1) {
        pageLivre--;
        afficherLivres();
    }
});  
document.getElementById("btn-suivant-livre").addEventListener("click", function() {
    if(pageLivre < totalPagesLivre) {
        pageLivre++;
        afficherLivres();
    }
}); 
} catch (error) {
        console.error("Erreur livres :", error);
    }
}

// RECHERCHER LES LIVRES
async function rechercherLivres() {
    
    try {
        const titre = document.getElementById("recherche-livre").value;
        const auteur = document.getElementById("recherche-auteur").value;
        const response = await fetch( `${API_URL}/livres?titre=${encodeURIComponent(titre)}&auteur=${encodeURIComponent(auteur)}` );

        if (!response.ok) {
            throw new Error("Erreur lors de la recherche des livres");
        }

        const data = await response.json();
        const listeLivres = document.getElementById("liste-livres");
        listeLivres.innerHTML = "";

        data.donnees.forEach(livre => {
            const ligne = document.createElement("tr");

            ligne.innerHTML = `
                <td>${livre.titre}</td>
                <td>${livre.nom_auteur}</td>
                <td>${livre.annee_publication || "-"}</td>
                <td>${livre.statut}</td>
                <td>
                    <button onclick="modifierLivre(${livre.id_livre})">Modifier</button>
                    <button onclick="supprimerLivre(${livre.id_livre})">Supprimer</button>
                </td>`;

            listeLivres.appendChild(ligne);
        });

    } catch (error) {
        console.error("Erreur recherche :", error);
    }
}
document.getElementById("btn-rechercher-livre").addEventListener("click", rechercherLivres);

// MODIFIER UN LIVRE
async function modifierLivre(idLivre) {
    try {
        const response = await fetch(`${API_URL}/livres/${idLivre}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération du livre");
        }
        const livre = await response.json();

        document.getElementById("id-livre").value = livre.id_livre;
        document.getElementById("titre").value = livre.titre;
        document.getElementById("auteur-livre").value = livre.id_auteur;
        document.getElementById("annee-publication").value =
            livre.annee_publication || "";

    } catch (error) {
        console.error("Erreur modification :", error);
    }
}

//SUPPRIMER UN LIVRE
async function supprimerLivre(idLivre) {
        const confirmation = confirm("voulez-vous vraiment supprimer ce livre ?");
        if(!confirmation){
            return;
        }
     try {
        const response = await fetch(`${API_URL}/livres/${idLivre}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la supression du livre");
        }
        alert("livre supprimer avec succes.");
        // actualiser la listdes livre
        afficherLivres();
        //charger les livre disponible dans formulaire emprunt
        chargerLivresPourEmprunt();
        //actualiser le tableau de bord
        afficherTableauDeBord();
         } catch (error) {
        console.error("error suppression:", error);
        alert(error.message);
    }
}

// AFFICHER LES ADHÉRENTS
async function afficherAdherents() {
    try {
        const response = await fetch(`${API_URL}/adherents`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des adhérents");
        }
        const adherents = await response.json();
        const listeAdherents = document.getElementById("liste-adherents");
        listeAdherents.innerHTML = "";

        adherents.forEach(adherent => {
            const ligne = document.createElement("tr");
            ligne.innerHTML = `
                <td>${adherent.nom}</td>
                <td>${adherent.contact}</td>
                <td>
                    <button onclick = "modifierAdherent(${adherent.id_adherent})">Modifier</button>
                    <button  onclick =  "supprimerAdherent(${adherent.id_adherent})">Supprimer</button>
                    <button  onclick =  "afficherHistoriqueAdherent(${adherent.id_adherent}, '${adherent.nom}')">Historique</button>
                </td> `;
            listeAdherents.appendChild(ligne);
        });
    } catch (error) {
        console.error(error);
    }
}

// AFFICHER L'HISTORIQUE DES EMPRUNTS D'UN ADHÉRENT
async function afficherHistoriqueAdherent(idAdherent, nomAdherent) {
    try {
        const response = await fetch(`${API_URL}/emprunts/adherent/${idAdherent}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'historique");
        }

        const emprunts = await response.json();

        const nomHistorique = document.getElementById("nom-adherent-historique");
        const listeHistorique = document.getElementById("liste-historique-adherent");

        nomHistorique.textContent = `Historique de : ${nomAdherent}`;
        listeHistorique.innerHTML = "";

        emprunts.forEach(emprunt => {
            const ligne = document.createElement("tr");

            const statut = emprunt.date_retour_effective
                ? "Retourné"
                : "En cours";

            ligne.innerHTML = `
                <td>${emprunt.titre_livre}</td>
                <td>${new Date(emprunt.date_emprunts).toLocaleDateString()}</td>
                <td>${new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                <td>
                    ${emprunt.date_retour_effective
                        ? new Date(emprunt.date_retour_effective).toLocaleDateString()
                        : "-"}
                </td>
                <td>${statut}</td>`;
            listeHistorique.appendChild(ligne);
        });

        if (emprunts.length === 0) {
            listeHistorique.innerHTML = `
                <tr>
                    <td colspan="5">Aucun emprunt pour cet adhérent.</td>
                </tr> `;
        }

    } catch (error) {
        console.error("Erreur historique :", error);
    }
}

// MODIFIER ADHERENT
async function modifierAdherent(idAdherent) {
    try {
        const response = await fetch(`${API_URL}/adherents/${idAdherent}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'adherent");
        }
        const adherent = await response.json();

        document.getElementById("id-adherent").value = adherent.id_adherent;
        document.getElementById("nom-adherent").value = adherent.nom;
        document.getElementById("contact-adherent").value = adherent.contact;

    } catch (error) {
        console.error("Erreur modification adherent :", error);
    }
}

//SUPPRIMER UN ADHERENT
async function supprimerAdherent(idAdherent) {
        const confirmation = confirm("voulez-vous vraiment supprimer cette adherent ?");
        if(!confirmation){
            return;
        }
     try {
        const response = await fetch(`${API_URL}/adherents/${idAdherent}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la supression de adherent");
        }
        alert("adherent supprimer avec succes.");
        // actualiser la listdes adherent
        afficherAdherents();
        //charger les livre disponible dans formulaire emprunt
        chargerAdherentsPourEmprunt();
        //actualiser le tableau de bord
        afficherTableauDeBord();
         } catch (error) {
        console.error("error suppression:", error);
        alert(error.message);
    }
}

// AJOUTER UN ADHÉRENT
const formAdherent = document.getElementById("form-adherent");
formAdherent.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nom = document.getElementById("nom-adherent").value;
    const contact = document.getElementById("contact-adherent").value;
    const message = document.getElementById("message-adherent");
    const idAdherent = document.getElementById("id-adherent").value;
    let url = `${API_URL}/adherents`;
    let method = "POST";
    if(idAdherent){
        url = `${API_URL}/adherents/${idAdherent}`;
        method = "PUT";
    }
    try {
        const response = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nom: nom, contact: contact})
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de l'ajout");
        }
        message.textContent = "Adhérent ajouté avec succès.";
        formAdherent.reset();
        // Actualiser la liste
        afficherAdherents();
        afficherTableauDeBord();
    } catch (error) {
        message.textContent = error.message;
        console.error(error);
    }
});

// CHARGER LES AUTEURS
async function chargerAuteurs() {
    try {
        const response = await fetch(`${API_URL}/auteurs`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des auteurs");
        }
        const auteurs = await response.json();
        const selectAuteur = document.getElementById("auteur-livre");
        selectAuteur.innerHTML = `<option value="">-- Choisir un auteur --</option> `;
        auteurs.forEach(auteur => {
            const option = document.createElement("option");
            option.value = auteur.id_auteur;
            option.textContent = auteur.nom;
            selectAuteur.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
}

// AFFICHER LES AUTEURS
async function afficherAuteurs() {
    try {
        const response = await fetch(`${API_URL}/auteurs`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des auteurs");
        }

        const auteurs = await response.json();
        const listeAuteurs = document.getElementById("liste-auteurs");
        listeAuteurs.innerHTML = "";

        auteurs.forEach(auteur => {
            const ligne = document.createElement("tr");

            ligne.innerHTML = ` <td>${auteur.nom}</td>
                <td>${auteur.nationalite || "-"}</td>
                <td>
                    <button onclick="modifierAuteur(${auteur.id_auteur})">Modifier</button>
                    <button onclick="supprimerAuteur(${auteur.id_auteur})">Supprimer</button>
                </td>`;

            listeAuteurs.appendChild(ligne);
        });

    } catch (error) {
        console.error("Erreur auteurs :", error);
    }
}

// AJOUTER OU MODIFIER UN AUTEUR
const formAuteur = document.getElementById("form-auteur");

formAuteur.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nom = document.getElementById("nom-auteur").value;
    const nationalite = document.getElementById("nationalite-auteur").value;
    const message = document.getElementById("message-auteur");
    const idAuteur = document.getElementById("id-auteur").value;
    let url = `${API_URL}/auteurs`;                                                                  
    let method = "POST";

    if (idAuteur) {
        url = `${API_URL}/auteurs/${idAuteur}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom: nom,
                nationalite: nationalite
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Erreur lors de l'enregistrement de l'auteur"
            );
        }
        message.textContent = idAuteur
            ? "Auteur modifié avec succès."
            : "Auteur ajouté avec succès.";

        formAuteur.reset();
        afficherAuteurs();
        chargerAuteurs();

    } catch (error) {
        message.textContent = error.message;
        console.error("Erreur auteur :", error);
    }
});

// MODIFIER UN AUTEUR
async function modifierAuteur(idAuteur) {
    try {
        const response = await fetch(`${API_URL}/auteurs/${idAuteur}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'auteur");
        }

        const auteur = await response.json();

        document.getElementById("id-auteur").value = auteur.id_auteur;
        document.getElementById("nom-auteur").value = auteur.nom;
        document.getElementById("nationalite-auteur").value =
            auteur.nationalite || "";

    } catch (error) {
        console.error("Erreur modification auteur :", error);
    }
}

//SUPPRIMER UN ADHERENT
async function supprimerAuteur(idAuteur) {
        const confirmation = confirm("voulez-vous vraiment supprimer cet auteur ?");
        if(!confirmation){
            return;
        }
     try {
        const response = await fetch(`${API_URL}/auteurs/${idAuteur}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la supression de l'auteur");
        }
        alert("auteur supprimer avec succes.");
        // actualiser la listdes des auteur
        afficherAuteurs();
        chargerAuteurs();
         } catch (error) {
        console.error("error suppression:", error);
        alert(error.message);
    }
}

// AJOUTER UN LIVRE
const formLivre = document.getElementById("form-livre");
formLivre.addEventListener("submit", async function(event) {
    event.preventDefault();
    const titre = document.getElementById("titre").value;
    const idAuteur = document.getElementById("auteur-livre").value;
    const anneePublication = document.getElementById("annee-publication").value;
    const message = document.getElementById("message-livre");

    try {
        const idLivre = document.getElementById("id-livre").value; 
        let url = `${API_URL}/livres`;
        let method = "POST";
        if(idLivre){
            url = `${API_URL}/livres/${idLivre}`;
            method = "PUT";
        }
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titre: titre,
                id_auteur: idAuteur,
                annee_publication: anneePublication
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de l'enregistrement du livre");
        }
        message.textContent = idLivre
        ? "Livre modifier avec succès."
        : "Livre ajouté avec succès.";
        formLivre.reset();
        // Actualiser la liste des livres
        afficherLivres();
        afficherTableauDeBord();
    } catch (error) {
        message.textContent = error.message;
        console.error(error);
    }
});

// CHARGER LES ADHÉRENTS DANS LE FORMULAIRE D'EMPRUNT
async function chargerAdherentsPourEmprunt() {
    try {
        const response = await fetch(`${API_URL}/adherents`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des adhérents");
        }
        const adherents = await response.json();
        const selectAdherent = document.getElementById("adherent-emprunt");
        selectAdherent.innerHTML = ` <option value="">-- Choisir un adhérent --</option>`;
        adherents.forEach(adherent => {
            const option = document.createElement("option");
            option.value = adherent.id_adherent;
            option.textContent = adherent.nom;
            selectAdherent.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
}
 
// CHARGER LES LIVRES DISPONIBLES
async function chargerLivresPourEmprunt() {
    try {
        const response = await fetch(`${API_URL}/livres?limite=100`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des livres");
        }
        const data = await response.json();
        const selectLivre = document.getElementById("livre-emprunt");
        selectLivre.innerHTML = ` <option value="">-- Choisir un livre --</option> `;
        data.donnees
            .filter(livre => livre.statut === "disponible")
            .forEach(livre => {
                const option = document.createElement("option");
                option.value = livre.id_livre;
                option.textContent = livre.titre;
                selectLivre.appendChild(option);
            });

    } catch (error) {
        console.error(error);
    }
}

// CRÉER UN EMPRUNT
const formEmprunt = document.getElementById("form-emprunt");

formEmprunt.addEventListener("submit", async function(event) {
    event.preventDefault();

    const idAdherent = document.getElementById("adherent-emprunt").value;
    const idLivre = document.getElementById("livre-emprunt").value;
    const dateRetour = document.getElementById("date-retour").value;
    const message = document.getElementById("message-emprunt");

    try {
        const response = await fetch(`${API_URL}/emprunts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_adherent: idAdherent,
                id_livre: idLivre,
                date_retour_prevue: dateRetour
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la création de l'emprunt");
        }

        message.textContent = "Emprunt enregistré avec succès.";

        formEmprunt.reset();

        // Actualiser les listes
        chargerLivresPourEmprunt();
        afficherLivres();

        // Actualiser les emprunts
        afficherEmprunts();
        afficherRetards();

        // Actualiser le tableau de bord
        afficherTableauDeBord();

    } catch (error) {
        message.textContent = error.message;
        console.error("Erreur emprunt :", error);
    }
});

// AFFICHER LE TABLEAU DE BORD
async function afficherTableauDeBord() {
    try {
        // Récupérer les livres
        const responseLivres = await fetch(`${API_URL}/livres?limite=1000`);
        if (!responseLivres.ok) {
            throw new Error("Erreur lors de la récupération des livres");
        }
        const dataLivres = await responseLivres.json();

        // Récupérer les adhérents
        const responseAdherents = await fetch(`${API_URL}/adherents`);
        if (!responseAdherents.ok) {
            throw new Error("Erreur lors de la récupération des adhérents");
        }
        const adherents = await responseAdherents.json();

        // Récupérer les emprunts en cours
        const responseEmprunts = await fetch(`${API_URL}/emprunts/encours`);
        if (!responseEmprunts.ok) {
            throw new Error("Erreur lors de la récupération des emprunts en cours");
        }
        const emprunts = await responseEmprunts.json();

        // Récupérer les emprunts en retard
        const responseRetards = await fetch(`${API_URL}/emprunts/retard`);
        if (!responseRetards.ok) {
            throw new Error("Erreur lors de la récupération des emprunts en retard");
        }
        const retards = await responseRetards.json();

        // Récupérer tous les emprunts pour les statistiques
const responseTousEmprunts = await fetch(`${API_URL}/emprunts`);

if (!responseTousEmprunts.ok) {
    throw new Error("Erreur lors de la récupération des emprunts");
}
const tousLesEmprunts = await responseTousEmprunts.json();

// Calculer le nombre d'emprunts par livre
const empruntsParLivre = {};
tousLesEmprunts.forEach(emprunt => {
    if (!empruntsParLivre[emprunt.id_livre]) {
        empruntsParLivre[emprunt.id_livre] = {
            titre: emprunt.titre_livre,
            nombre: 0
        };
    }
    empruntsParLivre[emprunt.id_livre].nombre++;
});

// Trouver le livre le plus emprunté
const livrePlusEmprunte = Object.values(empruntsParLivre)
    .sort((a, b) => b.nombre - a.nombre)[0];

// Calculer le nombre d'emprunts par adhérent
const empruntsParAdherent = {};

tousLesEmprunts.forEach(emprunt => {
    if (!empruntsParAdherent[emprunt.id_adherent]) {
        empruntsParAdherent[emprunt.id_adherent] = {
            nom: emprunt.nom_adherent,
            nombre: 0
        };
    }
    empruntsParAdherent[emprunt.id_adherent].nombre++;
});

// Trouver l'adhérent le plus actif
const adherentPlusActif = Object.values(empruntsParAdherent)
    .sort((a, b) => b.nombre - a.nombre)[0];

// Afficher les statistiques
document.getElementById("livre-plus-emprunte").textContent =livrePlusEmprunte
        ? `${livrePlusEmprunte.titre} (${livrePlusEmprunte.nombre} emprunt(s))`
        : "-";

document.getElementById("adherent-plus-actif").textContent =
    adherentPlusActif
        ? `${adherentPlusActif.nom} (${adherentPlusActif.nombre} emprunt(s))`
        : "-";

        // Afficher les résultats dans le tableau de bord
        document.getElementById("total-livres").textContent = dataLivres.pagination.total;
        document.getElementById("total-adherents").textContent = adherents.length;
        document.getElementById("total-emprunts").textContent = emprunts.length;
        document.getElementById("total-retards").textContent = retards.length;
    } catch (error) {
        console.error("Erreur tableau de bord :", error);
    }
}
// ENREGISTRER LE RETOUR D'UN LIVRE
async function retournerEmprunt(idEmprunt) {
    try {
        const response = await fetch(`${API_URL}/emprunts/${idEmprunt}/retour`, {
            method: "PUT"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Erreur lors du retour du livre");
        }
        alert("Livre retourné avec succès.");

        // Actualiser les emprunts
        afficherEmprunts();
        // Actualiser les listes de livres
        afficherLivres();
        chargerLivresPourEmprunt();
        // Actualiser le tableau de bord
        afficherTableauDeBord();

    } catch (error) {
        console.error("Erreur retour :", error);
        alert(error.message);
    }
}

// AFFICHER LES EMPRUNTS EN COURS
async function afficherEmprunts() {
    try {
        const response = await fetch(`${API_URL}/emprunts/encours`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des emprunts");
        }
        const emprunts = await response.json();
        const listeEmprunts = document.getElementById("liste-emprunts");
        listeEmprunts.innerHTML = "";

        emprunts.forEach(emprunt => {
            const ligne = document.createElement("tr");        
            ligne.innerHTML = `
                <td>${emprunt.nom_adherent}</td>
                <td>${emprunt.titre_livre}</td>
                <td>${new Date(emprunt.date_emprunts).toLocaleDateString()}</td>
                <td>${new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                <td>
                <button onclick = "retournerEmprunt(${emprunt.id_emprunts})">Retourner</button>
                </td>`;
            listeEmprunts.appendChild(ligne);
        });
    } catch (error) {
        console.error("Erreur emprunts :", error);
    }
}

// AFFICHER LES EMPRUNTS EN RETARD
async function afficherRetards() {
    try {
        const response = await fetch(`${API_URL}/emprunts/retard`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des retards");
        }
        const retards = await response.json();
        const listeRetards = document.getElementById("liste-retards");
        listeRetards.innerHTML = "";
        retards.forEach(emprunt => {
            const ligne = document.createElement("tr");

            ligne.innerHTML = `<td>${emprunt.nom_adherent}</td>
                <td>${emprunt.titre_livre}</td>
                <td>${new Date(emprunt.date_emprunts).toLocaleDateString()}</td>
                <td>${new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                <td>
                    <button onclick="retournerEmprunt(${emprunt.id_emprunts})">Retourner</button>
                </td>`;
            listeRetards.appendChild(ligne);
        });

    } catch (error) {
        console.error("Erreur retards :", error);
    }
}
// appelle de fonction
afficherLivres();
afficherAdherents();
chargerAuteurs();
afficherAuteurs();
chargerAdherentsPourEmprunt();
chargerLivresPourEmprunt();
afficherEmprunts();
afficherRetards();
afficherTableauDeBord();       

//NAVIGATION ENTRE SECTION
const liensMenu = document.querySelectorAll("nav a");
liensMenu.forEach(lien => {
    lien.addEventListener("click", function(event){
        event.preventDefault();
        const sectionChoisie = this.dataset.section;
        afficherSection(sectionChoisie);
     });
});
function afficherSection(sectionChoisie){
    const sections = document.querySelectorAll("main > section");
    sections.forEach(section => {
        section.style.display = "none";
    });
    const section = document.getElementById(sectionChoisie);
    if(section){
        section.style.display = "block";
    }
}
afficherSection("accueil");
document.querySelector('nav a[data-section="accueil"]').classList.add("active");