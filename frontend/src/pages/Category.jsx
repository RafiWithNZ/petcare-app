import CategoryCard from "../components/Category/CategoryCard";
import Loading from "../components/Loader/Loading";
import useFetchData from "../hooks/useFetchData";
import { BASE_URL } from "../config";

const Category = () => {
  const { data: categories, loading } = useFetchData(`${BASE_URL}/categories`);


  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px]">
          {loading && <Loading />}
          {!loading &&
            categories.map((item, index) => (
              <CategoryCard key={index} item={item} index={index} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
