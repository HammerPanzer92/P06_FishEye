export function photographerTemplate(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        //Création d'un lien contenant l'id du photograph
        const link = document.createElement( 'a' );
        link.href = 'photographer.html?id=' + id;

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", "Avatar de " + name);

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;

        const h3 = document.createElement( 'h3' );
        h3.textContent = city + ", " + country;

        const pTag = document.createElement( 'p' );
        pTag.classList.add( 'tagline' );
        pTag.textContent = tagline;

        const priceDOM = document.createElement( 'p' );
        priceDOM.classList.add( 'price' );
        priceDOM.textContent = price + "€/jour";

        link.appendChild(img);
        article.appendChild(link);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(pTag);
        article.appendChild(priceDOM);
        return (article);
    }

    function setUserHeaderDOM(){
        const photographNameDOM = document.querySelector('.photograph-name');
        photographNameDOM.textContent = name;

        const cityDOM = document.querySelector('.photograph-city');
        cityDOM.textContent = city + ", " + country;

        const taglineDOM = document.querySelector('.photograph-tagline');
        taglineDOM.textContent = tagline

        const profilPictDOM = document.querySelector('.photograph-profil-picture');
        profilPictDOM.setAttribute('src', picture);
        profilPictDOM.setAttribute('alt', name);

        const buttonDOM = document.querySelector('.contact_button');
        buttonDOM.ariaLabel = 'Contacter ' + name;
    }

    return { name, picture, price, getUserCardDOM, setUserHeaderDOM }
}