import React, { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { toast } from "react-toastify";
import { HiX } from "react-icons/hi";
import { formateDate } from "../../utils/formateDate";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const Approval = () => {
  const {
    data: ctData,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/caretakers`);

  const [modalData, setModalData] = useState({
    isOpen: false,
    type: "",
    selectedCT: null,
  });

  const toggleModal = (type = "", ct = null) => {
    setModalData({
      isOpen: !modalData.isOpen,
      type,
      selectedCT: ct,
    });
  };

  const approveHandler = async (ct) => {
    try {
      const res = await fetch(`${BASE_URL}/caretakers/approval/${ct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
      <h1 className="text-3xl font-bold mb-6">Persetujuan Seller</h1>
      <div
        className={`max-w-full ${
          window.innerWidth <= 768 ? "overflow-x-scroll" : ""
        }`}
      >
        <table className="w-full text-left text-gray-500">
          <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-2 md:px-4 py-3">Nama Seller</th>
              <th className="px-2 md:px-4 py-3">Tanggal Daftar</th>
              <th className="px-2 md:px-4 py-3">Detail Seller</th>
              <th className="px-2 md:px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="h-20 text-center">
                  <Loading />
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="4" className="h-20 text-center">
                  <Error errMessage={error} />
                </td>
              </tr>
            )}
            {ctData
              ?.filter((ct) => !ct.isApproved)
              .map((ct) => (
                <tr
                  key={ct._id}
                  className="bg-white border-b border-gray-300 font-semibold text-headingColor text-left text-xs md:text-base"
                >
                  <th className="flex px-2 py-3 whitespace-nowrap cursor-pointer items-center gap-2">
                    <img
                      src={ct.photo}
                      className="w-10 h-10 rounded-full"
                      alt={ct.name}
                    />
                    <h1 className="text-xs md:text-base font-bold min-w-[200px]">
                      {ct.name}
                    </h1>
                  </th>
                  <td className="px-2 md:px-6 py-4">
                    {formateDate(ct.createdAt)}
                  </td>
                  <td className="px-2 md:px-6 py-4">
                    <button
                      className="bg-primaryColor py-1 px-5 text-white rounded-md"
                      onClick={() => toggleModal("details", ct)}
                    >
                      Detail
                    </button>
                  </td>
                  <td className="px-2 md:px-6 py-4 gap-2">
                    <button
                      className={`text-white py-2 px-3 rounded-md gap-2 ${
                        ct.isApproved
                          ? "bg-green-200 cursor-no-drop"
                          : "bg-green-500"
                      }`}
                      disabled={ct.isApproved}
                      onClick={() => toggleModal("approve", ct)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalData.isOpen && modalData.selectedCT && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg relative w-full max-w-lg">
            <button
              className="absolute top-3 right-4 p-2 text-gray-500 hover:text-gray-800 transition duration-300"
              onClick={() => toggleModal()}
            >
              <HiX className="text-2xl" />
            </button>
            <div className="p-6">
              {modalData.type === "details" && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Caretaker Details
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4 mb-6 border p-4 rounded-lg">
                    <div>
                      <p className="text-normal text-black">Nama</p>
                      <p className="text-normal text-black">Email</p>
                      <p className="text-normal text-black">No.Telepon</p>
                      <p className="text-normal text-black">Alamat</p>
                      <p className="text-normal text-black">Spesialisasi</p>
                    </div>
                    <div>
                      <p className="text-normal text-textColor">
                        : {modalData.selectedCT.name}
                      </p>
                      <p className="text-normal text-textColor">
                        : {modalData.selectedCT.email}
                      </p>
                      <p className="text-normal text-textColor">
                        : {modalData.selectedCT.phone}
                      </p>
                      <p className="text-normal text-textColor">
                        : {modalData.selectedCT.address}
                      </p>
                      <p className="text-normal text-textColor">
                        : {modalData.selectedCT.specialization.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="border p-4 rounded-lg mb-6 overflow-y-scroll h-[500px]">
                    <h3 className="text-lg font-semibold mb-5 text-gray-700">
                      Dokumen :
                    </h3>
                    <Swiper
                      slidesPerView={1}
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                    >
                      {modalData.selectedCT.documents.map((docs, i) => (
                        <SwiperSlide key={i}>
                          <PhotoProvider>
                            <PhotoView src={docs}>
                              <img
                                className="w-full h-full object-cover cursor-pointer"
                                src={docs}
                                alt={`Slide ${i}`}
                              />
                            </PhotoView>
                          </PhotoProvider>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <h3 className="text-lg font-semibold mb-5 text-gray-700">
                      Gambar Toko :
                    </h3>
                    <Swiper
                      slidesPerView={1}
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                    >
                      {modalData.selectedCT.pictures.map((pic, i) => (
                        <SwiperSlide key={i}>
                          <PhotoProvider>
                            <PhotoView src={pic}>
                              <img
                                className="w-full h-full object-cover cursor-pointer"
                                src={pic}
                                alt={`Slide ${i}`}
                              />
                            </PhotoView>
                          </PhotoProvider>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <h3 className="text-lg font-semibold mb-5 text-gray-700">
                      Deskripsi Toko :
                    </h3>
                    <p
                      className="text-normal text-textColor"
                      dangerouslySetInnerHTML={{
                        __html: modalData.selectedCT.about,
                      }}
                    ></p>
                  </div>
                </>
              )}
              {modalData.type === "approve" && (
                <>
                  <h2 className="text-2xl font-semibold mb-4">
                    Konfimasi Approval
                  </h2>
                  <p className="mb-4">
                    Apakah anda yakin untuk mengapprove seller ini?
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleModal()}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition duration-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => approveHandler(modalData.selectedCT)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Approve
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
