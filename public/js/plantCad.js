let checkedBox = 0;
//function to set the action in the button
function setButtonAction()
{
    const sendData = document.getElementById('sendData');
    sendData.onclick = sendFormData;
}

async function fillForm(event)
{
    const name = document.getElementById("pname");
    const image = document.getElementById("pimage");
    const description = document.getElementById("pdescription");
    if(event.target.checked)
    {
        if(checkedBox !== event.target.id)
            checkedBox = event.target.id;

        let data = await fetch('/getPlantsData');
        let jsonData = await data.json();

        jsonData.data.forEach(item => {
            if(item.id === checkedBox)
            {
                name.value = item.name;
                image.value = item.imagelink;
                description.value = item.description;
            }
        });
    } else
    {
        checkedBox = 0;
        name.value = "";
        image.value = "";
        description.value = "";
    }
}

async function errorCheck(jsonData)
{
    const formDiv = document.getElementById('errorMessage');
    if(!jsonData.state)
    {
        formDiv.innerHTML = '';
        const message = document.createElement('p');
        message.textContent = jsonData.error;
        formDiv.appendChild(message);
        formDiv.style.display = 'grid';
    } else
    {
        formDiv.style.display = 'none';
    }

    await fillPlantTable();
}

async function getFormValues()
{
    const name = document.getElementById("pname");
    const image = document.getElementById("pimage");
    const description = document.getElementById("pdescription");
    
    let values = {"name": name.value, "image": image.value, "description": description.value};
    name.value = '';
    image.value = '';
    description.value = '';

    return values;
}

async function updatePlantsData()
{
    if(checkedBox !== 0)
    {
        let values = await getFormValues();
        let selectedItems = await getSelectedPlants();

        values.plantId = selectedItems[0];

        let data = await fetch('/editPlant', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        let jsonData = await data.json();

        errorCheck(jsonData);
    }
}

//function that gets the plant infos and registers it
async function sendFormData()
{
    let values = await getFormValues();

    let data = await fetch('/createPlant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    let jsonData = await data.json();
 
    errorCheck(jsonData);
}

async function fillPlantTable()
{
    const tableDiv = document.getElementById('table');
    let data = await fetch('/getPlantsData');
    let jsonData = await data.json();

    if(jsonData.data.length > 0)
    {
        tableDiv.innerHTML = '';
        const title = document.createElement('p');
        const delButton = document.createElement('button');
        delButton.textContent = "Delete Plant";
        delButton.onclick = delPlants;
        const editButton = document.createElement('button');
        editButton.textContent = "Edit Plant";
        editButton.onclick = updatePlantsData;

        title.textContent = "Your Plants";
        tableDiv.appendChild(title);
        jsonData.data.forEach(item => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            const label = document.createElement('label');
            checkbox.type = "checkbox";
            checkbox.id = item.id;
            checkbox.name = item.name;
            checkbox.className = "myPlants";
            checkbox.onchange = fillForm;
            label.for = item.name;
            label.textContent = item.name
            div.appendChild(checkbox);
            div.appendChild(label);
            tableDiv.appendChild(div);
        });

        tableDiv.appendChild(delButton);
        tableDiv.appendChild(editButton);
    }
}

async function getSelectedPlants()
{
    const checkboxes = document.getElementsByClassName('myPlants');
    let selectedItems = [];

    Array.from(checkboxes).forEach(item => {
        if(item.checked)
        {
            selectedItems.push(item.id);
        }
    });

    return selectedItems;
}

async function delPlants()
{
    let selectedItems = await getSelectedPlants();

    let data = await fetch('/deletePlants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedItems),
    });

    fillPlantTable();

}


fillPlantTable();
setButtonAction();
