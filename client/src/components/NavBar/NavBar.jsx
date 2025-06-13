import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearUser } from '../../features/user';
import './NavBar.css';
import { message } from "antd";


const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {currentUser, isAuthenticated} = useSelector(state => state.user);
    const user = useSelector((state) => state.user.currentUser);
    const navigate =useNavigate();
    // console.log('Cur User', user);

    // const [isCartOpen, setIsCartOpen] = useState(false)
    // const toggleCart = () => {
    //   if(!user){
    //     message.error('Please Sign In to Access Shopping Cart.')
    //     navigate("/signin");
    //     return;
    //   }
    //   setIsCartOpen(!isCartOpen);
    // };

  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {

    setIsMobileMenuOpen(false);
  };

  const handleLogOut = () => {
    dispatch(clearUser());
    closeMobileMenu();
    message.success('You have signed out.');
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={closeMobileMenu}
        >
          Management
        </NavLink>




        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {!isAuthenticated ? (<li className="nav-item">
            <NavLink
              to="/SignIn"
              className={({ isActive }) =>
                `nav-links ${isActive ? 'active' : ''}`
              }
              onClick={closeMobileMenu}
            >
              Sign In
            </NavLink>
          </li>): (<li className="nav-item">
            <button
             className="nav-links"
             style={{ background: 'none', border: 'none', cursor: 'pointer' }}
             onClick={handleLogOut}
            >
             Sign Out
            </button>
          </li>)}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
