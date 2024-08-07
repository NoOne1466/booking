const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: `./config.env` });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require(`./src/app/app.js`);
const { default: axios } = require("axios");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
  .then(console.log("DB Connection"))
  .catch((err) => console.log("DB connection error: ", err.message));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.message, err.name);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("New client connected", socket.id);

//   socket.on("joinRoom", ({ chatId }) => {
//     socket.join(chatId);
//     console.log(`Client joined room: ${chatId}`);
//   });

//   socket.on("chatMessage", async ({ chatId, sender, message }) => {
//     const chat = await Chat.findById(chatId);
//     console.log(chat);
//     if (chat) {
//       chat.messages.push({ sender, message });
//       await chat.save();
//       io.to(chatId).emit("message", { sender, message });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected", socket.id);
//   });
// });

// const axios = require(axios);
// const fs = require("fs");
// // const x = require("./src/app");

// const data = JSON.parse(
//   fs.readFileSync("./src/app/_common/airports.json", "utf8")
// );
// for (const el in data) {
//   const x = data[el].state.toLowerCase();

//   if (x === "cairo") {
//     console.log(data[el]);
//   }
// }
// console.log(data);
