
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

/**
 * Funcion utilizada para conocer la fecha de Ayer
 * @returns {String}
 */
function obtenerFechaAyer() {

    var hoy = new Date();
    var ayer = new Date(hoy.getTime() - 24 * 60 * 60 * 1000);
    var dd = ayer.getDate();
    var mm = ayer.getMonth() + 1; //hoy es 0!
    var yyyy = ayer.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    fechaAyer = yyyy + "-" + mm + "-" + dd;
    return fechaAyer;
}


document.getElementById("fechaInicio").value = obtenerFechaAyer();
document.getElementById("fechaFin").value = obtenerFechaActual();




var chartData1 = [];
var chartData2 = [];

var config = {
    type: "stock",
    categoryAxesSettings: {
        minPeriod: "mm"
    },
    dataSets: [{
            title: "first data set",
            fieldMappings: [{
                    fromField: "value",
                    toField: "value"
                }],
            dataProvider: chartData1,
            categoryField: "date"
        },
        {
            title: "second data set",
            compared: true,
            fieldMappings: [{
                    fromField: "value",
                    toField: "value"
                }],
            dataProvider: chartData2,
            categoryField: "date"
        },
    ],
    panels: [{
            showCategoryAxis: true,
            title: "Value",
            percentHeight: 100,
            stockGraphs: [{
                    id: "g1",
                    valueField: "value",
                    comparable: true,
                    compareField: "value",
                    bullet: "round",
                    bulletBorderColor: "#FFFFFF",
                    bulletBorderAlpha: 1,
                    balloonText: "&nbsp;&nbsp; &nbsp;  [[title]]: <b>[[value]]</b>",
                    compareGraphBalloonText: "&nbsp; [[title]]: <b>[[value]]</b>",
                    compareGraphBullet: "round",
                    compareGraphBulletBorderColor: "#FFFFFF",
                    compareGraphBulletBorderAlpha: 1
                }],
            stockLegend: {
                valueTextComparing: "[[value]]",
                periodValueTextComparing: "[[value.close]]",
                periodValueTextRegular: "[[value.close]]"
            }
        }],
    chartScrollbarSettings: {
        graph: "g1",
        usePeriod: "10mm",
        position: "top"
    },
    chartCursorSettings: {
        valueBalloonsEnabled: true,
        valueLineEnabled: true,
        valueLineBalloonEnabled: true
    },
    "export": {
        "enabled": true,
        "position": "bottom-right",
    }, panelsSettings: {
        recalculateToPercents: "never"
    },
    periodSelector: {
        backgroundColor: "#3f3f4f",
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
    }, "categoryAxis":
            {
                "startOnAxis": true
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

function obtenerDatos() {
    var nuevosDatos = [];
    var nuevosDatos1 = [];
    config.dataSets[0].dataProvider = [];
    config.dataSets[1].dataProvider = [];

    var sensor = selectSensor.options[selectSensor.selectedIndex].value;
    var medida = selectValor.options[selectValor.selectedIndex].value;
    var disp = selectDispositivo.options[selectDispositivo.selectedIndex].value;
    var fechaInicio = document.getElementById("fechaInicio").value;
    var fechaFin = document.getElementById("fechaFin").value;
    if (!validarFecha(fechaInicio) && !validarFecha(fechaFin)) {
        config.panels[0].title = "Las fechas son Invalidas";
        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/>Las fechas ingresadas son invalidas</span></div>';
        console.error("Fechas Invalidas");
        return;
    }
    if (!validarFecha(fechaInicio)) {
        config.panels[0].title = "Error: Fecha Inicio Invalida";
        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> Fecha Invalida: ' + fechaInicio + '</span></div>';
        console.error("Fecha Invalida");
        return;
    }
    if (!validarFecha(fechaFin)) {
        config.panels[0].title = "Error: Fecha Fin Invalida";
        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> Fecha Invalida: ' + fechaFin + '</span></div>';
        console.error("Fecha Invalida");
        return;
    }
    config.panels[0].title = "Comparativa entre: " + fechaInicio + " y " + fechaFin;
    chart = new AmCharts.makeChart("chartdiv", config);

    if (document.getElementById("nodatos")) {
        var nodatos = document.getElementById("nodatos");
        nodatos.parentElement.removeChild(nodatos);
    }

    if (!document.getElementById("loadingdiv")) {
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="loadingdiv"><span><img oncontextmenu="return false;" src="imagenes/load1.gif" width="50px" height="50px"/> Cargando Grafico</span></div>';
    }

    $.ajax({url: 'data/reporteDiario.php',
        data: {"fechaInicio": fechaInicio, "fechaFin": fechaFin, "sensor": sensor, "medida": medida, "dispositivo": disp},
        type: 'post',
        success: function (output) {
            if (output == "[[],[]]") {
                var fechaNIni = fechaInicio + "T00:00:00"
                var fechaNFin = fechaInicio + "T23:59:00"
                nuevosDatos.push({
                    date: fechaNIni,
                    value: 0
                });
                console.log(fechaNFin);
                nuevosDatos.push({
                    date: fechaNFin,
                    value: 0
                });
                config.dataSets[0].dataProvider = nuevosDatos;
                chart.validateData();
                var mensajesGrafico = document.getElementById("mensajesGrafico");
                mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> No existen datos ninguna de las dos fechas</span></div>';
                console.error("No existen datos para ambas fechas");
                return;
            }
            console.log(output);

            try {
                var jsonResultado = JSON.parse(output);
                var JsonObject = jsonResultado[0];
                var JsonObject1 = jsonResultado[1];

                for (x = 0; x < JsonObject.length; x++) {
                    var mes = JsonObject[x]._id.mes;
                    if (JsonObject[x]._id.mes < 10) {
                        mes = "0" + JsonObject[x]._id.mes;
                    }
                    var dia = JsonObject[x]._id.dia;
                    if (dia < 10) {
                        dia = "0" + dia;
                    }
                    var hora = JsonObject[x]._id.hora;
                    if (JsonObject[x]._id.hora < 10) {
                        hora = "0" + JsonObject[x]._id.hora;
                    }
                    var stringFecha = JsonObject[x]._id.anio + "-" + mes + "-" + dia + "T" +
                            hora + ":00:00";
                    var newDate = new Date(stringFecha);
                    nuevosDatos.push({
                        date: newDate,
                        value: (Math.round(JsonObject[x].promedio * 100) / 100)
                    });

                }

                for (x = 0; x < JsonObject1.length; x++) {

                    var hora = JsonObject1[x]._id.hora;
                    if (JsonObject1[x]._id.hora < 10) {
                        hora = "0" + JsonObject1[x]._id.hora;
                    }
                    if (JsonObject.length == 0) {
                        var stringFecha = fechaFin + "T" +
                                hora + ":00:00";

                    } else {
                        var mes = JsonObject[x]._id.mes;
                        if (JsonObject[x]._id.mes < 10) {
                            mes = "0" + JsonObject[x]._id.mes;
                        }
                        var dia = JsonObject[x]._id.dia;
                        if (dia < 10) {
                            dia = "0" + dia;
                        }
                        var stringFecha = JsonObject[x]._id.anio + "-" + mes + "-" + dia + "T" +
                                hora + ":00:00";
                    }
                    var newDate = new Date(stringFecha);
                    nuevosDatos1.push({
                        date: newDate,
                        value: (Math.round(JsonObject1[x].promedio * 100) / 100)
                    });
                }
                if (nuevosDatos.length > 0) {
                    config.dataSets[0].title = fechaInicio;
                    if (nuevosDatos1 == 0) {
                        config.dataSets[1].title = fechaFin + "(No se obtuvieron datos)";
                    } else {
                        config.dataSets[1].title = fechaFin;
                    }
                    config.dataSets[0].dataProvider = nuevosDatos;
                    config.dataSets[1].dataProvider = nuevosDatos1;
                } else {
                    config.dataSets[0].title = fechaFin;
                    config.dataSets[1].title = fechaInicio + "(No se obtuvieron datos)";
                    config.dataSets[0].dataProvider = nuevosDatos1;
                    config.dataSets[1].dataProvider = nuevosDatos;
                }
                chart.validateData();

            } catch (err) {
                if (document.getElementById("nodatos")) {
                    var nodatos = document.getElementById("nodatos");
                    nodatos.parentElement.removeChild(nodatos);
                }
                var mensajesGrafico = document.getElementById("mensajesGrafico");
                mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/error.png" width="50px" height="50px"/> Se produjo un error obteniendo los datos</span></div>';
                console.error("Se produjo un error obteniendo los datos" + err.toString());
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