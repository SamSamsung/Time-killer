//import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

var map = L.map('map');

// Ajouter le contrôle de géocodage à la carte
L.Control.geocoder().addTo(map);



function initMap(lat, lon, zoom = 13) {
  map.setView([lat, lon], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
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
    const markersRef = ref(db, 'markers');
    get(markersRef).then((snapshot) => {
        const markers = snapshot.val();
        for (const key in markers) {
            if (markers.hasOwnProperty(key)) {
                const markerData = markers[key];
                const position = markerData.position;
                const popupContent = markerData.popupContent;

                // Vérifier si le marqueur a une icône personnalisée
                if (markerData.icon) {
                    const customIcon = L.icon({
                        iconUrl: markerData.icon.iconUrl,
                        iconSize: markerData.icon.iconSize,
                        iconAnchor: markerData.icon.iconAnchor,
                        popupAnchor: markerData.icon.popupAnchor
                    });
                    const marker = L.marker(position, { icon: customIcon }).addTo(map);
                    marker.options.key = key; // Stocker la clé dans les options du marqueur
                    marker.bindPopup(getPopupContent(popupContent, key)).openPopup();
                } else {
                    const marker = L.marker(position).addTo(map);
                    marker.options.key = key; // Stocker la clé dans les options du marqueur
                    marker.bindPopup(getPopupContent(popupContent, key)).openPopup();
                }
            }
        }
    }).catch((error) => {
        console.error("Erreur lors du chargement des marqueurs :", error);
    });
}

// Fonction pour créer le contenu du popup avec la clé
function getPopupContent(popupContent, key) {
    return `
    <div>
        ${popupContent}
        <button class="popup-button" style="background-color: lightblue" onclick="modifyMarker('${key}')">Modifier</button>
        <button class="popup-button" style="background-color: red" onclick="removeMarker('${key}')">Supprimer</button>
        <button class="popup-button" style="background-color: green" onclick="showCommentPopup('${key}')">Ajouter un commentaire</button>
    </div>
    `;
}

// Sauvegarder un marqueur dans Realtime Database
function saveMarker(position, popupContent, icon=null, name, partenaires, date, lieu, positions, note_num, commentaires, creator) {
    const markersRef = ref(db, 'markers');
    const newMarkerRef = push(markersRef);
    const markerData = {
        position: [position.lat, position.lng],
        popupContent: popupContent,
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
            const popupContentWithKey = getPopupContent(popupContent, newMarkerRef.key);
            tempMarker.getPopup().setContent(popupContentWithKey);
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
        document.getElementById("dropdown_name").value = markerData.name || "Samuel";
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
    var listpopup = ['<img src="icons_map/dog.png" id="doggy-style-popup" alt="Image 1" />', '<img src="icons_map/anal.png" id="lazy-doggy-style-popup" alt="Image 2" />', '<img src="icons_map/doggy.png" id="standing-doggy-style-popup" alt="Image 3" />', '<img src="icons_map/sex-2.png" id="missionary-popup" alt="Image 4" />', '<img src="icons_map/cowgirl.png" id="cowgirl-popup" alt="Image 5" />', '<img src="icons_map/licking.png" id="cunnilingus-popup" alt="Image 6" />', '<img src="icons_map/oral-sex-2.png" id="blowjob-popup" alt="Image 7" />', '<img src="icons_map/oral-sex.png" id="lazy-blowjob-popup" alt="Image 8" />', '<img src="icons_map/front.png" id="upstanding-citizen-popup" alt="Image 9" />', '<img src="icons_map/back.png" id="reversed-cowgirl-popup" alt="Image 10" />', '<img src="icons_map/back (1).png" id="leapfrog-popup" alt="Image 11" />', '<img src="icons_map/man.png" id="69-popup" alt="Image 12" />', '<img src="icons_map/sex.png"  id="lotus-popup" alt="Image 13" />', '<img src="icons_map/autre.png"  id="others-popup" alt="Image 13" />']
    var textepopup = ''
    var L = []
    var all = document.getElementById("positions").children
    for(i = 0; i < all.length; i++){
        if(all[i].children[0].checked){
            textepopup += listpopup[i]
            L.push(all[i].children[0].id)
        }
    }
    return [L,textepopup]
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





// Ajouter un marqueur
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('Un endroit sympa !')
    .openPopup();


var popup = L.popup();

// Variable pour stocker le marqueur temporaire
var tempMarker = null;


function onMapClick(e) {
    
    document.getElementById("informations").classList.add("active");
    document.getElementById("overlay").classList.add("show");
    document.querySelector('#map').style.pointerEvents = 'none';
    const inputDate = document.getElementById('date');
    inputDate.value = new Date().toISOString().slice(0, 10);

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
    var popupContent = tempMarker.getPopup().getContent();
    var icon = tempMarker.getIcon();
    var name = document.getElementById("dropdown_name").value;
    var partenaires = document.getElementById("partenaire").value
    var lieu = document.getElementById("lieu").value
    var date = document.getElementById("date").value
    var variable = getPositions()
    var positions = variable[0]
    var popuptexte = variable[1]
    var notes = getSelectedRating()
    var note_emoji = notes[0]
    var note_num = notes[1];
    var commentaires = document.getElementById("commentaires").value

    var creator = window.auth.currentUser.uid; // Utiliser l'ID de l'utilisateur


    var popupContent = `
        <p class="header_popup">L'heureux·se élu·e</p>
        <p>${name}</p>
        <p class="header_popup">Partenaire·s</p>
        <p>${partenaires}</p>
        <p class="header_popup">Date</p>
        <p>${date}</p>
        <p class="header_popup">Lieu</p>
        <p>${lieu}</p>
        <p class="header_popup">Les positions</p>
        <div class="popup-images">
            ${popuptexte}
        </div>
        <p class="header_popup">Note</p>
        <p>${note_emoji} - ${note_num}/10</p>
        <p class="header_popup">Les commentaires</p>
        <p>${commentaires}</p>
        <p class="header_popup">Les commentaires exterieurs</p>
    `;
    
    
    if(name === "Benjamin"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-blue.png';
    } else if(name === "Louis"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-orange.png';
    } else if(name === "Nolwenn"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-lightgreen.png';
    } else if(name === "Alex"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-green.png';
    } else if(name === "Samuel"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-black.png';
    } else if(name === "Gabrielle"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-pink.png';
    }
    var customIcon = L.icon({
        iconUrl: icon.options.iconUrl,
        iconSize:     [32, 32], // taille de l'icône
        iconAnchor: [16, 16], // point de l'icône qui correspondra à la position du marqueur
        popupAnchor: [0, -16] // point à partir duquel le popup devrait s'ouvrir relativement à l'iconAnchor
    });

    tempMarker.setIcon(customIcon);
    tempMarker.getPopup().setContent(popupContent);

    if (window.currentEditingKey) {
        // Mode modification : mettre à jour le marqueur existant
        const markerRef = ref(db, `markers/${window.currentEditingKey}`);
        set(markerRef, {
            position: [position.lat, position.lng],
            popupContent: popupContent,
            name: name,
            partenaires: partenaires,
            date: date,
            lieu: lieu,
            positions: positions,
            note: note_num,
            commentaires: commentaires,
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
        saveMarker(position, popupContent, {
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

    // 1. Utiliser un proxy CORS pour les images Google
    const proxyImageURL = photo ?
        `https://images.weserv.nl/?url=${encodeURIComponent(photo)}&w=100&h=100&t=circle` :
        'icons_map/default-avatar.png';

    const markerRef = ref(db, `markers/${key}`);
    get(markerRef).then((snapshot) => {
        const markerData = snapshot.val();
        if (!markerData) {
            console.error("Aucune donnée trouvée pour ce marqueur.");
            return;
        }


        const currentContent = markerData.popupContent;
        const newContent = `
        ${currentContent}
        <div class="custom-comment-container" style="
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
            display: flex;
            width: calc(100% - 20px); /* Largeur = 100% du popup - marges */
        ">
            <!-- Partie gauche : Image de profil -->
            <div style="
                flex: 0 0 60px;
                margin-right: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
            ">
                <img src="${proxyImageURL}"
                     style="
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 2px solid #4285F4;
                        margin-bottom: 5px;
                     "
                     onerror="this.src='icons_map/default-avatar.png'">
            </div>

            <!-- Partie droite : Pseudo et texte -->
            <div style="
                flex: 1;
                min-width: 0;
            ">
                <!-- Pseudo en haut -->
                <div style="
                    font-weight: bold;
                    color: #4285F4;
                    margin-bottom: 5px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                    font-size: 14px;
                ">
                    ${pseudo}
                </div>

                <!-- Texte du commentaire -->
                <div style="
                    font-size: 13px;
                    color: #333;
                    word-break: break-word;
                ">
                    ${texte}
                </div>
            </div>
        </div>
        `;


        update(markerRef,{
            popupContent: newContent,
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
    }).catch((error) => {
        console.error("Erreur lors de la récupération des données du marqueur :", error);
    });
    
}


// Fonction de connexion avec Google
function loginWithGoogle() {
    window.signInWithPopup(window.auth, window.provider)
        .then((result) => {
            // Connexion réussie
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
        // Activer la carte
        document.getElementById('map').removeAttribute('disabled');
        document.getElementById('logout-button').style.display = 'inline';
        loadMarkers(); // Charger les marqueurs de l'utilisateur
    } else {
        // Désactiver la carte et afficher le popup
        document.getElementById('map').setAttribute('disabled', 'true');
        document.getElementById('logout-button').style.display = 'none';
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