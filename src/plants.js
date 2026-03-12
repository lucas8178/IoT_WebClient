const Database = require('./dataBase.js');

// plant.js
// This class is used when action in the plants table are needed
class Plants extends Database
{
    id = null;
    name = '';
    imageLink = '';
    description = '';
    connected = false;
    userId = 0;

    constructor(id = null, name = '', imageLink = '', description = '', connected = false, userId = 0)
    {
        super();

        if(id !== this.id)
            this.id = id;
        if(name !== this.name)
            this.name = name;
        if(imageLink !== this.imageLink)
            this.imageLink = imageLink;
        if(description !== this.description)
            this.description = description;
        if(connected !== this.connected)
            this.connected = connected;
        if(userId !== this.userId)
            this.userId = userId;
    }


    //This function registers the plant on the database
    async createPlant(name = '', imageLink = '', description = '', userId = 0, connected = false)
    {
        try {
            if(this.name === '')
            {
                if(name === '')
                    throw new Error("\u{1FAE4}A plant need a name");
                else
                    this.name = name;
            }
            if(this.imageLink === '')
            {
                if(imageLink === '')
                    throw new Error("\u{1FAE4}A plant need a link to its picture");
                else
                    this.imageLink = imageLink;
            }
            if(this.description === '')
            {
                if(description === '')
                    throw new Error("\u{1FAE4}You need to add a description for this plant");
                else
                    this.description = description;
            }
            if(this.userId === 0)
            {
                if(userId === 0)
                    throw new Error("\u{1FAE4}Every plant has owner please add his Id");
                else
                    this.userId = userId;
            }

            let query = "INSERT INTO plants (name, imageLink, description, connected, userId) VALUES ($1, $2, $3, $4, $5);";
            let values = [this.name, this.imageLink, this.description, this.connected, this.userId];
            let act = await this.executeQueryOnDataBase(query, values);

            return new Promise((resolve, reject) => {
                if(act.state === true)
                    resolve({state: true, error: null});
                else
                    reject({state: false, error: act.error});
            });
        } catch(error)
        {
            console.error("An error occured: ", error.message);
            return {state: false, error: error.message};
        }
    }

	//this function finds the plants with a specified userId
	async findUserPlants(userId = 0)
	{
		try
		{
			let query = "SELECT * FROM plants WHERE userId=$1";
			let values = [];
			if(this.userId === 0)
			{
				if(userId == 0)
					throw Error("\u{1FAE4}User Id cannot be empty");
				values.push(userId);
			} else
				values.push(this.userId);

			let plant = await this.executeReadQueryOnDataBase(query, values);

			return new Promise((resolve, reject) => {
				if(plant.data && plant.data.length > 0)
					resolve({state: true, data: plant.data});
				else
					reject({state: false, error: "\u{1FAE4}There're no plants registered by this user\n"});
			});
		} catch(error)
		{
			console.error("An error occurred:", error.message);
			return {state: false, error: error.message};
		}
	}
}

module.exports = Plants;
