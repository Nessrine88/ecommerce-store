import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="flex text-accent shadow-2xl bg-primary dark:bg-black justify-center  p-5 w-full mx-auto ">
        <h3 className="text-center">the current year {currentYear}</h3>
      </div>
    </footer>
  );
};

export default Footer;
