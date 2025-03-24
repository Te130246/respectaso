import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [showSettings, setShowSettings] = useState(false);

  const getActiveIndex = (href) => {
    return location.pathname === href;
  };

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'user1' }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed');
    }
  };

  const saveSettingsToDatabase = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bgColor, image }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleColorChange = (e) => {
    setBgColor(e.target.value);
    saveSettingsToDatabase();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        saveSettingsToDatabase();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e) => {
    setDragging(true);
  };

  const handleDrag = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - 30, y: e.clientY - 30 });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <>
      <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2" style={{ backgroundColor: bgColor }}>
        <div className="sidenav-header">
          <a className="navbar-brand px-4 py-3 m-0" href="https://demos.creative-tim.com/material-dashboard/pages/dashboard" target="_blank" rel="noopener noreferrer">
            <img src="../assets/img/logo-ct-dark.png" className="navbar-brand-img" width={26} height={26} alt="main_logo" />
            <span className="ms-1 text-sm text-dark">Creative Tim</span>
          </a>
        </div>
        <hr className="horizontal dark mt-0 mb-2" />
        <div className="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
          <ul className="navbar-nav">
            {[
              { name: 'Dashboard', icon: 'dashboard', href: '/Dashboard' },
              { name: 'Profile', icon: 'person', href: '/Profile' }
            ].map((item, index) => (
              <li className="nav-item" key={index}>
                <a
                  className={`nav-link ${getActiveIndex(item.href) || activeIndex === index ? 'border border-dark bg-dark text-white' : 'text-dark'}`}
                  href={item.href}
                  onClick={() => handleClick(index)}
                >
                  <i className={`material-symbols-rounded opacity-5`}>{item.icon}</i>
                  <span className="nav-link-text ms-1">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className={`active-indicator ${activeIndex !== null ? 'active' : ''}`} style={{ transform: `translateY(${activeIndex * 50}px)` }} />
        </div>
        <div className="sidenav-footer position-absolute w-100 bottom-0 ">
          <div className="mx-3">
            <button className="btn bg-gradient-dark w-100" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div
          className="settings-icon"
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            cursor: 'move',
            transition: 'transform 0.3s ease',
            zIndex: 20,
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <i className="fas fa-cog fa-2x" style={{ color: '#007bff' }} onClick={() => setShowSettings(!showSettings)} />
        </div>

        {showSettings && (
          <div className="settings-box" style={{ position: 'absolute', top: position.y + 40, left: position.x }}>
            <h5>Settings</h5>
            <label>
              Background Color:
              <input type="color" value={bgColor} onChange={handleColorChange} />
            </label>
            <label>
              Upload Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {image && <img src={image} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />}
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
