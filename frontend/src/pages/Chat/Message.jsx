import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL, token } from "../../config";
import { authContext } from "../../context/AuthContext";
import Loading from "../../components/Loader/Loading";
import { PiPaperclip } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { uploadImageToCloudinary } from "../../utils/uploadCloudinary";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const Message = () => {
  const { id } = useParams();
  const { user, role } = useContext(authContext);

  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageContainerRef = useRef(null);
  const [person, setPerson] = useState(null);

  let path = role === "customer" ? "caretakers" : "users";
  let personId =
    role === "caretaker" ? id.substring(24, 48) : id.substring(0, 24);

  const fetchPerson = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${path}/${personId}`);
      const data = await res.json();
      setPerson(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/messages/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { messages } = await response.json();
      setData(messages);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerson();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photoUrl = null;
    if (selectedFile) {
      const uploadedImage = await uploadImageToCloudinary(selectedFile);
      photoUrl = uploadedImage.secure_url;
    }

    const message = {
      conversationId: id,
      desc: e.target.message.value || "",
      photoUrl: photoUrl,
    };

    if (!message.desc && !message.photoUrl) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      e.target.message.value = "";
      setSelectedFile(null);
      setPhotoPreview(null);
      fetchMessages();
    } catch (error) {
      setError(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-screen-xl">
        <div className="bg-green-600 text-white p-4 flex items-center rounded-b-lg">
          {person && (
            <>
              <img
                src={person.photo}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <h3 className="text-lg md:text-2xl font-bold ml-3">
                {person.name}
              </h3>
            </>
          )}
        </div>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div
            ref={messageContainerRef}
            className="p-4 md:p-8 flex flex-col gap-5 h-[360px] md:h-[550px] overflow-y-auto"
          >
            {data.map((m) => (
              <div
                className={`flex gap-2 md:gap-5 max-w-full md:max-w-3xl text-sm md:text-lg ${
                  m.userId === user._id ? "flex-row-reverse self-end" : ""
                }`}
                key={m._id}
              >
                <div>
                  {m.desc && (
                    <p
                      className={`max-w-sm md:max-w-xl p-3 md:p-5 rounded-lg ${
                        m.userId === user._id
                          ? "bg-blue-500 text-white rounded-br-lg"
                          : "bg-gray-200 text-gray-700 rounded-bl-lg"
                      }`}
                    >
                      {m.desc}
                    </p>
                  )}
                  {m.photoUrl && (
                    <PhotoProvider>
                      <PhotoView src={m.photoUrl}>
                        <img
                          src={m.photoUrl}
                          alt="attachment"
                          className="max-w-xs h-auto rounded-lg mt-2 bg-blue-500 p-2 cursor-pointer"
                        />
                      </PhotoView>
                    </PhotoProvider>
                  )}
                  <span className="text-xs text-gray-800">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <hr className="border-gray-300 mb-5" />
        <form
          className="flex items-center justify-between gap-2 md:gap-4"
          onSubmit={handleSubmit}
          onKeyUp={handleKeyPress}
        >
          <input
            className="flex-grow h-12 md:h-16 p-2 border border-gray-300 rounded-lg"
            type="text"
            autoComplete="off"
            placeholder="Tulis Pesan Anda...."
            name="message"
          />
          <div className="relative cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              id="customFile"
              accept=".jpg,.jpeg, .png, .mp4"
              className="absolute inset-0 opacity-0"
            />
            <label
              htmlFor="customFile"
              className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full hover:bg-blue-300"
            >
              <PiPaperclip size={20} />
            </label>
            {photoPreview && (
              <div className="absolute top-[-150px] right-[-40px] w-32 h-32 border bg-white p-1 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Selected"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
          <button
            className="flex items-center font-extrabold bg-green-600 text-white py-2 px-3 md:py-3 md:px-5 rounded-lg hover:bg-green-700"
            type="submit"
          >
            {window.innerWidth <= 768 ? (
              <IoSend size={20} className="ml-2 md:ml-5" />
            ) : (
              <>
                Kirim <IoSend size={20} className="ml-2 md:ml-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
