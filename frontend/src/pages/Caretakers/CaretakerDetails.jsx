import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import starIcon from "../../assets/images/Star.png";
import CaretakerAbout from "./CaretakerAbout";
import Feedback from "./Feedback";
import SidePanel from "./SidePanel";
import { HiOutlineHeart, HiHeart, HiAnnotation } from "react-icons/hi";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import Loading from "../../components/Loader/Loading";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext";

const CaretakerDetails = () => {
  const [tab, setTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const { data, loading } = useFetchData(`${BASE_URL}/caretakers/${id}`);

  const { user, role } = useContext(authContext);

  const {
    name,
    photo,
    address,
    specialization,
    timeSlots,
    reviews,
    about,
    pictures = [],
    services = [],
    totalRating,
    averageRating,
  } = data;

  useEffect(() => {
    if (role !== "customer") return;
    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/users/${user?._id}/favourite-status/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch favorite status");
        }

        const { isFavourite } = await res.json();
        setIsFavorite(isFavourite);
      } catch (error) {
        console.error("Failed to fetch favorite status", error);
      }
    };

    fetchFavoriteStatus();
  }, [id, user?._id, token]);

  const toggleFavourite = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/users/${user._id}/toggle-favourite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ caretakerId: id }),
        }
      );

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      const { message, favoriteStatus } = await res.json();
      setIsFavorite(favoriteStatus);
      toast.success(message);
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
      toast.error(error.message);
    }
  };

  const handleContact = async () => {
    const buyerId = user._id;
    const sellerId = id;
    const conversationId = sellerId + buyerId;

    try {
      const res = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/message/${data.data.id}`);
      } else if (res.status === 404) {
        const createRes = await fetch(`${BASE_URL}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            to: role === "caretaker" ? buyerId : sellerId,
          }),
        });

        const createData = await createRes.json();
        navigate(`/message/${createData.data.id}`);
      } else {
        throw new Error(`Failed to fetch conversation: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-[1170px] mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-[50px]">
            <div className="md:col-span-2">
              <div className="relative flex items-center gap-5">
                <figure className="max-w-[200px] max-h-[200px] flex items-center justify-center">
                  <img
                    src={photo}
                    alt=""
                    className="w-full rounded-full self-center"
                  />
                </figure>

                <div>
                  <h3 className="text-headingColor text-[26px] leading-9 font-bold mt-3">
                    {name}
                  </h3>
                  <div className="flex items-center gap-3 mt-3 ">
                    {specialization?.map((item, index) => (
                      <span
                        key={index}
                        className="bg-[#CCF0F3] text-irisBlueColor px-6 py-1 lg:px-6 lg:py-2 text-[12px] 
              leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded mr-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[18px] lg:leading-7
                  font-semibold text-headingColor"
                    >
                      <img
                        className="w-[24px] h-[24px]"
                        src={starIcon}
                        alt=""
                      />{" "}
                      {averageRating}
                    </span>
                    <span
                      className="text-[14px] leading-5 lg:text-[18px] lg:leading-7
                  font-[400] text-textColor"
                    >
                      ({totalRating})
                    </span>
                  </div>
                  <p className="text__para text-[14px] leading-6 md:text-[15px] lg:text-[16px] lg:max-w-[400px] text-justify">
                    {address}
                  </p>
                  {role === "customer" && (
                    <button
                      className="font-semibold border border-solid border-primaryColor px-5 py-1 mt-5 rounded-lg"
                      onClick={() => handleContact()}
                    >
                      <HiAnnotation className="inline" /> Chat
                    </button>
                  )}
                </div>
                {role === "customer" && (
                  <div className="absolute top-5 right-5">
                    {!isFavorite ? (
                      <HiOutlineHeart
                        className="cursor-pointer"
                        size={40}
                        onClick={toggleFavourite}
                      />
                    ) : (
                      <HiHeart
                        className="text-red-600 cursor-pointer"
                        size={40}
                        onClick={toggleFavourite}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-[50px] border-b border-solid border-[#0066ff34] ">
                <button
                  onClick={() => setTab("about")}
                  className={`${
                    tab === "about"
                      ? "border-b border-solid border-primaryColor"
                      : ""
                  }
                 py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  About
                </button>

                <button
                  onClick={() => setTab("feedback")}
                  className={`${
                    tab === "feedback"
                      ? "border-b border-solid border-primaryColor"
                      : ""
                  }
                 py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  Feedback
                </button>
              </div>

              <div className="mt-[50px]">
                {tab === "about" ? (
                  <CaretakerAbout
                    name={name}
                    pictures={pictures}
                    about={about}
                  />
                ) : (
                  <Feedback reviews={reviews} totalRating={totalRating} />
                )}
              </div>
            </div>

            <div>
              <SidePanel timeSlots={timeSlots} services={services} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CaretakerDetails;
