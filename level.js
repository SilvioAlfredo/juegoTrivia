import { insertarUsuario } from "./insertarUsuario.js";
let nombre = sessionStorage.getItem('nombre');
let edad = parseInt(sessionStorage.getItem('edad'));
let rol = sessionStorage.getItem('rol');

let preguntasGeneral = [];
let cpu = [];
let ram = [];
let gpu = [];
let almacenamiento = [];
let preguntas = [];

let indicePregunta = 0;
let puntuacion = 0;

// leo las preguntas y sus respectivas opciones basado en preguntas.json
fetch('./preguntas.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return response.json(); // Parsear el JSON
    })
    .then(data => {
        preguntasGeneral.push(...data); // Agregar los datos al arreglo preguntas
        separarArreglos(preguntasGeneral)
    })
    .catch(error => {
        console.error('Error:', error); // Manejar errores
    }
);
// Función para separar en diferentes arreglos
function separarArreglos(preguntasGeneral){
    preguntasGeneral.forEach(pregunta => {
        switch (pregunta.tema.toLowerCase()) { // Cambiar a pregunta.tema
            case 'cpu':
                cpu.push(pregunta); // Agregar a la lista de CPU
                break;
            case 'ram':
                ram.push(pregunta); // Agregar a la lista de RAM
                break;
            case 'gpu':
                gpu.push(pregunta); // Agregar a la lista de GPU
                break;
            case 'almacenamiento':
                almacenamiento.push(pregunta); // Agregar a la lista de almacenamiento
                break;
            default:
                console.warn(`Tema desconocido: ${pregunta.tema}`);
        }
    });
    // Llamar a la función para generar preguntas aleatorias
    preguntasAleatorias(cpu);
    preguntasAleatorias(ram);
    preguntasAleatorias(gpu);
    preguntasAleatorias(almacenamiento);
    // Llamar a la función para mostrar la primera pregunta
    mostrarPregunta();
}
// Esta función elije algunas de la preguntas aleatoriamente y asigna esta a un nuevo arreglo.
function preguntasAleatorias(tema) {
    const cantidad = Math.min(3, tema.length); // Limitar a un máximo de 3 preguntas
    for (let i = 0; i < cantidad; i++) {
        let indiceAleatorio = Math.floor(Math.random() * tema.length); // Elegir índice aleatorio
        preguntas.push(tema[indiceAleatorio]); // Agregar la pregunta aleatoria a la lista
        tema.splice(indiceAleatorio, 1); // Eliminar la pregunta seleccionada para no repetir
    }
}
// 
function mostrarPregunta() {
    const contenedor = document.querySelector('.mainLevel');
    contenedor.innerHTML = '';
    console.log(preguntas)
    if (indicePregunta < preguntas.length) {
        const pregunta = preguntas[indicePregunta]; // Obtener la pregunta actual
        const nuevoLi = document.createElement('li');
        nuevoLi.innerHTML = `<strong>${pregunta.question}</strong><br>`;
        
        pregunta.answers.forEach((respuesta, index) => {
            nuevoLi.innerHTML += `<button onclick="verificarRespuesta(${index}, ${pregunta.correct})">${respuesta}</button><br>`;
        });
        nuevoLi.classList.add('textoTarjeta');
        contenedor.appendChild(nuevoLi);
    } else {
        contenedor.innerHTML = `<strong>¡Fin del juego! Tu puntuación es: ${puntuacion} </strong>
        <button id= "buttonTabla">Tabla General</button>'`;

        sessionStorage.setItem('puntuacion', puntuacion);
        let puntos = parseInt(sessionStorage.getItem('puntuacion'));
        insertarUsuario(nombre, edad, rol, puntos)

        // Cambiar hacia la tabla general.
        var buttonTabla = document.querySelector("#buttonTabla");

        buttonTabla.addEventListener("click", function(event){
            event.preventDefault();

            window.location.href = "../tabla.html";
        });
    }
}

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    if (respuestaSeleccionada === respuestaCorrecta) {
        alert('¡Correcto!');
        puntuacion += 20;
    } else {
        alert('Incorrecto.');
    }
    indicePregunta++; // Avanzar a la siguiente pregunta
    mostrarPregunta(); // Mostrar la siguiente pregunta
}

// Hacer funciones accesibles globalmente
window.mostrarPregunta = mostrarPregunta;
window.verificarRespuesta = verificarRespuesta;
