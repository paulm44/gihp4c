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
function obtenerMesActual() {

    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
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
    var mm = hoy.getMonth();
    var yyyy = hoy.getFullYear();
    if (mm == 0) {
        yyyy = yyyy - 1;
        mm = 12;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    fechaAyer = mm + "-" + yyyy;
    return fechaAyer;
}

obtenerMesAnterior();
document.getElementById("fechaInicio").value = obtenerMesAnterior();
document.getElementById("fechaFin").value = obtenerMesActual();




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

    chart = new AmCharts.makeChart("chartdiv", config);
    var sensor = selectSensor.options[selectSensor.selectedIndex].value;
    var medida = selectValor.options[selectValor.selectedIndex].value;
    var disp = selectDispositivo.options[selectDispositivo.selectedIndex].value;
    var fechaInicio = document.getElementById("fechaInicio").value;
    var fechaFin = document.getElementById("fechaFin").value;
    if (!validarFecha(fechaInicio) && !validarFecha(fechaInicio)) {
        config.panels[0].title = "Error: Meses ingresados Invalidos";
        chart = new AmCharts.makeChart("chartdiv", config);
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/>Los meses Ingresados son invalidos </span></div>';
        console.error("Fecha Invalida");
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

    if (document.getElementById("nodatos")) {
        var nodatos = document.getElementById("nodatos");
        nodatos.parentElement.removeChild(nodatos);
    }

    if (!document.getElementById("loadingdiv")) {
        var mensajesGrafico = document.getElementById("mensajesGrafico");
        mensajesGrafico.innerHTML = '<div id="loadingdiv"><span><img oncontextmenu="return false;" src="imagenes/load1.gif" width="50px" height="50px"/> Cargando Grafico</span></div>';
    }

    $.ajax({url: 'data/reporteMensual.php',
        data: {"fechaInicio": fechaInicio, "fechaFin": fechaFin, "sensor": sensor, "medida": medida, "dispositivo": disp},
        type: 'post',
        success: function (output) {
            if (output == "[]"||output == "[[],[]]") {
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
                mensajesGrafico.innerHTML = '<div id="nodatos"><span><img src="imagenes/information.png" width="50px" height="50px"/> No existen datos para estos meses</span></div>';
                console.error("No existen datos para estos meses");
                return;
            }
            try {

                var jsonResultado = JSON.parse(output);
                var JsonObject = jsonResultado[0];
                var JsonObject1 = jsonResultado[1];
                var dia = "01";

                for (x = 0; x < JsonObject.length; x++) {
                    var mes = JsonObject[x]._id.mes;
                    if (JsonObject[x]._id.mes < 10) {
                        mes = "0" + JsonObject[x]._id.mes;
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
                    } else{
                        config.dataSets[1].title = fechaFin;
                    }
                    config.dataSets[0].dataProvider = nuevosDatos;
                    config.dataSets[1].dataProvider = nuevosDatos1;
                    console.log(">>>> " + config.dataSets[0].dataProvider.length + " y " + config.dataSets[1].dataProvider.length)
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
        return true;
    } else {
        return false;
    }
}