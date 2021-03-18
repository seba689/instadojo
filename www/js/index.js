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

var provider = new firebase.auth.GoogleAuthProvider();
var loged = 0;
function onDeviceReady() {
    
}

const firedb = firebase.database().ref();
const auth = firebase.auth();
const storage = firebase.storage();

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