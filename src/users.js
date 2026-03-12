const argon2 = require('argon2');
const Database = require('./dataBase.js');

// users.js
// this classe is used when actions in the users table is needed
class Users extends Database
{
    id = null;
    name = '';
    email = '';

    constructor()
    {
        super();
    }

    //in this function the user is registered
    async createUser(name = null, email = null, password = null, cpassword = null)
    {
        try {
            if(password !== cpassword)
                throw new Error("\u{1FAE4}Passwords do not match");
            if(name === '' || email === '' || password === '' || cpassword === '')
                throw new Error("\u{1FAE4} All fields must be filled");

            const hash = await argon2.hash(password, {
                type: argon2.argon2i
            });

            let query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);";
            let values = [name, email, hash]
            let act = await this.executeQueryOnDataBase(query, values);
            if(act.state === true)
            {
                this.name = name;
                this.email = email;
            }

            return new Promise((resolve, reject) => {
                if(act.state === true)
                    resolve({state: true,  error: null});
                else
                    reject({state: false, error: act.error});
            });
        } catch(error)
        {
            console.error("An error occurred:", error.message);
            return {state: false, error: error.message};
        }
    }

    // In this function the user credentials are verified for login
    async LogUser(password = '', name = '')
    {
        try
        {
            let query = "SELECT * FROM users WHERE name=$1;";
            let values = [];
            if(this.name === '')
            {
                if(name == '')
                    throw Error("\u{1FAE4} user name cannot be empty");
                values.push(name);
            } else
                values.push(this.name);

            if(password === '')
                throw Error("\u{1FAE4} password cannot be empty");

            let user = await this.executeReadQueryOnDataBase(query, values);
            let match = false;

            if(user.data && user.data.length > 0)
            {
                const storedHash = user.data[0].password;
                match = await argon2.verify(storedHash, password);
            }

            return new Promise((resolve, reject) => {
                if(match)
                    resolve({state: match, data: user.data[0]});
                else
                    reject({state: match, error: "\u{1FAE4}Incorrect user or password"});
            });

        } catch(error)
        {
            console.error("An error occurred:", error.message);
            return {state: false, error: error.message};
        }
    }
}

module.exports = Users;
