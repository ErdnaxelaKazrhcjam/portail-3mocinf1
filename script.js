// Script unique du portail 3MOCINF1, chargé sur toutes les pages (avec defer).

// La langue de la page choisit les textes affichés par le script.
const anglais = document.documentElement.lang === "en";

// Lire et écrire la mémoire du navigateur sans planter si elle est bloquée.
function lireMemoire(cle) {
  try { return localStorage.getItem(cle); } catch (e) { return null; }
}
function ecrireMemoire(cle, valeur) {
  try { localStorage.setItem(cle, valeur); } catch (e) { /* tant pis */ }
}

// ---------------------------------------------------------------- 1. Mode sombre
const boutonTheme = document.querySelector("#bouton-theme");

function appliquerTheme(sombre) {
  document.body.classList.toggle("sombre", sombre);
  boutonTheme.setAttribute("aria-pressed", String(sombre));
  if (sombre) {
    boutonTheme.textContent = anglais ? "Light mode" : "Mode clair";
  } else {
    boutonTheme.textContent = anglais ? "Dark mode" : "Mode sombre";
  }
}

// Au chargement : le choix déjà fait, sinon le réglage de l'ordinateur.
const themeMemorise = lireMemoire("theme");
if (themeMemorise) {
  appliquerTheme(themeMemorise === "sombre");
} else {
  appliquerTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
}

boutonTheme.addEventListener("click", function () {
  const sombre = !document.body.classList.contains("sombre");
  appliquerTheme(sombre);
  ecrireMemoire("theme", sombre ? "sombre" : "clair");
});

// ---------------------------------------------------------------- 2. Taille du texte
const curseur = document.querySelector("#curseur-taille");
const valeurTaille = document.querySelector("#valeur-taille");

function appliquerTaille(valeur) {
  document.documentElement.style.fontSize = valeur + "%";
  valeurTaille.textContent = valeur + " %";
  curseur.value = valeur;
}

appliquerTaille(lireMemoire("taille") || 100);

curseur.addEventListener("input", function () {
  appliquerTaille(curseur.value);
  ecrireMemoire("taille", curseur.value);
});

// ---------------------------------------------------------------- 3. Menu sur téléphone
const boutonMenu = document.querySelector(".menu-bouton");
const menu = document.querySelector("#menu");

boutonMenu.addEventListener("click", function () {
  const ouvert = menu.classList.toggle("ouvert");
  boutonMenu.setAttribute("aria-expanded", String(ouvert));
});

// ---------------------------------------------------------------- 4. Liste des projets (accueil)
// Pour ajouter un projet : copier un bloc { … } et remplir les champs.
const projets = [
  {
    titre: { fr: "Bittensor sans jargon", en: "Bittensor, jargon-free" },
    auteur: "Alexandre Majchrzak",
    sujet: {
      fr: "Bittensor et son jeton TAO expliqués à qui ne connaît rien à la blockchain",
      en: "Bittensor and its TAO token explained to people who know nothing about blockchain",
    },
    lien: "https://alexandremajchrzak365.github.io/bittensor/",
    image: "img/projet-bittensor.svg",
  },
];

const listeProjets = document.querySelector("#projets");
const filtre = document.querySelector("#filtre");
const nombreProjets = document.querySelector("#nombre-projets");

function texte(valeur) {
  // un champ peut être un simple texte ou un objet { fr, en }
  if (typeof valeur === "string") return valeur;
  return anglais ? valeur.en : valeur.fr;
}

