const eventLikes = new CustomEvent("eventLikes");

/**
 * Factory pour créé les médias
 * @param {*} data Les données du media
 * @returns Renvoie un objet contenant les éléments DOM et les données du media
 */
export function mediaTemplate(data) {
  let { title, image, video, likes, price, photographerId, date } = data;

  const src = `assets/images/${photographerId}`;

  /**
   * Créé la balise img ou video du media
   * @returns La balise img ou video selon le type du media (Note : les contrôles de la vidéo sont activés)
   */
  function getMediaDOM() {
    if (image) {
      //Création du bloc <img> pour l'image
      const img = document.createElement("img");
      img.setAttribute("src", src + `/${image}`);
      img.setAttribute("alt", title);
      return img;
    } else if (video) {
      //Création du bloc <video> (avec controls)
      const videoDOM = document.createElement("video");
      videoDOM.setAttribute("controls", "");
      videoDOM.setAttribute("aria-label", title);

      //Création du bloc <source> pour la vidéo
      const sourceDOM = document.createElement("source");
      sourceDOM.setAttribute("src", src + `/${video}`);
      sourceDOM.setAttribute("type", "video/mp4");

      videoDOM.appendChild(sourceDOM);
      return videoDOM;
    }
  }

  /**
   * Créé la card pour la page photograph.html
   * @returns l'élément pour le dom
   */
  function getMediaCardDOM() {
    //Container principal
    const container = document.createElement("article");
    container.classList.add("photograph-photo-container");

    //Container du média
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("photograph-photo-img");

    const imgLink = document.createElement("a");
    imgLink.href = "javascript:;";
    imgLink.classList.add("photograph-photo-link");
    imgLink.ariaLabel = "Ouvrir la lightbox sur " + title;

    imgLink.appendChild(imgDiv);

    //Ajout de l'image/video (selon type du media) et supprime les controles pour les vidéos
    const mediaDOM = getMediaDOM();
    mediaDOM.controls = false;
    imgDiv.appendChild(mediaDOM);

    //Container du contenu (nom et like)
    const photoContent = document.createElement("div");
    photoContent.classList.add("photograph-photo-content");

    //Nom du media
    const nom = document.createElement("p");
    nom.classList.add("photo-grid-label");
    nom.textContent = title;

    //Nombre de likes
    const likeDOM = document.createElement("p");
    likeDOM.classList.add("photo-grid-fav");

    const likeSpan = document.createElement("span");
    likeSpan.classList.add("photo-grid-fav");
    likeSpan.textContent = likes;

    likeDOM.appendChild(likeSpan);

    const heart = document.createElement("em");
    heart.classList.add("fa-regular", "fa-heart");

    //Faux lien pour gestion du clavier
    const link = document.createElement("a");
    link.ariaLabel = "Mettre un like sur " + title;
    link.setAttribute("href", "javascript:;");
    link.onclick = () => {
      if (heart.classList.contains("fa-regular")) {
        this.likes += 1;
        heart.classList.replace("fa-regular", "fa-solid");
      } else {
        this.likes -= 1;
        heart.classList.replace("fa-solid", "fa-regular");
      }

      likeSpan.textContent = this.likes;

      const compteurDOM = document.getElementById("like-counter");
      compteurDOM.dispatchEvent(eventLikes);
    };

    link.appendChild(heart);

    likeDOM.appendChild(link);

    photoContent.appendChild(nom);
    photoContent.appendChild(likeDOM);

    container.appendChild(imgLink);
    container.appendChild(photoContent);

    return container;
  }

  return {
    title,
    likes,
    date,
    price,
    image,
    video,
    getMediaCardDOM,
    getMediaDOM,
  };
}
