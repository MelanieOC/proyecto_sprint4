$('.dropdown-menu a').on('click', function(){
	let imagen=$(this).find($("img")).attr('src');
    $('.dropdown-toggle').html( `<img src='${imagen}'>`+ '<span class="caret"></span>');
    $("#codigo").val($(this).attr('id'));
    $("#telefono").focus();
})

$("#telefono").keyup(()=>{
	if($("#telefono").val().length==9){
		 $("#boton_telefono").removeClass('disabled');
		$('#boton_telefono').click(()=>{
			window.location.href='signup_datos.html';
		})
	}else{
		$("#boton_telefono").addClass('disabled');
		$("#boton_telefono").off('click');
	}
})

function validacion() {
	let validaciones = true;
 if ($('#nombre').val() == "") {
			 $('#nombre').next().show();
			 validaciones =  validaciones && false;
 } else {
			 $('#nombre').next().hide();
			 validaciones = validaciones && true;
 }

	 if ($('#email').val() == "") {
			 $('#email').next().show();
			 validaciones = validaciones && false;
	 } else if(!(/\S+@\S+\.\S+/.test($('#email').val()))) { //valida si tiene los caracteres de un email
			 $('#email').next().hide();
			 $('#email').next().next().show();
			 validaciones = validaciones && false;
	 } else {
			 $('#email').next().hide();
			 $('#email').next().next().hide();
			 validaciones = validaciones && true;
	 }


	 if ($('#apellido').val() === "") {
			 $('#apellido').next().show();
			 validaciones = validaciones && false;
	 } else {
			 $('#apellido').next().hide();
			 validaciones = validaciones && true;
	 }

	 return validaciones;

}
$("#check").click(()=>{
	if($("#check").prop('checked')){
		$("#boton_usuario").removeClass('disabled');
		$('#boton_usuario').click(()=>{
			console.log('hola');
			//window.location.href='signup_datos.html';
		})
	}else{
		$("#boton_usuario").addClass('disabled');
		$("#boton_usuario").off('click');
	}
})





const geolocalizacion={
	iniciar: ()=> {
		let mapdivMap = $("#mapa")[0];
		mapdivMap.style.width = (window.innerWidth);
   		mapdivMap.style.height = (window.innerHeight) + "px";
        geolocalizacion.elementos.mapa = new google.maps.Map($("#mapa")[0], geolocalizacion.mapaInicial);
        geolocalizacion.buscar();
        geolocalizacion.elementos.puntoDestino=$('#destino')[0];
				geolocalizacion.elementos.puntoOrigen=$("#origen");
        geolocalizacion.autocompletado(geolocalizacion.elementos.puntoDestino);
				geolocalizacion.evento();
				geolocalizacion.elementos.servicioIndicaciones = new google.maps.DirectionsService;
   		geolocalizacion.elementos.mostrarDireccion = new google.maps.DirectionsRenderer;
   		geolocalizacion.elementos.mostrarDireccion.setMap(geolocalizacion.elementos.mapa);
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
        puntoDestino:null,
				precio:null
    },
    ubicacionActual:{//datos de la ubicacion dada con encuentrame
    	latitud: null,
        longitud: null,
        informacion: null,
				origen:null,
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

				let geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': posicionEncontrada}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					geolocalizacion.ubicacionActual.origen=results[0]['formatted_address'];
				}
		 });

    },
    mensajeError: (error)=>{ //funcion ejecutada cuando hay error en encontrar la ubicacion
        alert("Tenemos un problema con encontrar tu ubicación");
    },
    evento: ()=>{
        $('#ruta').click(()=>{
					geolocalizacion.mostrar();
				});
    },
		mostrar:()=>{
			$(".ocultar").show();
			$("#origen").show();
			$("#solicitar").show();
			$("#ruta").hide();
			$("#origen").html(geolocalizacion.ubicacionActual.origen);
			$('#precio').html(geolocalizacion.elementos.precio);
			$('#menu_mapa .form-control, #menu_mapa button').css('margin', '0');
		},
    crearMarcador:()=>{
        const icono = {
            url: 'https://www.shareicon.net/download/2015/06/21/57812_pink_256x256.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };
        let miUbicacion = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: geolocalizacion.elementos.mapa,
						icon: icono
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

            	//se borra la informacion y el marcador de ubicacion Actual, si es que está
            	if(geolocalizacion.ubicacionActual.informacion&&geolocalizacion.ubicacionActual.marcador){
            		geolocalizacion.ubicacionActual.informacion.close();
            		geolocalizacion.ubicacionActual.marcador.setVisible(false);
            	}
	            geolocalizacion.marcarUbicacion(lugar, info,marcador);
							geolocalizacion.dibujarRuta(geolocalizacion.elementos.servicioIndicaciones,geolocalizacion.elementos.mostrarDireccion);
	        });
    },
     marcarUbicacion: (lugar, detalleUbicacion, marcador) =>{
        marcador.setPosition(lugar.geometry.location);

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
        let destino = geolocalizacion.elementos.puntoDestino.value;
        if(destino != "") {
            servicioIndicaciones.route({
                origin: new google.maps.LatLng(geolocalizacion.ubicacionActual.latitud, geolocalizacion.ubicacionActual.longitud),
                destination: destino,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    mostrarDireccion.setDirections(response);
										geolocalizacion.elementos.precio = response.routes[0].overview_path.length / 10  + 'USD';
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
