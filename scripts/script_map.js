//import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

var map = L.map('map');

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
// Charger les marqueurs depuis Realtime Database une seule fois
function loadMarkers() {
    const currentUserId = window.auth.currentUser.uid;
    let allowedIds = [currentUserId];
    const friendsRef = ref(db, `friendships/${currentUserId}`);
    
    // On va stocker les données des marqueurs filtrés
    let markerDataMap = {};

    get(friendsRef).then((friendsSnapshot) => {
        // --- 1. Construire la liste d'amis ---
        if (friendsSnapshot.exists()) {
            const relations = friendsSnapshot.val();
            for (const friendId in relations) {
                if (relations[friendId] === "friends") {
                    allowedIds.push(friendId);
                }
            }
        }
        console.log("Affichage des marqueurs pour les UID:", allowedIds);
        
        // --- 2. Récupérer TOUS les marqueurs ---
        const markersRef = ref(db, 'markers');
        return get(markersRef); 

    }).then((markersSnapshot) => {
        // --- 3. Nettoyer la carte ---
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        if (!markersSnapshot.exists()) return;
        
        // --- 4. Filtrer les marqueurs et préparer le chargement des commentaires ---
        const markers = markersSnapshot.val();
        let commentPromises = []; // On va stocker les promesses de chargement

        for (const key in markers) {
            if (markers.hasOwnProperty(key)) {
                const markerData = markers[key];
                
                // On applique le filtre d'amis
                if (allowedIds.includes(markerData.creator_id)) {
                    // On stocke les données du marqueur
                    markerDataMap[key] = markerData;
                    
                    // On prépare la promesse de charger les commentaires pour CE marqueur
                    const commentsRef = ref(db, `comments/${key}`);
                    commentPromises.push(
                        get(commentsRef).then(commentSnapshot => {
                            // On renvoie un objet avec la clé ET les commentaires
                            return { markerKey: key, comments: commentSnapshot.val() || {} };
                        })
                    );
                }
            }
        }
        
        // --- 5. Lancer toutes les promesses de commentaires en même temps ---
        return Promise.all(commentPromises);

    }).then((commentResults) => {
        // --- 6. On a reçu TOUS les commentaires ---
        // (commentResults est un array: [{ markerKey: "k1", comments: {...} }, ...])
        
        // On attache les commentaires aux données de leur marqueur
        commentResults.forEach(result => {
            if (markerDataMap[result.markerKey]) {
                markerDataMap[result.markerKey].allComments = result.comments;
            }
        });

        // --- 7. MAINTENANT on peut enfin afficher les marqueurs ---
        for (const key in markerDataMap) {
            const markerData = markerDataMap[key];
            const allComments = markerData.allComments || {}; // Les commentaires de la BDD
            
            // On appelle la NOUVELLE fonction getPopupContent
            const finalPopupContent = getPopupContent(markerData, key, allComments);
            
            const position = markerData.position;

            if (markerData.icon) {
                const customIcon = L.icon({
                    iconUrl: markerData.icon.iconUrl,
                    iconSize: markerData.icon.iconSize,
                    iconAnchor: markerData.icon.iconAnchor,
                    popupAnchor: markerData.icon.popupAnchor
                });
                const marker = L.marker(position, { icon: customIcon }).addTo(map);
                marker.options.key = key;
                marker.bindPopup(finalPopupContent);

            } else {
                const marker = L.marker(position).addTo(map);
                marker.options.key = key;
                marker.bindPopup(finalPopupContent);
            }
        }

    }).catch((error) => {
        // Ce .catch() gérera TOUTES les erreurs de la chaîne
        console.error("Erreur lors du chargement des marqueurs/commentaires :", error);
    });
}


// REMPLACEZ getPopupContent PAR CELLE-CI

