import React, { useState } from "react";
import { toast } from "react-toastify";
import "../style.css";

function Report() {

    const [formData, setFormData] = useState({
        type: "Air Pollution",
        priority: "Low",
        location: "",
        lat: "",
        lng: "",
        description: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            setFormData(prev => ({
                ...prev,
                lat,
                lng,
                location: `${lat}, ${lng}`
            }));
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting data:", formData); 

    try {
        const res = await fetch("http://localhost:5000/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        console.log("Response:", res);   

        const data = await res.json();
        console.log("Data:", data);      

        toast.success("Report Submitted!", {
            position: "top-center"
        });

    } catch (err) {
        console.log("ERROR:", err);      
    }
};
    return (
        <div className="report-bg">

            <div className="navbar">
                <h2>📢 Report Pollution</h2>
                <a href="/" className="back-btn">⬅ Back</a>
            </div>

            <div className="center fade-in">
                <div className="card form-card">

                    <h2>Submit a Report</h2>

                    <form onSubmit={handleSubmit}>

                        <label>Pollution Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option>Air Pollution</option>
                            <option>Water Pollution</option>
                            <option>Noise Pollution</option>
                            <option>Land Pollution</option>
                            <option>Plastic Pollution</option>
                            <option>Industrial Waste</option>
                        </select>

                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>

                        <label>Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter location"
                            required
                        />

                        <button type="button" onClick={getLocation} className="btn btn-warning gps-btn">
                            📍 Use GPS
                        </button>

                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue"
                            rows="4"
                        />

                        <button className="btn btn-primary submit-btn">
                            Submit Report
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
}

export default Report;