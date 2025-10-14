import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
      <h1 className="text-6xl font-bold mb-4 text-green-700">404</h1>
      <h2 className="text-2xl mb-4">Oops! Page not found.</h2>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
