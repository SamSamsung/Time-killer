var list_de_mot = ['ANGLE', 'ARMOIRE', 'BANC', 'BUREAU', 'CABINET', 'CARREAU', 'CHAISE', 'CLASSE', 'CLEF', 'COIN', 'COULOIR', 'DOSSIER', 'EAU', 'ECOLE', 'ENTRER', 'ESCALIER', 'ETAGERE', 'EXTERIEUR', 'FENETRE', 'INTERIEUR', 'LAVABO', 'LIT', 'MARCHE', 'MATELAS', 'MATERNELLE', 'MEUBLE', 'MOUSSE', 'MUR', 'PELUCHE', 'PLACARD', 'PLAFOND', 'PORTE', 'POUBELLE', 'RADIATEUR', 'RAMPE', 'RIDEAU', 'ROBINET', 'SALLE', 'SALON', 'SERRURE', 'SERVIETTE', 'SIEGE', 'SIESTE', 'SILENCE', 'SOL', 'SOMMEIL', 'SONNETTE', 'SORTIE', 'TABLE', 'TABLEAU', 'TABOURET', 'TAPIS', 'TIROIR', 'TOILETTE', 'VITRE', 'ALLER', 'AMENER', 'APPORTER', 'APPUYER', 'ATTENDRE', 'BAILLER', 'COUCHER', 'DORMIR', 'ECLAIRER', 'EMMENER', 'EMPORTER', 'ENTRER', 'FERMER', 'FRAPPER', 'INSTALLER', 'LEVER', 'OUVRIR', 'PRESSER', 'RECHAUFFER', 'RESTER', 'SONNER', 'SORTIR', 'VENIR', 'ABSENT', 'ASSIS', 'BAS', 'HAUT', 'PRESENT', 'GAUCHE', 'DROITE', 'DEBOUT', 'DEDANS', 'DEHORS', 'FACE', 'LOIN', 'PRES', 'TARD', 'TOT', 'APRES', 'AVANT', 'CONTRE', 'DANS', 'DERRIERE', 'DEVANT', 'SOUS', 'SUR', 'CRAYON', 'STYLO', 'FEUTRE', 'MINE', 'GOMME', 'DESSIN', 'COLORIAGE', 'RAYURE', 'PEINTURE', 'PINCEAU', 'COULEUR', 'CRAIE', 'PAPIER', 'FEUILLE', 'CAHIER', 'CARNET', 'CARTON', 'CISEAUX', 'DECOUPAGE', 'PLIAGE', 'PLI', 'COLLE', 'AFFAIRE', 'BOITE', 'CASIER', 'CAISSE', 'TROUSSE', 'CARTABLE', 'JEU', 'JOUET', 'PION', 'DOMINO', 'PUZZLE', 'CUBE', 'PERLE', 'CHOSE', 'FORME', 'CARRE', 'ROND', 'PATE', 'MODELER', 'TAMPON', 'LIVRE', 'HISTOIRE', 'BIBLIOTHEQUE', 'IMAGE', 'ALBUM', 'TITRE', 'CONTE', 'DICTIONNAIRE', 'MAGAZINE', 'CATALOGUE', 'PAGE', 'LIGNE', 'MOT', 'ENVELOPPE', 'ETIQUETTE', 'CARTE', 'APPEL', 'AFFICHE', 'ALPHABET', 'APPAREIL', 'CAMESCOPE', 'CASSETTE', 'CHAINE', 'CHANSON', 'CHIFFRE', 'CONTRAIRE', 'DIFFERENCE', 'DOIGT', 'ECRAN', 'ECRITURE', 'FILM', 'FOIS', 'FOI', 'IDEE', 'INSTRUMENT', 'INTRUS', 'LETTRE', 'LISTE', 'MAGNETOSCOPE', 'MAIN', 'MICRO', 'MODELE', 'MUSIQUE', 'NOM', 'NOMBRE', 'ORCHESTRE', 'ORDINATEUR', 'PHOTO', 'POINT', 'POSTER', 'POUCE', 'PRENOM', 'QUESTION', 'RADIO', 'SENS', 'TAMBOUR', 'TELECOMMANDE', 'TELEPHONE', 'TELEVISION', 'TRAIT', 'TROMPETTE', 'VOIX', 'XYLOPHONE', 'ZERO', 'CHANTER', 'CHERCHER', 'CHOISIR', 'CHUCHOTER', 'COLLER', 'COLORIER', 'COMMENCER', 'COMPARER', 'COMPTER', 'CONSTRUIRE', 'CONTINUER', 'COPIER', 'COUPER', 'DECHIRER', 'DECOLLER', 'DECORER', 'DECOUPER', 'DEMOLIR', 'DESSINER', 'DIRE', 'DISCUTER', 'ECOUTER', 'ECRIRE', 'EFFACER', 'ENTENDRE', 'ENTOURER', 'ENVOYER', 'FAIRE', 'FINIR', 'FOUILLER', 'GOUTER', 'IMITER', 'LAISSER', 'LIRE', 'METTRE', 'MONTRER', 'OUVRIR', 'PARLER', 'PEINDRE', 'PLIER', 'POSER', 'PRENDRE', 'PREPARER', 'RANGER', 'RECITER', 'RECOMMENCER', 'REGARDER', 'REMETTRE', 'REPETER', 'REPONDRE', 'SENTIR', 'SOULIGNER', 'TAILLER', 'TENIR', 'TERMINER', 'TOUCHER', 'TRAVAILLER', 'TRIER', 'AMI', 'ATTENTION', 'CAMARADE', 'COLERE', 'COPAIN', 'COQUIN', 'DAME', 'DIRECTEUR', 'DIRECTRICE', 'DROIT', 'EFFORT', 'ELEVE', 'ENFANT', 'FATIGUE', 'FAUTE', 'FILLE', 'GARCON', 'GARDIEN', 'MADAME', 'MAITRE', 'MAITRESSE', 'MENSONGE', 'ORDRE', 'PERSONNE', 'RETARD', 'JOUEUR', 'SOURIRE', 'TRAVAIL', 'AIDER', 'DEFENDRE', 'DESOBEIR', 'DISTRIBUER', 'ECHANGER', 'EXPLIQUER', 'GRONDER', 'OBEIR', 'OBLIGER', 'PARTAGER', 'PRETER', 'PRIVER', 'PROMETTRE', 'PROGRES', 'PROGRESSER', 'PUNIR', 'QUITTER', 'RACONTER', 'EXPLIQUER', 'REFUSER', 'SEPARER', 'BLOND', 'BRUN', 'CALME', 'CURIEUX', 'DIFFERENT', 'DOUX', 'ENERVER', 'GENTIL', 'GRAND', 'HANDICAPE', 'INSEPARABLE', 'JALOUX', 'MOYEN', 'MUET', 'NOIR', 'NOUVEAU', 'PETIT', 'POLI', 'PROPRE', 'ROUX', 'SAGE', 'SALE', 'SERIEUX', 'SOURD', 'TRANQUILLE', 'ARROSOIR', 'ASSIETTE', 'BALLE', 'BATEAU', 'BOITE', 'BOUCHON', 'BOUTEILLE', 'BULLES', 'CANARD', 'CASSEROLE', 'CUILLERE', 'CUVETTE', 'DOUCHE', 'ENTONNOIR', 'GOUTTES', 'LITRE', 'MOULIN', 'PLUIE', 'POISSON', 'PONT', 'POT', 'ROUE', 'SAC', 'PLASTIQUE', 'SALADIER', 'SEAU', 'TABLIER', 'TASSE', 'TROUS', 'VERRE', 'AGITER', 'AMUSER', 'ARROSER', 'ATTRAPER', 'AVANCER', 'BAIGNER', 'BARBOTER', 'BOUCHER', 'BOUGER', 'DEBORDER', 'DOUCHER', 'ECLABOUSSER', 'ESSUYER', 'ENVOYER', 'COULER', 'PARTIR', 'FLOTTER', 'GONFLER', 'INONDER', 'JOUER', 'LAVER', 'MELANGER', 'MOUILLER', 'NAGER', 'PLEUVOIR', 'PLONGER', 'POUSSER', 'POUVOIR', 'PRESSER', 'RECEVOIR', 'REMPLIR', 'RENVERSER', 'SECHER', 'SERRER', 'SOUFFLER', 'TIRER', 'TOURNER', 'TREMPER', 'VERSER', 'VIDER', 'VOULOIR', 'AMUSANT', 'CHAUD', 'FROID', 'HUMIDE', 'INTERESSANT', 'MOUILLE', 'SEC', 'TRANSPARENT', 'MOITIE', 'AUTANT', 'BEAUCOUP', 'ENCORE', 'MOINS', 'PEU', 'PLUS', 'TROP', 'ANORAK', 'ARC', 'BAGAGE', 'BAGUETTE', 'BARBE', 'BONNET', 'BOTTE', 'BOUTON', 'BRETELLE', 'CAGOULE', 'CASQUE', 'CASQUETTE', 'CEINTURE', 'CHAPEAU', 'CHAUSSETTE', 'CHAUSSON', 'CHAUSSURE', 'CHEMISE', 'CIGARETTE', 'COL', 'COLLANT', 'COURONNE', 'CRAVATE', 'CULOTTE', 'ECHARPE', 'EPEE', 'FEE', 'FLECHE', 'FUSIL', 'GANT', 'HABIT', 'JEAN', 'JUPE', 'LACET', 'LAINE', 'LINGE', 'LUNETTES', 'MAGICIEN', 'MAGIE', 'MAILLOT', 'MANCHE', 'MANTEAU', 'MOUCHOIR', 'MOUFLE', 'NOEUD', 'PAIRE', 'PANTALON', 'PIED', 'POCHE', 'PRINCE', 'PYJAMA', 'REINE', 'ROBE', 'ROI', 'RUBAN', 'SEMELLE', 'SOLDAT', 'SOCIERE', 'TACHE', 'TAILLE', 'TALON', 'TISSU', 'TRICOT', 'UNIFORME', 'VALISE', 'VESTE', 'VETEMENT', 'CHANGER', 'CHAUSSER', 'COUVRIR', 'DEGUISER', 'DESHABILLER', 'ENLEVER', 'HABILLER', 'LACER', 'PORTER', 'RESSEMBLER', 'CLAIR', 'COURT', 'ETROIT', 'FONCE', 'JOLI', 'LARGE', 'LONG', 'MULTICOLORE', 'NU', 'USE', 'BIEN', 'MAL', 'MIEUX', 'PRESQUE', 'AIGUILLE', 'AMPOULE', 'AVION', 'BOIS', 'BOUT', 'BRICOLAGE', 'BRUIT', 'CABANE', 'CARTON', 'CLOU', 'COLLE', 'CROCHET', 'ELASTIQUE', 'FICELLE', 'FIL', 'MARIONNETTE', 'MARTEAU', 'METAL', 'METRE', 'MORCEAU', 'MOTEUR', 'OBJET', 'OUTIL', 'PEINTURE', 'PINCEAU', 'PLANCHE', 'PLATRE', 'SCIE', 'TOURNEVIS', 'VIS', 'VOITURE', 'ARRACHER', 'ATTACHER', 'CASSER', 'COUDRE', 'DETRUIRE', 'ECORCHER', 'ENFILER', 'ENFONCER', 'FABRIQUER', 'MESURER', 'PERCER', 'PINCER', 'REPARER', 'REUSSIR', 'SERVIR', 'TAPER', 'TROUER', 'TROUVER', 'ADROIT', 'DIFFICILE', 'DUR', 'FACILE', 'LISSE', 'MALADROIT', 'POINTU', 'TORDU', 'ACCIDENT', 'AEROPORT', 'CAMION', 'ENGIN', 'FEU', 'FREIN', 'FUSEE', 'GARAGE', 'GARE', 'GRUE', 'HELICOPTERE', 'MOTO', 'PANNE', 'PARKING', 'PILOTE', 'PNEU', 'QUAI', 'TRAIN', 'VIRAGE', 'VITESSE', 'VOYAGE', 'WAGON', 'ZIGZAG', 'ARRETER', 'ATTERRIR', 'BOUDER', 'CHARGER', 'CONDUIRE', 'DEMARRER', 'DISPARAITRE', 'DONNER', 'ECRASER', 'ENVOLER', 'GARDER', 'GARER', 'MANQUER', 'PARTIR', 'POSER', 'RECULER', 'ROULER', 'TENDRE', 'TRANSPORTER', 'VOLER', 'ABIME', 'ANCIEN', 'BLANC', 'BLEU', 'CASSE', 'CINQ', 'DERNIER', 'DEUX', 'DEUXIEME', 'DIX', 'GRIS', 'GROS', 'HUIT', 'JAUNE', 'MEME', 'NEUF', 'PAREIL', 'PREMIER', 'QUATRE', 'ROUGE', 'SEPT', 'SEUL', 'SIX', 'SOLIDE', 'TROIS', 'TROISIEME', 'UN', 'VERT', 'DESSUS', 'AUTOUR', 'VITE', 'VERS', 'ACROBATE', 'ARRET', 'ARRIERE', 'BARRE', 'BARREAU', 'BORD', 'BRAS', 'CERCEAU', 'CHAISE', 'CHEVILLE', 'CHUTE', 'COEUR', 'CORDE', 'CORPS', 'COTE', 'COU', 'COUDE', 'CUISSE', 'DANGER', 'DOIGTS', 'DOS', 'ECHASSES', 'ECHELLE', 'EPAULE', 'EQUIPE', 'ESCABEAU', 'FESSE', 'FILET', 'FOND', 'GENOU', 'GYMNASTIQUE', 'HANCHE', 'JAMBE', 'JEU', 'MAINS', 'MILIEU', 'MONTAGNE', 'MUR', 'ESCALADE', 'MUSCLE', 'NUMERO', 'ONGLE', 'PARCOURS', 'PAS', 'PASSERELLE', 'PENTE', 'PEUR', 'PIED', 'PLONGEOIR', 'POIGNET', 'POING', 'PONT', 'SIGNE', 'SINGE', 'POUTRE', 'EQUILIBRE', 'PRISE', 'RIVIERE', 'CROCODILE', 'ROULADE', 'PIROUETTE', 'SAUT', 'SERPENT', 'SPORT', 'SUIVANT', 'TETE', 'TOBOGGAN', 'TOUR', 'TRAMPOLINE', 'TUNNEL', 'VENTRE', 'ACCROCHER', 'APPUYER', 'ARRIVER', 'BAISSER', 'BALANCER', 'BONDIR', 'BOUSCULER', 'COGNER', 'COURIR', 'DANSER', 'DEPASSER', 'DESCENDRE', 'ECARTER', 'ESCALADER', 'GAGNER', 'GENER', 'GLISSER', 'GRIMPER', 'MARCHER', 'PATTES', 'DEBOUT', 'MONTER', 'MONTRER', 'PENCHER', 'PERCHER', 'PERDRE', 'RAMPER', 'RATER', 'REMPLACER', 'RESPIRER', 'RETOURNER', 'REVENIR', 'SAUTER', 'SOULEVER', 'SUIVRE', 'TOMBER', 'TRANSPIRER', 'TRAVERSER', 'DANGEUREUX', 'EPAIS', 'FORT', 'GROUPE', 'IMMOBILE', 'ROND', 'SERRE', 'SOUPLE', 'ENSEMBLE', 'ICI', 'JAMAIS', 'TOUJOURS', 'SOUVENT', 'BAGARRE', 'BALANCOIRE', 'BALLON', 'BANDE', 'BICYCLETTE', 'BILLE', 'CAGE', 'ECUREUIL', 'CERF', 'VOLANT', 'CHATEAU', 'COUP', 'COUR', 'COURSE', 'ECHASSE', 'FLAQUE', 'EAU', 'PAIX', 'PARDON', 'PARTIE', 'PEDALE', 'PELLE', 'POMPE', 'PREAU', 'RAQUETTE', 'RAYON', 'RECREATION', 'SABLE', 'SIFFLET', 'SIGNE', 'TAS', 'TRICYCLE', 'TUYAU', 'VELO', 'FILE', 'RANG', 'BAGARRER', 'BATTRE', 'CACHER', 'CRACHER', 'CREUSER', 'CRIER', 'DEGONFLER', 'DISPUTE', 'EMPECHER', 'GALOPER', 'HURLER', 'JONGLER', 'LANCER', 'PEDALER', 'PLAINDRE', 'PLEURER', 'POURSUIVRE', 'PROTEGER', 'SAIGNER', 'SALIR', 'SIFFLER', 'SURVEILLER', 'TRAINER', 'TROUVER', 'FOU', 'MECHANT']

