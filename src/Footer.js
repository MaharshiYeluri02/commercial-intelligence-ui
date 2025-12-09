import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Brand Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              RX Amplify
            </h3>
            <p className="text-gray-300 mt-2 text-sm">
              Empowering pharma teams with AI-driven insights
            </p>
          </div>

          {/* Divider */}
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

          {/* Footer Bottom */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} RX Amplify
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
