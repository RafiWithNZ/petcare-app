import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { HiOutlineXCircle } from "react-icons/hi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const ResetPassword = () => {
  const { reset_token } = useParams();
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!reset_token) {
    setError(true);
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: reset_token,
          password: formData.password,
        }),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }
      toast.success(message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-200">
      <div className="max-w-md p-9 mt-[15vh] mb-[10vh] bg-white shadow-md rounded">
        {error ? (
          <div className="flex flex-col items-center">
            <HiOutlineXCircle size={150} color="red" />
            <h1 className="text-3xl font-bold text-red-600">
              Token Anda expired!
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-primary mb-12">
              Masukkan Password Baru
            </h1>
            <div>
              <div className="mb-5 relative">
                <input
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor cursor-pointer"
                  required
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-3 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-3 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
              <div className="flex justify-center">
                <button className="btn cursor-pointer" onClick={submitHandler}>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
