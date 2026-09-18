// connexion a la base de donnee postgres

const {Pool, Client, Connection} = require('pg');
require('dotenv').config();

const pool = new Pool (
    {
        host: process.env.db_HOST,
        port: process.env.db_PORT,
        database:  process.env.db_NAME,
        user: process.env.db_USER,
        password: process.env.db_PASSWORD,
    }
);
//test de connexion au demarage 
pool.connect()
.then((Client) => {
    console.log('connexion reussi');
    Client.release();

})
.catch((err)=>{
    console.error('erreur Connection')
}

);
module.exports = pool;
