import { useState, useEffect } from "react";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PetCard = ({ pet }) => {
  const { petName, photo, animalType, age, weight, description, documents } = pet;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);
  const toggleModal2Open = () => setIsModal2Open(!isModal2Open);

  const [formData, setFormData] = useState({
    petName: "",
    photo: "",
    animalType: "",
    age: "",
    weight: "",
    description: "",
    documents: [],
  });

  useEffect(() => {
    const [ageValue, ageUnit] = pet.age.split(" ");
    const [weightValue, weightUnit] = pet.weight.split(" ");
    setFormData({
      ...formData,
      petName: pet.petName,
      animalType: pet.animalType,
      photo: pet.photo,
      age: ageValue,
      ageUnit: ageUnit,
      weight: weightValue,
      weightUnit: weightUnit,
      description: pet.description,
      documents: pet.documents,
    });
  }, [pet]);

  const handleDeletePet = async () => {
    try {
      const res = await fetch(`${BASE_URL}/my-pets/${pet._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Untuk multiple file
  const [previewURLs, setPreviewURLs] = useState([]);

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
    setFormData({
      ...formData,
      photo: data.url,
    });
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const combinedFormData = {
        ...formData,
        age: `${formData.age} ${formData.ageUnit}`,
        weight: `${formData.weight} ${formData.weightUnit}`,
      };

      const res = await fetch(`${BASE_URL}/my-pets/${pet._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(combinedFormData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex gap-4 p-3 lg:p-5 shadow-md rounded-2xl mb-5">
      <div className="flex justify-center">
        <figure>
          <img
            src={photo}
            className="w-[150px] h-[150px] object-cover rounded-lg"
            alt=""
          />
        </figure>
      </div>
      <div className="grow grid grid-cols-1 justify-center mr-5 ml-5">
        <h2 className="text-lg lg:text-3xl font-bold text-headingColor">
          {petName}
        </h2>
        <figure className="hidden md:block text-center gap-2 h-[32px] max-w-[120px] bg-irisBlueColor text-white rounded-lg text-lg">
          {animalType}
        </figure>
        <div className="md:flex text-sm lg:text-base font-semibold text-headingColor justify-between border-t border-solid border-gray-500">
          <div>
            Berat: <span className="font-normal">{weight}</span>
          </div>
          <div>
            Umur: <span className="font-normal">{age}</span>
          </div>
        </div>
      </div>
      <div className="justify-center flex flex-col items-center space-y-2 ">
        <button
          className="md:w-[120px] bg-blue-500 text-white px-2 py-2 rounded-md"
          onClick={toggleModal2Open}
        >
          Detail
        </button>
        <button
          className="md:w-[120px] bg-green-500 text-white px-2 py-2 rounded-md"
          onClick={toggleModalOpen}
        >
          Update
        </button>
        <button
          className="md:w-[120px] bg-red-500 text-white px-2 py-2 rounded-md"
          onClick={handleDeletePet}
        >
          Hapus
        </button>
      </div>
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal w-1/2 max-w-[500px] bg-white p-6 rounded-lg shadow-lg">
            <div className="sticky top-0 mb-10">
              <h1 className="text-3xl font-bold">Edit Profil Hewan</h1>
            </div>
            <div className="overflow-y-scroll max-h-[calc(100vh-190px)]">
              <form onSubmit={updateHandler}>
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
                    value={formData.petName}
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
                    value={formData.animalType}
                    onChange={handleInputChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="" disabled>
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
                  <div className="mb-4 mr-10">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="age"
                    >
                      Umur
                    </label>
                    <div className="flex items-center">
                      <input
                        className="shadow appearance-none border rounded w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="age"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                      <select
                        id="ageUnit"
                        name="ageUnit"
                        value={formData.ageUnit}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="" disabled>
                          Pilih
                        </option>
                        <option value="Bulan">Bulan</option>
                        <option value="Tahun">Tahun</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="weight"
                    >
                      Bobot
                    </label>
                    <div className="flex items-center justify-between">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="weight"
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                      <select
                        id="weightUnit"
                        name="weightUnit"
                        value={formData.weightUnit}
                        onChange={handleInputChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="" disabled>
                          Pilih
                        </option>
                        <option value="Gram">Gram</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
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
                    value={formData.description}
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
                    <div className="relative w-[160px] h-[50px] ml-3">
                      <input
                        type="file"
                        name="photos"
                        id="customFile"
                        onChange={handleImageInputChange}
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
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor=""
                  >
                    Upload Dokumen Pendukung
                  </label>
                  <div className="mb-5 items-center gap-3">
                    <div className="relative w-[160px] h-[50px] ml-3">
                      <input
                        type="file"
                        name="documents"
                        id="customFiles"
                        onChange={handleFilesInputChange}
                        accept=".jpg, .jpeg, .png"
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        multiple
                      />
                      <label
                        htmlFor="customFiles"
                        className="absolute top-0 left-0 w-full h-full flex
                          items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                          text-headingColor font-bold rounded-lg cursor-pointer hover:bg-[#0066ff99]"
                      >
                        Pilih Scan
                      </label>
                    </div>
                    {previewURLs.map((url, i) => (
                      <figure
                        key={i}
                        className="w-fit items-center justify-center"
                      >
                        <img src={url} alt="" className="mx-auto" />
                      </figure>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={toggleModalOpen}
                  >
                    Batal
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Edit Profil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isModal2Open && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal max-w-[590px] bg-white p-6 rounded-lg shadow-lg">
            <div className="sticky top-0 mb-10">
              <h1 className="text-3xl font-bold">Detail Profil Hewan</h1>
            </div>
            <div className="overflow-y-scroll max-h-[calc(100vh-190px)]">
              <div className="flex items-center gap-5">
                <img
                  className="w-full max-w-[200px] rounded-xl"
                  src={photo}
                  alt=""
                />
                <div className="ml-5">
                  <h2 className="text-lg font-semibold">Nama : {petName}</h2>
                  <h2 className="text-lg font-semibold">
                    Jenis Hewan : {animalType}
                  </h2>
                  <h2 className="text-lg font-semibold">Umur : {age}</h2>
                  <h2 className="text-lg font-semibold">Bobot : {weight}</h2>
                  <div>
                    <h2 className="text-lg font-semibold">Deskripsi :</h2>
                    <p>{description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-lg font-semibold border-t border-solid border-gray-500 py-5">
                {" "}
                Dokumen Pendukung :
              </div>
              <div className="flex flex-wrap gap-5">
                {documents.map((url, i) => (
                  <PhotoProvider>
                  <PhotoView key={i} src={url}>
                    <img
                      className="w-[150px] h-[270px]"
                      src={url}
                      alt="foto"
                    />
                  </PhotoView>
                </PhotoProvider>
                ))}
              </div>
            </div>
            <div className="sticky bottom-0 mt-5">
              <div className="flex items-center justify-center mt-5">
                <button
                  className="bg-primaryColor hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  onClick={toggleModal2Open}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCard;
