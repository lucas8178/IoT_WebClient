const pg = require("pg");

// dataBase.js
// this class is used when connection to the database is needed
class Database
{
    #connectionString = null;
    constructor()
    {
        this.#connectionString = process.env.CONNINFO;
    }


    //in this function the connection to the database is stablished
    #connectDataBase()
    {
        let dbInfo = {};
        this.#connectionString.split(' ').forEach(pair => {
            const [key, value] = pair.split('=');
            dbInfo[key] = value;
        });
        return new pg.Pool(dbInfo);
    }
	
    //this function is used when any data of the database needs to be retrieved
    async executeReadQueryOnDataBase(query, values)
    {
        const connection = await this.#connectDataBase().connect();
        return new Promise((resolve, reject) => {
            const res = connection.query(query, values, (err, data) => {
                connection.release();
                if(err)
                    reject({state: false, error: err});
                else
                    resolve({state: true, data: data.rows});
            });
        });
    }

    //this function is used when data in the database needs to created or changed
    async executeQueryOnDataBase(query, values)
    {
        const connection = await this.#connectDataBase().connect();
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, data) => {
                connection.release();
                if(err)
                    reject({state: false, error: err});
                else
                    resolve({state: true, error: null});
            });
        });
    }
}

module.exports = Database;
