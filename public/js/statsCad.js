
//Function that sets the button action
function setButtonAction()
{
	const sendData = document.getElementById('sendData');
	sendData.onclick = saveSensorsData;
}

//Function to fetch the plants data to fill automatically the html select item(combobox)
async function fillIdSelect()
{
	const idSelect = document.getElementById('pid');
	let data = await fetch('/getPlantsData');
	let jsonData = await data.json();

	console.log(jsonData);
	if(jsonData.data.length > 0)
	{
		jsonData.data.forEach(item => {
			const opt = document.createElement('option');
			opt.value = item.id;
			opt.textContent = item.id;
			idSelect.appendChild(opt);
		});
	}
}

//function that gets the sensors values filled in the form to be saved in the database in there respective tables
async function saveSensorsData()
{
	const moistureDry = document.getElementById('mdry');
	const moistureWet = document.getElementById('mwet');

	const minExternalTem = document.getElementById('cetemp');
	const maxExternalTem = document.getElementById('hetemp');

	const minInternalTem = document.getElementById('citemp');
	const maxInternalTem = document.getElementById('hitemp');

	const plantId = document.getElementById('pid');

	let values = {"plantId": plantId.value, "moistureMin": moistureDry.value, "moistureMax": moistureWet.value,
		"minExternal": minExternalTem.value, "maxExternal": maxExternalTem.value, "minInternal": minInternalTem.value,
		"maxInternal": maxInternalTem.value};

	let data = await fetch('/saveSensorsData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values),
	});

	let jsonData = await data.json();
	const formDiv = document.getElementById('errorMessage');
	if(!jsonData.state)
	{
		formDiv.innerHTML = '';
		const message = document.createElement('p');
		message.textContent = jsonData.error;
		formDiv.appendChild(message);
		formDiv.style.display = "grid";
	} else
	{
		formDiv.style.display = "none";
	}
}

setButtonAction();
fillIdSelect();
