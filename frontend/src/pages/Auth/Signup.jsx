import { useState } from "react";
import signupImg from "../../assets/images/signup.gif";
import { Link } from "react-router-dom";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: selectedFile,
    gender: "",
    role: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);

    setPreviewURL(data.url);
    setSelectedFile(data.url);
    setFormData({
      ...formData,
      photo: data.url,
    });
  };

  const Submithandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* ========= img ========= */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img src={signupImg} alt="" className="w-full rounded-l-lg" />
            </figure>
          </div>
          {/* ========= form ========= */}
          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-[22px] leading-9 font-bold text-headingColor mb-10">
              Buat <span className="text-primaryColor">Akun</span> Baru
            </h3>
            <form onSubmit={Submithandler}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
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
              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-[15px] leading-7 font-bold text-headingColor"
                >
                  Mendaftar sebagai :
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-extrabold text-[16px] leading-7 px-4
                  py-2 focus:outline-none hover:bg-gray-200 ml-3 rounded-lg "
                  >
                    <option value="" disabled selected>
                      Pilih
                    </option>
                    <option value="caretaker">Seller</option>
                    <option value="customer">Pelanggan</option>
                  </select>
                </label>
              </div>
              <div className="mb-5 flex items-center justify-between">
                <label
                  htmlFor=""
                  className="text-[15px] leading-7 font-bold text-headingColor"
                >
                  Gender :
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-extrabold text-[16px] leading-7 px-4
                  py-2 focus:outline-none hover:bg-gray-200 ml-3 rounded-lg "
                  >
                    <option value="" disabled selected>
                      Pilih
                    </option>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                {loading ? (
                  <HashLoader size={35} color="blue" />
                ) : (
                  selectedFile && (
                    <figure
                      className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
                    flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={previewURL}
                        alt=""
                        className="w-full rounded-full"
                      />
                    </figure>
                  )
                )}

                <div className="relative w-[160px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleFileInputChange}
                    accept=".jpg,.jpeg,.png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex
                  items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                  text-headingColor font-bold rounded-lg truncate cursor-pointer hover:bg-[#0066ff99]"
                  >
                    Pilih Gambar
                  </label>
                </div>
              </div>
              <div className="mt-7">
                <button
                  disabled={loading && true}
                  type="submit"
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px]
            rounded-lg px-4 py-3 mt-5"
                >
                  {loading ? (
                    <HashLoader size={35} color="white" />
                  ) : (
                    "Buat Akun"
                  )}
                </button>
              </div>

              <p className="mt-5 text-textColor text-center">
                Sudah punya akun?
                <Link
                  to="/login"
                  className="text-primaryColor font-medium ml-1"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
