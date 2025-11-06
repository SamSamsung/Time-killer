const ADMIN_UID = "dtbRFLH60vVn7T7czh3dZTVguck2"
var userProfileMap = {};
// Variable globale pour stocker les infos du créateur original
window.currentEditingOriginalCreator = null;

// =================================================
// == CONFIGURATION DES ICÔNES DE PROFIL ==
// =================================================
// Dictionnaire qui lie un ID de couleur au fichier de l'icône
const ICON_COLOR_MAP = {
    "red": './icons_map/boutique-de-sexe-red.png',
    "blue": './icons_map/boutique-de-sexe-blue.png',
    "lightblue": './icons_map/boutique-de-sexe-lightblue.png',
    "orange": './icons_map/boutique-de-sexe-orange.png',
    "lightgreen": './icons_map/boutique-de-sexe-lightgreen.png',
    "gray": './icons_map/boutique-de-sexe-gray.png',
    "magenta": './icons_map/boutique-de-sexe-magenta.png',
    "green": './icons_map/boutique-de-sexe-green.png',
    "pink": './icons_map/boutique-de-sexe-pink.png',
    "yellow": './icons_map/boutique-de-sexe-yellow.png',
    "purple" : './icons_map/boutique-de-sexe-purple.png',
    "darkgray" : './icons_map/boutique-de-sexe-darkgray.png',
    "black": './icons_map/boutique-de-sexe-black.png',
    "bed": './icons_map/lit.png',
    "google": null // Cas spécial pour la photo de profil Google
};
// =================================================
// On définit les "coins" du monde
var coinSudOuest = L.latLng(-90, -180);
var coinNordEst = L.latLng(90, 180);
var limitesMonde = L.latLngBounds(coinSudOuest, coinNordEst);

var map = L.map('map', {
    worldCopyJump: true,
    maxBounds: limitesMonde, // <-- La nouvelle option
    maxBoundsViscosity: 1.0,   // Force la limite (1.0 = mur solide)
    minZoom: 3,  // <-- Empêche de trop dézoomer
});

// Ajouter le contrôle de géocodage à la carte
L.Control.geocoder().addTo(map);



function initMap(lat, lon, zoom = 13) {
    map.setView([lat, lon], zoom);


    // 1. Définir les deux thèmes
    var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    var cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var esriDarkGray = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    });

    // L'ancien thème classique (pour comparer)
    var osmClassic = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
  
    // 2. Créer l'objet pour le contrôle
    var baseMaps = {
        "Moderne (Clair)": cartoLight,
        "Moderne (Sombre)": cartoDark,
        "Gris (Sombre)": esriDarkGray,
        "Satellite": esriSatellite,
        "Terrain": openTopo,
        "Classique (OSM)": osmClassic
    };

    // 3. Ajouter le contrôle à la carte
    L.control.layers(baseMaps).addTo(map);


    const savedThemeName = localStorage.getItem('userMapTheme'); // On récupère le nom sauvegardé
    let defaultLayer;

    // On vérifie si le nom sauvegardé existe dans notre objet baseMaps
    if (savedThemeName && baseMaps[savedThemeName]) {
        defaultLayer = baseMaps[savedThemeName]; // Si oui, on l'utilise
    } else {
        defaultLayer = cartoLight; // Sinon, on prend le thème par défaut
    }

    // 4. Ajouter le thème par défaut (important !)
    defaultLayer.addTo(map);

    // On écoute l'événement 'baselayerchange' (quand l'utilisateur change de thème)
    map.on('baselayerchange', function(e) {
        // e.name est le nom du thème (ex: "Satellite", "Moderne (Sombre)")
        localStorage.setItem('userMapTheme', e.name);
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Si autorisé, centrer sur la position
      initMap(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      // En cas de refus ou erreur, centrer sur Paris
      console.warn('Géo non autorisée ou erreur, centrage sur Paris');
      initMap(48.8566, 2.3522);
    }
  );
} else {
  // Si géoloc pas supportée, centrer sur Paris
  initMap(48.8566, 2.3522);
}

/**
 * Crée une icône de profil ronde (L.divIcon)
 * @param {object} userProfile - L'objet utilisateur (de /users/)
 */
function createProfileIcon(userProfile) {
    if (!userProfile) { // Sécurité si le profil est manquant
        userProfile = {}; 
    }
    
    // VOTRE IDÉE : On utilise l'icône choisie, SINON la photo Google
    const photoToUse = userProfile.chosen_icon || userProfile.photoURL || null;

    const proxyImageURL = photoToUse ?
        `https://images.weserv.nl/?url=${encodeURIComponent(photoToUse)}&w=40&h=40&t=circle` :
        './icons_map/default-avatar.png'; // Un avatar par défaut

    const iconHTML = `
        <div class="profile-marker-container">
            <img src="${proxyImageURL}" class="profile-marker-image" onerror="this.src='./icons_map/default-avatar.png'">
        </div>
    `;

    return L.divIcon({
        className: 'profile-marker', // Classe CSS pour le conteneur global
        html: iconHTML,
        iconSize: [36, 36], // Taille de l'icône
        iconAnchor: [18, 18], // Point d'ancrage (centre)
        popupAnchor: [0, -20] // Point d'où le popup sort
    });
}


