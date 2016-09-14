<?php
if (isset($_POST['newSensor']) && !empty($_POST['codigo'])) {
	if(test_input($_POST['codigo']!= "" )){
		$codigo=$_POST['codigo'];
	/*$m = new MongoClient("localhost");
                    $db = $m->ivandb;
                    $collection1 = $db->dispositivos;
                    $a = array('nombre' => $codigo);
                    $collection1->insert($a);
                     $m->close();*/
                     echo $codigo;
                 }else

                 {
                 	echo "datos invalidos";
                 }
}

function test_input($data) {
// echo 'La entrada es: '. $data;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $pattern = '/^[\w]+$/';
    if (preg_match($pattern, $data)) {
        return $data;
    } else {
        return "";
    }
}

?>                    