function afficherProjets() {
  const recherche = filtre.value.trim().toLowerCase();
  listeProjets.textContent = "";
  let trouves = 0;

  for (const projet of projets) {
    const contenu = (texte(projet.titre) + " " + projet.auteur + " " + texte(projet.sujet)).toLowerCase();
    if (!contenu.includes(recherche)) continue;
    trouves++;

    const carte = document.createElement("li");
    carte.className = "carte";

    const image = document.createElement("img");
    image.src = projet.image;
    image.alt = "";
    carte.append(image);

    const corps = document.createElement("div");
    corps.className = "carte-corps";

    const titre = document.createElement("h3");
    if (projet.lien) {
      const lien = document.createElement("a");
      lien.href = projet.lien;
      lien.textContent = texte(projet.titre);
      titre.append(lien);
    } else {
      titre.textContent = texte(projet.titre);
    }
    corps.append(titre);

    const auteur = document.createElement("p");
    auteur.className = "auteur";
    auteur.textContent = projet.auteur;
    corps.append(auteur);

    const sujet = document.createElement("p");
    if (projet.lien) {
      sujet.textContent = texte(projet.sujet);
    } else {
      const etiquette = document.createElement("span");
      etiquette.className = "etiquette";
      etiquette.textContent = texte(projet.sujet);
      sujet.append(etiquette);
    }
    corps.append(sujet);

    carte.append(corps);
    listeProjets.append(carte);
  }

  if (trouves === 0) {
    nombreProjets.textContent = anglais ? "No project matches this search." : "Aucun projet ne correspond à cette recherche.";
  } else if (anglais) {
    nombreProjets.textContent = trouves + (trouves === 1 ? " project" : " projects");
  } else {
    nombreProjets.textContent = trouves + " projet" + (trouves === 1 ? "" : "s");
  }
}

if (listeProjets) {
  afficherProjets();
  filtre.addEventListener("input", afficherProjets);
}

// ---------------------------------------------------------------- 5. Compte à rebours (accueil)
const compte = document.querySelector("#compte");
const expo = new Date(2026, 11, 3, 13, 30); // mois comptés à partir de 0 : 11 = décembre

function mettreAJourCompte() {
  const reste = expo - new Date();
  if (reste <= 0) {
    compte.textContent = anglais ? "The fair is on! Come and visit." : "C'est le jour de l'expo, venez visiter !";
    return;
  }
  const jours = Math.floor(reste / 86400000);
  const heures = Math.floor((reste % 86400000) / 3600000);
  const minutes = Math.floor((reste % 3600000) / 60000);
  if (anglais) {
    compte.textContent = `In ${jours} days, ${heures} h and ${minutes} min`;
  } else {
    compte.textContent = `Dans ${jours} jours, ${heures} h et ${minutes} min`;
  }
}

if (compte) {
  mettreAJourCompte();
  setInterval(mettreAJourCompte, 30000);
}

// ---------------------------------------------------------------- 6. Semaine en cours (projet)
const etapes = document.querySelectorAll(".etapes li");
const maintenant = new Date();
const aujourdhui = maintenant.getFullYear() + "-" + String(maintenant.getMonth() + 1).padStart(2, "0") + "-" + String(maintenant.getDate()).padStart(2, "0"); // par exemple "2026-11-19"

for (const etape of etapes) {
  if (aujourdhui >= etape.dataset.debut && aujourdhui <= etape.dataset.fin) {
    etape.classList.add("actuelle");
    etape.setAttribute("aria-current", "step");
    etape.querySelector("h3").dataset.maintenant = anglais ? "← now" : "← en ce moment";
  }
}

// ---------------------------------------------------------------- 7. Bandeau d'alerte (accueil)
// Le dark pattern volontaire du site : voir la page Crédits.
const bandeau = document.querySelector("#bandeau");

function fermerBandeau() {
  bandeau.hidden = true;
  try { sessionStorage.setItem("bandeau-vu", "oui"); } catch (e) { /* tant pis */ }
}

if (bandeau) {
  let dejaVu = false;
  try { dejaVu = sessionStorage.getItem("bandeau-vu") === "oui"; } catch (e) { /* tant pis */ }

  if (!dejaVu) {
    setTimeout(function () { bandeau.hidden = false; }, 4000);
  }

  bandeau.querySelector(".bandeau-oui").addEventListener("click", function () {
    bandeau.querySelector("p").textContent = anglais
      ? "Thanks! (In fact, this portal sends no alerts. See the Credits page.)"
      : "Merci ! (En fait, ce portail n'envoie aucune alerte. Voir la page Crédits.)";
    bandeau.querySelector(".bandeau-boutons").hidden = true;
    setTimeout(fermerBandeau, 3500);
  });
  bandeau.querySelector(".bandeau-non").addEventListener("click", fermerBandeau);

  // La touche Échap ferme aussi le bandeau.
  document.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Escape" && !bandeau.hidden) fermerBandeau();
  });
}
