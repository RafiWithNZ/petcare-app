import { useRef, useContext, useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { HiHeart, HiAnnotation } from "react-icons/hi";
import { authContext } from "../../context/AuthContext.jsx";
import { BASE_URL } from "../../config";

const navLinks = [
  {
    path: "/",
    display: "Beranda",
  },
  {
    path: "/caretaker",
    display: "Temukan Layanan",
  },
  {
    path: "/categories",
    display: "Kategori",
  },
  {
    path: "/contact",
    display: "Kontak",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token } = useContext(authContext);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/conversations/unread`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setUnreadCount(data.unreadCount);
        setHasUnreadMessages(data.unreadCount > 0);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    if (token) {
      fetchUnreadMessages();
    }
  }, [token]);

  return (
    <header
      className="header mx-auto flex items-center sticky top-0"
      ref={headerRef}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* ========= logo =========*/}
          <div>
            <Link to="/">
              <img
                className="w-40 h-10 md:w-56 md:h-14"
                src={logo}
                alt="Logo"
              />
            </Link>
          </div>

          {/* ========= menu ========= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.5rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[18px] leading-7 font-[600]"
                        : "text-textColor text-[18px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ========= user nav menu ========= */}
          <div className="flex items-center gap-1 md:gap-4">
            {(role === "customer" || role === "caretaker") && (
              <Link to="/messages" className="relative">
                <HiAnnotation
                  size={30}
                  className="text-primaryColor md:mr-5 cursor-pointer"
                />
                {hasUnreadMessages && (
                  <span className="absolute top-0 right-[12px] w-4 h-4 bg-red-600 text-white text-xs font-extrabold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            {role === "customer" && (
              <Link to="/favourites">
                <HiHeart
                  size={30}
                  className="text-primaryColor md:mr-5 cursor-pointer"
                />
              </Link>
            )}
            {token && user ? (
              <NavLink
                to={
                  role === "customer"
                    ? "/users/dashboard/overview"
                    : role === "caretaker"
                    ? "/caretakers/dashboard/overview"
                    : "/admin/dashboard/overview"
                }
                className={(navClass) =>
                  navClass.isActive
                    ? "text-primaryColor text-[18px] leading-7 font-[600]"
                    : "text-textColor text-[18px] leading-7 font-[500] hover:text-primaryColor"
                }
              >
                <div className="flex items-center gap-4">
                  <figure className="w-[44px] h-[44px] md:w-[55px] md:h-[55px] rounded-full cursor-pointer overflow-hidden">
                    <img
                      src={user?.photo}
                      className="w-full rounded-full"
                      alt=""
                    />
                  </figure>

                  <h2 className="hidden md:block md:text-[20px] font-semibold ml-3">
                    {user?.name}
                  </h2>
                </div>
              </NavLink>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor px-6 py-2 text-[18px] text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-12 h-12 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
