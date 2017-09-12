$('.dropdown-menu a').on('click', function(){
	let imagen=$(this).find($("img")).attr('src');   
    $('.dropdown-toggle').html( `<img src='${imagen}'>`+ '<span class="caret"></span>');
    $("#codigo").val($(this).attr('id'));
    $("#telefono").focus();   
})

const geolocalizacion={
	iniciar: ()=> {
		let mapdivMap = $("#mapa")[0];
		mapdivMap.style.width = (window.innerWidth);	
   		mapdivMap.style.height = (window.innerHeight) + "px";
        geolocalizacion.elementos.mapa = new google.maps.Map($("#mapa")[0], geolocalizacion.mapaInicial);
        geolocalizacion.buscar();
        geolocalizacion.elementos.puntoDestino=$('#destino')[0];
        geolocalizacion.autocompletado(geolocalizacion.elementos.puntoDestino);
        
        /*geolocalizacion.elementos.puntoOrigen=$("#origen")[0];
        geolocalizacion.elementos.puntoDestino=$('#destino')[0];

        geolocalizacion.elementos.servicioIndicaciones = new google.maps.DirectionsService;
   		geolocalizacion.elementos.mostrarDireccion = new google.maps.DirectionsRenderer;
   		geolocalizacion.elementos.mostrarDireccion.setMap(geolocalizacion.elementos.mapa);
   		
        geolocalizacion.autocompletado(geolocalizacion.elementos.puntoOrigen);
        geolocalizacion.autocompletado(geolocalizacion.elementos.puntoDestino);*/
    },
    mapaInicial: { //datos para generar el mapa inicial
        zoom: 8,
        center: {lat: -16.3988900, lng: -71.5350000},//coordenadas de Arequipa
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl:false
    },
    elementos:{ 
        mapa:null,
        servicioIndicaciones: null,
        mostrarDireccion: null,
        puntoOrigen: null,
        puntoDestino:null
    },
    ubicacionActual:{//datos de la ubicacion dada con encuentrame
    	latitud: null,
        longitud: null,
        informacion: null,
        marcador: null
    },
    buscar: ()=>{ //funcion que da la ubicacion actual
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(geolocalizacion.marcarUbicacionActual,geolocalizacion.mensajeError);
        }
    },
    marcarUbicacionActual : (posicion)=>{ //funcion ejecutada cuando se encuentra la ubicacion
        geolocalizacion.ubicacionActual.latitud = posicion.coords.latitude;
        geolocalizacion.ubicacionActual.longitud= posicion.coords.longitude;

        let posicionEncontrada = {lat:geolocalizacion.ubicacionActual.latitud, lng:geolocalizacion.ubicacionActual.longitud};
        geolocalizacion.elementos.puntoOrigen=posicionEncontrada;
        geolocalizacion.ubicacionActual.marcador = geolocalizacion.crearMarcador();
        geolocalizacion.ubicacionActual.informacion=new google.maps.InfoWindow();
        	geolocalizacion.ubicacionActual.informacion.setContent(`<div><strong>Mi ubicacion</strong><br>`);
        	geolocalizacion.ubicacionActual.informacion.open(geolocalizacion.elementos.mapa, geolocalizacion.ubicacionActual.marcador);

        geolocalizacion.ubicacionActual.marcador.setPosition(posicionEncontrada);
        geolocalizacion.elementos.mapa.setCenter(posicionEncontrada);

    },
    mensajeError: (error)=>{ //funcion ejecutada cuando hay error en encontrar la ubicacion
        alert("Tenemos un problema con encontrar tu ubicación");
    },
    evento: ()=>{
        $("#encuentrame").click(geolocalizacion.buscar);
        $('#ruta').click(()=>{geolocalizacion.dibujarRuta(geolocalizacion.elementos.servicioIndicaciones,geolocalizacion.elementos.mostrarDireccion)});
    },
    crearMarcador:()=>{
        const icono = {
            url: 'https://icon-icons.com/icons2/740/PNG/512/bicycle_icon-icons.com_63321.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };
        let miUbicacion = new google.maps.Marker({ 
            animation: google.maps.Animation.DROP,
            map: geolocalizacion.elementos.mapa,
        });
        geolocalizacion.elementos.mapa.setZoom(15);
        return miUbicacion;

    }, 
    autocompletado: (entrada)=>{ //fncion para que cada input tenga el autocompletado
    	let info=new google.maps.InfoWindow();
    	let marcador=geolocalizacion.crearMarcador();
    	let autocompletar = new google.maps.places.Autocomplete(entrada);
	    	autocompletar.bindTo('bounds', geolocalizacion.elementos.mapa);
	    	autocompletar.addListener('place_changed', function() { //se le da el evento
	            let lugar = autocompletar.getPlace();
	            info.close();//se borra de la informacion y el marcador de antiguas ubicaciones dadas
            	marcador.setVisible(false);
            	//se borra la informacion y el marcador de ubicacion Actual, si es que está
            	if(geolocalizacion.ubicacionActual.informacion&&geolocalizacion.ubicacionActual.marcador){
            		geolocalizacion.ubicacionActual.informacion.close();
            		geolocalizacion.ubicacionActual.marcador.setVisible(false);
            	}
	            geolocalizacion.marcarUbicacion(lugar, info,marcador);
	        });
    },
     marcarUbicacion: (lugar, detalleUbicacion, marcador) =>{
        if (!lugar.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + lugar.name + "'");
            return;
        }
        // Si el lugar tiene una geometría, entonces presentarlo en un mapa.
        if (lugar.geometry.viewport) {
            geolocalizacion.elementos.mapa.fitBounds(lugar.geometry.viewport);
        } else {
            geolocalizacion.elementos.mapa.setCenter(lugar.geometry.location);
        }

        marcador.setPosition(lugar.geometry.location);
        marcador.setVisible(true);

        let direccion = '';
        if (lugar.address_components) {
            direccion = [
                (lugar.address_components[0] && lugar.address_components[0].short_name || ''),
                (lugar.address_components[1] && lugar.address_components[1].short_name || ''),
                (lugar.address_components[2] && lugar.address_components[2].short_name || '')
            ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + lugar.name + '</strong><br>' + direccion);
        detalleUbicacion.open(geolocalizacion.elementos.mapa, marcador);
    },
    dibujarRuta:(servicioIndicaciones, mostrarDireccion)=> {
    	console.log('hola');
        let origen = geolocalizacion.elementos.puntoOrigen;
        let destino = geolocalizacion.elementos.puntoDestino.value;
        if(destino != "" && origen != "") {
            servicioIndicaciones.route({
                origin: origen,
                destination: destino,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    mostrarDireccion.setDirections(response);
                } else {
                    geolocalizacion.mensajeError();
                }
            });
        }
    },

}

function initMap() {
   geolocalizacion.iniciar();

}