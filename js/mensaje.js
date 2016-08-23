/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function reset() {
    $("#toggleCSS").attr("href", "css/alertify.default.css");
    alertify.set({
        labels: {
            ok: "OK",
            cancel: "Cancel"
        },
        delay: 5000,
        buttonReverse: false,
        buttonFocus: "ok"
    });
}

$("#alert").on('click', function () {
    alertify.alert("<div class='row'><div class='col-md-4'><h2>Realizado por:</h2><h4>Ivan Yuquilima<br/><br/>Christian Argudo<br/><br/>Paul Montesdeoca</h4></div> <div class='col-md-6'><img src='imagenes/GIHP4C.png' class='img-responsive img-thumbnail' alt='gihp4c'></div></div>");
    return false;
});


