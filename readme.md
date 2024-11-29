Este proyecto es una combinación de tecnologías web, python y sqlite, para crear un juego de trivia con un enfoque educativo.

### **Explicación de proyecto:**

1. **JSON para almacenar preguntas y opciones**:
   - Puedes usar un archivo JSON para almacenar las preguntas de forma sencilla y cargarlo en memoria cuando inicies la aplicación.
   - El formato JSON es perfecto para este tipo de información que no cambia con frecuencia.

   **Ejemplo del archivo JSON (preguntas.json):**
   ```json
   [
     {
       "question": "¿Qué es una CPU?",
       "answers": ["Unidad de memoria", "Unidad de procesamiento central", "Dispositivo de almacenamiento", "Pantalla de computadora"],
       "correct": 1
     },
     {
       "question": "¿Qué es RAM?",
       "answers": ["Memoria de Acceso Regular", "Memoria de Acceso Aleatorio", "Memoria Rápida", "Memoria Residual"],
       "correct": 1
     }
   ]
   ```

2. **SQLite para almacenar datos dinámicos**:
   - Utilizar SQLite para gestionar información como información del usuario y su correspondiente puntaje.

### **Flujo de trabajo sugerido:**

1. **Carga inicial de preguntas desde JSON**:
   - Al iniciar la aplicación, cargas las preguntas desde el archivo JSON.
   - Estas preguntas se muestran al usuario sin necesidad de acceder a la base de datos.

2. **Registrar usuarios en SQLite**:
   - Cada vez que un nuevo usuario participe, lo registras en la tabla `usuarios` de la base de datos SQLite.

   **Ejemplo en Python:**
   ```python
   import sqlite3

   conn = sqlite3.connect('quiz.db')
   cursor = conn.cursor()

   # Agregar nuevo usuario
   nombre_usuario = "Juan"
   cursor.execute("INSERT INTO usuarios (nombre) VALUES (?)", (nombre_usuario,))
   conn.commit()
   usuario_id = cursor.lastrowid  # Obtener el ID del usuario recién agregado
   ```

3. **Registrar los usuarios**:

4. **Calcular puntaje y guardarlo**:
   - Una vez que el usuario ha respondido todas las preguntas, se toman todos los datos y se almacenan en la tabla correspondiente en SQLite.

   **Ejemplo en Python:**
   ```python
    @app.route('/api/usuarios', methods=['POST'])
    def insertar_usuario():
        try:
            print("Recibiendo datos...")
            data = request.get_json()
            print(data)

            nombre = data.get('nombre')
            cantidad = data.get('edad')
            rol = data.get('rol')
            puntuacion = data.get('puntuacion')

            if not nombre or not cantidad or not rol or not puntuacion:
                return jsonify({"error": "Faltan datos en la solicitud"}), 400

            conn = sqlite3.connect('datosDB.db')
            cursor = conn.cursor()

            cursor.execute('''CREATE TABLE IF NOT EXISTS usuarios 
                              (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, edad INTEGER, rol TEXT, puntuacion INTEGER)''')

            cursor.execute("INSERT INTO usuarios (nombre, edad, rol, puntuacion) VALUES (?, ?, ?, ?)", (nombre, cantidad, rol, puntuacion))
            conn.commit()

            return jsonify({"message": "Usuario insertado correctamente"}), 201

        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 500

        finally:
            if conn:
                conn.close()
   ```

### **Ventajas de este enfoque**:
- **Separación de responsabilidades**: JSON para los datos estáticos (preguntas y opciones), y SQLite para datos dinámicos (usuarios, respuestas, puntajes).
- **Simplicidad y eficiencia**: Al usar JSON, no tienes que realizar consultas complejas para las preguntas. Solo las cargas una vez y las usas durante el cuestionario. Luego, todo lo relacionado con los usuarios y sus interacciones queda almacenado en SQLite.
- **Escalabilidad**: A medida que tengas más usuarios o más tipos de datos, puedes mantener los datos estáticos en JSON y manejar los datos crecientes de manera eficiente con SQLite.
