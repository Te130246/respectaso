import React, { useState } from 'react';

function Settings() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [image, setImage] = useState(null);

  const handleColorChange = (e) => {
    setBgColor(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: bgColor, padding: '20px' }}>
      <h2>Settings</h2>
      <label>
        Background Color:
        <input type="color" value={bgColor} onChange={handleColorChange} />
      </label>
      <br />
      <label>
        Upload Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {image && <img src={image} alt="Uploaded" style={{ width: '100px', height: '100px' }} />}
    </div>
  );
}

export default Settings;
