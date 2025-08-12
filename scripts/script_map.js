



var map = L.map('map');


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
        <p>Clé du marqueur : ${key}</p>
        <button class="popup-button" style="background-color: lightblue;border-radius:10px;" onclick="alert('Bouton 1 cliqué !')">Modifier</button>
        <button class="popup-button" style="background-color: red;border-radius:10px;" onclick="removeMarker('${key}')">Supprimer</button>
    </div>
    `;
}

// Sauvegarder un marqueur dans Realtime Database
function saveMarker(position, popupContent, icon=null) {
    const markersRef = ref(db, 'markers');
    const newMarkerRef = push(markersRef);
    const markerData = {
        position: [position.lat, position.lng],
        popupContent: popupContent
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
}

function yes(){
    document.getElementById("informations").classList.remove("active")
    document.getElementById("overlay").classList.remove("show")
    document.querySelector('#map').style.pointerEvents = 'auto';


    var position = tempMarker.getLatLng();
    var popupContent = tempMarker.getPopup().getContent();
    var icon = tempMarker.getIcon();

    var name = document.getElementById("dropdown_name").value;
    if(name === "Benjamin"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-blue.png';
    } else if(name === "Louis"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-orange.png';
    } else if(name === "Nolwenn"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-pink.png';
    } else if(name === "Alex"){
        icon.options.iconUrl = '../icons_map/boutique-de-sexe-green.png';
    } 
    var customIcon = L.icon({
        iconUrl: icon.options.iconUrl,
        iconSize:     [32, 32], // taille de l'icône
        iconAnchor: [16, 16], // point de l'icône qui correspondra à la position du marqueur
        popupAnchor: [0, -16] // point à partir duquel le popup devrait s'ouvrir relativement à l'iconAnchor
    });
    tempMarker.setIcon(customIcon);
    // Sauvegarder le marqueur dans Realtime Database
    saveMarker(position, popupContent,{
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        iconAnchor: icon.options.iconAnchor,
        popupAnchor: icon.options.popupAnchor
    });

}


document.addEventListener('DOMContentLoaded', function() {
    loadMarkers();
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