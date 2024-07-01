import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { HiOutlineBadgeCheck, HiOutlineXCircle } from "react-icons/hi";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await fetch(`${BASE_URL}/auth/activation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: activation_token }),
          });

          const { message } = await res.json();

          if (!res.ok) {
            throw new Error(message);
          }
          toast.success(message);
        } catch (error) {
          setError(true);
          toast.error(error.message);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-md p-9 bg-white shadow-md rounded">
        {error ? (
          <div className="flex flex-col items-center">
            <HiOutlineXCircle size={150} color="red" />
            <h1 className="text-3xl font-bold text-red-600">
              Token Anda expired!
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <HiOutlineBadgeCheck size={150} color="green" />
            <h1 className="text-2xl font-bold text-center text-green-600 mt-5">
              Akun Anda telah teraktivasi! Silahkan login
            </h1>
            <Link className="mt-10" to="/login">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-2xl">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
