$(document).ready(function () {

	//Use esto dentro de su document ready jQuery -- forzar la recarga de una página
	$(window).on('popstate', function () {
		location.reload(true);
	});

});

/* Conectarse a Firebase*/
try {
	firebase.initializeApp({
		apiKey: "AIzaSyB3Vk0nWljV4KhsfU9Co4qNNE0P_FhIJC4",
		authDomain: "taksi-d543c.firebaseapp.com",
		projectId: "taksi-d543c",
		storageBucket: "taksi-d543c.appspot.com",
	});
} catch (err) {
	if (!/already exists/.test(err.message)) {
		console.error(
			"Se produjo un error de inicialización de Firebase",
			err.stack
		);
	}
}


var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var gmarkers = [];
var map;


firebase.auth().onAuthStateChanged(function (user) {

	if (user) {

		var user = firebase.auth().currentUser;
		var correo_id = user.email;

		var ciudad; //consultar ciudad el propietario pra borrar de ciudad
		db.collection("reg_prop_prin_web").where("email", "==", correo_id).onSnapshot(function (queryPropietario) {
			queryPropietario.forEach(function (docDuen) {
				if (docDuen.exists) {

					ciudad = docDuen.data().ciudad;
					//borrar de comitan
					db.collection(ciudad).where("dueño", "==", correo_id).onSnapshot(function (querySnapshot) {
						removeMarkers();
						querySnapshot.forEach(async function (doc) {
							if (doc.data().estado == "online" || doc.data().estado == "offline" || doc.data().estado == "ocupado") {

								var infowindow = new google.maps.InfoWindow();
								var marker = new google.maps.Marker({
									position: {
										lat: parseFloat(doc.data().ubicacion.latitude),
										lng: parseFloat(doc.data().ubicacion.longitude)
									},
									icon: {
										url: "../../Diseno/IMG/taxi.svg",
										scaledSize: new google.maps.Size(50, 50)
									},
									map: map,
									title: doc.data().identificador
								});

								//console.log("IDENTIFICADOR: "+doc.data().identificador);

								var name = "nombre";
								var apePat = "Apellido";
								var placaTaxi = "default";
								var urltaxi = "Url";

								await db.collection("choferes").where("dueno", "==", correo_id).where("identificador", "==", doc.data().identificador).get().then(function (doc) {
									//forma de obtener los datos sin el foreach
									name = doc.docs[0]._document.proto.fields.nombre['stringValue'];
									apePat = doc.docs[0]._document.proto.fields.apellidos['stringValue'];
									placaTaxi = doc.docs[0]._document.proto.fields.placa_taxi['stringValue'];

								}).catch(function (err) {
									console.log(err);
								});

								await db.collection("taxis").where("correo", "==", correo_id).where("placa", "==", placaTaxi).get().then(function (doc) {
									//forma de obtener los datos sin el foreach
									urltaxi = doc.docs[0]._document.proto.fields.foto_taxi['stringValue'];
								}).catch(function (err) {
									console.log(err);
								});


								var estadoTxi = "";
								if (doc.data().estado === 'online') {
									estadoTxi = 'Buscando servicio..'
								} else if (doc.data().estado === 'offline') {
									estadoTxi = 'Fuera de servicio'
								} else if (doc.data().estado === 'ocupado') {
									estadoTxi = 'En un servicio'
								}


								var contentString = "<div align='center'><img height='100px' width='200px' src='" + urltaxi + "'/></div>" +
									"<h5 class='placa'>" + placaTaxi + "</h5>" +
									"<br><b>Sitio:</b>  " + doc.data().sitio +
									"<br><b>Chofer:</b>   " + name + " " + apePat +
									"<br><strong>Actualmente:</strong>   " + estadoTxi +
									"<br>";


								(doc.data().estado === 'online' ? 'Buscando servicio' : 'En un servicio') +
								"<br>";
								google.maps.event.addListener(marker, 'mouseover', function (e) {
									infowindow.setContent(contentString);
									infowindow.open(map, marker);
								});
								google.maps.event.addListener(marker, 'mouseout', function (e) {
									infowindow.close();
								});
								gmarkers.push(marker);
							} else {}
						});
						/*Recargamos desde caché*/
					});
				}
			});
		});
	}
});









function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 16.241409,
			lng: -92.129658
		},
		zoom: 14,
	});
	//printDatos();

}

function removeMarkers() {
	while (gmarkers.length) {
		var oldMarker = gmarkers.pop();
		oldMarker.setMap(null);
	}
}
