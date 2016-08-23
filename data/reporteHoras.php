<?php

date_default_timezone_set('Africa/Abidjan');

function consultar($fechaInicio, $fechaFin, $hora, $sensor, $medida, $dispositivo) {

    try {

        $fIni = $fechaInicio . " 00:00:00";
        $fFin = $fechaFin . " 23:59:59";
        $start = new MongoDate(strtotime($fIni));
        $end = new MongoDate(strtotime($fFin));
        //echo "La fecha 1 es: " . $start . " la fecha 2 es: " . $end . "\n";
        //echo date(DATE_ISO8601, $start->sec);
        //echo "\n";
        //echo date(DATE_ISO8601, $end->sec);

        /**
         * Creamos una instancia de el conector al a BD
         */
        $m = new MongoClient("mongodb://webuser3:webproduccionv1.3@10.3.3.5/sensoresdb");
        $c = $m->selectDB("sensoresdb")->selectCollection("sen");
       
        
         // Array optimo
         
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
                '$project' => array(
                    'dp' => 1,
                    'sen' => 1,
                    'm' => 1,
                    'fecha' => 1,
                    'val'=>1,
                    'hour_part' => array('$hour' => '$fecha')
                )
            ),
            array(
                '$match' => array(
                    'hour_part'=>$hora
                )
            ),
            array(
                '$group' => array(
                    '_id' => array(
                        'anio' => array('$year' => '$fecha'),
                        'mes' => array('$month' => '$fecha'),
                        'dia' => array('$dayOfMonth' => '$fecha'),
                        'hora' => array('$hour' => '$fecha'),
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
         

        $out = $c->aggregate($pipeline);

        // $r = json_encode($out);
        //echo $r;
        //echo "Nueva Linea/n";
        $m->close();
        $resultado = json_encode($out["result"]);
        return $resultado;

        
    } catch (Exception $ex) {
       echo "se produjo un Error";
    }
}

if (isset($_POST['fechaInicio']) && isset($_POST['fechaFin'])&& isset($_POST['hora'])) {
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
         
        $patternHora = '/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/';
        if (!preg_match($patternHora, $_POST['hora'])) {
            echo "Hora Invalida";
            return"";
        }
        
        $arrayHora = explode(":", $_POST['hora']);
        $h=(int) $arrayHora[0];
        if(!($h<24)){
            echo "Hora Invalida" .$arrayHora[0] ;
            return"";
        }
        $arrayFecha = explode("-", $_POST['fechaInicio']);
        $arrayFecha1 = explode("-", $_POST['fechaFin']);
        if (checkdate($arrayFecha[1], $arrayFecha[2], $arrayFecha[0]) && checkdate($arrayFecha1[1], $arrayFecha1[2], $arrayFecha1[0])) {
            $pattern = '/^[\w]+$/';
            if (preg_match($pattern, $_POST['sensor']) && preg_match($pattern, $_POST['medida']) && preg_match($pattern, $_POST['dispositivo'])) {
                $v1 = consultar($_POST['fechaInicio'], $_POST['fechaFin'], $h, $_POST['sensor'], $_POST['medida'], $_POST['dispositivo']);
                echo $v1;
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