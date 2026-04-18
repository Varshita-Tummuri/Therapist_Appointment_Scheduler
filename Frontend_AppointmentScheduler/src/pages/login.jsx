// import { useState } from "react";
// import axiosInstance from "../api/axiosConfig";
// import "../styles/login.css";
// import { useNavigate } from "react-router-dom";
// import "./home";


// function Login(){
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [selectedValue, setSelectedValue] = useState("user");
//     const options = [
//                         {label: "Admin", value: "admin"},
//                         {label:"User", value: "user"},
//                         {label:"Therapist", value: "therapist"},
//     ];
//     const [success, setSuccess] = useState("");
//     const [error, setError] = useState("");

//     const handleSubmit = async (e) =>{
//         e.preventDefault();
//         console.log("Login button clicked");
        
//         setError("");
//         setSuccess("");

//         try{
//             const response = await axiosInstance.post("/auth/login",{
//                 email,
//                 password,
//                 role:selectedValue,
//             });
//             console.log(response.data);
//             if (response.status === 200) {
//                 setSuccess("Login Successful!");
//                 localStorage.setItem("userId", response.data.userId);
//                 localStorage.setItem("role",   response.data.role);

//                 const role = response.data.role?.toLowerCase();
//                 if (role === "admin")     navigate("/admin");
//                 else if (role === "therapist") navigate("/therapist");
//                 else                      navigate("/home");
//             }

//         }
//         catch (err){
//             console.log(err);
//             setError("Invalid Email id or Password.");
//         }
//     };
    
//     return(
//         <div>
//             <form className="loginborder">
//                 <div className="Role">
//                     <label className="loginfont">LOGIN</label><br />
//                     <label>as </label>
//                     <select className="myDropdownBox" value={selectedValue} onChange={(e)=>setSelectedValue(e.target.value)}>
//                         {options.map((option) => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <br />

//                 <div className="Email">
//                     <label className="lablefonts">Email Id: </label>
//                     <input
//                     type="email"
//                     value={email}
//                     className="mytextBox"
//                     onChange={(e)=>setEmail(e.target.value)}
//                     />
//                     <br />
//                     <br />
//                 </div>

//                 <div className="Password">
//                     <label className="lablefonts">Password: </label>
//                     <input
//                     type="password"
//                     value={password}
//                     className="mytextBox2"
//                     onChange={(e)=>setPassword(e.target.value)}
//                     />
//                     <br />
//                 </div>
//                 <br />
//                 {error && <p style={{color:"red"}}>{error}</p>}
//                 {success && <p style={{color:"green"}}>{success}</p>}
//                 <div className="Button">
//                     <button className="mybutton" type="button" onClick={handleSubmit}>Login</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default Login;

import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!email || !password) { setError("Please enter email and password."); return; }

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });

      if (response.status === 200) {
        const { role, userId } = response.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        localStorage.setItem("name", response.data.name);
        setSuccess("Login Successful!");

        // Match exactly what backend returns
        if (role === "Admin")      navigate("/admin");
        else if (role === "Therapist") navigate("/therapist");
        else                       navigate("/home");
      }
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <form className="loginborder" onSubmit={e => e.preventDefault()}>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        <label className="loginfont">LOGIN</label>
        <div className="Email">
          <label className="lablefonts">Email Id</label>
          <input
            type="email"
            value={email}
            className="mytextBox"
            placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="Password">
          <label className="lablefonts">Password</label>
          <input
            type="password"
            value={password}
            className="mytextBox2"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
          />
        </div>


        {error   && <p style={{ color: "rgb(252,109,156)", fontSize:"0.9rem" }}>{error}</p>}
        {success && <p style={{ color: "rgb(100,255,180)", fontSize:"0.9rem" }}>{success}</p>}

        <div className="Button">
          <button className="mybutton" type="button" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;