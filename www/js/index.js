/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    document.getElementById("cameraTakePicture").addEventListener 
    ("click", cameraTakePicture); 
    document.getElementById("saveimg").addEventListener 
    ("click", saveImg); 

    
}
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl, {})
})

var provider = new firebase.auth.GoogleAuthProvider();
var loged = 0;

const firedb = firebase.database().ref();
const auth = firebase.auth();
const storage = firebase.storage();
var user = firebase.auth().currentUser;
const commetimg= firebase.database().ref('commetimg');

class Commetimg {
    key;
    urlImg;
    userName;
    userKey;
    comment;
    likes; 
    
    constructor() {
        this.key = "";
        this.urlImg = "";
        this.userName= "";
        this.userKey = "";
        this.comment = "";
        this.likes = []; 
    }
}


firebase.database().ref('usuario').once('value',function(snapshot){
    snapshot.forEach(function(childSnapshot){
        reg=childSnapshot.val()
        key=childSnapshot.key
        
        $('test').append(`
            <div class="coment">
                <h2>${reg.user}</h2>
                <p>${reg.text}</p>
            </div>
        `);
        console.log(key)
    })
});

$('#reg').click(function (e) { 
    e.preventDefault();
    $('#exampleModal').modal('toggle');
});

$('#enviar').click(function (e) { 
    e.preventDefault();
    email = $('#validationCustom01').val();
    password = $('#validationCustom02').val();
    acept = $('#invalidCheck').prop('checked');
    
    if($('#validationCustom02').val() == $('#validationCustom03').val()){
        auth
        .createUserWithEmailAndPassword(email,password)
        .then(userCredential=>{
        console.log('signup')
        $('#userName').modal('toggle');
        $('#exampleModal').modal('toggle');
        })
        window.location.replace("login.html");
    }
    else{
        alert("contraseña no coinside")
    }

    console.log('click')
});

$('#ingresar').click(function (e) { 
    e.preventDefault();
    email = $('#email').val();
    password = $('#password').val()

    auth
    .signInWithEmailAndPassword(email,password)
    .then(userCredential=>{
    console.log('signin')
    window.location.replace("index.html");

    })
})
// iniciar con google

$('#google').click(function (e) { 
    e.preventDefault();
    auth
    .signInWithPopup(provider)
    .then((result) => {
       /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
       // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
       // The signed-in user info.
        var user = result.user;
       // ...
    }).catch((error) => {
       // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      // The email of the user's account used.
        var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      // ...
    });
    console.log('click')
});


// cerrar sesion

$('#logout').click(function (e) { 
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log('sign out')
        window.location.replace("login.html");
    })
    location.reload()
});

//dibujar contenido en la pantalla de muro
cont =[]; //arreglo que contiene las publicaciones del usuario , para poder dibujarlas en un loop for
//funcion que muesta los usuarios de la app , y datos del usuario conectado 
function contenido(x) {
    $('#muro').append(
        `<div class="contenido mx-2 my-2">
            <div class="userId">
            <img src="img/kisspng-avatar-user-profile-male-logo-profile-icon-5b238cafcb8559.4398361515290564318336.jpg" alt="" style="width:80px; height:80px; border:1px solid black;;border-radius: 50%;" >
            <img src="img/kisspng-avatar-user-profile-male-logo-profile-icon-5b238cafcb8559.4398361515290564318336.jpg" alt="" style="width:80px; height:80px; border:1px solid black;;border-radius: 50%;" >
            <img src="img/kisspng-avatar-user-profile-male-logo-profile-icon-5b238cafcb8559.4398361515290564318336.jpg" alt="" style="width:80px; height:80px; border:1px solid black;;border-radius: 50%;" >
            </div>
            <div class="user">
                <h5 class="mt-2" id="name">${x}</h3>
            </div>
        </div>`
    );
}

