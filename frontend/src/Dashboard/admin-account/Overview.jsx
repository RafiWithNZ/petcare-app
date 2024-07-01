import { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import Loading from "../../components/Loader/Loading";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";

const Overview = () => {
  const {
    data: categories,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/categories`);

  const { data: ctData } = useFetchData(`${BASE_URL}/caretakers`);
  const { data: data } = useFetchData(`${BASE_URL}/users`);

  const activeCaretakers = ctData.length || 0;
  const activeUsers = data.length || 0;
  const approvalQueue = ctData.filter((ct) => ct.isApproved === false).length;

  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCategory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add category");

      const { message } = await res.json();
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/categories/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      const { message } = await res.json();
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-6">Overview</h1>
        {loading && <Loading />}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Pelanggan Aktif:</p>
                <span className="text-2xl font-bold">{activeUsers}</span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Seller Aktif:</p>
                <span className="text-2xl font-bold">{activeCaretakers}</span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Antrian Persetujuan:</p>
                <span className="text-2xl font-bold">{approvalQueue}</span>
              </div>
            </div>
            <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
              <p className="text-lg font-bold">Kelola Kategori</p>
              <input
                type="text"
                name="category"
                onChange={handleInputChange}
                placeholder="tambah kategori baru"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="description"
                onChange={handleInputChange}
                placeholder="tambah deskripsi"
                className="w-full p-2 mt-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddCategory}
                className="w-full mt-2 p-2 bg-blue-600 text-white rounded"
              >
                Add Category
              </button>
              <ul className="mt-4">
                {categories?.map((cat) => (
                  <li
                    key={cat._id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-lg text-textColor">
                      {cat.category}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-red-600"
                    >
                      <AiOutlineDelete />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
