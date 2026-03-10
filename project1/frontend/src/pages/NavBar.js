import React from "react";
import "./NavBar.css";
import { useLogout } from "../hooks/useLogoutHook";
import { useAuthContext } from "../hooks/authcontexthook";

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">Workout Tracker</h1>

        {user && (
          <div>

            <ul className="nav-links">

              <li><a href="/">Home</a></li>
              <li><a href="/create">Add Workout</a></li>
              <li><a href="/about">About</a></li>
              <li><button onClick={logout}>Logout</button></li> <span>{user.email}</span>

            </ul>
          </div>

        )}


      {!user && (
        <div>
          <ul className="nav-links">



            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Singup</a></li>


          </ul>
        </div>
      )}
            </div>

    </nav>
  );
};

export default Navbar;