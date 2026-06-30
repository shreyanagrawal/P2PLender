import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoleSelection = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRoleSelect = async (role) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(`${API_URL}/api/updateRole`, { role }, {
        headers: {
              Authorization: `Bearer ${token}`
          },
          withCredentials: true
      });
      navigate("/home");
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose your Role</h2>
        
        <div className="space-y-6">
          {/* Borrower Option */}
          <button 
            onClick={() => handleRoleSelect("borrower")}
            className="w-full p-6 border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition text-left"
          >
            <h3 className="text-xl font-semibold text-blue-700">I want to Borrow</h3>
            <p className="text-gray-600 mt-2">Apply for loan & achieve goals</p>
          </button>

          {/* Lender Option */}
          <button 
            onClick={() => handleRoleSelect("lender")}
            className="w-full p-6 border-2 border-green-500 rounded-xl hover:bg-green-50 transition text-left"
          >
            <h3 className="text-xl font-semibold text-green-700">I want to Lend</h3>
            <p className="text-gray-600 mt-2">Invest in loan & earn attractive returns</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;