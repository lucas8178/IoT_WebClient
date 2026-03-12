
//function to change the images of plants in the main page
async function imageCarousel()
{
    const articles = document.getElementById("articles");
    const section = document.createElement("section");
    const img = document.createElement("img");
    img.id = "postImg";

    const data = await fetch('/postImageNames');
    const images = await data.json();
    img.src = `../img/index/${images[0]}`;

    section.appendChild(img);
    articles.appendChild(section);

    let i = 1;
    setInterval(() => {
        if(i >= images.length)
            i = 0;
        console.log(images[i]);
        img.src = `../img/index/${images[i]}`;
        i++;
    }, 10000);
}

imageCarousel();
