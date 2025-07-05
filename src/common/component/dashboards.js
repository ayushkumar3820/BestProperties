import { useNavigate } from "react-router-dom";
import BottomBar from "./bottomBar";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";

export default function Dashboards() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/contact");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 -mt-52">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600 text-base mb-6">
            Welcome to your admin dashboard. You can manage properties, users,
            and settings from here.
          </p>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200"
          >
            Contact Us
          </button>
        </div>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