function loadMarkers() {
    const currentUserId = window.auth.currentUser.uid;
    const isAdmin = (currentUserId === ADMIN_UID);
    let allowedIds = [currentUserId];
    
    // On réinitialise les données
    userProfileMap = {}; 
    let markerDataMap = {};

    // --- ÉTAPE 1: On lance DEUX requêtes en parallèle ---
    // 1. Récupérer les amis
    const friendsPromise = get(ref(db, `friendships/${currentUserId}`)).then((friendsSnapshot) => {
        if (friendsSnapshot.exists()) {
            const relations = friendsSnapshot.val();
            for (const friendId in relations) {
                if (relations[friendId] === "friends") {
                    allowedIds.push(friendId);
                }
            }
        }
        console.log("Amis autorisés:", allowedIds);
        return true; // La promesse est résolue
    });

    // 2. Récupérer TOUS les utilisateurs (pour avoir noms, photos, et icônes choisies)
    const usersPromise = get(ref(db, 'users')).then((usersSnapshot) => {
        if (usersSnapshot.exists()) {
            userProfileMap = usersSnapshot.val(); // On stocke TOUS les profils
        }
        console.log("Carte des profils utilisateur chargée.");
        return true; // La promesse est résolue
    });

    // --- ÉTAPE 2: Quand on a les amis ET les profils, on charge les marqueurs ---
    Promise.all([friendsPromise, usersPromise]).then(() => {
        
        const markersRef = ref(db, 'markers');
        return get(markersRef); 

    }).then((markersSnapshot) => {
        // --- ÉTAPE 3: On a les marqueurs. On nettoie la carte ---
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        if (!markersSnapshot.exists()) return;
        
        // --- ÉTAPE 4: On filtre les marqueurs et on prépare les commentaires ---
        const markers = markersSnapshot.val();
        let commentPromises = []; 

        for (const key in markers) {
            if (markers.hasOwnProperty(key)) {
                const markerData = markers[key];
                
                // Si vous êtes Admin OU si le créateur est dans vos amis
                if (isAdmin || allowedIds.includes(markerData.creator_id)) {
                    
                    markerDataMap[key] = markerData;
                    
                    // On prépare la promesse de charger les commentaires
                    const commentsRef = ref(db, `comments/${key}`);
                    commentPromises.push(
                        get(commentsRef).then(commentSnapshot => {
                            return { markerKey: key, comments: commentSnapshot.val() || {} };
                        })
                    );
                }
            }
        }
        
        // On lance toutes les promesses de commentaires
        return Promise.all(commentPromises);

    }).then((commentResults) => {
        // --- ÉTAPE 5: On a les commentaires, on attache tout ---
        commentResults.forEach(result => {
            if (markerDataMap[result.markerKey]) {
                markerDataMap[result.markerKey].allComments = result.comments;
            }
        });

        // --- ÉTAPE 6: On affiche les marqueurs ---
        for (const key in markerDataMap) {
            const markerData = markerDataMap[key];
            const allComments = markerData.allComments || {};
            
            // On va chercher le profil "à jour" du créateur
            const creatorProfile = userProfileMap[markerData.creator_id];
            
            // Sécurité : si le créateur d'un marqueur a été supprimé
            if (!creatorProfile) {
                console.warn(`Marqueur ${key} ignoré car le créateur ${markerData.creator_id} n'existe pas dans /users/`);
                continue; 
            }
            
            // On génère le contenu HTML avec les données À JOUR
            const finalPopupContent = getPopupContent(markerData, creatorProfile, key, allComments);
            
            // On génère l'icône avec les données À JOUR
            const markerIcon = createProfileIcon(creatorProfile);
            
            const position = markerData.position;
            const marker = L.marker(position, { icon: markerIcon }).addTo(map);
            marker.options.key = key;
            marker.bindPopup(finalPopupContent);
        }

    }).catch((error) => {
        console.error("Erreur majeure lors du chargement :", error);
    });
}

/**
 * Construit le HTML du popup en utilisant les données brutes
 * @param {object} markerData - Les données du marqueur (/markers/)
 * @param {object} userData - Les données À JOUR du créateur (/users/)
 * @param {string} key - L'ID du marqueur
 * @param {object} allComments - Les commentaires (/comments/)
 */
// REMPLACEZ getPopupContent (Version finale et propre)
function getPopupContent(markerData, userData, key, allComments) {
    const currentUserId = window.auth.currentUser.uid;
    const isAdmin = (currentUserId === ADMIN_UID);
    const isCreator = (currentUserId === markerData.creator_id);

    // --- 1. Cartes de conversion (identique) ---
    const listpopup_map = {
        "doggy-style": '<img src="icons_map/dog.png" alt="Doggy style" />',
        "lazy-doggy-style": '<img src="icons_map/anal.png" alt="Lazy doggy" />',
        "standing-doggy-style": '<img src="icons_map/doggy.png" alt="Standing doggy" />',
        "missionary": '<img src="icons_map/sex-2.png" alt="Missionary" />',
        "cowgirl": '<img src="icons_map/cowgirl.png" alt="Cowgirl" />',
        "cunnilingus": '<img src="icons_map/licking.png" alt="Cunnilingus" />',
        "blowjob": '<img src="icons_map/oral-sex-2.png" alt="Blowjob" />',
        "lazy-blowjob": '<img src="icons_map/oral-sex.png" alt="Lazy blowjob" />',
        "upstanding-citizen": '<img src="icons_map/front.png" alt="Upstanding" />',
        "reversed-cowgirl": '<img src="icons_map/back.png" alt="Reversed cowgirl" />',
        "leapfrog": '<img src="icons_map/back (1).png" alt="Leapfrog" />',
        "69": '<img src="icons_map/man.png" alt="69" />',
        "lotus": '<img src="icons_map/sex.png" alt="Lotus" />',
        "others": '<img src="icons_map/autre.png" alt="Others" />'
    };
    const note_map = {
        "1": "🤮", "2": "🫥", "3": "🥱", "4": "🙃", "5": "😏",
        "6": "😋", "7": "🥴", "8": "😍", "9": "😈", "10": "🥵", "none": "❌"
    };

    // --- 2. HTML des positions (identique) ---
    let popuptexte = '';
    if (markerData.positions && Array.isArray(markerData.positions)) {
        markerData.positions.forEach(pos_id => {
            if (listpopup_map[pos_id]) popuptexte += listpopup_map[pos_id];
        });
    }
    
    // --- 3. Note (identique) ---
    const note_num = markerData.note || "none";
    const note_emoji = note_map[note_num.toString()] || "❌";

    // --- 4. HTML des commentaires (uniquement depuis /comments/) ---
    let commentsHTML = ''; 
    for (const commentKey in allComments) {
        const comment = allComments[commentKey];
        
        const proxyImageURL = comment.authorPhoto ?
            `https://images.weserv.nl/?url=${encodeURIComponent(comment.authorPhoto)}&w=100&h=100&t=circle` :
            'icons_map/default-avatar.png';
        
        const adminDeleteButton = isAdmin ? 
            `<button class="comment-delete-button" title="Supprimer ce commentaire (Admin)" onclick="removeComment('${key}', '${commentKey}')">
                <img src="./icons_map/delete.png" alt="Supprimer" style="width: 12px; height: 12px; vertical-align: middle;">
            </button>` : '';

        // Le HTML de votre style de commentaire (corrigé)
        commentsHTML += `
        <div class="custom-comment-container" style="
            margin-top: 15px; padding: 10px; border: 1px solid #ddd;
            border-radius: 5px; background-color: #f9f9f9; display: flex;
            width: calc(100% - 20px); position: relative;
        ">
            ${adminDeleteButton}
            <div style="flex: 0 0 60px; margin-right: 10px; display: flex; flex-direction: column; align-items: center;">
                <img src="${proxyImageURL}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #4285F4; margin-bottom: 5px;"
                     onerror="this.src='icons_map/default-avatar.png'">
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: bold; color: #4285F4; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 14px;">
                    ${comment.authorName}
                </div>
                <div style="font-size: 13px; color: #333; word-break: break-word;">
                    ${comment.text}
                </div>
            </div>
        </div>
        `;
    }

    // --- 5. LOGIQUE HYBRIDE (old_comments) SUPPRIMÉE ---
    
    // --- 6. On assemble le contenu principal ---
    const mainPopupContent = `
        <p class="header_popup">L'heureux·se élu·e</p>
        <p class="popup-data-box">${userData.displayName || '???'}</p>
        
        <p class="header_popup">Partenaire·s</p>
        <p class="popup-data-box">${markerData.partenaires || ''}</p>
        
        <p class="header_popup">Date</p>
        <p class="popup-data-box">${markerData.date || ''}</p>
        
        <p class="header_popup">Lieu</p>
        <p class="popup-data-box">${markerData.lieu || ''}</p>
        
        <p class="header_popup">Les positions</p>
        <div class="popup-images">${popuptexte}</div>
        
        <p class="header_popup">Note</p>
        <div class="popup-data-box" id="note-box-stacked">
            <span class="note-emoji-stacked">${note_emoji}</span>
            <span class="note-number-stacked">${note_num}/10</span>
        </div>
        
        <p class="header_popup">Les commentaires (du créateur)</p>
        <p class="popup-data-box">${markerData.commentaires || ''}</p>
        
        <p class="header_popup">Section commentaire</p>
        ${commentsHTML} `;
    
    // --- 7. On ajoute les boutons d'action (identique) ---
    const iconEdit = './icons_map/edit.png';
    const iconDelete = './icons_map/delete.png';
    const iconComment = './icons_map/comment.png';

    return `
    <div>
        ${mainPopupContent}
        <div class="popup-actions-container">
            ${(isCreator || isAdmin) ? `
                <button class="popup-action-button" onclick="modifyMarker('${key}')" title="Modifier">
                    <img src="${iconEdit}" alt="Modifier" />
                </button>
                <button class="popup-action-button" onclick="removeMarker('${key}')" title="Supprimer">
                    <img src="${iconDelete}" alt="Supprimer" />
                </button>
            ` : ''}
            <button class="popup-action-button" onclick="showCommentPopup('${key}')" title="Ajouter un commentaire">
                <img src="${iconComment}" alt="Commenter" />
            </button>
        </div>
    </div>
    `;
}

