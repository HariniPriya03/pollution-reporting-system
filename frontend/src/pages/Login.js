import React, { useState } from "react";
import "../style.css";

function Login() {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (form.username === "admin" && form.password === "admin123") {
            localStorage.setItem("admin", "true");
            window.location.href = "/dashboard";
        } else {
            alert("❌ Invalid Credentials");
        }
    };

    return (
        <div className="center">
            <div className="card">
                <h2>Admin Login</h2>

                <form onSubmit={handleLogin}>

                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <button className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;