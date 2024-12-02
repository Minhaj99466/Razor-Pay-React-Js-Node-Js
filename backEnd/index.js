import express from "express";
import cors from "cors";
import userRoute from "./Route/userRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(
  cors({
    origin: [process.env.CLIENTADDRESS],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
