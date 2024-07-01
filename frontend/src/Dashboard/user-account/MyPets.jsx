import { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import PetCard from "../../components/Pets/PetCard";
import HashLoader from "react-spinners/HashLoader";
import { HiX } from "react-icons/hi";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const MyPets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);

  const { data: myPets, loading, error } = useFetchData(`${BASE_URL}/my-pets/`);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState([]);
  //untuk multiple file
  const [previewURLs, setPreviewURLs] = useState([]);

  const [formData, setFormData] = useState({
    petName: "",
    photo: selectedFile,
    animalType: "",
    age: "",
    weight: "",
    description: "",
    documents: [],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      documents: datas.map((d) => d.url),
    });
  };

  const handleImageInputChange = async (event) => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);

    setPreviewImg(data.url);
    setSelectedFile(data.url);
    setFormData({
      ...formData,
      photo: data.url,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/my-pets/create-pet-info`, {
        method: "POST",
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
      toggleModalOpen();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex align-middle justify-between mb-10">
        <h1 className="text-lg lg:text-3xl font-bold">Info Peliharaan Saya</h1>
        <button
          className="w-[150px] lg:w-[200px] bg-primaryColor text-[14px] lg:text-[16px] leading-7 rounded-xl text-white font-semibold"
          onClick={toggleModalOpen}
          disabled={isModalOpen}
        >
          Tambah Profil Hewan
        </button>
      </div>

      {loading && !error && <Loading />}

      {error && !loading && <Error errMessage={error} />}

      {!loading && !error && myPets.length > 0 ? (
        <div className="mb-5">
          {myPets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      ) : null}

      {!loading && myPets.length === 0 ? (
        <h2
          className="mt-5 text-center leading-7
      text-[20px] font-semibold text-primaryColor"
        >
          Belum menambahkan Info
        </h2>
      ) : null}

      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal relative w-1/2 max-w-[500px] bg-white p-6 rounded-lg shadow-lg ">
            <button
              className="absolute top-3 right-0 p-4 text-red-700 text-2xl hover:text-red-500"
              onClick={toggleModalOpen}
            >
              <HiX />
            </button>
            <h2 className="text-lg md:text-3xl font-bold mb-5">
              Tambah Profil Hewan
            </h2>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="petName"
                >
                  Nama
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="petName"
                  type="text"
                  name="petName"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="animal-type"
                >
                  Jenis Hewan
                </label>
                <select
                  id="animal-type"
                  name="animalType"
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="" disabled selected>
                    Pilih
                  </option>
                  <option value="anjing">Anjing</option>
                  <option value="kucing">Kucing</option>
                  <option value="kelinci">Kelinci</option>
                  <option value="hamster">Hamster</option>
                  <option value="burung">Burung</option>
                  <option value="reptil">Reptil</option>
                </select>
              </div>
              <div className="flex justify-between">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="age"
                  >
                    Umur <i className="hidden md:inline">(bulan/tahun)</i>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="age"
                    type="String"
                    name="age"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="weight"
                  >
                    Bobot <i className="hidden md:inline">(gram/kg)</i>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="weight"
                    type="String"
                    name="weight"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Deskripsi Singkat
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="photos"
                >
                  Upload Gambar
                </label>
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
                          src={previewImg}
                          alt=""
                          className="w-full rounded-full"
                        />
                      </figure>
                    )
                  )}

                  <div className="relative w-full md:w-[160px] md:h-[50px] ml-3">
                    <input
                      type="file"
                      name="photo"
                      id="customFile"
                      onChange={handleImageInputChange}
                      accept=".jpg,.jpeg, .png, .webp"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      multiple
                    />

                    <label
                      htmlFor="customFile"
                      className="absolute top-0 left-0 w-full h-full flex
                  items-center px-[0.75rem] py-[0.375rem] text-[12px] md:text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                  text-headingColor font-bold rounded-lg truncate cursor-pointer hover:bg-[#0066ff99]"
                    >
                      Pilih Gambar
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor=""
                >
                  Dokumen Pendukung
                </label>
                <div className="mb-5 items-center gap-3">
                  <div className="relative w-full md:w-[160px] md:h-[50px] ml-3">
                    <input
                      type="file"
                      name="documents"
                      id="customFiles"
                      onChange={handleFilesInputChange}
                      accept=".jpg,.jpeg, .png, .mp4"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      multiple
                    />

                    <label
                      htmlFor="customFiles"
                      className="absolute top-0 left-0 w-full h-full flex
                  items-center px-[0.75rem] py-[0.375rem] text-[12px] md:text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                  text-headingColor font-bold rounded-lg truncate cursor-pointer hover:bg-[#0066ff99]"
                    >
                      Pilih Foto
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-5 ml-5 mt-3">
                    {previewURLs.map((url, i) => (
                      <PhotoProvider>
                        <PhotoView key={i} src={url}>
                          <img
                            className="w-[60px] h-[60px] rounded-md"
                            src={url}
                            alt="foto"
                          />
                        </PhotoView>
                      </PhotoProvider>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 border-t border-solid border-gray-200 rounded-b">
                <button
                  className="bg-blue-500 hover:bg-primaryColor text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Tambah Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPets;
