import { useContext, useState, useEffect, useRef } from "react";
import { authContext } from "../../context/AuthContext.jsx";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { dispatch } = useContext(authContext);
  const { user, role } = useContext(authContext);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState("Menu");

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalVisible(false);
    }, 300); // Duration of the animation
  };

  const handleShowModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setShowModal(true);
    }, 10); // Short delay to trigger the animation
  };

  const handleLogout = () => {
    handleShowModal();
  };

  const handleConfirmLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    handleCloseModal();
  };

  useEffect(() => {
    // Set active page based on the current location
    const path = location.pathname.split("/").pop();
    if (path) {
      const activeItem = navItems.find((item) => item.to === path);
      setActivePage(activeItem ? activeItem.label : "Menu");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let navItems;
  if (role === "caretaker") {
    navItems = [
      { to: "overview", label: "Overview" },
      { to: "orders", label: "Pesanan" },
      { to: "services", label: "Layanan Toko" },
      { to: "settings", label: "Pengaturan Akun" },
    ];
  } else if (role === "customer") {
    navItems = [
      { to: "overview", label: "Overview" },
      { to: "orders", label: "Pesanan" },
      { to: "pets", label: "Peliharaan" },
      { to: "settings", label: "Pengaturan Akun" },
    ];
  } else if (role === "admin") {
    navItems = [
      { to: "overview", label: "Overview" },
      { to: "users", label: "Pengguna" },
      { to: "caretakers", label: "Seller" },
      { to: "approval", label: "Persetujuan" },
      { to: "helpdesk", label: "Helpdesk" },
    ];
  }

  return (
    <>
      <div className="max-w-[1440px] px-5 mx-auto mt-10">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="pt-[30px] pb-[50px] px-[30px] rounded-lg bg-lightBlueColor hidden md:block">
            <div className="flex items-center justify-center">
              <figure className="hidden md:block w-[160px] h-[160px] rounded-full border-2 border-solid border-primaryColor">
                <img
                  src={user?.photo}
                  alt=""
                  className="w-full h-full rounded-full"
                />
              </figure>
            </div>
            <div className="hidden md:block text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                {user?.name}
              </h3>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                {user?.email}
              </p>
            </div>
            <div className="mt-[10px] md:mt-[30px] items-center grid grid-cols-1 gap-5">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primaryColor text-white font-semibold text-[16px] leading-7 py-2 text-center rounded-md border border-solid border-primaryColor"
                      : "text-headingColor font-semibold text-[16px] leading-7 py-2 text-center rounded-md border border-solid border-primaryColor hover:bg-primaryColor hover:text-white transition duration-300"
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full mt-5 md:mt-[100px] bg-red-500 text-[16px] leading-7 py-2 rounded-md text-white font-semibold text-center hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          <div ref={dropdownRef} className="relative md:hidden">
            <button
              className="text-headingColor font-semibold text-[16px] leading-7 py-2 text-center rounded-md border border-solid border-primaryColor hover:bg-primaryColor hover:text-white transition duration-300 w-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {activePage}
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 w-full text-center z-10 top-full mt-2 bg-white rounded shadow-md py-2 transition-all duration-300">
                {navItems.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className="block px-4 py-2 text-headingColor hover:bg-gray-100 hover:text-primaryColor transition duration-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-400 text-[16px] rounded-b-md text-white font-semibold text-center hover:bg-red-600 transition duration-300 py-1"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
          {/* content */}
          <div className="md:col-span-3 md:px-[30px]">
            <Outlet />
          </div>
        </div>
      </div>

      {modalVisible && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-transform duration-300 ${
              showModal ? "scale-100" : "scale-90"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Konfirmasi Logout</h2>
            <p className="mb-4">Apakah Anda yakin untuk logout?</p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