function saveMarker(position, partenaires, date, lieu, positions, note_num, commentaires, creator) {
    const markersRef = ref(db, 'markers');
    const newMarkerRef = push(markersRef);
    
    // Le marqueur ne contient QUE les données de l'événement
    const markerData = {
        position: [position.lat, position.lng],
        partenaires: partenaires,
        date: date,
        lieu: lieu,
        positions: positions,
        note: note_num,
        commentaires: commentaires, // Le commentaire principal
        creator_id: creator // Le SEUL lien vers l'utilisateur
        
        // 'name', 'creator_photo', 'icon', 'popupContent' sont partis
    };

    // On sauvegarde et on renvoie une promesse avec les données
    return set(newMarkerRef, markerData).then(() => {
        return { key: newMarkerRef.key, data: markerData };
    });
}

// Supprimer un marqueur de la base de données
function removeMarker(key) {
    const markerRef = ref(db, `markers/${key}`);

    // On empeche de supprimer les markers qui ne sont pas les siens.
    get(markerRef).then((snapshot) => {
        const markerData = snapshot.val();
        if (!markerData) {
            console.error("Aucune donnée trouvée pour ce marqueur.");
            return;
        }

        const currentUserId = window.auth.currentUser.uid;
        const isAdmin = (currentUserId === ADMIN_UID);
        const isCreator = (currentUserId === markerData.creator_id);

        // On empeche n'importe qui de modifier les markers des autres
        if(!isAdmin && !isCreator){
            alert("Vous essayez de supprimer un marker que vous n'avez pas créé et ce n'est pas autorisé")
            return;
        }
        
        // On supprime s'il n'y a aucun soucis
        remove(markerRef)
            .then(() => {
                console.log("Marqueur supprimé avec succès !");
                // Recharger les marqueurs pour mettre à jour la carte
                map.eachLayer(function(layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });
                loadMarkers();
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression du marqueur :", error);
            });

    }).catch((error) => {
        console.error("Erreur lors de la récupération des données du marqueur :", error);
    });
    
}



function modifyMarker(key) {
    const markerRef = ref(db, `markers/${key}`);
    const commentsRef = ref(db, `comments/${key}`);

    let markerData; 

    // 1. On charge les données du MARQUEUR
    get(markerRef).then((markerSnapshot) => {
        if (!markerSnapshot.exists()) throw new Error("Marqueur non trouvé");
        markerData = markerSnapshot.val(); 

        // 2. On vérifie les permissions
        const currentUserId = window.auth.currentUser.uid;
        const isAdmin = (currentUserId === ADMIN_UID);
        const isCreator = (currentUserId === markerData.creator_id);
        if (!isCreator && !isAdmin) throw new Error("Permission refusée");

        // 3. ON VA CHERCHER LE PROFIL DU CRÉATEUR (depuis la map globale)
        const creatorProfile = userProfileMap[markerData.creator_id];
        if (!creatorProfile) throw new Error("Profil créateur non trouvé.");

        // 4. Mémoriser le créateur (pour la "gaffe" admin)
        window.currentEditingOriginalCreator = {
            uid: markerData.creator_id,
            name: creatorProfile.displayName, 
            photo: creatorProfile.chosen_icon || creatorProfile.photoURL
        };

        // 5. On pré-remplit le formulaire
        document.getElementById("creator-name-display").innerText = creatorProfile.displayName || ""; 
        document.getElementById("partenaire").value = markerData.partenaires || "";
        document.getElementById("date").value = markerData.date || new Date().toISOString().slice(0, 10);
        document.getElementById("lieu").value = markerData.lieu || "";
        document.getElementById("commentaires").value = markerData.commentaires || ""; 

        const positions = markerData.positions || [];
        document.querySelectorAll("#positions input[type=checkbox]").forEach(checkbox => {
            checkbox.checked = positions.includes(checkbox.id);
        });
        const note = markerData.note;
        if (note) {
            document.querySelector(`input[name="rating"][value="${note}"]`).checked = true;
        }

        // 6. On affiche le popup de modification
        document.getElementById("informations").classList.add("active");
        document.getElementById("overlay").classList.add("show");
        document.querySelector('#map').style.pointerEvents = 'none';

        // 7. On stocke la clé
        window.currentEditingKey = key;

        // --- VEUILLEZ AJOUTER CETTE LIGNE ---
        showFormPage(1); // Réinitialise le formulaire à la première page
        // ---------------------------------

        // 8. On charge les COMMENTAIRES (pour l'affichage du tempMarker)
        return get(commentsRef); 

    }).then((commentsSnapshot) => {
        // 9. On a tout : markerData, comments, et le profil
        const allComments = commentsSnapshot.val() || {};
        const position = markerData.position;
        const creatorProfile = userProfileMap[markerData.creator_id];

        // 10. On génère le VRAI contenu HTML
        const finalPopupContent = getPopupContent(markerData, creatorProfile, key, allComments);
        
        // 11. On génère la VRAIE icône
        const finalIcon = createProfileIcon(creatorProfile);

        // 12. On crée le tempMarker avec le VRAI contenu
        window.tempMarker = L.marker(position, { icon: finalIcon }).addTo(map)
            .bindPopup(finalPopupContent) 
            .openPopup();

    }).catch((error) => {
        console.error("Erreur lors de la préparation de la modification :", error.message);
        if (error.message === "Permission refusée") {
            alert("Vous essayez de modifier un marker que vous n'avez pas créé et ce n'est pas autorisé");
        }
        // On réinitialise au cas où
        window.currentEditingOriginalCreator = null;
        window.currentEditingKey = null;
    });
}


function showCommentPopup(key){
        document.getElementById("overlay").classList.add("show");
        document.getElementById("comments").classList.add("active");
        document.getElementById("pseudo").innerText = window.auth.currentUser.displayName;
        document.getElementById("key").innerHTML = key;
}


