import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { BASE_URL, token } from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { toast } from "react-toastify";
import useFetchData from "../../hooks/useFetchData";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const { data } = useFetchData(`${BASE_URL}/caretakers/${id}`);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!rating || !reviewText) {
        setLoading(false);
        return toast.error("Lengkapi semua kolom terlebih dahulu");
      }
      const res = await fetch(`${BASE_URL}/caretakers/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, reviewText }),
      });

      const { message } = await res.json();

      setLoading(false);
      toast.success(message);
      navigate(`/caretakers/${id}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleHover = (index) => {
    setHover(index);
  };

  const handleRate = (index) => {
    setRating(index);
    setHover(0);
  };

  const handleDoubleClick = () => {
    setRating(0);
    setHover(0);
  };

  return (
    <section>
      <div className="container max-w-[700px]">
        <div className="flex items-center justify-center gap-4 mb-5 p-6 border-b">
          <img
            className="w-[25px] h-[25px] lg:w-[80px] lg:h-[80px] object-cover rounded-full"
            src={data?.photo}
            alt=""
          />
          <div>
            <p className="text-[24px] leading-6 font-semibold text-headingColor mb-4">
              {data?.name}
            </p>
            <p>{data?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmitReview}>
          <div className="flex items-center justify-center gap-3">
            {[...Array(5).keys()].map((_, index) => {
              index += 1;

              return (
                <button
                  key={index}
                  type="button"
                  className={` ${
                    index <= (hover || rating)
                      ? "text-yellowColor"
                      : "text-gray-400"
                  } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                  onMouseEnter={() => handleHover(index)}
                  onClick={() => handleRate(index)}
                  onDoubleClick={handleDoubleClick}
                >
                  <span>
                    <AiFillStar size={35} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-[30px]">
            <h3 className="text-[16px] leading-6 font-semibold text-headingColor mb-4">
              Beri Komentar dan Saran*
            </h3>

            <textarea
              className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor 
        px-4 py-3 w-full rounded-md"
              placeholder="Masukkan komentar dan saran"
              rows="5"
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button type="submit" className="btn">
              {loading ? (
                <HashLoader size={25} color="#fff" />
              ) : (
                "Kirim Ulasan"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
