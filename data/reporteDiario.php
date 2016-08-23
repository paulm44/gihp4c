<?php
//ini_set('MAX_EXECUTION_TIME', -1);
date_default_timezone_set('Africa/Abidjan');


MongoCursor::$timeout = -1;

function consultar($fechaInicio, $sensor, $medida, $dispositivo) {

    try {

        $fIni = $fechaInicio . " 00:00:00";
        $fFin = $fechaInicio . " 23:59:59";
        $start = new MongoDate(strtotime($fIni));
        $end = new MongoDate(strtotime($fFin));
        

        /**
         * Creamos una instancia de el conector al a BD
         */

        $m = new MongoClient("mongodb://webuser3:webproduccionv1.3@10.3.3.5/sensoresdb");
        $c = $m->selectDB("sensoresdb")->selectCollection("sen");
        $pipeline = array(
            array(
                '$match' => array(
                    'dp' => $dispositivo,
                    'sen' => $sensor,
                    'm' => $medida,
                    'fecha' => array(
                        '$gte' => $start, '$lte' => $end
                    )
                )
            ),
            array(
                '$group' => array(
                    '_id' => array(
                        'anio' => array('$year' => '$fecha'),
                        'mes' => array('$month' => '$fecha'),
                        'dia' => array('$dayOfMonth' => '$fecha'),
                        'hora' => array('$hour' => '$fecha'),
                       // 'minuto'=>  array('$minute' =>'$fecha'),
                        'dp' => '$dp',
                        'sen' => '$sen',
                        'm' => '$m'
                    ),
                    'promedio' => array('$avg' => '$val'),
                    'contador' => array('$sum' => 1),
                    'suma' => array('$sum' => '$val'),
                )
            ),
            array(
                '$sort' => array(
                    '_id' => 1
                )
            )
        );
        
        
//$options = array("maxTimeMS" => true);
        $out = $c->aggregate($pipeline);

        $m->close();
        $resultado = json_encode($out["result"]);
        return $resultado;

    } catch (Exception $ex) {
        echo "se produjo un Error";
    }
}


if (isset($_POST['fechaInicio']) && !isset($_POST['fechaFin'])) {
    try {
        //recibo como parametros anio mes dia
        //bool checkdate ( int $month , int $day , int $year )
        /**
         * Validaciones de los campos de entrada como:
         * -fechas
         * -nombres de sensor
         * -medida
         * -dispositivo
         */
        $patternFecha = '/^\d{4}-[0-1]?[0-9]-[0-3]?[0-9]$/';
        if (!preg_match($patternFecha, $_POST['fechaInicio'])){
            echo "Fecha Invalida";
            return"";
        }
          
        $arrayFecha = explode("-", $_POST['fechaInicio']);
        if (checkdate($arrayFecha[1], $arrayFecha[2], $arrayFecha[0])) {
            $pattern = '/^[\w]+$/';
            if (preg_match($pattern, $_POST['sensor']) && preg_match($pattern, $_POST['medida']) && preg_match($pattern, $_POST['dispositivo'])) {
                echo consultar($_POST['fechaInicio'], $_POST['sensor'], $_POST['medida'], $_POST['dispositivo']);
            } else {
                echo "Datos de entrada Invalidos";
            }
        } else {
            echo "Fecha Invalida";
            
        }
    } catch (Exception $ex) {
        echo "Datos de entrada Invalidos";
    }
}



if (isset($_POST['fechaInicio']) && isset($_POST['fechaFin'])) {
    try {
        //recibo como parametros anio mes dia
        //bool checkdate ( int $month , int $day , int $year )
        /**
         * Validaciones de los campos de entrada como:
         * -fechas
         * -nombres de sensor
         * -medida
         * -dispositivo
         */
        $patternFecha = '/^\d{4}-[0-1]?[0-9]-[0-3]?[0-9]$/';
        if (!preg_match($patternFecha, $_POST['fechaInicio'])){
            echo "Fecha Invalida";
            return"";
        }
        if (!preg_match($patternFecha, $_POST['fechaFin'])){
            echo "Fecha Invalida";
            return"";
        }
         
         
        $arrayFecha = explode("-", $_POST['fechaInicio']);
        $arrayFecha1 = explode("-", $_POST['fechaFin']);
        if (checkdate($arrayFecha[1], $arrayFecha[2], $arrayFecha[0]) && checkdate($arrayFecha1[1], $arrayFecha1[2], $arrayFecha1[0])) {
            $pattern = '/^[\w]+$/';
            if (preg_match($pattern, $_POST['sensor']) && preg_match($pattern, $_POST['medida']) && preg_match($pattern, $_POST['dispositivo'])) {
                $v1 = consultar($_POST['fechaInicio'], $_POST['sensor'], $_POST['medida'], $_POST['dispositivo']);
                $v2 = consultar($_POST['fechaFin'], $_POST['sensor'], $_POST['medida'], $_POST['dispositivo']);
                echo "[" . $v1 . "," . $v2 . "]";
            } else {
                echo "Datos de entrada Invalidos";
            }
        } else {
            echo "Fechas Invalidas";
        }
    } catch (Exception $ex) {
        echo "Datos de entrada Invalidos";
    }
}