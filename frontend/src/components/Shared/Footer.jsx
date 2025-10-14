import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <h3 className="font-bold text-2xl text-white tracking-wider">
            Rescue<span className="text-green-500">Bites</span>
          </h3>
          <p className="max-w-md mx-auto mt-2 text-gray-400">
            Connecting communities to reduce food waste and fight hunger.
          </p>
          {/* <div className="flex mt-6 space-x-6">
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaLinkedin size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><FaGithub size={24} /></a>
          </div> */}
        </div>
        <hr className="my-6 border-gray-800" />
        <div className="text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} RescueBites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;