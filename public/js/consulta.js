const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host + '/api';
let TOKEN = getTokenValue('token');
let PAGES = {
    current: 1,
    currentIndex: 0,
};
let NAME_FILTER = '';

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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, ) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    // console.log(TOKEN);
    xhr.setRequestHeader('x-auth-user', TOKEN);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            // console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}



const userToHTML = (user) => {
    return `
    <div class="media col-8 mt-2">
                <div class="media-left align-self-center mr-3">
                    <img class="rounded-circle" src="${user.image}">
                </div>
                <div class="media-body">
                        <h4> ${user.nombre} ${user.apellidos}</h4>
                        <p >Correo: ${user.email}</p>
                        <p >Fecha de nacimiento: ${user.fecha} </p>
                        <p >Sexo: ${user.sexo} </p>
                    </div>
                <div class="media-right align-self-center">
                    <div class="row">
                        <div class="btn btn-primary mt-2" data-user='${JSON.stringify(user)}' > <a class="text-white"><i class="fas fa-search"></i></a></div>
                    </div>
                    <div class="row">
                        <div class="btn btn-primary mt-2" data-user='${JSON.stringify(user)}' data-toggle="modal" data-target="#updateFormModal"><i class="fas fa-pencil-alt edit"></i></div>
                    </div>
                    <div class="row">
                        <div class="btn btn-primary mt-2" data-toggle="modal" data-target="#deleteFormModal"  data-email="${user.email}"><i class="fas fa-trash-alt remove "></i></div>
                    </div>
                </div>
            </div>
    `
}
const userListToHTML = (list, id) => {
    if (id && list && document.getElementById(id)) {
        document.getElementById(id).innerHTML = list.map(userToHTML).join('');
    }
}


function updateUser(ele) {
    console.log('updateUser');
    //agrega el códgio necesario...
}

function deleteUser(ele) {
    console.log('deleteUser');
    console.log(ele.getAttribute('data-email'));
    //agrega el códgio necesario...

}

function getUsersPage(page, pageLimit, filter) {
    let nfilter = (filter) ? `${filter}` : '';
    let url = APIURL + "/users?page=" + page + `&limit=${pageLimit}` + nfilter;
    //agrega el códgio necesario...
    sendHTTPRequest(url, '', HTTTPMethods.get, (res) => {
        let data = JSON.parse(res.data);
        let users = data.content;
        userListToHTML(users, 'listaUsuarios');
        // console.log(users);
    }, (error) => {
        console.log(error);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    let pageLimit = 3;
    getUsersPage(PAGES.current, pageLimit, NAME_FILTER);

    let filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('change', (e) => {
        NAME_FILTER = `&name=${e.target.value}`;
        getUsersPage(PAGES.current, pageLimit, NAME_FILTER);
    })

    $('#updateFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        let selectedUser = JSON.parse(event.relatedTarget.getAttribute('data-user'));
        let email = selectedUser.email;

        let url = APIURL + "/users/" + email;
        //agrega el códgio necesario...
        sendHTTPRequest(url, '', HTTTPMethods.get, (res) => {
            let user = JSON.parse(res.data);

            //agrega el códgio necesario...
            document.getElementById('updateName').value = user.nombre;
            document.getElementById('updateApellidos').value = user.apellidos;
            // document.getElementById('updatePassword1').value = user.password;
            // document.getElementById('updatePassword2').value = user.password;
            document.getElementById('updateDate').value = user.fecha;
            document.getElementById('updateUrl').value = user.image;

            $('#updateUserBtn').attr("data-user", JSON.stringify(user));
        }, (error) => {
            console.log(error);
        })
    });

    $('#updateFormModal').on('keyup', function (event) {
        let registerNombreValid = document.getElementById('updateName').checkValidity();
        let registerApellidosValid = document.getElementById('updateApellidos').checkValidity();
        document.getElementById('updateUserBtn').disabled = !(
            registerNombreValid && registerApellidosValid
        );
    });

    $('#updateUserBtn').on('click', function (event) {
        var user = $('#updateUserBtn').data('user');

        user.nombre = document.getElementById('updateName').value;
        user.apellidos = document.getElementById('updateApellidos').value;
        user.fecha = document.getElementById('updateDate').value;
        user.image = document.getElementById('updateUrl').value;

        let passwordValid = document.getElementById('updatePassword1').checkValidity();
        if (document.getElementById('updatePassword1').value !== "" && passwordValid &&
            document.getElementById('updatePassword1').value === document.getElementById('updatePassword2').value) {
            user.password = document.getElementById('updatePassword1').value;
        } else {
            console.log("Password wasn't updated");
        }

        let url = APIURL + "/users/" + user.email;
        sendHTTPRequest(url, JSON.stringify(user), HTTTPMethods.put, (res) => {
            // console.log(res);
            getUsersPage(PAGES.current, pageLimit, NAME_FILTER);
        }, (error) => {
            console.log(error);
        })
    });

    $('#deleteFormModal').on('show.bs.modal', function (event) {
        // console.log(event.relatedTarget);
        //agrega el códgio necesario...
        let email = event.relatedTarget.getAttribute('data-email');
        $('#deleteUserBtn').attr("data-email", email);
    });

    $('#deleteUserBtn').on('click', function (event) {
        var email = $('#deleteUserBtn').data('email');
        let url = APIURL + "/users/" + email;
        sendHTTPRequest(url, '', HTTTPMethods.delete, (res) => {
            // console.log(res);
            getUsersPage(PAGES.current, pageLimit, NAME_FILTER);
        }, (error) => {
            console.log(error);
        })
        console.log(url);
    });

});