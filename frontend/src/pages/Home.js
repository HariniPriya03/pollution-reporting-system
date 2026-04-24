import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

function Home() {
    return (
        <div className="landing-bg">
            
            <div className="navbar">
                <h2>🌍 Pollution System</h2>
                <Link to="/dashboard" className="admin-btn">🔑 Admin</Link>
            </div>

            <div className="hero fade-in">

                <h1>
                    Breathe Better. 🌿 <br />
                    Report Smarter.
                </h1>

                <p>
                    Every report matters. Help create a cleaner,
                    safer environment for everyone.
                </p>

                <Link to="/report">
                    <button className="hero-btn">📢 Report Now</button>
                </Link>

            </div>

        </div>
    );
}

export default Home;