function getPositions(){
    var L = []
    var all = document.getElementById("positions").children
    // Assurez-vous de déclarer 'i'
    for(var i = 0; i < all.length; i++){
        if(all[i].children[0].checked){
            L.push(all[i].children[0].id)
        }
    }
    return L; // Ne renvoie QUE l'array
}


// Fonction pour récupérer la note sélectionnée
function getSelectedRating() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    if (selectedRating) {
        // Trouver le label associé à l'input radio sélectionné
        const label = document.querySelector(`label[for="${selectedRating.id}"]`);
        return label ? [label.textContent,selectedRating.value] : null;
    }
    return null;
}

var customIcon = L.icon({
    iconUrl: '../icons_map/boutique-de-sexe-black.png',
    iconSize:     [32, 32], // taille de l'icône
    iconAnchor: [16, 16], // point de l'icône qui correspondra à la position du marqueur
    popupAnchor: [0, -16] // point à partir duquel le popup devrait s'ouvrir relativement à l'iconAnchor
});
// Variable pour stocker le marqueur temporaire
var tempMarker = null;


function onMapClick(e) {
    
    document.getElementById("informations").classList.add("active");
    document.getElementById("overlay").classList.add("show");
    document.querySelector('#map').style.pointerEvents = 'none';
    const inputDate = document.getElementById('date');
    inputDate.value = new Date().toISOString().slice(0, 10);

    document.getElementById("creator-name-display").innerText = window.auth.currentUser.displayName;

    var popupContent = `
    <div>
        <p>Vous etes en train de creer un marker !</p>
        <div class="popup-images">
            
        </div>
    </div>
    `;

    // Créer un nouveau marqueur temporaire
    tempMarker = L.marker(e.latlng, { icon: customIcon }).addTo(map)
        .bindPopup(popupContent)
        .openPopup();

    showFormPage(1); // Réinitialise le formulaire à la première page
}

map.on('click', onMapClick);



function pop_up_close(){
    document.getElementById("informations").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';

    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }

    // Réinitialisation
    window.currentEditingOriginalCreator = null; 
    window.currentEditingKey = null;

    // (Réinitialise le formulaire à la page 1 pour la prochaine ouverture)
    setTimeout(() => showFormPage(1), 200); // 200ms pour laisser l'animation de fermeture se faire
}

function pop_up_close_comments(){
    document.getElementById("comments").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    ocument.querySelector('#map').style.pointerEvents = 'auto';
}


function reloadMapAndClosePopup() {
    pop_up_close(); // S'assure que tout est réinitialisé

    // Recharger la carte
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    loadMarkers();
}


function yes(){
    document.getElementById("informations").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';

    // --- 1. Récupération des données ---
    const currentUser = window.auth.currentUser;
    const position = tempMarker.getLatLng();
    const partenaires = document.getElementById("partenaire").value;
    const lieu = document.getElementById("lieu").value;
    const date = document.getElementById("date").value;
    const notes = getSelectedRating();
    const note_num = notes[1];
    const commentaires = document.getElementById("commentaires").value;
    const creator = currentUser.uid;
    const positions = getPositions();

    // --- 2. On prépare les données du marqueur (SANS nom, SANS photo) ---
    const markerDataToSave = {
        position: [position.lat, position.lng],
        partenaires: partenaires,
        date: date,
        lieu: lieu,
        positions: positions,
        note: note_num,
        commentaires: commentaires,
        creator_id: creator
    };

    // --- 3. Logique de sauvegarde ---
    if (window.currentEditingKey) {
        // Mode modification
        const markerRef = ref(db, `markers/${window.currentEditingKey}`);
        
        let finalData = markerDataToSave;
        const isAdmin = (currentUser.uid === ADMIN_UID);
        
        if (isAdmin && window.currentEditingOriginalCreator && window.currentEditingOriginalCreator.uid !== currentUser.uid) {
            // "Gaffe" admin : on préserve le créateur original
            finalData.creator_id = window.currentEditingOriginalCreator.uid;
        }

        set(markerRef, finalData).then(() => {
            console.log("Marqueur mis à jour avec succès !");
            reloadMapAndClosePopup();
        });

    } else {
        // Mode création
        saveMarker(position, partenaires, date, lieu, positions, note_num, commentaires, creator)
        .then((result) => { // result contient { key, data }
            // On met à jour le tempMarker AVANT de le fermer
            const userProfile = userProfileMap[currentUser.uid]; // On le lit de la map globale
            const popupHTML = getPopupContent(result.data, userProfile, result.key, {});
            const markerIcon = createProfileIcon(userProfile); 
            
            tempMarker.setIcon(markerIcon);
            tempMarker.getPopup().setContent(popupHTML);
            
            reloadMapAndClosePopup(); // Appelle la fonction helper
        });
    }

    // On vide la mémoire d'édition (déplacé de pop_up_close)
    window.currentEditingOriginalCreator = null;
    window.currentEditingKey = null;
}


function yes_comments(){
    document.getElementById("comments").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';

    // 1. Récupérer les informations
    var key = document.getElementById("key").innerHTML; // Clé du marqueur
    var pseudo = window.auth.currentUser.displayName;
    var photo = window.auth.currentUser.photoURL;
    var texte = document.getElementById("comment_box").value;
    var creator_uid = window.auth.currentUser.uid;

    // 2. NOUVELLE LOGIQUE: On crée une référence vers le nouveau dossier 'comments'
    // (ex: /comments/-Ma_Marker_Key/)
    const commentsRef = ref(db, `comments/${key}`);
    
    // 3. On "push" pour générer une clé unique pour le nouveau commentaire
    // (ex: /comments/-Ma_Marker_Key/-Ma_Comment_Key)
    const newCommentRef = push(commentsRef); 

    // 4. On sauvegarde les données du commentaire
    set(newCommentRef, {
        authorName: pseudo,
        authorPhoto: photo,
        text: texte,
        authorUid: creator_uid,
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("Commentaire ajouté avec succès dans /comments/ !");
        
        // 5. On recharge la carte
        // (on n'a pas besoin de vider la carte, loadMarkers() le fait déjà)
        loadMarkers();
    }).catch((error) => {
        console.error("Erreur lors de l'ajout du commentaire :", error);
    });
}


