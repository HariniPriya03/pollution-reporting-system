import React, { useEffect, useState, useRef } from "react";
import "../style.css";
import Chart from "chart.js/auto";

function Dashboard() {

    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        verified: 0,
        resolved: 0
    });

    const [filters, setFilters] = useState({
        type: "All",
        priority: "All",
        search: ""
    });

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem("admin")) {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/reports")
            .then(res => res.json())
            .then(data => {
                setReports(data.reports);
                setStats({
                    total: data.total,
                    pending: data.pending,
                    verified: data.verified,
                    resolved: data.resolved
                });
            });
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");

        chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Total", "Pending", "Verified", "Resolved"],
                datasets: [{
                    label: "Reports",
                    data: [
                        stats.total,
                        stats.pending,
                        stats.verified,
                        stats.resolved
                    ],
                    backgroundColor: [
                        "#3498db",
                        "#f1c40f",
                        "#2980b9",
                        "#2ecc71"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });

    }, [stats]);

    const filteredReports = reports.filter(r => {
        const typeMatch =
            filters.type === "All" ||
            r.type.toLowerCase().includes(filters.type.toLowerCase());

        const priorityMatch =
            filters.priority === "All" ||
            r.priority.toLowerCase() === filters.priority.toLowerCase();

        const searchMatch =
            r.description.toLowerCase().includes(filters.search.toLowerCase());

        return typeMatch && priorityMatch && searchMatch;
    });

    const updateStatus = async (id, action) => {
        await fetch(`http://localhost:5000/api/reports/${action}/${id}`, {
            method: "PUT"
        });
        window.location.reload();
    };

    const deleteReport = async (id) => {
        await fetch(`http://localhost:5000/api/reports/${id}`, {
            method: "DELETE"
        });
        window.location.reload();
    };

    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location.href = "/";
    };

    return (
        <div>

            <div className="navbar">
                <h2>📊 Admin Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="dashboard-container">

                <div className="stats-grid">
                    <div className="stat-card">📊 Total<br/><b>{stats.total}</b></div>
                    <div className="stat-card">⏳ Pending<br/><b>{stats.pending}</b></div>
                    <div className="stat-card">✔ Verified<br/><b>{stats.verified}</b></div>
                    <div className="stat-card">✅ Resolved<br/><b>{stats.resolved}</b></div>
                </div>

                <div className="middle-section">

                    <div className="chart-box">
                        <canvas ref={chartRef}></canvas>
                    </div>

                    <div className="filter-box">

                        <select onChange={(e) => setFilters({...filters, type: e.target.value})}>
                            <option value="All">All Types</option>
                            <option value="Air">Air</option>
                            <option value="Water">Water</option>
                            <option value="Noise">Noise</option>
                            <option value="Land">Land</option>
                            <option value="Plastic">Plastic</option>
                            <option value="Industrial">Industrial</option>
                        </select>

                        <select onChange={(e) => setFilters({...filters, priority: e.target.value})}>
                            <option value="All">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <input
                            placeholder="🔍 Search..."
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>

                </div>
            </div>

            <div className="cards-grid">

                {filteredReports.map(r => (

                    <div className="card report-card fade-in" key={r._id}>

                        <h3>{r.type}</h3>
                        <p>{r.description}</p>
                        <p>📍 {r.location}</p>
                        <p>🕒 {r.date}</p>

                        <p>Status:
                            {r.status === "Pending" && <span className="status-pending"> Pending</span>}
                            {r.status === "Verified" && <span className="status-verified"> Verified</span>}
                            {r.status === "Resolved" && <span className="status-resolved"> Resolved</span>}
                        </p>

                        <p><b>Priority:</b> {r.priority}</p>

                        <div className="actions">
                            <button className="btn btn-warning" onClick={() => updateStatus(r._id, "verify")}>✔ Verify</button>
                            <button className="btn btn-success" onClick={() => updateStatus(r._id, "resolve")}>✅ Resolve</button>
                            <button className="btn btn-danger" onClick={() => deleteReport(r._id)}>🗑 Delete</button>
                        </div>

                        <a
                            href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="map-link"
                        >
                            📍 View Exact Location
                        </a>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Dashboard;