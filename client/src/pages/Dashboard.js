import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!token) navigate("/");
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/items",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item added successfully");
      setTitle("");
      setDescription("");
      fetchItems();
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Item deleted");
      fetchItems();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = async (id) => {
    if (!title || !description) {
      toast.warn("Fill all fields to update");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/items/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item updated");
      setEditingItem(null);
      setTitle("");
      setDescription("");
      fetchItems();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* ================= TOP BAR ================= */}
      <div className="topbar">
        <h2 className="logo">DigitalFlake</h2>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="content-area">
        <h3 className="section-title">Your Items</h3>

        {/* ================= ADD FORM ================= */}
        <div className="add-card">
          <h4>Add New Item</h4>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {editingItem ? (
            <button
              className="edit-btn"
              onClick={() => handleEdit(editingItem.id)}
            >
              Update Item
            </button>
          ) : (
            <button className="add-btn" onClick={handleAddItem}>
              Add Item
            </button>
          )}
        </div>

        {/* ================= ITEMS GRID ================= */}
        <div className="items-grid">
          {loading ? (
            <>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <h3>No items yet</h3>
              <p>Start by adding your first item 🚀</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div className="item-card" key={item.id}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>

                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingItem(item);
                      setTitle(item.title);
                      setDescription(item.description);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;