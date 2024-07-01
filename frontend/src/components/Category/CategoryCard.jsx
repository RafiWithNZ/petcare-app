import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ item, index }) => {
  const { category, description } = item;
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/caretaker?category=${category}`);
  };

  return (
    <div onClick={handleCategoryClick} className="cursor-pointer py-[30px] px-3 lg:px-5 shadow-lg">
      <h2 className="text-[26px] leading-9 font-[700] text-headingColor">
        {category}
      </h2>
      <p className="text-[16px] leading-6 font-[400] mt-4 text-justify text-textColor">
        {description}
      </p>
      <div className="flex items-center justify-end mt-[30px]">
        <span
          className="w-[44px] h-[44px] flex items-center justify-center font-extrabold text-[18px] leading-[30px]"
          style={{
            backgroundColor: "#FFFDB5",
            color: "#0067FF",
            borderRadius: "6px 0 0 6px",
          }}
        >
          {index + 1}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
