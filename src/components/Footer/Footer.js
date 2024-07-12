import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-10">
      <div className="container mx-auto">
        <span className="text-white text-sm">&copy; 2024 Algo-Trading</span>
      </div>
      <div class="text-center dark:text-white"><span class="text-xs">Charts powered by <a href="https://www.tradingview.com/" target="_blank" class="text-[#0081B8]" rel="noopener noreferrer">Tradingview</a></span></div>
    </footer>
  );
};

export default Footer;
