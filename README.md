Gestion d'une Bibliothèque de quartier

Application web de gestion d’une bibliothèque de quartier développée dans le cadre du projet pratique Semaines 14 et 15 – Backend, Frontend & Base de données.

L’application permet de gérer les auteurs, les adhérents, les livres et les emprunts, ainsi que de consulter un tableau de bord avec les principales statistiques de la bibliothèque.

────────

 Objectifs du projet

L’objectif est de mettre en place une application permettant de :

* gérer les auteurs ;
* gérer les adhérents ;
* gérer les livres ;
* enregistrer les emprunts ;
* enregistrer les retours de livres ;
* empêcher l’emprunt d’un livre déjà emprunté ;
* identifier les emprunts en cours et les emprunts en retard ;
* consulter l’historique des emprunts d’un adhérent ;
* rechercher des livres par titre ou par auteur ;
* utiliser la pagination pour l’affichage des livres ;
* consulter les statistiques principales de la bibliothèque.

────────

 Technologies utilisées

Backend

* Node.js
* Express.js 5.2.1
* PostgreSQL
* pg pour la connexion à PostgreSQL
* dotenv pour les variables d’environnement
* cors pour autoriser les échanges avec le frontend
* morgan pour la journalisation des requêtes HTTP
* express-validator pour la validation des données
* nodemon pour le développement

Frontend

* HTML5
* CSS3
* JavaScript
* API REST avec fetch()

────────

📁 Structure du projet

text
Bibliotheque_quartier/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adherentsControllers.js
│   │   ├── auteursControllers.js
│   │   ├── empruntControllers.js
│   │   ├── livreControllers.js
│   │   └── statistiquesControllers.js
│   ├── middlewares/
│   │   ├── gestionValidation.js
│   │   ├── validationAdherent.js
│   │   ├── validationAuteurs.js
│   │   ├── validationEmprunts.js
│   │   └── validationLivres.js
│   ├── routes/
│   │   ├── adherentsRoute.js
│   │   ├── auteursRoute.js
│   │   ├── empruntsRoute.js
│   │   ├── livreRoute.js
│   │   └── statistiqueRoute.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── css/
│   │   └── styl.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── diagramme-er.png
└── README.md


────────

 Base de données

La base de données utilisée est PostgreSQL.

Nom de la base utilisée :

text
bibliotheque_quartier


Elle contient quatre tables principales :

* auteurs
* adherents
* livres
* emprunts

Relations

text
AUTEURS 1 ───────── N LIVRES

ADHERENTS 1 ─────── N EMPRUNTS

LIVRES 1 ────────── N EMPRUNTS


Modèle relationnel

Auteurs

|Champ        |Description    |
|-------------|---------------|
|id_auteur  |Clé primaire   |
|nom        |Nom de l’auteur|
|nationalite|Nationalité    |

Adhérents

|Champ        |Description      |
|-------------|-----------------|
|id_adherent|Clé primaire     |
|nom        |Nom de l’adhérent|
|contact    |Contact          |

Livres

|Champ              |Description                 |
|-------------------|----------------------------|
|id_livre         |Clé primaire                |
|titre            |Titre du livre              |
|id_auteur        |Clé étrangère vers auteurs|
|annee_publication|Année de publication        |
|statut           |disponible ou emprunte  |

Emprunts

|Champ                  |Description                   |
|-----------------------|------------------------------|
|id_emprunts          |Clé primaire                  |
|id_adherent          |Clé étrangère vers adherents|
|id_livre             |Clé étrangère vers livres   |
|date_emprunts        |Date de l’emprunt             |
|date_retour_prevue   |Date prévue du retour         |
|date_retour_effective|Date effective du retour      |

Le diagramme ER fourni avec le projet représente ces quatre tables et leurs relations.

────────

 Installation et configuration

1. Prérequis

Avant de lancer le projet, il faut disposer de :

* Node.js
* PostgreSQL
* un navigateur web
* Git, si le projet est récupéré depuis GitHub

────────

2. Récupérer le projet

bash
git clone https://github.com/kallaclairline/Bibliotheque_quartier.git
cd Bibliotheque_quartier


────────

3. Installer les dépendances

Depuis le dossier backend :

bash
cd backend
npm install


Les principales dépendances sont déjà définies dans package.json.

────────

4. Configurer les variables d’environnement

Créer un fichier .env dans le dossier backend.

Exemple :

env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bibliotheque_quartier
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

────────

 Lancer le backend

Depuis le dossier backend :

bash
node server.js


Le serveur démarre sur :

text
http://localhost:3000


Une route de test est disponible à :

text
http://localhost:3000/


────────

 Lancer le frontend

Le frontend se trouve dans :

text
frontend/index.html


Il peut être ouvert dans un navigateur ou servi avec une extension comme Live Server dans VS Code.

