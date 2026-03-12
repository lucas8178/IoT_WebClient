
//the nav bar for those who are already logged in
function loggedNavBar()
{
    const barDiv = document.getElementById("myNavBar");
    const myNavBar = document.createElement("nav");
    const barUList = document.createElement("ul");

    const menuItems = ["profile", "create", "configure", "status"];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.id = item.replace(/ /g, '');
        a.href = `/${item}`;
        a.textContent = `\u{1FAB4}` + item.charAt(0).toUpperCase() + item.slice(1);
        li.appendChild(a);
        barUList.appendChild(li);
    });

    myNavBar.appendChild(barUList);
    barDiv.appendChild(myNavBar);
}

loggedNavBar();
