
//Function that set the button actions
function setButtonAction()
{
    const sendData = document.getElementById('sendData');
    sendData.onclick = sendFormData;
}

//Function that gets the user data to register in the database
async function sendFormData() 
{
    const name = document.getElementById('uname');
    const email = document.getElementById('uemail');
    const password = document.getElementById('pword');
    const cpassword = document.getElementById('cpword');

    let values = {"name": name.value, "email": email.value, "pword": password.value, "cpword": cpassword.value};
    name.value = '';
    email.value = '';
    password.value = '';
    cpassword.value = '';
    
    let data = await fetch('/createUser', {
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
