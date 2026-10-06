from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="user_management1"
    )
    return connection


@app.route("/")
def home():
    return "User Management API Running"


@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    age = data.get("age")

    if not name or not email or age is None:
        return jsonify({"message": "All fields are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO users (name, email, age)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (name, email, age))
        connection.commit()

        return jsonify({
            "message": "User added successfully",
            "id": cursor.lastrowid
        }), 201

    except Exception as error:
        connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route("/api/users", methods=["GET"])
def get_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        return jsonify(users), 200

    finally:
        cursor.close()
        connection.close()


@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM users WHERE id = %s",
            (user_id,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify(user), 200

    finally:
        cursor.close()
        connection.close()


@app.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    age = data.get("age")

    if not name or not email or age is None:
        return jsonify({"message": "All fields are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
        UPDATE users
        SET name = %s, email = %s, age = %s
        WHERE id = %s
        """
        cursor.execute(query, (name, email, age, user_id))

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        connection.commit()
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as error:
        connection.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            "DELETE FROM users WHERE id = %s",
            (user_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        connection.commit()
        return jsonify({"message": "User deleted successfully"}), 200

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    app.run(debug=True)
