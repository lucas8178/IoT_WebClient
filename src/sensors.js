const Database = require('./dataBase.js');

// sensors.js
// This class is used when actions in one of the sensors tables are need
class Sensors extends Database
{
	plantId = 0;
	minMoisture = 0;
	maxMoisture = 0;
	minExternalTemperature = 0;
	maxExternalTemperature = 0;
	minInternalTemperature = 0;
	maxInternalTemperature = 0;

	constructor(plantId, minMoisture, maxMoisture, minExternalTemperature, maxExternalTemperature, minInternalTemperature, maxInternalTemperature)
	{
		super();
		this.plantId = plantId;
		this.minMoisture = minMoisture;
		this.maxMoisture = maxMoisture;
		this.minExternalTemperature = minExternalTemperature;
		this.maxExternalTemperature = maxExternalTemperature;
		this.minInternalTemperature = minInternalTemperature;
		this.maxInternalTemperature = maxInternalTemperature;
	}

	//This function saves the sensors data in the database
	async saveSensorsConfigs()
	{
		try
		{
			if(this.plantId == 0)
				throw new Error("\u{1FAE4}Plant Id cannot be emmpty");
			if(this.minMoisture == 0 || this.maxMoisture == 0 || this.minExternalTemperature == 0 || this.maxExternalTemperature == 0 || this.minInternalTemperature == 0 || this.maxInternalTemperature == 0)
				throw new Error("\u{1FAE4}the sensors sets cannot be empty");

			let query = "INSERT INTO sensors (plantId, moistureDry, moistureWet, maxExternalTemperature, minExternalTemperature, maxInternalTemperature, minInternalTemperature) VALUES ($1, $2, $3, $4, $5, $6, $7);";
			let values = [this.plantId, this.minMoisture, this.maxMoisture, this.maxExternalTemperature, this.minExternalTemperature, this.maxInternalTemperature, this.minInternalTemperature];

			let act = await this.executeQueryOnDataBase(query, values);


			return new Promise((resolve, reject) => {
				if(act.state === true)
					resolve({state: true, error: null});
				else
					reject({state: false, error: act.error});
			});
		} catch(error)
		{
			console.error("An error occurred:", error.message);
			return {state: false, error: error.message};
		}

	}
}

module.exports = Sensors;
