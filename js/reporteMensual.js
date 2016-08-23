/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var dispositivos = []
var sensores = [];
var acronimos = []


var selectDispositivo = document.getElementById('selectDispositivo');
var selectSensor = document.getElementById('selectSensor');
var selectValor = document.getElementById('selectValor');

function buscarAcronimo(nombre) {
    for (var i = 0; i < acronimos.length; i++) {
        if (acronimos[i].acronimo == nombre) {
            return acronimos[i].valor;
        }
    }
    return nombre;
}


function cargarDispositivo() {
    selectDispositivo.options.length = 0;
    for (var i = 0; i < dispositivos.length; i++) {
        var opt = document.createElement('option');
        opt.value = dispositivos[i].nombre;
        opt.innerHTML = dispositivos[i].nombre;
        selectDispositivo.appendChild(opt);
    }
}

function cargarSensor() {
    selectSensor.options.length = 0;
    var dispositivoIndex = selectDispositivo.options[selectDispositivo.selectedIndex].value;
    var auxSensoresDisp = [];
    for (var i = 0; i < dispositivos.length; i++) {
        if (dispositivos[i].nombre == dispositivoIndex) {
            for (var j = 0; j < dispositivos[i].sensores.length; j++) {
                var opt = document.createElement('option');
                opt.value = dispositivos[i].sensores[j];
                opt.innerHTML = buscarAcronimo(dispositivos[i].sensores[j]);
                selectSensor.appendChild(opt);
            }
            break;
        }
    }
    cargarValor();

}
function cargarValor() {
    selectValor.options.length = 0;
    var opcion = selectSensor.options[selectSensor.selectedIndex].value;
    for (var i = 0; i < sensores.length; i++) {
        if (sensores[i].sensor == opcion) {
            for (var j = 0; j < sensores[i].valores.length; j++) {
                var opt = document.createElement('option');
                opt.value = sensores[i].valores[j];
                opt.innerHTML = buscarAcronimo(sensores[i].valores[j]);
                selectValor.appendChild(opt);
            }
        }
    }
    obtenerDatos();

}

/**
 * Metodo Utilizado para obtener los datos de los
 * sensores y llenar los select
 * @param {type} param
 */
$.ajax({url: 'data/Data.php',
    data: {"funcion": "obtenerDatos"},
    type: 'post',
    success: function (output) {
        //alert(output);
        if (output == "[]") {
            alert("No llego nada");
            return nuevosDatos;
        }
        var jsonObjectData;
        try {
            jsonObjectData = JSON.parse(output);
        } catch (err) {
            console.error("Se produjo un error con el servidor");

            var mensajesGrafico = document.getElementById("mensajesGrafico");
            while (mensajesGrafico.firstChild) {
                mensajesGrafico.removeChild(mensajesGrafico.firstChild);
            }
            mensajesGrafico.innerHTML = mensajesGrafico.innerHTML + '<div id="nodatos"><span><img src="imagenes/error.png" width="50px" height="50px"/> Se produjo un error obteniendo los datos</span></div>';
            console.log(output);
            return {};

        }
        dispositivos = jsonObjectData[0];
        sensores = jsonObjectData[1];
        acronimos = jsonObjectData[2];

        cargarDispositivo();
        cargarSensor();

    }
});



/**
 * Funcion utilizada para conocer la fecha actual
 * @returns {String}
 */
function obtenerMesActual() {

    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    fechaActual = mm + "-" + yyyy;
    return fechaActual;
}

/**
 * Funcion utilizada para conocer la fecha de Ayer
 * @returns {String}
 */
function obtenerMesAnterior() {

    var hoy = new Date();
    var dd = hoy.getDate() - 1;
    var mm = hoy.getMonth() + 1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    fechaAyer = yyyy + "-" + mm + "-" + dd;
    return fechaAyer;
}

obtenerMesAnterior();
document.getElementById("fechaInicio").value = obtenerMesActual();




var chartData = [];

var config = {
    type: "stock",
    theme: "dark",
    addClassNames: true,
    categoryAxesSettings: {
        minPeriod: "mm"
    },
    dataSets: [{
            color: "#81DAF5",
            fieldMappings: [{
                    fromField: "value",
                    toField: "value"
                }, {
                    fromField: "volume",
                    toField: "volume"
                }],
            dataProvider: chartData,
            categoryField: "date"
        }],
    panels: [{
            showCategoryAxis: false,
            backgroundAlpha: 1,
            backgroundColor: "#3f3f4f",
            title: "Valor",
            percentHeight: 70,
            stockGraphs: [{
                    id: "g1",
                    lineColor: "#00CC00",
                    valueField: "value",
                    dashLength: 0,
                    bullet: "round",
                    balloonText: "<b><span style='font-size:14px;'>[[value]]</span></b>",
                    balloon: {
                        drop: true
                    }
                }],
            stockLegend: {
                valueTextRegular: " ",
                markerType: "none"
            }
        }, {
            title: "Valor",
            percentHeight: 30,
            stockGraphs: [{
                    valueField: "volume",
                    type: "column",
                    cornerRadiusTop: 2,
                    fillAlphas: 1
                }],
            stockLegend: {
                valueTextRegular: " ",
                markerType: "none"
            }
        }


    ],
    chartScrollbarSettings: {
        graph: "g1",
        usePeriod: "10mm",
        position: "top",
    },
    chartCursorSettings: {
        valueBalloonsEnabled: true
    },
    periodSelector: {
        position: "top",
        inputFieldsEnabled: false,
        periods: [{
                period: "hh",
                count: 12,
                label: "12 Horas"
            },
            {
                period: "MAX",
                label: "Maximo",
                selected: true
            }]
    },
    panelsSettings: {
        usePrefixes: true,
        backgroundAlpha: 1,
        backgroundColor: "#3f3f4f"
    },
    "export": {
        "enabled": true,
        "position": "bottom-right"
    },
    "listeners": [
        {
            "event": "rendered",
            "method": function (e) {
                if (document.getElementById("loadingdiv")) {
                    var loadingdiv = document.getElementById("loadingdiv");
                    loadingdiv.parentElement.removeChild(loadingdiv);
                }
            }
        }
    ]
};


