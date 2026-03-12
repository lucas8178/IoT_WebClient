
//function to set the action in the button
function setButtonAction()
{
    const sendData = document.getElementById('sendData');
    sendData.onclick = sendFormData;
}

//function that gets the plant infos and registers it
async function sendFormData()
{
    const name = document.getElementById("pname");
    const image = document.getElementById("pimage");
    const description = document.getElementById("pdescription");
    
    values = {"name": name.value, "image": image.value, "description": description.value};
    name.value = '';
    image.value = '';
    description.value = '';

    let data = await fetch('/createPlant', {
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
        formDiv.style.display = 'grid';
    } else
    {
        formDiv.style.display = 'none';
    }
}

setButtonAction();
