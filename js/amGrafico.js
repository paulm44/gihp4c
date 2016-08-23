/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var dispositivos = ['E1', 'E2', 'E3', 'E4', 'E5'];
var sensores = [['dht11', 'hum'], ['dht11', 'hum', 'part'], ['hum'], ['part'], ['dht11']];
var valores = {dht11: ['c', 'f', 'h', 'dp'], hum: ['hs', 'phs'], part: ['sng', 'v', 'dd']};
var escalaInicio = 0;
var escalaFin = 100;
var scaleSteps = 10;
var scaleStepWidth = (escalaFin - escalaInicio) / 10;

var selectDispositivo = document.getElementById('selectDispositivo');
var selectSensor = document.getElementById('selectSensor');
var selectValor = document.getElementById('selectValor');



function cargarDispositivo() {
    selectDispositivo.options.length = 0;
    for (var i = 0; i < dispositivos.length; i++) {
        var opt = document.createElement('option');
        opt.value = dispositivos[i];
        opt.innerHTML = dispositivos[i];
        selectDispositivo.appendChild(opt);
    }

}
function cargarSensor() {
    selectSensor.options.length = 0;
    var indice = selectDispositivo.selectedIndex;
    for (var i = 0; i < sensores[indice].length; i++) {
        var opt = document.createElement('option');
        opt.value = sensores[indice][i];
        opt.innerHTML = sensores[indice][i];
        selectSensor.appendChild(opt);
        cargarValor();
    }
}
function cargarValor() {
    selectValor.options.length = 0;
    var opcion = selectSensor.options[selectSensor.selectedIndex].value;
    for (var i = 0; i < valores[opcion].length; i++) {
        var opt = document.createElement('option');
        opt.value = valores[opcion][i];
        opt.innerHTML = valores[opcion][i];
        selectValor.appendChild(opt);
    }


}

cargarDispositivo();
cargarSensor();

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

/**
 * Funcion utilizada para conocer la fecha de Ayer
 * @returns {String}
 */
function obtenerFechaAyer() {

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
obtenerFechaActual();
obtenerFechaAyer();
document.getElementById("fechaInicio").value = fechaAyer;
document.getElementById("fechaFin").value = fechaActual;


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






function obtenerDatos() {
    var sensor = selectSensor.options[selectSensor.selectedIndex].value;
    var medida = selectValor.options[selectValor.selectedIndex].value;
    var disp = selectDispositivo.options[selectDispositivo.selectedIndex].value;
    var fechaInicio = document.getElementById("fechaInicio").value;
    var fechaFin = document.getElementById("fechaFin").value;
    var nuevosDatos = [];
    $.ajax({url: 'testing_1.php',
        data: {"fechaInicio": fechaInicio, "fechaFin": fechaFin, "sensor": sensor, "medida": medida, "dispositivo": disp},
        type: 'post',
        success: function (output) {
            //alert(output);
            if (output == "[]") {
                alert("No llego nada");
                return nuevosDatos;
            }
            //var JsonObject = JSON.parse(output);
            alert(output);
           console.log(output);
            
            var JsonObject = JSON.parse(output);
            var fechaLongAux = "";
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
            alert("Datos configurados: "+ JsonObject.length);
            //alert("A punto de salir");
        }
    });

    return nuevosDatos;
}

function handleRender() {
    alert("ZOOOOOOM");

}




var chartData = [];

var config = {
    type: "stock",
    backgroundAlpha: 1,
    backgroundColor: "#AAA",
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
            dataProvider:chartData,
            categoryField: "date"
        }],
    panels: [{
            showCategoryAxis: false,
            title: "Value",
            percentHeight: 70,
            stockGraphs: [{
                    class: "newclass",
                    id: "g1",
                    valueField: "value",
                    type: "smoothedLine",
                    lineThickness: 2,
                    bullet: "round"
                }],
            stockLegend: {
                valueTextRegular: " ",
                markerType: "none"
            }
        }, {
            title: "Volume",
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
        position: "top"
    },
    chartCursorSettings: {
        valueBalloonsEnabled: true
    },
    periodSelector: {
        position: "top",
        dateFormat: "YYYY-MM-DD JJ:NN",
        inputFieldWidth: 150,
        periods: [ {
                period: "hh",
                count: 12,
                label: "12 hours"
            }, {
                period: "DD",
                count: 1,
                label: "1 day"
            }, {
                period: "DD",
                count: 2,
                label: "2 days"
            },
            {
                period: "DD",
                count: 5,
                label: "5 days"
            },
            {
                period: "MM",
                count: 1,
                label: "1 MES"
            },
            {
                period: "MAX",
                label: "MAX"
            }]
    },
    panelsSettings: {
        usePrefixes: true
    },
    "export": {
        "enabled": true,
        "position": "bottom-right"
    },
    "listeners": [{
            "event": "dataUpdated",
            "method": handleRender
        }]
};
AmCharts.theme = AmCharts.themes.light;
var chart = new AmCharts.makeChart("chartdiv", config);
//chart.addListener("dataUpdated", zoomChart);


function llamada() {
    config.dataSets[0].dataProvider = obtenerDatos();
    chart.validateData();
    alert("Llamando");
}

llamada();