--Base de Donnee : GESTION DE BIBLIOTHEQUE 
--Creation des tables

CREATE TABLE auteurs (
    id_auteur SERIAL PRIMARY KEY , 
    nom VARCHAR(140) NOT NULL,
    nationalite VARCHAR(90));

CREATE TABLE adherents(
    id_adherent SERIAL PRIMARY KEY ,
    nom VARCHAR(140) NOT NULL,
    contact VARCHAR(90) NOT NULL);

CREATE TABLE livres (
    id_livre SERIAL PRIMARY KEY ,
    titre VARCHAR(220) NOT NULL,
    id_auteur INTEGER NOT NULL,
    annee_publication INTEGER, 
    statut VARCHAR(25) NOT NULL DEFAULT 'disponible',
    CONSTRAINT fk_livre_auteur FOREIGN KEY (id_auteur) REFERENCES auteurs (id_auteur),
    CONSTRAINT chk_statu_auteur CHECK(statut IN ('disponible', 'emprunte')) );

CREATE TABLE emprunts(
    id_emprunts SERIAL PRIMARY KEY,
    id_adherent INTEGER NOT NULL,
    id_livre INTEGER NOT NULL,
    date_emprunts DATE NOT NULL DEFAULT CURRENT_DATE, 
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    CONSTRAINT fk_emprunt_adherent FOREIGN KEY (id_adherent) REFERENCES adherents (id_adherent),
    CONSTRAINT fk_emprunt_livre FOREIGN KEY (id_livre) REFERENCES livres (id_livre));