Le frontend communique avec l’API à l’adresse :

text
http://localhost:3000/api


────────

🔌 API REST

Auteurs

Base URL :

text
/api/auteurs


|Méthode|Endpoint          |Fonction                  |
|-------|------------------|--------------------------|
|GET    |/api/auteurs    |Récupérer tous les auteurs|
|GET    |/api/auteurs/:id|Récupérer un auteur       |
|POST   |/api/auteurs    |Ajouter un auteur         |
|PUT    |/api/auteurs/:id|Modifier un auteur        |
|DELETE |/api/auteurs/:id|Supprimer un auteur       |

────────

Adhérents

Base URL :

text
/api/adherents


|Méthode|Endpoint                     |Fonction                    |
|-------|-----------------------------|----------------------------|
|GET    |/api/adherents             |Récupérer tous les adhérents|
|GET    |/api/adherents/:id         |Récupérer un adhérent       |
|GET    |/api/adherents/:id/emprunts|Historique des emprunts     |
|POST   |/api/adherents             |Ajouter un adhérent         |
|PUT    |/api/adherents/:id         |Modifier un adhérent        |
|DELETE |/api/adherents/:id         |Supprimer un adhérent       |

Le frontend utilise également l’endpoint :

text
GET /api/emprunts/adherent/:id


pour afficher l’historique d’un adhérent.

────────

Livres

Base URL :

text
/api/livres


|Méthode|Endpoint         |Fonction            |
|-------|-----------------|--------------------|
|GET    |/api/livres    |Récupérer les livres|
|GET    |/api/livres/:id|Récupérer un livre  |
|POST   |/api/livres    |Ajouter un livre    |
|PUT    |/api/livres/:id|Modifier un livre   |
|DELETE |/api/livres/:id|Supprimer un livre  |

Recherche

La recherche peut utiliser :

text
GET /api/livres?titre=...
GET /api/livres?auteur=...


Les deux critères peuvent également être utilisés ensemble.

Pagination

L’API accepte :

text
GET /api/livres?page=1&limite=10


La réponse contient les données ainsi que les informations de pagination :

json
{
  "donnees": [],
  "pagination": {
    "page": 1,
    "limite": 10,
    "total": 0,
    "totalPages": 0
  }
}


────────

Emprunts

Base URL :

text
/api/emprunts


|Méthode|Endpoint                    |Fonction                |
|-------|----------------------------|------------------------|
|GET    |/api/emprunts             |Tous les emprunts       |
|GET    |/api/emprunts/encours     |Emprunts en cours       |
|GET    |/api/emprunts/retard      |Emprunts en retard      |
|GET    |/api/emprunts/adherent/:id|Historique d’un adhérent|
|POST   |/api/emprunts             |Créer un emprunt        |
|PUT    |/api/emprunts/:id/retour  |Enregistrer un retour   |

Règles de gestion d’un emprunt

Lorsqu’un emprunt est créé :

1. l’adhérent et le livre sont vérifiés ;
2. le livre doit exister ;
3. le livre doit être disponible ;
4. l’emprunt est enregistré ;
5. le statut du livre devient emprunte.

Lorsqu’un livre est retourné :

1. l’emprunt est recherché ;
2. le système vérifie qu’il n’a pas déjà été retourné ;
3. la date de retour effective est enregistrée ;
4. le statut du livre redevient disponible.

La création et le retour utilisent des transactions PostgreSQL afin de maintenir la cohérence entre l’emprunt et le statut du livre.

────────

Statistiques

Base URL :

text
/api/statistiques


|Méthode|Endpoint           |Fonction                  |
|-------|-------------------|--------------------------|
|GET    |/api/statistiques|Récupérer les statistiques|

Les statistiques disponibles sont :

* total des livres ;
* total des adhérents ;
* nombre d’emprunts en cours ;
* nombre d’emprunts en retard ;
* livre le plus emprunté ;
* adhérent le plus actif.

Le frontend utilise également les endpoints d’emprunts pour actualiser les informations affichées dans le tableau de bord.

────────

 Fonctionnalités du frontend

 Accueil

Une page d’accueil présente l’application et permet d’accéder aux différentes sections.

 Tableau de bord

Le tableau de bord affiche :

* le nombre total de livres ;
* le nombre total d’adhérents ;
* les emprunts en cours ;
* les emprunts en retard ;
* le livre le plus emprunté ;
* l’adhérent le plus actif.

 Livres

L’utilisateur peut :

* consulter les livres ;
* ajouter un livre ;
* modifier un livre ;
* supprimer un livre ;
* rechercher par titre ;
* rechercher par auteur ;
* naviguer entre les pages ;
* consulter le statut du livre.

 Auteurs

L’utilisateur peut :

* consulter les auteurs ;
* ajouter un auteur ;
* modifier un auteur ;
* supprimer un auteur.

 Adhérents

