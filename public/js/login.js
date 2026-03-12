
//Function to set the button action
function setButtonAction()
{
    const sendData = document.getElementById('sendData');
    sendData.onclick = logIn;
}

//function to get the user data and send to the server to login
async function logIn()
{
    const name = document.getElementById('uname');
    const password = document.getElementById('pword');

    values = {"name": name.value, "pword": password.value};

    name.value = '';
    password.value = '';

    let data = await fetch('/signIn', {
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
        formDiv.innetHTML = '';
        const message = document.createElement('p');
        message.textContent = jsonData.error;
        formDiv.appendChild(message);
        formDiv.style.display = "grid";
    } else
    {
        formDiv.style.display = "none";
        window.location.href = "/menu";
    }
}

setButtonAction();
