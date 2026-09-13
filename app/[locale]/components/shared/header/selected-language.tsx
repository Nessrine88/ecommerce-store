import React from "react";

const SelectedLanguage = () => {
  const getSelectedValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <select name="language" id="language" onChange={getSelectedValue}>
        <option value="english">English</option>
        <option value="french">French</option>
        <option value="arabic">Arabic</option>
      </select>
    </div>
  );
};

export default SelectedLanguage;