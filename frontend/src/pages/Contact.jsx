import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../config";

const Contact = () => {
  const [formData, setFormData] = useState();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/helpdesk/create-suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Kontak Kami</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Utarakan saran atau keluhan anda tentang aplikasi ini.
        </p>

        <form onSubmit={submitHandler} className="space-y-8">
          <div>
            <label htmlFor="email" className="form__label">
              Email Anda
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="form__input mt-1"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="form__label">
              Subjek
            </label>
            <input
              name="subject"
              type="text"
              id="subject"
              placeholder="Beri tahu kami masalah Anda"
              className="form__input mt-1"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="form__label">
              Pesan Anda
            </label>
            <textarea
              name="message"
              rows="6"
              type="text"
              id="message"
              placeholder="Tinngalkan pesan Anda....."
              className="form__input mt-1"
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn rounded sm:w-fit">
            Kirim
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
