from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        conn = sqlite3.connect('datosDB.db')
        cursor = conn.cursor()

        # Obtiene todos los usuarios
        cursor.execute("SELECT id, nombre, edad, rol, puntuacion FROM usuarios ORDER BY puntuacion DESC LIMIT 10")
        usuarios = cursor.fetchall()

        # Convierte los datos a una lista de diccionarios
        usuarios_list = [
            {"id": usuario[0], "nombre": usuario[1], "edad": usuario[2], "rol": usuario[3], "puntuacion": usuario[4]}
            for usuario in usuarios
        ]

        return jsonify(usuarios_list), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            conn.close()

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


if __name__ == '__main__':
    app.run(debug=True)