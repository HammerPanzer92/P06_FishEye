import { photographerTemplate } from "../templates/photographer.js";
import { mediaTemplate } from "../templates/media.js";
import {
  initClickImg,
  setLightboxArray,
  lightboxClose,
  lightboxMovePos,
} from "../utils/lightbox.js";
import {
  displayModal,
  closeModal,
  validateContact,
} from "../utils/contactForm.js";

//Récupération de l'id via les SearchParams
const queryParams = new URLSearchParams(window.location.search);

const id = queryParams.get("id");

const mediaArray = [];

/**
 * Récupére les données d'un photograph
 * @param {Number} idPhoto Le numéro d'identifiant du photograph
 * @returns Un objet contenant les informations du photograph, null si vide
 */
async function getPhotographer(idPhoto) {
  const res = await fetch("../../data/photographers.json");
  const { photographers } = await res.json();

  const result = photographers.filter(
    (photographer) => photographer.id == idPhoto
  );

  if (result.length == 1) {
    return result[0];
  } else {
    return null;
  }
}

/**
 * Récupére les données des médias d'un photographe
 * @param {Number} photoId L'id du photographe
 * @returns Un tableau contenant les informations sur les médias d'un photographe
 */
async function getMedias(photoId) {
  const res = await fetch("../../data/photographers.json");
  const { media } = await res.json();

  const result = media.filter((element) => element.photographerId == photoId);

  return result;
}

/**
 * Supprime les medias du DOM pour remplacer par une version mise a jour (ex : lors d'un tri)
 */
function updateMediaDOM() {
  //Ajout du DOM des medias dans le HTML
  const mediaArrayDOM = [];

  mediaArray.forEach((element) =>
    mediaArrayDOM.push(element.getMediaCardDOM())
  );

  const divGrid = document.querySelector(".photograph-grid");

  //Suppression des anciens médias
  while (divGrid.firstChild) {
    divGrid.removeChild(divGrid.firstChild);
  }

  //Ajout des cards des medias dans la grille
  for (let i = 0; i < mediaArrayDOM.length; i++) {
    const element = mediaArrayDOM[i];

    const videoDOM = element.querySelector("video");
    if(videoDOM){
      videoDOM.tabIndex = -1;
    }

    divGrid.appendChild(element);
  }

  initClickImg(mediaArrayDOM);
}

/**
 * Met a jour le prix du photographe sur la page
 */
async function updatePrice() {
  const photographer = await getPhotographer(id);

  const priceDOM = document.querySelector("#price");

  priceDOM.textContent = photographer.price + "€/jour";
}

/**
 * Met a jour le compteur de likes
 */
async function updateLikeCounter() {
  let totalLikes = 0;

  mediaArray.forEach((element) => {
    totalLikes += element.likes;
  });

  const counterDOM = document.querySelector(".like-counter-count");
  counterDOM.textContent = totalLikes;
}

/**
 * Tri les medias selon l'ordre indiqué (ou par popularité si aucun paramétre indiqué)
 * @param {String} sortOrder "pop" -> trie par popularité
 * "date" -> trie par date
 * "titre" -> trie par titre
 */
function sortMedia(sortOrder) {
  if (sortOrder === "pop") {
    mediaArray.sort((a, b) => {
      return b.likes - a.likes;
    });
  } else if (sortOrder === "date") {
    mediaArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateB - dateA;
    });
  } else if (sortOrder === "titre") {
    mediaArray.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }
}

//Tri lors de la sélection d'une option
const filterInput = document.getElementById("filter");
filterInput.onchange = () => {
  //On tri les medias
  sortMedia(filterInput.value);

  //Puis on met a jour le DOM afin d'afficher la liste trié
  updateMediaDOM();
};
/**
 * Fonction d'initialisation de la page
 */
async function init() {
  //Récupération du profil du photographe
  const profilJSON = await getPhotographer(id);
  const profil = photographerTemplate(profilJSON);

  profil.setUserHeaderDOM();

  const modalContactSpan = document.getElementById("modal_photo_name");
  modalContactSpan.textContent = profil.name;

  //Récupération des médias du photographe
  const mediaJSON = await getMedias(id);

  //Créé les templates pour média et les stockent dans un tableau
  mediaJSON.forEach((element) => mediaArray.push(mediaTemplate(element)));

  //On appelle la fonction de tri via popularité (choix par défaut)
  sortMedia(filterInput.value);

  setLightboxArray(mediaArray);

  updateMediaDOM();

  updateLikeCounter();

  const compteurDOM = document.getElementById("like-counter");
  compteurDOM.addEventListener("eventLikes", (e) => {
    e.preventDefault();
    updateLikeCounter();
  });
}

init();
updatePrice();

/*---Gestion lightbox ---*/
//Gestion du clavier pour navigation de la lightbox via clavier
document.onkeydown = function (e) {
  const lightboxModal = document.getElementById("bg-lightbox");

  //On vérifie si la lightbox est affiché
  if (lightboxModal.style.display == "block") {
    if (e.key === "ArrowRight") {
      //Si on appui sur droite, on passe au média suivant (ou on revient au début si on est déjà au dernier)
      lightboxMovePos(1);
    } else if (e.key === "ArrowLeft") {
      //Si on appui sur gauche, on passe au précédent ou au premier
      lightboxMovePos(-1);
    } else if (e.key === "Escape") {
      //Si on appui sur échappe on ferme la lightbox
      lightboxClose();
    }
  }
};

const btnNextLightbox = document.getElementById("lightboxBtnNext");
const btnPrevLightbox = document.getElementById("lightboxBtnPrev");
const btnCloseLightbox = document.getElementById("lightboxBtnClose");

btnNextLightbox.addEventListener("click", () => {
  lightboxMovePos(1);
});

btnPrevLightbox.addEventListener("click", () => {
  lightboxMovePos(-1);
});

btnCloseLightbox.addEventListener("click", () => lightboxClose());

/*---Gestion du form de contact---*/
const formDOM = document.querySelector("form");
formDOM.onsubmit = (e) => validateContact(e.target);

const btnContact = document.querySelector(".contact_button");
btnContact.onclick = () => displayModal();

//Ajout de la gestion du clavier pour pouvoir quitter la modal de contact
const inputArray = document.querySelectorAll(
  "form input, form button, form textarea"
);

inputArray.forEach((element) => {
  element.onkeydown = (e) => {
    if (e.key == "Escape") {
      closeModal();
    }
  };
});
