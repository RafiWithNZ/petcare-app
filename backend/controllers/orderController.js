import Caretaker from "../models/CaretakerSchema.js";
import User from "../models/UserSchema.js";
import Orders from "../models/OrderSchema.js";
import Service from "../models/ServiceSchema.js";
import sendMail from "../utils/sendMail.js";
import Queue from "bull";

// Setup a queue for email sending
const emailQueue = new Queue("email");

// Consumer to process email sending from the queue
emailQueue.process(async (job, done) => {
  const { email, subject, html } = job.data;
  await sendMail({ email, subject, html });
  done();
});

// Function to update order status
const updateOrderStatus = async (req, res, status, emailSubject, emailHtml) => {
  try {
    // Find the order by id
    const order = await Orders.findById(req.params.id);

    // If order not found, return 404
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan" });
    }

    // Find the user and caretaker associated with the order
    const user = await User.findById(order.user._id);
    const caretaker = await Caretaker.findById(order.caretaker._id);

    // If user or caretaker not found, return 404
    if (!user || !caretaker) {
      return res
        .status(404)
        .json({ success: false, message: "User or Caretaker not found" });
    }

    // Update order status
    await Orders.findByIdAndUpdate(order._id, { status });

    // Add email sending task to the queue
    emailQueue.add({
      email: user.email,
      subject: emailSubject,
      html: emailHtml(user, caretaker, order.orderedService),
    });

    // Return success response
    res
      .status(200)
      .json({ success: true, message: `Order ${status.toLowerCase()}` });
  } catch (error) {
    // Return error response
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

export const getMyOrders = async (req, res) => {
  const id = req.userId;

  try {
    const customer = await User.findById(id);
    const caretaker = await Caretaker.findById(id);

    const user = customer || caretaker;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const myOrders = await Orders.find(
      user === customer ? { user: id } : { caretaker: id }
    );

    res.status(200).json({
      success: true,
      message: "Orders found",
      data: myOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal error",
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { caretaker, user, orderDate, orderedService, selectedPet } =
      req.body;

    // Validate input data
    if (!caretaker || !user || !orderDate || !orderedService || !selectedPet) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete order details" });
    }

    // Find user, caretaker, and service
    const u = await User.findById(user);
    const ct = await Caretaker.findById(caretaker);
    const serv = await Service.findById(orderedService);

    if (!u || !ct || !serv) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User, Caretaker atau Service tidak ditemukan",
        });
    }

    // Create order
    const order = new Orders({
      caretaker,
      user,
      orderDate,
      orderedService,
      selectedPet,
      status: "Pending",
    });

    const newOrder = await order.save();

    // Push newOrder._id to user.orders and caretaker.orders
    await User.findByIdAndUpdate(user, { $push: { orders: newOrder._id } });
    await Caretaker.findByIdAndUpdate(caretaker, {
      $push: { orders: newOrder._id },
    });

    // Add email sending task to the queue
    emailQueue.add({
      email: ct.email,
      subject: "Ada Pesanan Baru",
      html: `
        <div>
          <h2>Halo ${ct.name}!</h2>
          <p>Ada pesanan baru (${serv.servName}) oleh <b>${u.name}</b> pada ${orderDate}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "Pesanan berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal error, tidak bisa membuat order",
    });
  }
};

// Export order status update functions
export const accept = (req, res) => {
  updateOrderStatus(
    req,
    res,
    "Diproses",
    "Pesanan Anda Diterima",
    (user, caretaker, service) => `
      <div>
        <h2>Halo ${user.name}!</h2>
        <p>Pesanan Anda (${service.servName}) telah dikonfirmasi oleh Toko <b>${caretaker.name}</b></p>
        <p>Silahkan datang ke tempat untuk melanjutkan pesanan</p>
      </div>
    `
  );
};

export const reject = (req, res) => {
  updateOrderStatus(
    req,
    res,
    "Ditolak",
    "Pesanan Anda Ditolak",
    (user, caretaker, service) => `
      <div>
        <h2>Halo ${user.name}!</h2>
        <p>Pesanan Anda (${service.servName}) telah ditolak oleh Toko <b>${caretaker.name}</b></p>
        <p>Silahkan kembali layanan dilain waktu atau kontak <b>${caretaker.name}</b></p>
      </div>
    `
  );
};

export const complete = (req, res) => {
  updateOrderStatus(
    req,
    res,
    "Selesai",
    "Pesanan Anda Telah Selesai",
    (user, caretaker, service) => `
      <div>
        <h2>Halo ${user.name}!</h2>
        <p>Pesanan Anda (${service.servName}) telah diselesaikan oleh Toko <b>${caretaker.name}</b></p>
        <p>Silahkan ambil hewan peliharaan Anda</p>
        <p>Terima kasih telah mempercayakan hewan Anda pada Kami</p>
      </div>
    `
  );
};

export const cancel = (req, res) => {
  updateOrderStatus(
    req,
    res,
    "Dibatalkan",
    "Pesanan Dibatalkan Pelanggan",
    (user, caretaker, service) => `
      <div>
        <h2>Halo ${caretaker.name}!</h2>
        <p>Pesanan (${service.servName}) telah dibatalkan oleh pelanggan Yth.<b>${user.name}</b></p>
      </div>
    `
  );
};

export const Rated = async (req, res) => {
  try {
    await Orders.findByIdAndUpdate(req.params.id, { rated: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal error" });
  }
};
