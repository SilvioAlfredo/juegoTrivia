// selectores necesarios para los input y botón de la pagina index.
var botonRegistro = document.querySelector("#registro");
var inputNombre = document.querySelector("#nombre");
var inputEdad = document.querySelector("#edad");
var inputRol = document.querySelector("#rol");

// Defino nombre, edad y rol para luego asignar el retorno de funciones.
var nombre = '';
var edad = 0;
var rol = '';

//añado un evento al boton de login
botonRegistro.addEventListener("click", function(event){
    event.preventDefault();
    nombre = obtenerNombre()
    edad = obtenerEdad()
    rol = obtenerRol()

    sessionStorage.setItem('nombre', nombre);
    sessionStorage.setItem('edad', edad);
    sessionStorage.setItem('rol', rol);

    window.location.href = "../level.html";
});

function obtenerNombre(){
    var nombre = inputNombre.value.trim();
    return nombre;
}
function obtenerEdad(){
    var edad = parseInt(inputEdad.value);
    return edad;
}
function obtenerRol(){
    var rol = inputRol.value.trim();
    return rol;
}