//consulta de autenticacion

    auth.onAuthStateChanged(user=>{
        if(user){
            console.log('signed')
            console.log(user);
            
            var name, email, photoUrl, uid, emailVerified;

            if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.
            }
            console.log(name)
            contenido(name)
        }
        else{
            console.log('not signed');
        }
    })

    $('#close4').click(function (e) { 
        e.preventDefault();
        $('#perfil').modal('toggle');
    });

    $('#editar').click(function (e) { 
        e.preventDefault();
        $('#perfil').modal('toggle');
    });

    
//agregar nombre de ususario y foto de perfil

$('#update').click(function (e) { 
    e.preventDefault();
    usuario = document.getElementById('user').value;
    //perf = $('#foto').val();
    var user = firebase.auth().currentUser;

    user.updateProfile({
    displayName: usuario,
    //photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
  // Update successful.
    }).catch(function(error) {
  // An error happened.
    });

    console.log(user)
    location.reload()
});

function posteo(){
    let user = $('#post').val();
    let text = $("#texto").val();

    if(text!="" && url!=""){
        let nuevoPost = post.push();
        nuevoPost.set({
            user : user,
            text : text,
        });
    }
    location.reload()
}



function cameraTakePicture() { 
    navigator.camera.getPicture(onSuccess, onFail, {  
        quality: 50, 
        destinationType: Camera.DestinationType.DATA_URL 
    });  
    
    function onSuccess(imageData) { 
        var image = document.getElementById('camara'); 
        image.src = "data:image/jpeg;base64," + imageData; 
    }  
    
    function onFail(message) { 
        alert('Failed because: ' + message); 
    } 
}




function saveImg(){
    var user= firebase.auth().currentUser;
    var uid = user.uid; //identificador del usuario activp
    var userName = user.displayName == null ? user.email : user.displayName;
    if($("#camara").attr('src').indexOf('data') > -1){
        // Create a root reference
        var storageRef = firebase.storage().ref();
        // Create a reference to 'mountains.jpg'
        var time = new Date().getTime();
        var imgProfileRef = storageRef.child(uid+'/snapshot-'+ time+'.jpg');
        var file = $("#camara").attr('src');
        var img = file.replace("data:image/jpeg;base64,","");
        imgProfileRef.putString(img, 'base64', {contentType:'image/jpg'}).then(function(snapshot) {
            console.log('Imagen Subida a Firebase Storage !');
        })
        .then(function(){
            imgProfileRef.getDownloadURL().then(function (downloadURL) {   // Obtengo la URL de la imagen 
                console.log('URL de la imagen: ', downloadURL);
                var comment= document.querySelector('#floatingTextarea2').value; 
                let newComment = commetimg.push();
                newComment.set({
                    urlImg: downloadURL,
                    userName: userName,
                    userKey: uid,
                    comment: comment,
                    likes: []
                });
                newComment.on('value', (snapshot) => {
                    $('#msm').addClass('show');
                    document.querySelector('#floatingTextarea2').value='';
                    $("#camara").attr('src','img/logo.png');
                });
            })
        });
    }
    
}
document.addEventListener("DOMContentLoaded", function(event) {
          
        var dataPosteos= [];
        firebase.database().ref('commetimg').once('value', function (data) {
            data.forEach(function (ccm) {
                var ccmObject = new Commetimg();
                ccmObject.key = ccm.key;
                ccmObject.urlImg = ccm.val().urlImg;
                ccmObject.userName = ccm.val().userName;
                ccmObject.userKey = ccm.val().userKey;
                ccmObject.comment = ccm.val().comment;
                ccmObject.likes = ccm.val().likes;
                dataPosteos.push(ccmObject); 
            });
            for (var i = 0; i < dataPosteos.length; i++) {
                let dp=dataPosteos[i];
                var tpl= `<div class="card">
                            <img src="${dp.urlImg}" class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${dp.userName}</h5>
                            <p class="card-text">${dp.comment}</p>
                            </div>
                            </div>`;
                $('#mural').append(tpl);
            }     
        });
    });
