import { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { AiOutlineDelete } from "react-icons/ai";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [previewURLs2, setPreviewURLs2] = useState([]);

  const { data: ct } = useFetchData(`${BASE_URL}/caretakers/caretaker/profile`);
  const { data: categories } = useFetchData(`${BASE_URL}/categories`);

  const [formData, setFormData] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    passwordConfirm: "",
    photo: "",
    pictures: [],
    documents: [],
    phone: "",
    address: "",
    specialization: [],
    timeSlots: [],
    about: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      name: ct.name,
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
      photo: ct.photo,
      pictures: ct.pictures || [],
      phone: ct.phone,
      address: ct.address,
      specialization: ct.specialization || [],
      timeSlots: ct.timeSlots || [],
      about: ct.about,
    });
  }, [ct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target ? e.target : { name: "about", value: e };
    setFormData({
      ...formData,
      [name]: value,
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

  const handleFilesInputChange = async (e) => {
    const files = Array.from(e.target.files);
    const datas = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file))
    );
    setPreviewURLs(datas.map((d) => d.url));
    setFormData({
      ...formData,
      pictures: datas.map((d) => d.url),
    });
  };

  const handleFiles2InputChange = async (e) => {
    const files = Array.from(e.target.files);
    const datas = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file))
    );
    setPreviewURLs2(datas.map((d) => d.url));
    setFormData({
      ...formData,
      documents: datas.map((d) => d.url),
    });
  };

  const confirmPasswordValidation = () => {
    if (formData.newPassword !== formData.passwordConfirm) {
      toast.error("Password tidak sama");
      return false;
    }
    return true;
  };

  // Handle specialization
  const addSpecialization = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      specialization: [...prevFormData.specialization, ""],
    }));
  };

  const removeSpecialization = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      specialization: prevFormData.specialization.filter((_, i) => i !== index),
    }));
  };

  const handleSpecializationInput = (index, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      specialization: prevFormData.specialization.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  // Handle time slots
  const addTimeSlot = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeSlots: [
        ...prevFormData.timeSlots,
        {
          day: "",
          startingTime: "",
          endingTime: "",
        },
      ],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeSlots: prevFormData.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleTimeSlotChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeSlots: prevFormData.timeSlots.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const Submithandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!confirmPasswordValidation()) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/caretakers/${ct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "null"),
          name: formData.name,
          photo: formData.photo,
        })
      );
      const { message } = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }
      toast.success(message);
      setLoading(false);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        window.innerWidth <= 768 ? "max-w-[350px]" : "mx-auto px-4 max-w-full "
      }`}
    >
      <h1 className="text-3xl font-bold mb-[30px] text-center">Edit Profile</h1>
      <form onSubmit={Submithandler} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-[16px] font-bold">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama Lengkap"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-[16px] font-bold">
            No. Telepon
          </label>
          <input
            type="numeric"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="No. Telepon"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-[16px] font-bold">
            Lokasi
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Lokasi"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <label htmlFor="about" className="text-[16px] font-bold">
            Deskripsi Toko
          </label>
          <ReactQuill
            name="about"
            theme="snow"
            value={formData.about}
            onChange={(value) => handleInputChange(value)}
            placeholder="Tentang"
            className="w-full cursor-pointer"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="specialization" className="text-[16px] font-bold">
            Tag Kategori
          </label>
          {formData.specialization?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                name="specialization"
                value={item}
                onChange={(e) =>
                  handleSpecializationInput(index, e.target.value)
                }
                className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor cursor-pointer"
              >
                <option value="" disabled>
                  Pilih
                </option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeSpecialization(index)}
                className="bg-red-600 p-2 rounded-full mt-2"
              >
                <AiOutlineDelete className="text-white" />
              </button>
            </div>
          ))}
          <button
            onClick={addSpecialization}
            className="bg-slate-600 text-white p-2 rounded-lg mt-2"
          >
            Tambah Tag
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="text-[16px] font-bold">
            Jam Operasional
          </label>
          {formData.timeSlots?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div>
                <div className="flex flex-row gap-5 items-center w-full">
                  <select
                    name="day"
                    value={item.day}
                    onChange={(e) => handleTimeSlotChange(e, index)}
                    className="mt-1 mr-[13px] text-[11px] md:text-[15px]"
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                    <option value="Setiap Hari">Setiap Hari</option>
                    <option value="Hari ini Libur">Hari ini Libur</option>
                  </select>

                  <input
                    type="time"
                    name="startingTime"
                    value={item.startingTime}
                    onChange={(e) => handleTimeSlotChange(e, index)}
                    className="mt-1 text-[11px] md:text-[15px]"
                  />

                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    onChange={(e) => handleTimeSlotChange(e, index)}
                    className="mt-1 text-[11px] md:text-[15px]"
                  />

                  <button
                    onClick={() => removeTimeSlot(index)}
                    className="bg-red-600 p-2 rounded-full mt-2"
                  >
                    <AiOutlineDelete className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div>
            <button
              onClick={addTimeSlot}
              className="bg-slate-600 text-white p-2 rounded-lg mt-3 w-full md:w-auto"
            >
              Tambah Jam Operasional
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-bold">
            Upload Gambar Slider (1920 x 1080 px Better)
          </label>
          <div className="flex flex-col gap-2">
            {previewURLs.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-24 h-24 object-cover rounded-md"
              />
            ))}
            <div className="relative">
              <input
                type="file"
                name="pictures"
                id="customFiles"
                onChange={handleFilesInputChange}
                accept=".jpg, .jpeg, .png, .webp"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                multiple
              />
              <label
                htmlFor="customFiles"
                className="block w-full py-2 text-center bg-lightBlueColor text-headingColor font-bold rounded-lg cursor-pointer hover:bg-primaryColor hover:text-white"
              >
                Pilih Gambar
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <label className="text-[16px] font-bold">
            Update Profile Picture
          </label>
          <div className="flex flex-col gap-2 items-center">
            {selectedFile && (
              <figure className="w-24 h-24 rounded-full border-2 border-solid border-primaryColor overflow-hidden">
                <img
                  src={formData.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </figure>
            )}
            <div className="relative w-full">
              <input
                type="file"
                name="photo"
                id="customFile"
                onChange={handleFileInputChange}
                accept=".jpg, .jpeg, .png, .mp4"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="customFile"
                className="block w-full py-2 text-center bg-lightBlueColor text-headingColor font-bold rounded-lg cursor-pointer hover:bg-primaryColor hover:text-white"
              >
                Pilih Gambar
              </label>
            </div>
          </div>
        </div>

        {ct.isApproved === false && (
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-bold">
              Upload dokumen pendukung (untuk persetujuan)
            </label>
            <div className="flex flex-col gap-2">
              {previewURLs2.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
              <div className="relative">
                <input
                  type="file"
                  name="documents"
                  id="customFiles2"
                  onChange={handleFiles2InputChange}
                  accept=".jpg, .jpeg, .png, .webp"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                />
                <label
                  htmlFor="customFiles2"
                  className="block w-full py-2 text-center bg-lightBlueColor text-headingColor font-bold rounded-lg cursor-pointer hover:bg-primaryColor hover:text-white"
                >
                  Pilih Gambar
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="oldPassword" className="text-[16px] font-bold">
            Password Lama (Wajib Diisi)
          </label>
          <input
            type="password"
            name="oldPassword"
            onChange={handleInputChange}
            placeholder="Password Lama"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-[16px] font-bold">
            Password Baru
          </label>
          <input
            type="password"
            name="newPassword"
            onChange={handleInputChange}
            placeholder="Password Baru"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="passwordConfirm" className="text-[16px] font-bold">
            Konfirmasi Password
          </label>
          <input
            type="password"
            name="passwordConfirm"
            onChange={handleInputChange}
            placeholder="Konfirmasi Password"
            className="w-full py-2 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
          />
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
