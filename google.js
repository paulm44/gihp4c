var googleUser = {};
  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '831510361387-lkko2b6td272guqrup0ph3d9nejojlps.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      attachSignin(document.getElementById('customBtn'));
    });
  };


  function attachSignin(element) {
     
     console.log(element.id);
     auth2.attachClickHandler(element, {}, function(googleUser){
      document.getElementById('name').innerText="Nombre: " + googleUser.getBasicProfile().getName();
      document.getElementById('correo').innerText="Email: " + googleUser.getBasicProfile().getEmail();
      document.getElementById('imagen').innerText="Imagen: " + googleUser.getBasicProfile().getImageUrl();
     },
     function(error) {
      alert(JSON.stringify(error, undefined, 2));
     });

  }
