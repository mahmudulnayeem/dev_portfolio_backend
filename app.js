const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//use middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// require routes
const AuthRouter = require("./routes/authRoutes");
const BlogRouter = require("./routes/blogRoutes");
const ResumeRouter = require("./routes/resumeRoute");
const PortfolioRouter = require("./routes/portfolioRoutes");
const MessageRouter = require("./routes/messageRoute");
const PricingRouter = require("./routes/pricingRoutes");
const ViwerRouter = require("./routes/viewerRoute");
const OrderRouter = require("./routes/OrderRoute");


// routes use 
app.use("/api/v2",AuthRouter);
app.use("/api/v2",BlogRouter);
app.use("/api/v2",ResumeRouter);
app.use("/api/v2", PortfolioRouter);
app.use("/api/v2", MessageRouter);
app.use("/api/v2", PricingRouter );
app.use("/api/v2", ViwerRouter );
app.use("/api/v2", OrderRouter );
module.exports = app;
