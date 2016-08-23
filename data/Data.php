<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Data
 *
 * @author Ivan
 */
if (isset($_POST['funcion']) && !empty($_POST['funcion'])) {
    if ($_POST['funcion'] == "obtenerDatos") {
        obtenerDatos();
    }
}

function obtenerDatos() {
try {
    $resultado = array();
    $dispositivos = array();
    $sensores = array();
    $acronimos = array();
    $m = new MongoClient("mongodb://webuser3:webproduccionv1.3@10.3.3.5/sensoresdb");
    $db = $m->sensoresdb;
    $collection1 = $db->dispositivos;
    $collection2 = $db->sensores;
    $collection3 = $db->acronimos;

    $rangeQuery = array();

    /**
     * Creamos una proyeccion que nos sirve para indicar los campos que 
     * queremos que nos retorne. El el cual indicamo False o true
     */
    $proyeccion = array("_id" => false);
    /**
     * Ejecutmos la consulta pasando como parametros la consulta y la proyeccion
     * y posterormente la ordenamos con sort
     */

    $cursorDispositivos = $collection1->find($rangeQuery, $proyeccion);
    $cursorSensores = $collection2->find($rangeQuery, $proyeccion);
    $cursorAcronimos = $collection3->find($rangeQuery, $proyeccion);
    

    /**
     * Almacenamos los resultado de la consulta en un array
     */
    

    foreach ($cursorDispositivos as $document) {
        //echo $document["name"] . "\n";
        $dispositivos[] = $document;
    }

    foreach ($cursorSensores as $document) {
        //echo $document["name"] . "\n";
        $sensores[] = $document;
    }
    foreach ($cursorAcronimos as $document) {
        //echo $document["name"] . "\n";
        $acronimos[] = $document;
    }
    $m->close();
    $resultado=[$dispositivos,$sensores, $acronimos];
    echo json_encode($resultado);
} catch (Exception $ex) {
        echo "se produjo un Error";
    }
    
    }

?>