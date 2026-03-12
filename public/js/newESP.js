
let generalSocket = null;

//connects to the websocket
async function configureClient()
{
    let ipData = await fetch('/getLocalIp');
    let ipJson = await ipData.json();
    const socket = new WebSocket(`ws://${ipJson.ip}:8080`);
    /*
    fetch('/getUserData').then(response => response.json()).then(data => {
    });
    */

    socket.onmessage = newEspConnected;
    generalSocket = socket;
}

//Executes the action when a new garden device is connected
async function newEspConnected(event) {
    const jsonData = JSON.parse(event.data)
    console.log(jsonData);
    let userData = await fetch('/getUserData');
    let userJson = await userData.json();
    if(jsonData.device === "garden" && jsonData.command == "newGarden")
    {
        let newEspCode = prompt("A new device was connected using your Id,\n" +
                                "please choose a Id if you already registered your plant \n" +
                                "or else register it and then connect again", "plantId");
        let id = parseInt(newEspCode, 10);

        generalSocket.send(`{"device": "client", "command": "newGardenId", "id": ${userJson.id}, "plantId": ${id}}`);
    } else if(jsonData.device === "client" && jsonData.command == "firstConn")
    {
        generalSocket.send(`{"device": "client", "command": "newClient", "id": ${userJson.id}}`);
    }
}

configureClient();