// Fonction de connexion avec Google
function loginWithGoogle() {
    window.signInWithPopup(window.auth, window.provider)
        .then( async (result) => {
            // Connexion réussie
            const firebaseUser = result.user;
            const additionalInfo = window.getAdditionalUserInfo(result);
            const googleProfile = additionalInfo.profile;

            // On compare le nom en cache de Firebase avec le nom frais de Google
            if (firebaseUser.photoURL !== googleProfile.picture) {
                
                console.warn("Mise à jour de la photo de profil (Firebase Auth)...");
                console.log("La photo Google a changé, on la synchronise.");

                // On force la mise à jour de la photo dans Firebase AUTHENTICATION
                // On NE TOUCHE PAS au displayName, pour préserver le pseudo !
                await window.updateProfile(firebaseUser, {
                    photoURL: googleProfile.picture 
                });
                
                console.log("Photo de profil (Auth) mise à jour.");
            }

            // Si les noms sont déjà identiques, on ferme simplement le popup
            login_pop_up_close();
        })
        .catch((error) => {
            if (error.code === 'auth/admin-restricted-operation') {
                console.warn("Tentative de connexion bloquée (admin-restricted-operation) :", error.customData.email);
                alert("Accès refusé. Votre compte n'est pas autorisé pour cette application. Veuillez contacter l'administrateur pour obtenir un accès.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log("Connexion annulée par l'utilisateur.");
            } else {
                console.error("Erreur de connexion inconnue :", error);
                alert("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
            }
        });
}

// Fonction de déconnexion
function logout() {
    window.signOut(window.auth)
        .then(() => {
            // Rafraîchir la page après une déconnexion réussie
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erreur de déconnexion :", error);
        });
}

// Afficher le popup de connexion
function show_login_popup() {
    document.getElementById("login-popup").classList.add("active");
    document.getElementById("overlay").classList.add("show");
    document.querySelector('#map').style.pointerEvents = 'none';
}

// Fermer le popup (fonction existante, déjà définie dans ton code)
function login_pop_up_close() {
    document.getElementById("login-popup").classList.remove("active");
    document.getElementById("overlay").classList.remove("show");
    document.querySelector('#map').style.pointerEvents = 'auto';
}

// Mettre à jour l'UI en fonction de l'état de connexion
function updateUI(user) {
    if (user) {
        // --- 1. L'UTILISATEUR EST CONNECTÉ ---
        
        // On cible le profil de l'utilisateur dans /users/
        const userRef = ref(db, `users/${user.uid}`);

        // On lance la première promesse : lire le profil
        get(userRef).then((userSnapshot) => {

            if (userSnapshot.exists()) {
                // --- 2. UTILISATEUR CONNU (Login normal) ---
                console.log("Utilisateur connu, synchronisation de la photoURL...");
                
                // On lance la deuxième promesse : mettre à jour la photo
                update(userRef, {
                    photoURL: user.photoURL
                }).then(() => {
                    // Une fois la mise à jour terminée, on charge l'app
                    loadApp(user);
                }); // (on pourrait ajouter un .catch ici si on voulait)

            } else {
                // --- 3. NOUVEL UTILISATEUR ! (Premier login) ---
                console.log("Nouvel utilisateur ! Création du profil...");
                
                const firstName = user.displayName.split(' ')[0] || "Nouvel utilisateur";
                
                const userData = {
                    displayName: firstName,
                    displayName_lowercase: firstName.toLowerCase(),
                    email: user.email,
                    photoURL: user.photoURL,
                    chosen_color: "google" // Valeur par défaut
                };
                
                // On lance la deuxième promesse : créer l'utilisateur
                set(userRef, userData).then(() => {
                    // Une fois la création terminée, on charge l'app
                    loadApp(user);
                }); // (on pourrait ajouter un .catch ici)
            }

        }).catch((error) => {
            // Ce .catch() gère les erreurs de LECTURE (get)
            console.error("Erreur lors de la lecture du profil utilisateur :", error);
        });
        
    } else {
        // --- 4. L'UTILISATEUR EST DÉCONNECTÉ ---
        document.getElementById('map').setAttribute('disabled', 'true');
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('friends-button').style.display = 'none';
        if (document.getElementById('profile-button')) {
             document.getElementById('profile-button').style.display = 'none';
        }
        show_login_popup(); 
    }
}


/**
 * Active l'interface utilisateur et charge les marqueurs.
 * Appelé SEULEMENT après que updateUI ait vérifié/créé le profil.
 */
function loadApp(user) {
    // 1. Activation de l'interface
    document.getElementById('map').removeAttribute('disabled');
    document.getElementById('logout-button').style.display = 'flex';
    document.getElementById('friends-button').style.display = 'flex';
    document.getElementById('profile-button').style.display = 'flex';
    
    // 2. Chargement de la carte
    loadMarkers();

    updateFriendRequestCount();
}


// Écouteur pour le bouton de connexion Google
document.getElementById('google-login-button').addEventListener('click', loginWithGoogle);
// Écouteur pour le bouton de déconnexion
document.getElementById('logout-button').addEventListener('click', logout);

document.addEventListener('DOMContentLoaded', function() {
    // Désactiver la carte par défaut
    document.getElementById('map').setAttribute('disabled', 'true');

    
    window.onAuthStateChanged(window.auth, (user) => {
        updateUI(user);
    });
    
    if (!window.friendsListenerAdded) {
        document.getElementById('friends-button').addEventListener('click', show_friends_popup);
        document.getElementById('user-search-button').addEventListener('click', searchUsers);
        window.friendsListenerAdded = true; // Pour éviter les doublons
    }

    if (document.getElementById('profile-button')) {
        document.getElementById('profile-button').addEventListener('click', openProfilePopup);
    }
    
    // Ajouter le gestionnaire d'événement pour le bouton de localisation
    document.getElementById('locate-button').addEventListener('click', function() {
        map.locate({setView: true, maxZoom: 16});
    });
    // Écouter l'événement de géolocalisation réussie
    function onLocationFound(e) {
        // Supprimer les anciens cercles de localisation s'ils existent
        if (typeof locationCircle !== 'undefined') {
            map.removeLayer(locationCircle);
        }

        var radius = e.accuracy / 2;

        locationCircle = L.circle(e.latlng, radius, {
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.25
        }).addTo(map);

        // Optionnel: ajouter un marqueur pour indiquer précisément la position
        if (typeof locationMarker !== 'undefined') {
            map.removeLayer(locationMarker);
        }

        locationMarker = L.circleMarker(e.latlng, {
            radius: 5,
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 1
        }).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    // Écouter l'événement d'erreur de géolocalisation
    function onLocationError(e) {
        alert("Impossible de vous localiser : " + e.message);
        map.setView([48.8566, 2.3522], 13); // Centre de Paris
    }

    map.on('locationerror', onLocationError);

    map.on('popupopen', function(e) {
        // 1. On récupère la coordonnée du marqueur
        var latLng = e.popup.getLatLng();
        // On convertit en "pixels"
        var px = map.project(latLng);

        // On "triche" en déplaçant le point de centrage de 150px vers le BAS
        // (sur un écran, "bas" = Y positif)
        // Cela forcera la carte à glisser vers le HAUT,
        // laissant de la place pour le volet qui s'ouvre d'en bas.
        
        
        // 2. ON VÉRIFIE LA TAILLE DE L'ÉCRAN
        if (window.innerWidth <= 600) {
            // --- CAS MOBILE (Volet inférieur) ---
            px.y += 200; // Tu peux ajuster 150
            
        } else {
            // --- CAS ORDINATEUR (Popup centré) ---
            // On fait un centrage simple, sans décalage.
            px.y -= 400;
        }
        var newCenter = map.unproject(px);
        map.panTo(newCenter);
    });

    
});



// Gerer l'amitié :

// --- Fonctions principales du Popup ---

function show_friends_popup() {
    document.getElementById("friends-popup").classList.add("active");
    document.getElementById("overlay").classList.add("show");
    document.querySelector('#map').style.pointerEvents = 'none';
    
    // Charger les deux listes à l'ouverture
    loadCurrentFriends();
    loadPendingRequests();
    
    // Vider la recherche
    document.getElementById("user-search-results").innerHTML = "";
    document.getElementById("user-search-input").value = "";
}

function friends_pop_up_close() {
    document.getElementById("friends-popup").classList.remove("active");
    document.getElementById("overlay").classList.remove("show");
    document.querySelector('#map').style.pointerEvents = 'auto';
    
    // Recharger les marqueurs sur la carte
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    loadMarkers(); // (Cette fonction sera mise à jour à l'Étape 4)
}


async function searchUsers() {
    const searchInput = document.getElementById("user-search-input").value.toLowerCase();
    const resultsContainer = document.getElementById("user-search-results");
    resultsContainer.innerHTML = "<i>Recherche...</i>";

    if (searchInput.length < 3) {
        resultsContainer.innerHTML = "<i>Veuillez entrer au moins 3 caractères.</i>";
        return;
    }

    const currentUserId = window.auth.currentUser.uid;
    const usersRef = ref(db, 'users');
    const userQuery = query(usersRef, 
        orderByChild('displayName_lowercase'), 
        startAt(searchInput), 
        endAt(searchInput + '\uf8ff')
    );

    const snapshot = await get(userQuery);
    if (!snapshot.exists()) {
        resultsContainer.innerHTML = "<i>Aucun utilisateur trouvé.</i>";
        return;
    }

    const usersData = snapshot.val();
    const friendshipRef = ref(db, `friendships/${currentUserId}`);
    const relationsSnapshot = await get(friendshipRef);
    const relations = relationsSnapshot.exists() ? relationsSnapshot.val() : {};

    let htmlToRender = []; 

    for (const userId in usersData) {
        if (userId === currentUserId) continue; 
        
        const userData = usersData[userId];
        const relationStatus = relations[userId];

        // --- AJOUT : On récupère la photo ---
        const photoURL = userData.photoURL || './icons_map/default-avatar.png';
        const imageHTML = `<img src="${photoURL}" class="result-avatar" onerror="this.src='./icons_map/default-avatar.png'">`;
        // --- FIN AJOUT ---

        let buttonHTML = "";
        if (relationStatus === "friends") {
            buttonHTML = `<button disabled>Amis</button>`;
        } else if (relationStatus === "sent") {
            buttonHTML = `<button disabled>Demande envoyée</button>`;
        } else if (relationStatus === "pending") {
            buttonHTML = `<button class="accept" onclick="acceptFriendRequest('${userId}', '${userData.displayName}')">Accepter</button>`;
        } else {
            buttonHTML = `<button onclick="sendFriendRequest('${userId}', '${userData.displayName}')">Ajouter</button>`;
        }

        // --- MODIFICATION : On ajoute l'image et une div ---
        htmlToRender.push(`
            <div class="user-result">
                <div class="user-result-identity">
                    ${imageHTML}
                    <span>${userData.displayName}</span>
                </div>
                ${buttonHTML}
            </div>
        `);
    }

    if (htmlToRender.length > 0) {
        resultsContainer.innerHTML = htmlToRender.join('');
    } else {
        resultsContainer.innerHTML = "<i>Aucun autre utilisateur trouvé.</i>";
    }
}

async function sendFriendRequest(friendId, friendName) {
    const currentUserId = window.auth.currentUser.uid;

    // Statut "sent" (envoyé) pour l'expéditeur
    const userRef = ref(db, `friendships/${currentUserId}/${friendId}`);
    await set(userRef, "sent");

    // Statut "pending" (en attente) pour le destinataire
    const friendRef = ref(db, `friendships/${friendId}/${currentUserId}`);
    await set(friendRef, "pending");

    alert(`Demande d'ami envoyée à ${friendName} !`);
    searchUsers(); // Rafraîchir les résultats de recherche
}

async function acceptFriendRequest(friendId, friendName) {
    const currentUserId = window.auth.currentUser.uid;

    // Les deux deviennent "friends"
    const userRef = ref(db, `friendships/${currentUserId}/${friendId}`);
    await set(userRef, "friends");

    const friendRef = ref(db, `friendships/${friendId}/${currentUserId}`);
    await set(friendRef, "friends");

    alert(`Vous êtes maintenant ami avec ${friendName} !`);
    
    // Rafraîchir les deux listes dans le popup
    loadCurrentFriends();
    loadPendingRequests();
    searchUsers(); // Rafraîchir aussi la recherche si elle est ouverte

    updateFriendRequestCount();
}

async function declineFriendRequest(friendId, friendName) {
    if (!confirm(`Voulez-vous vraiment refuser la demande de ${friendName} ?`)) return;

    const currentUserId = window.auth.currentUser.uid;

    // On supprime les entrées des deux côtés
    const userRef = ref(db, `friendships/${currentUserId}/${friendId}`);
    await remove(userRef);

    const friendRef = ref(db, `friendships/${friendId}/${currentUserId}`);
    await remove(friendRef);

    alert(`Demande de ${friendName} refusée.`);
    loadPendingRequests(); // Rafraîchir la liste des demandes

    updateFriendRequestCount();
}

async function removeFriend(friendId, friendName) {
    if (!confirm(`Voulez-vous vraiment retirer ${friendName} de vos amis ?`)) return;

    const currentUserId = window.auth.currentUser.uid;

    // On supprime les entrées des deux côtés
    const userRef = ref(db, `friendships/${currentUserId}/${friendId}`);
    await remove(userRef);

    const friendRef = ref(db, `friendships/${friendId}/${currentUserId}`);
    await remove(friendRef);

    alert(`${friendName} a été retiré(e) de vos amis.`);
    loadCurrentFriends(); // Rafraîchir la liste d'amis
}

/**
 * Compte les demandes d'amis en attente et met à jour le badge.
 */
function updateFriendRequestCount() {
    // Sécurité : ne rien faire si on n'est pas connecté
    if (!window.auth || !window.auth.currentUser) {
        return;
    }
    
    const currentUserId = window.auth.currentUser.uid;
    const badge = document.getElementById('friend-request-badge');
    
    const friendsRef = ref(db, `friendships/${currentUserId}`);

    get(friendsRef).then((snapshot) => {
        let pendingCount = 0;
        
        if (snapshot.exists()) {
            const relations = snapshot.val();
            // On compte combien de relations sont "pending"
            for (const friendId in relations) {
                if (relations[friendId] === "pending") {
                    pendingCount++;
                }
            }
        }
        
        // On met à jour le badge
        if (pendingCount > 0) {
            badge.innerText = pendingCount;
            badge.style.display = 'flex'; // On le montre
        } else {
            badge.style.display = 'none'; // On le cache
        }
        
    }).catch(error => {
        console.error("Erreur lors de la mise à jour du compteur d'amis :", error);
        badge.style.display = 'none'; // Cacher en cas d'erreur
    });
}


// --- Fonctions d'affichage des listes ---

async function loadCurrentFriends() {
    const currentUserId = window.auth.currentUser.uid;
    const listContainer = document.getElementById("current-friends-list");
    listContainer.innerHTML = "<i>Chargement...</i>";

    try {
        const friendsRef = ref(db, `friendships/${currentUserId}`);
        const snapshot = await get(friendsRef);

        if (!snapshot.exists()) {
            listContainer.innerHTML = "<i>Vous n'avez pas encore d'amis.</i>";
            return;
        }
        
        const relations = snapshot.val();
        const promises = [];
        let friendCount = 0;

        for (const friendId in relations) {
            if (relations[friendId] === "friends") {
                friendCount++;
                promises.push(
                    get(ref(db, `users/${friendId}`)).then(userSnapshot => {
                        let friendName = "Utilisateur inconnu";
                        let photoURL = './icons_map/default-avatar.png'; // Défaut

                        if (userSnapshot.exists()) {
                            friendName = userSnapshot.val().displayName;
                            photoURL = userSnapshot.val().photoURL || './icons_map/default-avatar.png';
                        }
                        
                        // --- MODIFICATION : Template HTML mis à jour ---
                        return `
                            <div class="friend-item">
                                <div class="user-result-identity">
                                    <img src="${photoURL}" class="result-avatar" onerror="this.src='./icons_map/default-avatar.png'">
                                    <span>${friendName}</span>
                                </div>
                                <button onclick="removeFriend('${friendId}', '${friendName}')">Retirer</button>
                            </div>
                        `;
                    }).catch(err => {
                        console.error(`Erreur au chargement de l'ami ${friendId}:`, err);
                        return ''; 
                    })
                );
            }
        }

        if (friendCount === 0) {
            listContainer.innerHTML = "<i>Vous n'avez pas encore d'amis.</i>";
            return;
        }

        const friendsHTMLArray = await Promise.all(promises);
        listContainer.innerHTML = friendsHTMLArray.join('');

    } catch (error) {
        console.error("Erreur majeure dans loadCurrentFriends :", error);
        listContainer.innerHTML = "<i style='color: red;'>Erreur de chargement. Vérifiez la console.</i>";
    }
}


async function loadPendingRequests() {
    const currentUserId = window.auth.currentUser.uid;
    const listContainer = document.getElementById("pending-friends-list");
    listContainer.innerHTML = "<i>Chargement...</i>";

    try {
        const friendsRef = ref(db, `friendships/${currentUserId}`);
        const snapshot = await get(friendsRef);

        if (!snapshot.exists()) {
            listContainer.innerHTML = "<i>Aucune demande en attente.</i>";
            return;
        }
        
        listContainer.innerHTML = ""; 
        const relations = snapshot.val();
        let pendingCount = 0;
        const promises = [];

        for (const friendId in relations) {
            if (relations[friendId] === "pending") {
                pendingCount++;
                promises.push(
                    get(ref(db, `users/${friendId}`)).then(userSnapshot => {
                        let friendName = "Utilisateur inconnu";
                        let photoURL = './icons_map/default-avatar.png'; // Défaut

                        if (userSnapshot.exists()) {
                            friendName = userSnapshot.val().displayName;
                            photoURL = userSnapshot.val().photoURL || './icons_map/default-avatar.png';
                        }

                        // --- MODIFICATION : Template HTML mis à jour ---
                        return `
                            <div class="pending-item">
                                <div class="user-result-identity">
                                    <img src="${photoURL}" class="result-avatar" onerror="this.src='./icons_map/default-avatar.png'">
                                    <span>${friendName}</span>
                                </div>
                                <div>
                                    <button class="accept" onclick="acceptFriendRequest('${friendId}', '${friendName}')">Accepter</button>
                                    <button class="decline" onclick="declineFriendRequest('${friendId}', '${friendName}')">Refuser</button>
                                </div>
                            </div>
                        `;
                    }).catch(err => {
                        console.error(`Erreur au chargement du demandeur ${friendId}:`, err);
                        return ''; 
                    })
                );
            }
        }

        if (pendingCount === 0) {
            listContainer.innerHTML = "<i>Aucune demande en attente.</i>";
            return;
        }

        const pendingHTMLArray = await Promise.all(promises);
        listContainer.innerHTML = pendingHTMLArray.join('');

    } catch (error) {
        console.error("Erreur majeure dans loadPendingRequests :", error);
        listContainer.innerHTML = "<i style='color: red;'>Erreur de chargement. Vérifiez la console.</i>";
    }
}


/**
 * NOUVELLE FONCTION ADMIN : Supprime un commentaire spécifique
 * @param {string} markerKey - L'ID du marqueur parent
 * @param {string} commentKey - L'ID du commentaire à supprimer
 */
function removeComment(markerKey, commentKey) {
    // Vérification de sécurité (au cas où le bouton s'afficherait par erreur)
    if (window.auth.currentUser.uid !== ADMIN_UID) {
        alert("Action réservée à l'administrateur.");
        return;
    }

    // Confirmation
    if (!confirm("ADMIN : Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.")) {
        return;
    }

    // On crée la référence vers le commentaire
    const commentRef = ref(db, `comments/${markerKey}/${commentKey}`);

    // On supprime
    remove(commentRef)
        .then(() => {
            console.log("Commentaire supprimé avec succès par l'admin.");
            // On recharge la carte pour que le popup se mette à jour
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            loadMarkers();
        })
        .catch((error) => {
            console.error("Erreur (Admin) lors de la suppression du commentaire :", error);
            alert("Erreur : Le commentaire n'a pas pu être supprimé. (Vos règles Firebase sont-elles à jour ?)");
        });
}

/**
 * CRÉATION 1/5 : OUVRE LE POPUP DE PROFIL
 * (Charge les couleurs et pré-remplit les champs)
 */
function openProfilePopup() {
    const uid = window.auth.currentUser.uid;
    const userRef = ref(db, `users/${uid}`);

    get(userRef).then((snapshot) => {
        if (!snapshot.exists()) {
            alert("Erreur : profil utilisateur introuvable.");
            return;
        }
        
        const userData = snapshot.val();
        
        // --- 1. Pré-remplir le nom ---
        document.getElementById('profile-name-input').value = userData.displayName || "";
        
        // --- 2. Définir l'icône actuelle ---
        const currentColor = userData.chosen_color || "google"; // Par défaut, c'est la photo Google
        let previewIconSrc;
        let googlePhotoUrl = userData.photoURL; // Stocker la photo Google

        if (currentColor === "google") {
            const proxyImageURL = googlePhotoUrl ?
                `https://images.weserv.nl/?url=${encodeURIComponent(googlePhotoUrl)}&w=80&h=80&t=circle` :
                './icons_map/default-avatar.png';
            previewIconSrc = proxyImageURL;
        } else {
            previewIconSrc = ICON_COLOR_MAP[currentColor] || ICON_COLOR_MAP["black"];
        }

        document.getElementById('profile-icon-preview').src = previewIconSrc;
        
        // --- 3. Construire la grille de couleurs ---
        const grid = document.getElementById('icon-color-grid');
        grid.innerHTML = ''; // Vider la grille
        
        // On ajoute la photo Google comme première option
        const googlePhotoOption = document.createElement('div');
        googlePhotoOption.className = 'color-choice';
        googlePhotoOption.dataset.color = "google"; // L'ID "google"
        googlePhotoOption.title = "Utiliser ma photo de profil Google";
        // On utilise l'URL de prévisualisation qu'on a déjà
        const googlePreviewSrc = (currentColor === "google") ? previewIconSrc : (googlePhotoUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(googlePhotoUrl)}&w=80&h=80&t=circle` : './icons_map/default-avatar.png');
        googlePhotoOption.innerHTML = `<img src="${googlePreviewSrc}" alt="Photo Google">`;
        if (currentColor === "google") {
            googlePhotoOption.classList.add('selected');
        }
        googlePhotoOption.onclick = () => selectColor(googlePhotoOption);
        grid.appendChild(googlePhotoOption);

        // On ajoute les autres couleurs (sauf "google")
        for (const colorName in ICON_COLOR_MAP) {
            if (colorName === "google") continue; // On l'a déjà mis
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-choice';
            colorDiv.dataset.color = colorName;
            colorDiv.title = colorName;
            // On ne met QUE l'image de fond. On ne touche plus à la couleur de fond.
            colorDiv.style.backgroundImage = `url(${ICON_COLOR_MAP[colorName]})`;
            
            if (currentColor === colorName) {
                colorDiv.classList.add('selected');
            }
            colorDiv.onclick = () => selectColor(colorDiv);
            grid.appendChild(colorDiv);
        }

        // --- 4. Afficher le popup ---
        document.getElementById("profile-popup").classList.add("active");
        document.getElementById("overlay").classList.add("show");
        document.querySelector('#map').style.pointerEvents = 'none';
    
    }).catch(err => {
        console.error("Erreur de chargement du profil:", err);
    });
}

/**
 * CRÉATION 2/5 : Gère le clic sur une couleur dans la grille
 */
function selectColor(selectedColorElement) {
    // On enlève "selected" de tous les autres
    document.querySelectorAll('#icon-color-grid .color-choice').forEach(el => {
        el.classList.remove('selected');
    });
    
    // On ajoute "selected" à celui sur lequel on a cliqué
    selectedColorElement.classList.add('selected');
    
    // On met à jour la grosse image de prévisualisation
    const selectedColor = selectedColorElement.dataset.color;
    let previewIconSrc;

    if (selectedColor === "google") {
        // On va chercher l'image de la photo google (qui est dans la grille)
        previewIconSrc = selectedColorElement.querySelector('img').src;
    } else {
        previewIconSrc = ICON_COLOR_MAP[selectedColor];
    }
    
    document.getElementById('profile-icon-preview').src = previewIconSrc;
}

/**
 * CRÉATION 3/5 : FERME LE POPUP DE PROFIL
 */
function closeProfilePopup() {
    document.getElementById("profile-popup").classList.remove("active");
    document.getElementById("overlay").classList.remove("show");
    document.querySelector('#map').style.pointerEvents = 'auto';
}

/**
 * CRÉATION 4/5 : ENREGISTRE LES CHANGEMENTS DU PROFIL
 */
function saveProfile() {
    const uid = window.auth.currentUser.uid;
    const newName = document.getElementById('profile-name-input').value;
    
    if (!newName) {
        alert("Le pseudo ne peut pas être vide.");
        return;
    }
    
    // On trouve quelle couleur est sélectionnée
    const selectedColorEl = document.querySelector('.color-choice.selected');
    if (!selectedColorEl) {
        alert("Veuillez sélectionner une icône.");
        return;
    }
    
    const newColor = selectedColorEl.dataset.color; // ex: "red" ou "google"

    // --- 1. On prépare les mises à jour pour la Realtime Database ---
    const updates = {};
    updates[`/users/${uid}/displayName`] = newName;
    updates[`/users/${uid}/displayName_lowercase`] = newName.toLowerCase();
    updates[`/users/${uid}/chosen_color`] = newColor; // On sauvegarde la couleur
        
    // --- 2. On met aussi à jour le profil Firebase Auth (juste le nom) ---
    const authUpdatePromise = updateProfile(auth.currentUser, { 
        displayName: newName 
    });

    // --- 3. On lance les deux mises à jour ---
    Promise.all([
        update(ref(db), updates), // Met à jour la Realtime Database
        authUpdatePromise       // Met à jour Firebase Auth
    ]).then(() => {
        // --- 4. TOUT est fini et sauvegardé ---
        console.log("Profil mis à jour avec succès !");
        closeProfilePopup();
        loadMarkers(); // Recharge la carte avec le nouveau nom/couleur
        
    }).catch(error => {
        console.error("Erreur lors de la sauvegarde du profil :", error);
        alert("Une erreur est survenue lors de la sauvegarde.");
    });
}

/**
 * CRÉATION 5/5 : CRÉE L'ICÔNE DE MARQUEUR (L.divIcon ou L.Icon)
 * @param {object} userProfile - L'objet utilisateur (de /users/)
 */
function createProfileIcon(userProfile) {
    if (!userProfile) userProfile = {}; 
    
    // On récupère la couleur choisie, sinon "google"
    const color = userProfile.chosen_color || "google";

    if (color === "google") {
        // --- CAS 1 : L'utilisateur veut sa photo Google ---
        // On utilise le code de l'icône ronde avec bordure
        const photoToUse = userProfile.photoURL || null;
        
        const proxyImageURL = photoToUse ?
            `https://images.weserv.nl/?url=${encodeURIComponent(photoToUse)}&w=40&h=40&t=circle` :
            './icons_map/default-avatar.png';

        const iconHTML = `
            <div class="profile-marker-container">
                <img src="${proxyImageURL}" class="profile-marker-image" onerror="this.src='./icons_map/default-avatar.png'">
            </div>
        `;

        return L.divIcon({
            className: 'profile-marker',
            html: iconHTML,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });
        
    } else {
        // --- CAS 2 : L'utilisateur a choisi une couleur ---
        // On utilise une icône Leaflet standard (L.Icon)
        
        // On va chercher le chemin de l'image (ex: './icons_map/boutique-de-sexe-red.png')
        const iconPath = ICON_COLOR_MAP[color] || ICON_COLOR_MAP["black"]; // "black" par défaut
        
        return L.icon({
            iconUrl: iconPath,
            iconSize:     [32, 32], 
            iconAnchor: [16, 16], 
            popupAnchor: [0, -16] 
        });
    }
}

// AJOUTEZ CETTE VARIABLE GLOBALE (au début de votre script)
var currentFormPage = 1;

/**
 * Affiche la page N du formulaire et cache les autres
 * @param {number} pageNumber - Le numéro de la page (1-4)
 */
function showFormPage(pageNumber) {
    currentFormPage = pageNumber;
    
    // Cache toutes les pages
    document.querySelectorAll('#informations .form-page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active-page');
    });
    
    // Affiche la page ciblée
    const targetPage = document.querySelector(`#informations .form-page[data-page="${pageNumber}"]`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active-page');
    }
}

/**
 * Passe à la page suivante du formulaire
 */
function formNext() {
    showFormPage(currentFormPage + 1);
}

/**
 * Revient à la page précédente du formulaire
 */
function formPrev() {
    showFormPage(currentFormPage - 1);
}