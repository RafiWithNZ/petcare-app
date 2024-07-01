import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../../config";
import { HiTrash, HiPencil } from "react-icons/hi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ServiceCard = ({ services }) => {
  const { servName, description, price } = services;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    setFormData({
      servName: services.servName,
      description: services.description,
      price: services.price,
    });
  }, [services]);

  const [formData, setFormData] = useState({
    servName: "",
    description: "",
    price: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target
      ? e.target
      : { name: "description", value: e };
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const deleteHandler = async () => {
    try {
      const res = await fetch(`${BASE_URL}/my-services/${services._id}`, {
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

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/my-services/${services._id}`, {
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
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      const res = await fetch(`${BASE_URL}/my-services/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
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
    <div className="bg-white p-5 lg:p-10 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-headingColor">{servName}</h2>
        <h2 className="text-[20px] font-semibold text-primaryColor">
          IDR{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "decimal",
            currency: "IDR",
          }).format(price)}
        </h2>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <p className="text-[16px] leading-6 font-semibold text-headingColor">
          Deskripsi Layanan :
        </p>
        <p
          className="text-[16px] leading-6 font-[400] text-justify text-textColor overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => handleToggleStatus(services._id, services.isActive)}
            className={`px-4 py-2 rounded-full ${
              services.isActive ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {services.isActive ? "Nonaktifkan" : "Aktifkan"}
          </button>
          <button
            className="bg-green-500 text-white py-2 rounded-md flex items-center gap-2"
            onClick={toggleModalOpen}
          >
            <HiPencil className="w-10 h-5" />
          </button>
          <button
            className="bg-red-500 text-white py-2 rounded-md flex items-center gap-2"
            onClick={deleteHandler}
          >
            <HiTrash className="w-10 h-5" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal w-1/2 max-w-[500px] bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-5">Edit Service</h2>
            <form onSubmit={updateHandler}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="servName"
                >
                  Nama Layanan
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="servName"
                  type="text"
                  name="servName"
                  value={formData.servName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Tarif Layanan
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Deskripsi Layanan
                </label>
                <ReactQuill
                  theme="snow"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(value) => handleInputChange(value)}
                  required
                />
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
                  Edit Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
