import React, { useEffect, useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import { Link } from "react-router-dom";
import starIcon from "../../assets/images/Star.png";
import IncomeLineChart from "../../components/Charts/LineChart";

const Overview = () => {
  const { data: ctData, loading, error } = useFetchData(
    `${BASE_URL}/caretakers/caretaker/profile`
  );

  const [incomeInsights, setIncomeInsights] = useState({
    dailyIncome: 0,
    weeklyIncome: 0,
    monthlyIncome: 0,
  });

  const [chartData, setChartData] = useState({
    dailyIncome: [],
    monthlyIncome: [],
  });

  const [filter, setFilter] = useState("month");

  useEffect(() => {
    if (ctData.orders) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      let dailyIncome = 0;
      let weeklyIncome = 0;
      let monthlyIncome = 0;

      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      let dailyIncomeArray = new Array(daysInMonth).fill(0);
      let monthlyIncomeArray = new Array(12).fill(0);

      const completedOrders = ctData.orders.filter(
        (order) => order.status === "Selesai"
      );

      completedOrders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const orderTotalPrice = order.orderedService?.price || 0;

        if (orderDate.toDateString() === today.toDateString()) {
          dailyIncome += orderTotalPrice;
        }
        if (orderDate >= startOfWeek) {
          weeklyIncome += orderTotalPrice;
        }
        if (orderDate >= startOfMonth) {
          monthlyIncome += orderTotalPrice;
        }
        if (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        ) {
          dailyIncomeArray[orderDate.getDate() - 1] += orderTotalPrice;
        }
        if (orderDate >= startOfYear) {
          monthlyIncomeArray[orderDate.getMonth()] += orderTotalPrice;
        }
      });

      setIncomeInsights({ dailyIncome, weeklyIncome, monthlyIncome });
      setChartData({
        dailyIncome: dailyIncomeArray,
        monthlyIncome: monthlyIncomeArray,
      });
    }
  }, [ctData.orders]);

  const activeServicesCount =
    ctData.services?.filter((item) => item.isActive === true).length || 0;
  const totalActiveOrdersCount = ctData.orders
    ? ctData.orders.filter(
        (order) => order.status === "Pending" || order.status === "Diproses"
      ).length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {ctData?.isApproved === false && (
        <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          <p className="ml-3 text-[15px] leading-6 font-medium">
            Akun anda sedang ditinjau oleh admin. Mohon lengkapi data anda di
            Profile. Peninjauan mungkin memakan waktu 2x24 jam.
          </p>
        </div>
      )}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold mb-6">Overview</h1>

          <Link to={`/caretakers/${ctData._id}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
              See my page
            </button>
          </Link>
        </div>
        {loading && <Loading />}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Pesanan Aktif:</p>
                <span className="text-2xl font-bold">
                  {totalActiveOrdersCount}
                </span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F8F6E3] p-4">
                <p className="text-lg font-bold">Services Aktif:</p>
                <span className="text-2xl font-bold">
                  {activeServicesCount}
                </span>
              </div>
              <div className="shadow-xl rounded-lg bg-lightBlueColor p-4">
                <p className="text-lg font-bold">Total Rating:</p>
                <span className="text-2xl font-bold">{ctData.totalRating}</span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#97E7E1] p-4">
                <p className="text-lg font-bold">Rating Toko:</p>
                <span className="flex items-center gap-2 text-2xl font-bold">
                  <img src={starIcon} alt="Star Icon" className="w-6 h-6" />{" "}
                  {ctData.averageRating}
                </span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Pendapatan Harian:</p>
                <span className="text-2xl font-bold">
                  {incomeInsights.dailyIncome.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Pendapatan Mingguan:</p>
                <span className="text-2xl font-bold">
                  {incomeInsights.weeklyIncome.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
                <p className="text-lg font-bold">Pendapatan Bulanan:</p>
                <span className="text-2xl font-bold">
                  {incomeInsights.monthlyIncome.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-bold mt-10 mb-2 text-center">
                Grafik Pendapatan
              </h1>
              <div className="flex justify-end">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm mr-0 md:mr-10 leading-5 focus:outline-none focus:ring-1 focus:ring-primaryColor focus:border-primaryColor sm:text-sm"
                >
                  <option value="month">Bulan ini</option>
                  <option value="year">Tahun ini</option>
                </select>
              </div>

              <div className="w-full h-[500px] bg-white shadow-inner my-10">
                {filter === "month" ? (
                  <IncomeLineChart
                    data={chartData.dailyIncome}
                    label="Daily Income"
                  />
                ) : (
                  <IncomeLineChart
                    data={chartData.monthlyIncome}
                    label="Monthly Income"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
