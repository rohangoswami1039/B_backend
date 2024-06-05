import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Server is Up and Running");
});

//Routes File
import routes from "./routes/index.js";
app.use(routes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
