import { useEffect, useContext } from "react";
import { authContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const useIdleLogout = (timeout = 1800000) => { //Timer 30 menit
  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();
  let timer;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      alert("You have been logged out due to inactivity.");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }, timeout);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer(); // Initialize timer

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, timeout]);

  return null;
};

export default useIdleLogout;
