import { formateDate } from "../../utils/formateDate";
import { AiFillStar } from "react-icons/ai";

const Feedback = ({ reviews, totalRating }) => {
  return (
    <div>
      <div className="mb-[50px]">
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
          Semua Review ({totalRating})
        </h4>

        {reviews?.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="flex justify-between gap-10 mb-[30px]">
              <div className="flex gap-3">
                <figure className="w-10 h-10 rounded-full">
                  <img className="w-full" src={review?.user?.photo} alt="" />
                </figure>

                <div>
                  <h5 className="text-[14px] leading-6 font-bold text-primaryColor">
                    {review?.user?.name}
                  </h5>
                  <p className="text-[14px] leading-6 text-textColor">
                    {formateDate(review?.createdAt)}
                  </p>
                  <p className="text__para mt-3 font-medium text-[16px]">
                    {review?.reviewText}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                {[...Array(review?.rating).keys()].map((_, index) => (
                  <AiFillStar key={index} color="Orange" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[16px] leading-7 font-medium text-textColor">
            Belum ada review
          </p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
