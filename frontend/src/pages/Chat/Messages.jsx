import { useState, useEffect, useContext } from "react";
import { BASE_URL, token } from "../../config";
import { authContext } from "../../context/AuthContext";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import moment from "../../utils/momentConfig"; // Import the configured moment instance
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const { role } = useContext(authContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/conversations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { conversations } = await response.json();
        setData(conversations);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const handleRowClick = (id) => {
    navigate(`/message/${id}`);
  };

  const handleRead = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/conversations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
      await fetchConversations(); // Re-fetch data
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full max-w-screen-xl p-4 md:p-12">
        <div className="flex justify-between mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Chat</h1>
        </div>
        <table className="w-full border-collapse">
          {isLoading && (
            <tr>
              <td colSpan="4" className="h-20 text-center">
                <div className="flex justify-center items-center">
                  <Loading />
                </div>
              </td>
            </tr>
          )}
          {error ? (
            <Error errMessage={error} />
          ) : (
            <tbody>
              {data.map((c) => (
                <tr
                  className={`h-24 cursor-pointer shadow-md  ${
                    (role === "caretaker" && !c.readBySeller) ||
                    (role === "customer" && !c.readByBuyer)
                      ? "bg-green-100"
                      : "bg-slate-100"
                  }`}
                  key={c.id}
                  onClick={() => {
                    handleRowClick(c.id);
                    handleRead(c.id);
                  }}
                >
                  <td className="p-2 md:p-4 font-medium">
                    {role === "caretaker" ? (
                      <div
                        key={c.buyerId?._id}
                        className="flex items-center gap-2 md:gap-4"
                      >
                        <img
                          src={c.buyerId?.photo}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                          alt=""
                        />
                        <h1 className="text-md md:text-lg font-bold">
                          {c.buyerId?.name}
                        </h1>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 md:gap-4">
                        <img
                          src={c.sellerId?.photo}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                          alt=""
                        />
                        <h1
                          className={`text-sm md:hidden font-bold ${
                            window.innerWidth > 768 ? "hidden" : ""
                          }`}
                        >
                          {c.sellerId?.name.substring(0, 10)}...
                        </h1>
                        <h1
                          className={`text-lg md:block font-bold ${
                            window.innerWidth <= 768 ? "hidden" : ""
                          }`}
                        >
                          {c.sellerId?.name}
                        </h1>
                      </div>
                    )}
                  </td>
                  <td className="p-2 md:p-4 text-gray-600">
                    {c?.lastMessage?.substring(0, 100)}...
                  </td>
                  <td className="p-2 md:p-4 text-gray-600">
                    {moment(c.updatedAt).fromNow()}
                  </td>
                  <td className="p-2 md:p-4">
                    {((role === "caretaker" && !c.readBySeller) ||
                      (role === "customer" && !c.readByBuyer)) && (
                      <button
                        className="bg-green-600 text-white hidden md:block md:text-[14px] py-1 px-2 md:py-2 md:px-4 rounded hover:bg-green-700"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRead(c.id);
                        }}
                      >
                        Tandai Telah Dibaca
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Messages;