let nb_essay = 7
let compteur_slides = 0

function choix_de_mot(){
  return list_de_mot[Math.floor(Math.random()*list_de_mot.length)]
}

const mot = choix_de_mot()

setTimeout(function () {
    let tiret = document.getElementById("cases_lettres");
    str_tiret = tiret.textContent.toString()
    let tirets = str_tiret.repeat(mot.length);
    tiret.innerHTML = tirets
    
}, 10)



function lettre_not_in_mot(){
  document.getElementById(compteur_slides).classList.remove("active");
  nb_essay = nb_essay - 1
  compteur_slides++;
  if(compteur_slides > 7) {
    compteur_slides = 0
  }
  document.getElementById(compteur_slides).classList.add("active")
  document.querySelector("#compteur").innerHTML = "Vous avez " + nb_essay +" essais";
}




function desapear (lettre){
  document.getElementById(lettre).classList.add("non_active");

}

function appear(lettre){
  document.getElementById(`${lettre}_dis`).classList.add("show");
}


function verif_in_mot(mot, lettre){
  if (mot.toUpperCase().includes(lettre)) {
    let tiret = document.getElementById("cases_lettres");
    let str_tiret = tiret.textContent.toString()
    let tirets = str_tiret.split(" ", mot.length)
    console.log(tirets)
    str = ""
    str_sans_espace = ""
    for(i = 0; i < mot.length; i++) {
        if(mot[i].toUpperCase() === lettre){
            tirets[i] = lettre
            
        }
        console.log(tirets[i])
        str = str + tirets[i] + " "
        str_sans_espace = str_sans_espace + tirets[i]
    }
    tiret.innerHTML = str
    desapear(lettre)
    return str_sans_espace
  } 
  else {
    console.log("mauvaise réponse")
    desapear(lettre)
    appear(lettre)
    lettre_not_in_mot()
  }
}


function recupere_lettre(x){
  var lettre = x
  str = verif_in_mot(mot, lettre)
  if(str === mot.toUpperCase()){
    document.getElementById("gagne").classList.add("active")
    document.getElementById("overlay").classList.add("show")
  } else if(nb_essay === 0) {
    document.getElementById("overlay").classList.add("show")
    setTimeout( function () {
      document.getElementById("perdu").classList.add("active");
      document.querySelector("#mot").innerHTML = mot;
    }, 1000)
    
  }

  return(x)
}