L’utilisateur peut :

* consulter les adhérents ;
* ajouter un adhérent ;
* modifier un adhérent ;
* supprimer un adhérent ;
* consulter son historique d’emprunts.

 Emprunts

L’utilisateur peut :

* sélectionner un adhérent ;
* sélectionner un livre disponible ;
* définir une date de retour prévue ;
* enregistrer l’emprunt ;
* consulter les emprunts en cours ;
* consulter les emprunts en retard ;
* enregistrer le retour d’un livre.

Les livres déjà empruntés ne sont pas proposés dans la liste de sélection des livres disponibles.

────────

 Validation et gestion des erreurs

Le projet utilise express-validator pour contrôler les données reçues par l’API.

Adhérents

* nom obligatoire ;
* minimum 2 caractères ;
* contact obligatoire.

Auteurs

* nom obligatoire ;
* minimum 2 caractères ;
* nationalité facultative et contrôlée comme texte.

Livres

* titre obligatoire ;
* auteur obligatoire ;
* identifiant de l’auteur entier ;
* année de publication facultative et entière.

Emprunts

* adhérent obligatoire ;
* livre obligatoire ;
* identifiants entiers ;
* date de retour prévue obligatoire et valide.

Les erreurs de validation sont renvoyées avec le statut HTTP 400.

Le serveur possède également un middleware pour gérer les routes inexistantes avec une réponse 404 et un middleware général pour les erreurs internes avec une réponse 500.

────────

 Journalisation

Le projet utilise Morgan pour enregistrer les requêtes HTTP reçues par le serveur.

Exemple :

text
GET /api/livres
POST /api/emprunts
PUT /api/emprunts/1/retour


────────

 Architecture du projet

Le backend suit une organisation séparant les responsabilités :

text
Client / Frontend
       │
       │ fetch()
       ▼
    Routes
       │
       ▼
  Middlewares
(validation)
       │
       ▼
 Controllers
       │
       ▼
 PostgreSQL


Cette organisation permet de séparer :

* les routes API ;
* la validation ;
* la logique métier ;
* l’accès aux données ;
* la présentation frontend.

────────

 Choix de modélisation

Le modèle de données repose sur quatre entités principales :

* Auteur : peut être associé à plusieurs livres ;
* Livre : appartient à un auteur et peut apparaître dans plusieurs emprunts au cours du temps ;
* Adhérent : peut effectuer plusieurs emprunts ;
* Emprunt : associe un adhérent à un livre et conserve les dates de l’opération.

Le champ statut de la table livres permet de représenter directement la disponibilité du livre :

text
disponible
emprunte


La date date_retour_effective permet de distinguer un emprunt encore en cours d’un emprunt terminé.

────────

Diagramme ER

Le diagramme de la base de données est fourni séparément dans le fichier :

text
diagramme-er.png


Il représente :

text
AUTEURS
   │
   │ 1,N
   ▼
LIVRES
   │
   │ 1,N
   ▼
EMPRUNTS
   ▲
   │ N,1
   │
ADHERENTS


Le diagramme doit correspondre exactement au fichier database/schema.sql.

────────

 Responsive design

L’interface a été adaptée aux différentes tailles d’écran grâce aux media queries CSS.

Les principaux seuils utilisés sont :

* 768px
* 600px
* 480px

Les tableaux peuvent notamment être parcourus horizontalement sur les petits écrans.

────────

 Améliorations possibles

Des évolutions pourraient être ajoutées ultérieurement, par exemple :

* authentification des utilisateurs ;
* gestion de plusieurs rôles ;
* amélioration des messages de notification ;
* statistiques graphiques supplémentaires ;
* pagination des autres ressources ;
* amélioration de l’interface utilisateur.

Ces éléments ne sont pas nécessaires au fonctionnement actuel de la version livrée.

────────

 État du projet

|Fonctionnalité        |État|
|----------------------|----|
|Base PostgreSQL       |✅   |
|Gestion des auteurs   |✅   |
|Gestion des adhérents |✅   |
|Gestion des livres    |✅   |
|Recherche des livres  |✅   |
|Pagination des livres |✅   |
|Création des emprunts |✅   |
|Retour des livres     |✅   |
|Emprunts en cours     |✅   |
|Emprunts en retard    |✅   |
|Historique adhérent   |✅   |
|Tableau de bord       |✅   |
|Validation des données|✅   |
|Gestion des erreurs   |✅   |
|Journalisation HTTP   |✅   |
|Frontend HTML/CSS/JS  |✅   |
|Design responsive     |✅   |
|Diagramme ER          |✅   |

────────

Projet académique

Projet pratique – Application de gestion d’une bibliothèque de quartier

Technologies principales :

Node.js · Express · PostgreSQL · HTML · CSS · JavaScript

Dépôt GitHub :

kallaclairline/Bibliotheque_quartier