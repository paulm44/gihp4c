<?php

date_default_timezone_set('Africa/Abidjan');

function consultar($mesAnio, $sensor, $medida, $dispositivo) {

    try {
        $arrayMesAnio=  explode("-", $mesAnio);
        $mes = mktime( 0, 0, 0, $arrayMesAnio[0], 1, $arrayMesAnio[1] );
        //echo "El mes de ".date("F Y",$mes)." tiene ".date("t",$mes)." días";
        
        $fIni = $arrayMesAnio[1]."-".$arrayMesAnio[0]."-"."01" . " 00:00:00";
        $fFin = $arrayMesAnio[1]."-".$arrayMesAnio[0]."-".date("t",$mes) . " 23:59:59";
        $start = new MongoDate(strtotime($fIni));
        $end = new MongoDate(strtotime($fFin));
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
       
        return "";
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
        $patternFecha = '/^[0-1]?[0-9]-\d{4}$/';
        if (!preg_match($patternFecha, $_POST['fechaInicio'])){
            echo "Fecha Invalida ";
            return"";
        }
         
        $arrayFecha = explode("-", $_POST['fechaInicio']);
        if (checkdate($arrayFecha[0], 1, $arrayFecha[1])) {
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
        echo "Datos de entrada Invalidos" . $ex;
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
        $patternFecha = '/^[0-1]?[0-9]-\d{4}$/';
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
        if (checkdate($arrayFecha[0], 1, $arrayFecha[1]) && checkdate($arrayFecha1[0],1, $arrayFecha1[1])) {
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