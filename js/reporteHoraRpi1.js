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


$.ajax({url: 'data/Data.php',
    data: {"funcion": "obtenerDatos"},
    type: 'post',
    success: function (output) {
        
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
function obtenerFechaActual() {

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
    fechaActual = yyyy + "-" + mm + "-" + dd;
    return fechaActual;
}


function obtenerHora(){
    var hoy = new Date();
    return hoy.getHours();
}


document.getElementById("fechaInicio").value = obtenerFechaActual();
document.getElementById("hora").value= obtenerHora()+ ":00";

/**
 * Funcion que devuelve el valor minimo de un Array
 * @param {type} array
 * @returns {unresolved}
 */
function getMin(array) {
    return Math.min.apply(Math, array);
}

/**
 * Funcion que devuelve el valor maximo de un Array
 * @param {type} array
 * @returns {unresolved}
 */
function getMax(array) {
    return Math.max.apply(Math, array);
}



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
                    class: "newclass",
                    id: "g1",
                    valueField: "value",
                    //type: "smoothedLine",
                    lineThickness: 2,
                    bullet: "round"
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
        valueBalloonsEnabled: false
    },
    periodSelector: {
        position: "top",
        dateFormat: "YYYY-MM-DD JJ:NN",
        inputFieldWidth: 150,
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


console.log("hola de nuevo");
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
    var hora = document.getElementById("hora").value;
    console.error("La hora seleccionada es: " + hora.toString());

    if (!validarFecha(fechaInicio)) {
        config.panels[0].title = "Error: Fecha Invalida";
        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> Fecha Invalida: ' + fechaInicio + '</span></div>';
        console.error("Fecha Invalida");
        return;
    }

    config.panels[0].title = "Reporte para las : " +hora+" del dia "+ fechaInicio;
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

    console.log("Enviando consulta\n");
    console.log("fechaInicio: " + fechaInicio + " sensor: " + sensor + " medida: " + medida + " dispositivo: " + disp + "\n");
    $.ajax({url: 'data/reporteHoraRpi1.php',
        data: {"fechaInicio": fechaInicio,"hora": hora, "sensor": sensor, "medida": medida, "dispositivo": disp},
        type: 'post',
        success: function (output) {
            if (output == "[]") {
                var fechaNIni = fechaInicio + "T00:00:00"
                var fechaNFin = fechaInicio + "T23:59:00"
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
                console.error("No existen datos para esta fecha");
                return;
            }
            try {
                var JsonObject = JSON.parse(output);
                var fechaLongAux = "";
                console.log(output);
                console.log(JsonObject.length);
                for (x = 0; x < JsonObject.length; x++) {
                    var fechaAux = JsonObject[x].fecha;
                    var stringFecha = fechaAux.replace(" ", "T");
                    var newDate = new Date(stringFecha);
                    var a = JsonObject[x].val;
                    var b = a;
                    nuevosDatos.push({
                        date: newDate,
                        value: a,
                        volume: b
                    });
                }

                console.log("Datos configurados: " + JsonObject.length);
                config.dataSets[0].dataProvider = nuevosDatos;
                chart.validateData();

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
    var fechaDate = new Date(fechaAuxArr[0], fechaAuxArr[1] - 1, fechaAuxArr[2]);
    if (!fechaDate || fechaDate.getFullYear() == fechaAuxArr[0] &&
            fechaDate.getMonth() == fechaAuxArr[1] - 1 && fechaDate.getDate() == fechaAuxArr[2]) {
        return true;
    } else {
        return false;
    }
}