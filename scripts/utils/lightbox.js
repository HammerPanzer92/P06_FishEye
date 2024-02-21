//Sauvegarde la position actuelle de la lightbox
let posLightbox = -1;

const lightboxImgDOM = document.getElementById("lightbox-img");

//Variable contenant le tableau des médias
let arrayLightbox = [];

/**
 * Configure le tableau pour la lightbox
 * @param {Array} newArray Le nouveau tableau contenant les medias
 */
export function setLightboxArray(newArray){
  arrayLightbox = newArray;
}

/**
 * Modifie (ou initialise) l'image/vidéo a affiché dans la lightbox
 * @param {Number} pos La position dans le tableau des medias de l'élément souhaité
 */
export function lightboxSetPos(pos) {
  const media = arrayLightbox[pos];

  const mediaDOM = media.getMediaDOM();

  if (lightboxImgDOM.children[0]) {
    lightboxImgDOM.removeChild(lightboxImgDOM.children[0]);
  }
  mediaDOM.classList.add("lightbox-media");

  //Rajoute tabIndex pour les vidéos
  if(mediaDOM.nodeName === "VIDEO"){
    mediaDOM.tabIndex = 2;
  }

  lightboxImgDOM.appendChild(mediaDOM);

  posLightbox = pos;
}

/**
 * Affiche ou masque la lightbox
 */
function toggleDisplayLightbox() {
  const lightboxModal = document.getElementById("bg-lightbox");
  if ((lightboxModal.style.display == "none" || !lightboxModal.style.display)) {
    lightboxModal.style.display = "block";
    lightboxModal.inert = false;
  } else {
    lightboxModal.style.display = "none";
    lightboxModal.inert = true;
  }
}

/**
 * Ajout du event click pour afficher la lightbox sur les medias
 * @param {Array} arrayDom Tableau contenant tout les éléments de type media (img/video)
 */
export function initClickImg(arrayDom) {
  for (let i = 0; i < arrayDom.length; i++) {
    const element = arrayDom[i];
    let media = element.querySelector(".photograph-photo-link");
    media.addEventListener("click", () => { lightboxOpen(i) });
  }
}

/**
 * Ouvre la lightbox avec le media correspondant
 * @param {Number} pos La position du media dans le tableau
 */
function lightboxOpen(pos) {
  const mainContainer = document.getElementById("main_container");
  mainContainer.inert = true;

  toggleDisplayLightbox();
  lightboxSetPos(pos);
}

/**
 * Ferme la lightbox
 */
export function lightboxClose() {
  //Suppression de l'image/video
  if (lightboxImgDOM.children[0]) {
    lightboxImgDOM.removeChild(lightboxImgDOM.children[0]);
  }

  toggleDisplayLightbox();

  const mainContainer = document.getElementById("main_container");
  mainContainer.inert = false;
}

/**
 * "Déplace" la position de la lightbox de x position 
 * @param {Number} movement 1 pour passer au média suivant, -1 pour passer au média précédent
 */
export function lightboxMovePos(movement) {
  let newPos = movement + posLightbox;
  if(newPos > arrayLightbox.length - 1){
    newPos = 0;
  }else if(newPos < 0){
    newPos = arrayLightbox.length - 1;
  }
  lightboxSetPos(newPos);
}
