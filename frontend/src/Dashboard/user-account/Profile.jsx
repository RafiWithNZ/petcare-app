import { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: user } = useFetchData(`${BASE_URL}/users/user/profile`);

  const [formData, setFormData] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    passwordConfirm: "",
    photo: "",
    phone: "",
    address: "",
  });


  useEffect(() => {
    setFormData({
      ...formData,
      name: user.name,
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
      photo: user.photo,
      phone: user.phone,
      address: user.address,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.url);
    setFormData({
      ...formData,
      photo: data.url,
    });
  };

  const confirmPasswordValidation = () => {
    if (formData.newPassword !== formData.passwordConfirm) {
      toast.error("Password tidak sama");
      return false;
    }
    return true;
  };

  const Submithandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      confirmPasswordValidation();

      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      // update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "null"),
          name: formData.name,
          photo: formData.photo,
        })
      );

      setLoading(false);
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-[50px] text-center">Edit Profile</h1>
      <form onSubmit={Submithandler} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[16px] font-bold">
                Nama Lengkap
              </label>
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
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[16px] font-bold">
                No. Telepon
              </label>
              <input
                type="numeric"
                placeholder="No. Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                  placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-[16px] font-bold">
                Alamat
              </label>
              <input
                type="text"
                placeholder="Alamat"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                  placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[16px] font-bold">
                Password Lama (Wajib diisi)
              </label>
              <input
                type="password"
                placeholder="Password Lama"
                name="oldPassword"
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                  placeholder:text-textColor cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[16px] font-bold">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Password Baru"
                name="newPassword"
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                  placeholder:text-textColor cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="passwordConfirm"
                className="text-[16px] font-bold"
              >
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                name="passwordConfirm"
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                  focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                  placeholder:text-textColor cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[16px] font-bold">
                Edit Profile Picture
              </label>
              {selectedFile && (
                <figure
                  className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
                    flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={formData.photo}
                    alt=""
                    className="w-full rounded-full"
                  />
                </figure>
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
                    items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-lightBlueColor
                    text-headingColor font-bold rounded-lg truncate cursor-pointer hover:bg-primaryColor-500"
                >
                  Pilih Gambar
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="items-center justify-center">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg py-3 mt-5"
          >
            {loading ? <HashLoader size={25} color="white" /> : "Edit Akun"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
