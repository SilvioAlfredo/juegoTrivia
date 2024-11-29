document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await fetch('http://127.0.0.1:5000/api/usuarios');
      if (!response.ok) throw new Error('Error en la solicitud');

      const usuarios = await response.json();
      const contenedor = document.getElementById('contenedor');

      // Genera el HTML de la tabla
      let tableHTML = `
          <table>
              <thead>
                  <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Edad</th>
                      <th>Rol</th>
                      <th>Puntuación</th>
                  </tr>
              </thead>
              <tbody>
      `;

      usuarios.forEach(usuario => {
          tableHTML += `
              <tr>
                  <td>${usuario.id}</td>
                  <td>${usuario.nombre}</td>
                  <td>${usuario.edad}</td>
                  <td>${usuario.rol}</td>
                  <td>${usuario.puntuacion}</td>
              </tr>
          `;
      });

      tableHTML += `
              </tbody>
          </table>
      `;

      // Inserta la tabla generada en el contenedor
      contenedor.innerHTML = tableHTML;

  } catch (error) {
      console.error('Error al obtener los datos:', error);
  }
});

const volver = document.querySelector('#volver')

volver.addEventListener("click", function(event){
  event.preventDefault();
  window.location.href = "/template/index.html";
});