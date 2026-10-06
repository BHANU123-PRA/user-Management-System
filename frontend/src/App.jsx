import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API_URL = "http://127.0.0.1:5000/api/users";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fetchUsers() {
    setLoading(true);
    setError("");

    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function clearForm() {
    setName("");
    setEmail("");
    setAge("");
    setEditId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const userData = {
      name,
      email,
      age: Number(age),
    };

    // const request = editId === null
      // ? axios.post(API_URL, userData)
      // : axios.put(`${API_URL}/${editId}`, userData);
      if (editId===null){
        axios.post(API_URL, userData)
      }
      else{
        axios.put(`${API_URL}/${editId}`, userData);
      }

    request
      .then(() => {
        alert(
          editId === null
            ? "User added successfully"
            : "User updated successfully"
        );
        clearForm();
        fetchUsers();
      })
      .catch(() => {
        setError("Request failed. Check the backend and database.");
      });
  }

  function handleEdit(user) {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        alert("User deleted successfully");
        fetchUsers();
      })
      .catch(() => setError("Failed to delete user"));
  }

  
return (
  <div className="container">
    <h1>User Management System</h1>

    <form onSubmit={handleSubmit} className="user-form">
      <h2>{editId === null ? "Add User" : "Edit User"}</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Enter age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
        required
      />

      <button type="submit">
        {editId === null ? "Add User" : "Update User"}
      </button>

      {editId !== null && (
        <button type="button" onClick={clearForm}>
          Cancel
        </button>
      )}
    </form>

    {error && <p className="error-message">{error}</p>}

    {loading && (
      <p className="loading-message">Loading users...</p>
    )}

    <h2>All Users</h2>

    {!loading && users.length === 0 && (
      <p className="no-users">No users found</p>
    )}

    {!loading && users.length > 0 && (
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>

                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}
export default App;
