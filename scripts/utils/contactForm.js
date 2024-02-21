/**
 * Affiche la modal de contact
 */
export function displayModal() {
  const modalBg = document.getElementById("contact_modal");
  modalBg.inert = false;
  modalBg.style.display = "block";

  //Mets le focus sur le premier input du form
  modalBg.querySelector("input").focus();

  const modal = modalBg.querySelector("div");
  modal.ariaModal = true;
  modal.ariaHidden = false;

  const mainContainer = document.getElementById("main_container");
  mainContainer.inert = true;
}

/**
 * Ferme la modal de contact
 */
export function closeModal() {
  const modalBg = document.getElementById("contact_modal");
  modalBg.inert = true;
  modalBg.style.display = "none";
  
  const modal = modalBg.querySelector("div");
  modal.ariaModal = false;
  modal.ariaHidden = true;

  const mainContainer = document.getElementById("main_container");
  mainContainer.inert = false;
}

const closeModalBtn = document.getElementById("contactCloseBtn");
closeModalBtn.onclick = () => closeModal();

/**
 * Valide le formulaire de contact (pour l'instant affiche juste les valeurs)
 * @param {*} form Le formulaire à valider
 */
export function validateContact(form) {
  closeModal();
  let i = 0;
  do {
    const element = form[i];

    if (element.value) {
      console.log("Nom input : " + element.name);
      console.log("Valeur : " + element.value);

      element.value = "";
    }

    i++;
  } while (form[i]);
}

