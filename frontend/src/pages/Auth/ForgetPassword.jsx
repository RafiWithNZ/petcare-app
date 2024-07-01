import { useState } from "react";
import { BASE_URL } from "../../config.js";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const Submithandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setLoading(false);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Lupa Password
        </h3>
        <form className="py-4 md:py-0" onSubmit={Submithandler}>
          <div className="mb-7">
            <input
              type="email"
              placeholder="Masukkan Email Anda"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor cursor-pointer"
              required
            />
          </div>
          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px]
            rounded-lg px-4 py-3 mt-5"
            >
              {loading ? <HashLoader color="#fff" size={25} /> : "Kirim"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;
