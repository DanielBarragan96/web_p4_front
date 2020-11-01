const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('content-type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function login() {
    console.log('login...');
    //agrega tu codigo...
    let email = document.getElementById("userInputLogin").value;
    let pass = document.getElementById("passwordInputLogin").value;
    let url = APIURL + '/login/';

    sendHTTPRequest(url, JSON.stringify({
        email: email,
        password: pass
    }), HTTTPMethods.post, (res) => {
        let token = res.data.substring(10, 26);
        console.log(token);
        setCookie('token', token, 2);
        document.getElementById('loginResponseMSG').innerHTML = '<div class="text-success">Bienvenido</div>';
    }, (error) => {
        document.getElementById('loginResponseMSG').innerHTML = '<div class="text-danger">' + error + '</div>';
    })
}

//get elementos del html
const createUserBtn = document.getElementById("createUserBtn");
const registerNombre = document.getElementById("registerNombre");
const registerApellidos = document.getElementById("registerApellidos");
const registerEmail = document.getElementById("registerEmail");
const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");
const registerDate = document.getElementById("registerDate");
const registerSexo = document.getElementById("registerSexoM");
const registerUrl = document.getElementById("registerUrl");

let registerNombreValid = false;
let registerApellidosValid = false;
let registerEmailValid = false;
let password1Valid = false;
let password2Valid = false;
let samePassword = false;

function createUser() {
    console.log('createUser');


    let url = APIURL + '/users/';
    //agrega tu codigo...
    sendHTTPRequest(url, JSON.stringify({
        nombre: registerNombre.value,
        apellidos: registerApellidos.value,
        email: registerEmail.value,
        password: password1.value,
        fecha: registerDate.value,
        sexo: registerSexo.value,
        image: registerUrl.value
    }), HTTTPMethods.post, (datos) => {
        console.log(datos);
    }, (error) => {
        console.log(error);
    }, document.cookie.split("=")[1]);
}

document.addEventListener('DOMContentLoaded', () => {
    //agrega tu codigo de asignación de eventos...


    $('#createFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        //agrega tu codigo...
    });

    //validar que el usuario a registrar tenga los campos validos
    $('#createFormModal').on('keyup', function (event) {
        registerNombreValid = registerNombre.checkValidity();
        registerApellidosValid = registerApellidos.checkValidity();
        registerEmailValid = registerEmail.checkValidity();
        password1Valid = password1.checkValidity();
        password2Valid = password2.checkValidity();
        samePassword = (password1.value === password2.value);
        createUserBtn.disabled = !(
            registerNombreValid && registerApellidosValid &&
            registerEmailValid && password1Valid &&
            password2Valid && samePassword
        );
    });

    //al presionar el boton de guardar nuevo usuario
    $('#createUserBtn').on('click', function (event) {
        createUser();
    });
    //al presionar el boton de iniciar sesion
    $('#loginBtn').on('click', function (event) {
        login();
    });

});