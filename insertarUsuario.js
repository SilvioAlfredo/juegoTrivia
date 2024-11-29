
export function insertarUsuario(nombre, edad, rol, puntuacion) {
  console.log("insertando usuario");
  console.log({ nombre, edad, rol, puntuacion });


  // Validación de datos
  if (!nombre || isNaN(edad) || !rol || !puntuacion) {
      console.error('Por favor, completa todos los campos correctamente.');
      return;
  }

  fetch('http://localhost:5000/api/usuarios', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: nombre, edad: edad, rol: rol, puntuacion: puntuacion}),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error en la solicitud, código de estado: ' + response.status);
      }
      return response.json();
  })
  .then(data => {
      console.log('Usuario insertado:', data);
      setTimeout(function() {
          window.location.href = "../tabla.html";
      }, 3000);
  })
  .catch((error) => {
      console.error('Error durante la solicitud:', error);
  });
}
