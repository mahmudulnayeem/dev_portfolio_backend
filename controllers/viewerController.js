const View = require("../models/viwerModel");
const date = require("date-and-time");
const UserModel = require("../models/AuthModel");
const BlogModel = require("../models/BlogModel");
const PortfolioModel = require("../models/portfolioModel");
const PricingModel = require("../models/pricingModel");
const MessageModel = require("../models/messageModel");
const OrderModel = require("../models/OrderModel")
// view
module.exports.Viewer = async (req, res) => {
  const { userVisite } = req.cookies;

  try {
    const time = date.format(new Date(), "YYYY/MM/DD").split("/");
    const year = time[0];
    const month = time[1];

    const checkYear = await View.findOne({ year });
    if (checkYear) {
      const uniqeViewer = checkYear.uniqeViewer;
      const checkCookie = uniqeViewer.find((c) => c === userVisite);
      if (checkCookie && checkCookie !== undefined) {
        let monthArray = checkYear.monthArray;
        const checkViewer = monthArray[month - 1].uniqeViewer.find(
          (c) => c === userVisite
        );
        if (!checkViewer) {
          monthArray[month - 1].viewer = monthArray[month - 1].viewer + 1;
          monthArray[month - 1].uniqeViewer = [
            ...monthArray[month - 1].uniqeViewer,
            userVisite,
          ];
          await View.updateOne(
            {
              year,
            },
            {
              monthArray,
            }
          );
          res.status(200).json({ message: "success" });
        }
      } else {
        let monthArray = checkYear.monthArray;
        const makeCookie =
          Math.floor(Math.random() * 50000000 + 5434374) + Date.now();
        const cookieString = makeCookie.toString();
        monthArray[month - 1].viewer = 1 + monthArray[month - 1].viewer;
        monthArray[month - 1].uniqeViewer = [
          ...monthArray[month - 1].uniqeViewer,
          cookieString,
        ];

        await View.updateOne(
          {
            year,
          },
          {
            viewer: checkYear.viewer + 1,
            monthArray,
            $push: {
              uniqeViewer: cookieString,
            },
          }
        );
        const option = {
          expires: new Date(Date.now() + 366 * 24 * 60 * 60 * 1000),
        };
        return res
          .status(201)
          .cookie("userVisite", cookieString, option)
          .json({ successMessage: "success" });
      }
    } else {
      let monthArray = [];
      for (let i = 0; i < 12; i++) {
        monthArray.push({
          viewer: 0,
          month: i + 1,
          uniqeViewer: [],
        });
      }
      const makeCookie =
        Math.floor(Math.random() * 50000000 + 5434374) + Date.now();
      const cookieString = makeCookie.toString();
      monthArray[month - 1].month = month;
      monthArray[month - 1].viewer = 1;
      monthArray[month - 1].uniqeViewer = [cookieString];

      await View.create({
        viewer: 1,
        year,
        monthArray,
        uniqeViewer: [cookieString],
      });
      const option = {
        expires: new Date(Date.now() + 366 * 24 * 60 * 60 * 1000),
      };
      return res
        .status(201)
        .cookie("userVisite", cookieString, option)
        .json({ successMessage: "success" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
};

// all length

module.exports.allLength = async (req, res) => {
  try {
    const time = date.format(new Date(), 'YYYY/MM/DD').split('/')
    const year = time[0]
    const userView = await View.findOne({ year })
    const users = await  UserModel.find({});
    const blogs = await BlogModel.find({});
    const portfolios = await PortfolioModel.find({});
    const pricings = await PricingModel.find({});
    const messages = await MessageModel.find({});
    const orders= await OrderModel.find({});
   res.status(201).json({
    users,
    blogs,
    portfolios,
    messages,
    pricings,
    userView,
    orders
   })
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal server error" });
  }
};