var chart;

/**
 * Funcion utilizada para obtener datos de la 
 * base de datos y luego renderizarlos en el grafico
 * @returns {undefined}
 */
function obtenerDatos() {
    config.dataSets[0].dataProvider = [];
    var sensor = selectSensor.options[selectSensor.selectedIndex].value;
    var medida = selectValor.options[selectValor.selectedIndex].value;
    var disp = selectDispositivo.options[selectDispositivo.selectedIndex].value;
    var fechaInicio = document.getElementById("fechaInicio").value;
    if (!validarFecha(fechaInicio)) {

        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> Fecha Invalida: ' + fechaInicio + '</span></div>';
        console.error("Fecha Invalida");
        return;
    }
    config.panels[0].title = "Reporte: " + fechaInicio;
    chart = new AmCharts.makeChart("chartdiv", config);
    var nuevosDatos = [];

    if (document.getElementById("nodatos")) {
        var nodatos = document.getElementById("nodatos");
        nodatos.parentElement.removeChild(nodatos);
    }

    if (!document.getElementById("loadingdiv")) {
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="loadingdiv"><span><img oncontextmenu="return false;" src="imagenes/load1.gif" width="50px" height="50px"/> Cargando Grafico</span></div>';
    }

    $.ajax({url: 'data/reporteMensual.php',
        data: {"fechaInicio": fechaInicio, "sensor": sensor, "medida": medida, "dispositivo": disp},
        type: 'post',
        success: function (output) {
            if (output == "[]") {
                var fechaSplit = fechaInicio.split("-");
                var fechaNIni = fechaSplit[1] + "-" + fechaSplit[0] + "-01" + "T00:00:00";
                var fechaNFin = fechaSplit[1] + "-" + fechaSplit[0] + "-01" + "T23:59:00";
                nuevosDatos.push({
                    date: fechaNIni,
                    value: 0,
                    volume: 0
                });
                nuevosDatos.push({
                    date: fechaNFin,
                    value: 0,
                    volume: 0
                });
                config.dataSets[0].dataProvider = nuevosDatos;
                chart.validateData();
                var mensajesGrafico = document.getElementById("mensajesGrafico");
                mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> No existen datos para esta fecha</span></div>';
                console.error("No existen datos para esta fecha+++");
                return;
            }
            try {
                var JsonObject = JSON.parse(output);
                var fechaLongAux = "";
                console.log(output);
                console.log(JsonObject.length);
                for (x = 0; x < JsonObject.length; x++) {
                    console.log(JsonObject[x]._id.anio + " " + JsonObject[x].promedio);
                    var mes = JsonObject[x]._id.mes;
                    if (mes < 10) {
                        mes = "0" + mes;
                    }

                    var hora = JsonObject[x]._id.hora;
                    if (hora < 10) {
                        hora = "0" + hora;
                    }
                    var stringFecha = JsonObject[x]._id.anio + "-" + mes + "-01T" +
                            hora + ":00:00";
                    var newDate = new Date(stringFecha);
                    nuevosDatos.push({
                        date: newDate,
                        value: (Math.round(JsonObject[x].promedio * 100) / 100),
                        volume: (Math.round(JsonObject[x].promedio * 100) / 100)
                    });

                }
                console.log("Datos configurados: " + JsonObject.length);
                config.dataSets[0].dataProvider = nuevosDatos;

                chart.validateData();
                console.log(output);
            } catch (err) {
                if (document.getElementById("nodatos")) {
                    var nodatos = document.getElementById("nodatos");
                    nodatos.parentElement.removeChild(nodatos);
                }
                var mensajesGrafico = document.getElementById("mensajesGrafico");
                mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/error.png" width="50px" height="50px"/> Se produjo un error obteniendo los datos</span></div>';
                console.error("Se produjo un error obteniendo los datos")
                console.log(output);
                return;
            }

        }
    });
}


function validarFecha(fecha) {
    var fechaAuxArr = fecha.split('-');
    var fechaDate = new Date(fechaAuxArr[1], fechaAuxArr[0] - 1, 1);
    if (!fechaDate || fechaDate.getFullYear() == fechaAuxArr[1] &&
            fechaDate.getMonth() == fechaAuxArr[0] - 1) {
        //alert(fechaDate.toDateString());
        return true;
    } else {
        return false;
    }
}