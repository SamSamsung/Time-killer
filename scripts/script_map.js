




// Initialiser la carte
var map = L.map('map').setView([51.505, -0.09], 13);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


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
                    L.marker(position, { icon: customIcon }).addTo(map).bindPopup(popupContent);
                } else {
                    L.marker(position).addTo(map).bindPopup(popupContent);
                }
            }
        }
    }).catch((error) => {
        console.error("Erreur lors du chargement des marqueurs :", error);
    });
}

// Sauvegarder un marqueur dans Realtime Database
function saveMarker(position, popupContent, icon=null) {
    const markersRef = ref(db, 'markers');
    const newMarkerRef = push(markersRef);
    const markerData = {
        position: position,
        popupContent: popupContent
    };
    if (icon) {
        markerData.icon = icon;
    }
    set(newMarkerRef, markerData);
}


var customIcon = L.icon({
    iconUrl: '../icons/accro-au-sexe.png',

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
    
    document.getElementById("informations").classList.add("active")
    document.getElementById("overlay").classList.add("show")
    document.querySelector('#map').style.pointerEvents = 'none';
    var popupContent = `
    <div>
        <p>Voici un popup avec des boutons !</p>
        <button class="popup-button" onclick="alert('Bouton 1 cliqué !')">Modifier</button>
        <button class="popup-button" onclick="alert('Bouton 2 cliqué !')">Supprimer</button>
    </div>
`;
    // Créer un nouveau marqueur temporaire
    tempMarker = L.marker(e.latlng,{icon: customIcon}).addTo(map)
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

    tempMarker = null;


    
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
});