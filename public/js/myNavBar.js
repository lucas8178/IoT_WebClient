
//the main nav bar of the site for those that are not logged
function navBar()
{
    const barDiv = document.getElementById("myNavBar");
    const myNavBar = document.createElement("nav");
    const barUList = document.createElement("ul");

    const menuItems = ["home", "login", "register"];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.id = item.replace(/ /g, '');
        a.href = `/${item}`;
        a.textContent = item.charAt(0).toUpperCase() + item.slice(1);
        li.appendChild(a);
        barUList.appendChild(li);
    });

    myNavBar.appendChild(barUList);
    barDiv.appendChild(myNavBar);
}

navBar();
