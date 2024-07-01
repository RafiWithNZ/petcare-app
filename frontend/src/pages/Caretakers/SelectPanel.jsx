import { useContext } from "react";
import ServiceList from "../../components/Services/ServiceList";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loader/Loading";
import { authContext } from "../../context/AuthContext.jsx";

const SelectPanel = () => {
  const { id } = useParams();
  const { data, loading } = useFetchData(`${BASE_URL}/caretakers/${id}`);

  const { role } = useContext(authContext);

  return (
    <div className="container mx-auto p-4">
      {role === "caretaker" ? (
        <div className="flex flex-col items-center justify-between mt-20 mb-[500px] ">
          <h1 className="text-3xl font-bold text-primary">
            Hanya Bisa diakses oleh Pelanggan
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Layanan {data?.name}
          </h1>
          {loading && <Loading />}
          {!loading && <ServiceList data={data} />}
        </div>
      )}
    </div>
  );
};

export default SelectPanel;