function getPopupContent(markerData, key, allComments) {
    const currentUserId = window.auth.currentUser.uid;
    const isCreator = (currentUserId === markerData.creator_id);

    // --- 1. On définit nos "cartes" de conversion (pas de changement) ---
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

    // --- 2. On recrée le HTML des positions (pas de changement) ---
    let popuptexte = '';
    if (markerData.positions && Array.isArray(markerData.positions)) {
        markerData.positions.forEach(pos_id => {
            if (listpopup_map[pos_id]) {
                popuptexte += listpopup_map[pos_id];
            }
        });
    }
    
    // --- 3. On recrée la note (pas de changement) ---
    const note_num = markerData.note || "none";
    const note_emoji = note_map[note_num.toString()] || "❌";

    // --- 4. On construit le HTML des NOUVEAUX commentaires (du noeud 'comments') ---
    let commentsHTML_new = '';
    for (const commentKey in allComments) {
        const comment = allComments[commentKey];
        const proxyImageURL = comment.authorPhoto ?
            `https://images.weserv.nl/?url=${encodeURIComponent(comment.authorPhoto)}&w=100&h=100&t=circle` :
            'icons_map/default-avatar.png';
        
        commentsHTML_new += `
        <div class="custom-comment-container" style="
            margin-top: 15px; padding: 10px; border: 1px solid #ddd;
            border-radius: 5px; background-color: #f9f9f9; display: flex;
            width: calc(100% - 20px);
        ">
            <div style="flex: 0 0 60px; margin-right: 10px; display: flex; flex-direction: column; align-items: center;">
                <img src="${proxyImageURL}"
                     style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #4285F4; margin-bottom: 5px;"
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

    // --- NOUVEAU : 5. On extrait les ANCIENS commentaires de popupContent ---
    let commentsHTML_old = '';
    const oldPopupContent = markerData.popupContent || "";
    const oldCommentsStartTag = '<div class="custom-comment-container"'; // Le marqueur de vos anciens commentaires
    
    const startIndex = oldPopupContent.indexOf(oldCommentsStartTag);
    
    if (startIndex !== -1) {
        // On a trouvé d'anciens commentaires !
        // On extrait tout, de ce point jusqu'à la fin de la chaîne.
        commentsHTML_old = oldPopupContent.substring(startIndex);
        console.log(`Anciens commentaires trouvés pour le marqueur ${key}`);
    }
    
    // --- 6. On assemble le contenu principal ---
    const mainPopupContent = `
        <p class="header_popup">L'heureux·se élu·e</p>
        <p class="popup-data-box">${markerData.name || ''}</p>
        
        <p class="header_popup">Partenaire·s</p>
        <p class="popup-data-box">${markerData.partenaires || ''}</p>
        
        <p class="header_popup">Date</p>
        <p class="popup-data-box">${markerData.date || ''}</p>
        
        <p class="header_popup">Lieu</p>
        <p class="popup-data-box">${markerData.lieu || ''}</p>
        
        <p class="header_popup">Les positions</p>
        <div class="popup-images">${popuptexte}</div>
        
        <p class="header_popup">Note</p>
        <p class="popup-data-box">${note_emoji} - ${note_num}/10</p>
        
        <p class="header_popup">Les commentaires (du créateur)</p>
        <p class="popup-data-box">${markerData.commentaires || ''}</p>
        
        <p class="header_popup">Section commentaire</p>
        ${commentsHTML_new}  ${commentsHTML_old}  `;
    
    // --- 7. On ajoute les boutons d'action (pas de changement) ---
    const iconEdit = './icons_map/edit.png';
    const iconDelete = './icons_map/delete.png';
    const iconComment = './icons_map/comment.png';

    return `
    <div>
        ${mainPopupContent}
        
        <div class="popup-actions-container">
            ${isCreator ? `
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

// Sauvegarder un marqueur dans Realtime Database
function saveMarker(position, icon=null, name, partenaires, date, lieu, positions, note_num, commentaires, creator) {
    const markersRef = ref(db, 'markers');
    const newMarkerRef = push(markersRef);
    const markerData = {
        position: [position.lat, position.lng],
        name: name,
        partenaires: partenaires,
        date: date,
        lieu: lieu,
        positions: positions,
        note: note_num,
        commentaires: commentaires,
        creator_id: creator
    };
    if (icon) {
        markerData.icon = icon;
    }
    return set(newMarkerRef, markerData).then(() => {
        // Stocker la clé dans le marqueur temporaire
        if (tempMarker) {
            tempMarker.options.key = newMarkerRef.key;
            // Mettre à jour le contenu du popup avec la clé
            const newPopupHTML = getPopupContent(markerData, newMarkerRef.key, {});
            tempMarker.getPopup().setContent(newPopupHTML);
        }
        return newMarkerRef.key; // Retourner la clé pour un usage ultérieur si nécessaire
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
        // On empeche n'importe qui de modifier les markers des autres
        if(window.auth.currentUser.uid != markerData.creator_id){
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
    // 1. Récupérer les données du marqueur depuis Firebase
    const markerRef = ref(db, `markers/${key}`);
    get(markerRef).then((snapshot) => {
        const markerData = snapshot.val();
        if (!markerData) {
            console.error("Aucune donnée trouvée pour ce marqueur.");
            return;
        }

        // On empeche n'importe qui de modifier les markers des autres
        if(window.auth.currentUser.uid != markerData.creator_id){
            alert("Vous essayez de modifier un marker que vous n'avez pas créé et ce n'est pas autorisé")
            return;
        }

        // 2. Pré-remplir le formulaire avec les données existantes
        document.getElementById("creator-name-display").innerText = markerData.name || "";
        document.getElementById("partenaire").value = markerData.partenaires || "";
        document.getElementById("date").value = markerData.date || new Date().toISOString().slice(0, 10);
        document.getElementById("lieu").value = markerData.lieu || "";
        document.getElementById("commentaires").value = markerData.commentaires || "";

        // 3. Gérer les positions (cocher les cases correspondantes)
        const positions = markerData.positions || [];
        document.querySelectorAll("#positions input[type=checkbox]").forEach(checkbox => {
            checkbox.checked = positions.includes(checkbox.id);
        });

        // 4. Gérer la note (sélectionner le radio button correspondant)
        const note = markerData.note;
        if (note) {
            document.querySelector(`input[name="rating"][value="${note}"]`).checked = true;
        }

        // 5. Afficher le popup de modification
        document.getElementById("informations").classList.add("active");
        document.getElementById("overlay").classList.add("show");
        document.querySelector('#map').style.pointerEvents = 'none';

        // 6. Stocker la clé du marqueur en cours de modification (pour la sauvegarde)
        window.currentEditingKey = key;

        // 7. Stocker le marqueur temporaire (pour mise à jour visuelle)
        const position = markerData.position;
        const popupContent = markerData.popupContent;
        const icon = markerData.icon || customIcon;
        window.tempMarker = L.marker(position, { icon: L.icon(icon) }).addTo(map)
            .bindPopup(popupContent)
            .openPopup();
    }).catch((error) => {
        console.error("Erreur lors de la récupération des données du marqueur :", error);
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
        <p>Voici un popup avec des boutons !</p>
        <div class="popup-images">
            
        </div>
    </div>
    `;

    // Créer un nouveau marqueur temporaire
    tempMarker = L.marker(e.latlng, { icon: customIcon }).addTo(map)
        .bindPopup(popupContent)
        .openPopup();
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

    // Réinitialiser le mode modification
    window.currentEditingKey = null;
}


function pop_up_close_comments(){
    document.getElementById("comments").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    ocument.querySelector('#map').style.pointerEvents = 'auto';
}


function yes(){
    document.getElementById("informations").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';


    var position = tempMarker.getLatLng();
    var icon = tempMarker.getIcon();
    var name = window.auth.currentUser.displayName;
    var partenaires = document.getElementById("partenaire").value
    var lieu = document.getElementById("lieu").value
    var date = document.getElementById("date").value
    var notes = getSelectedRating()
    var note_emoji = notes[0]
    var note_num = notes[1];
    var commentaires = document.getElementById("commentaires").value
    var creator = window.auth.currentUser.uid; // Utiliser l'ID de l'utilisateur
    var positions = getPositions();
    
    
    if(name === "Benjamin"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-blue.png';
    } else if(name === "Louis"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-orange.png';
    } else if(name === "Nolwenn"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-lightgreen.png';
    } else if(name === "Alex"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-gray.png';
    } else if(name === "Samuel"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-red.png';
    } else if(name === "Gabrielle"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-magenta.png';
    } else if(name === "Tim"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-green.png';
    } else if(name === "Iloë"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-pink.png';
    } else if(name === "Maurange"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-yellow.png';
    } else {
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-black.png';
    }
    var customIcon = L.icon({
        iconUrl: icon.options.iconUrl,
        iconSize:     [32, 32], // taille de l'icône
        iconAnchor: [16, 16], // point de l'icône qui correspondra à la position du marqueur
        popupAnchor: [0, -16] // point à partir duquel le popup devrait s'ouvrir relativement à l'iconAnchor
    });

    tempMarker.setIcon(customIcon);

    if (window.currentEditingKey) {
        // Mode modification : mettre à jour le marqueur existant
        const markerRef = ref(db, `markers/${window.currentEditingKey}`);
        set(markerRef, {
            position: [position.lat, position.lng],
            name: name,
            partenaires: partenaires,
            date: date,
            lieu: lieu,
            positions: positions,
            note: note_num,
            commentaires: commentaires,
            creator_id: creator,
            icon: {
                iconUrl: icon.options.iconUrl,
                iconSize: icon.options.iconSize,
                iconAnchor: icon.options.iconAnchor,
                popupAnchor: icon.options.popupAnchor
            }
        }).then(() => {
            console.log("Marqueur mis à jour avec succès !");
            // Recharger les marqueurs pour mettre à jour la carte
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            loadMarkers();
            // Réinitialiser
            window.currentEditingKey = null;
            window.tempMarker = null;
        });
    } else {
        // Mode création : sauvegarder un nouveau marqueur
        saveMarker(position, {
            iconUrl: icon.options.iconUrl,
            iconSize: icon.options.iconSize,
            iconAnchor: icon.options.iconAnchor,
            popupAnchor: icon.options.popupAnchor
        }, name, partenaires, date, lieu, positions, note_num, commentaires, creator)
        .then(() => {
            window.tempMarker = null;
        })
        .catch((error) => {
            console.error("Erreur lors de la création :", error);
            alert("Erreur lors de la sauvegarde.");
        });
    }

}


function yes_comments(){
    document.getElementById("comments").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';

    var key = document.getElementById("key").innerHTML;
    var pseudo = window.auth.currentUser.displayName;
    var photo = window.auth.currentUser.photoURL;
    var texte = document.getElementById("comment_box").value;
    var creator_uid = window.auth.currentUser.uid;


    const commentsRef = ref(db, `comments/${key}`);
    const newCommentRef = push(commentsRef); // Génère une clé unique pour le commentaire
    set(newCommentRef, {
        authorName: pseudo,
        authorPhoto: photo,
        text: texte,
        authorUid: creator_uid,
        timestamp: new Date().toISOString()
    }).then(() => {
        console.log("Commentaire ajouté !");
        // On recharge les marqueurs pour que le nouveau commentaire s'affiche
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });
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
            const googleProfileName = googleProfile.given_name || googleProfile.name.split(' ')[0];

            // On compare le nom en cache de Firebase avec le nom frais de Google
            if (firebaseUser.displayName !== googleProfileName) {
                
                console.warn("Mise à jour du profil Firebase !");
                console.log(`Ancien nom (cache) : ${firebaseUser.displayName}`);
                console.log(`Nouveau nom (Google) : ${googleProfileName}`);

                // On force la mise à jour du profil Firebase
                // (On met aussi à jour la photo, au cas où)
                await window.updateProfile(firebaseUser, {
                    displayName: googleProfileName,
                    photoURL: additionalInfo.profile.picture 
                });
                
                console.log("Profil Firebase mis à jour avec succès.");
                
                // On recharge la page pour que "updateUI" s'exécute
                // avec le bon nom partout.
                window.location.reload();
            }

            // Si les noms sont déjà identiques, on ferme simplement le popup
            login_pop_up_close();
        })
        .catch((error) => {
            console.error("Erreur de connexion :", error);
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
        // Utilisateur connecté
        const displayName = user.displayName || "Utilisateur inconnu";
        const email = user.email || "Aucun email";
        const photoURL = user.photoURL || "./icons_map/default-avatar.png"; // URL de la photo de profil

        console.log("Nom:", displayName);
        console.log("Email:", email);
        console.log("Photo:", photoURL);

        const userRef = ref(db, `users/${user.uid}`);
        const userData = {
            displayName: displayName,
            email: email,
            photoURL: photoURL,
            displayName_lowercase: displayName.toLowerCase()
        };

        set(userRef, userData);

        // Activer la carte
        document.getElementById('map').removeAttribute('disabled');
        document.getElementById('logout-button').style.display = 'flex';
        document.getElementById('friends-button').style.display = 'flex';
        loadMarkers(); // Charger les marqueurs de l'utilisateur
    } else {
        // Désactiver la carte et afficher le popup
        document.getElementById('map').setAttribute('disabled', 'true');
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('friends-button').style.display = 'none';
        show_login_popup(); // Afficher le popup de connexion
    }
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
    
    //loadMarkers();
    // Ajouter le contrôle de géolocalisation
    
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