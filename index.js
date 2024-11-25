const express = require("express");
require("dotenv").config();
const cors = require("cors");
//,{useNewUrlParser: true}
const app = express();
//>py -m pip install pip --upgrade pip setuptools wheel
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => console.log("Connected to database"));
//process.env.AUTH_URI || 'mongodb://localhost:27017/port';
mongoose.connect(process.env.AUTH_URI);
const port = process.env.PORT || 5030;
const uuid = require("uuid");
const {
  PortfolioServices,
  PortfolioSchemas,
  Valabilitys,
  PortfolioTalkBusiness,
  UserDB,
} = require("./Model/Email");
const Mailer = require("./Service/MailSender");

app.post("/post-project", async (req, res) => {
  let {
    title,
    description,
    github_url,
    image_link,
    live_link,
    order,
    roles,
    technologies_json,
  } = req.body;
  const id = uuid.v4();
  try {
    const Enter = new PortfolioServices({
      title,
      description,
      github_url,
      live_link,
      id,
      image_link,
      order,
      roles,
      technologies_json,
      ...req.body
    });

    Enter.save()
      .then((corn) => {
        res.status(201).json({
          message: `posted...`,
        });
      })
      .catch((err) => {
        res.status(401).json({ message: err.message, status: 401 });
      });
  } catch (error) {
    res.status(500).json({
      message: `Error occured`,
      status: 500,
    });
  }
});

app.post("/create-user", async (req, res) => {
  const user_id = uuid.v4();
  const body = req.body;
  console.log({ user_id, body });
  try {
    const newUser = new UserDB({ ...body, user_id });
    const saved = await newUser.save();
    res.status(201).json({ message: "User created", data: saved, status: 201 });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
    })
  }
});

app.post("/update-project", async (req, res) => {
 const updatedProject = await PortfolioServices.updateMany({ id: req.body.id },{ $set: req.body });
 res.status(201).json({
    message: `Project updated`,
    data: updatedProject,
  });
});

app.get("/get-project", async (req, res) => {
  try {
    let corn = await PortfolioServices.find().sort({ order: -1, created_at: -1 });

    res.status(200).json({
      message: `Found`,
      data: corn,
    });
  } catch (error) {
    console.log({ err: error.message });
    res.status(500).json({
      message: `${error.message}`,
      status: 500,
    });
  }
});

app.get("/dlt-project/:id", async (req, res) => {
  try {
    let dlt = await PortfolioServices.deleteMany({ id: req.params.id });
    res.status(200).json({
      message: `Deleted`,
      data: dlt,
    });
  } catch (error) {
    console.log({ err: error.message });
    res.status(500).json({
      message: `${error.message}`,
      status: 500,
    });
  }
});

app.post("/post-email", async (req, res) => {
  let { name, email, message } = req.body;
  try {
    const PortfolioSchemass = new PortfolioSchemas({
      name,
      email,
      message,
    });
    PortfolioSchemass.save().then(async (corn) => {
      const sendMail = await Mailer.sendAlert(res, {
        msg: message,
        subject: name,
        email: email,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

app.get("/get-email", (req, res) => {
  try {
    PortfolioSchemas.find().then((corn) => {
      res.status(200).json({
        message: `found`,
        data: corn,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/post-check", (req, res) => {
  let { is_available } = req.body;
  try {
    const Valabilityss = new Valabilitys({
      is_available,
    });
    Valabilityss.save().then((corn) => {
      res.status(201).json({
        message: "Posted",
        status: 201,
      });
    });
  } catch (error) {
    res.status(501).json({
      message: error.message,
    });
  }
});

app.get("/check", (req, res) => {
  try {
    Valabilitys.find().then((corn) => {
      res.status(200).json({ message: "Found", data: corn, status: 200 });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
});

app.get("/currently", (req, res) => {
  try {
    res.status(200).json({
      message: "FALSE",
      currently: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to track my current status",
      currently: false,
    });
  }
});

app.post("/talk-business", async (req, res) => {
  try {
    const { name, description, demos, piority, media, amount } = req.body;
    const postBusiness = new PortfolioTalkBusiness({
      name,
      piority,
      description,
      demos,
      talkbusiness_id: uuid.v4(),
      media,
      amount,
    });
    const saved = await postBusiness.save();
    res.status(201).json({
      message: "Fetch Completed",
      data: saved,
      sttaus: 201,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Unable to post Talk Business.",
      status: 500,
    });
  }
});

app.post("/talk-business-update", async (req, res) => {
  try {
    const talkbusiness_id = req.body.talkbusiness_id;
    const updatedUser = await PortfolioTalkBusiness.findOneAndUpdate(
      { talkbusiness_id },
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({
      message: "Update Completed",
      data: updatedUser,
      sttaus: 201,
    });
  } catch (error) {
    console.log({ error });
  }
});

app.get("/talk-business", async (req, res) => {
  try {
    const getAllBusiness = await PortfolioTalkBusiness.find({}).sort({
      piority: -1,
    });
    res.status(200).json({
      message: "Fetch Completed",
      data: getAllBusiness,
      sttaus: 200,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Unable to fetch Talk Business.",
      status: 500,
    });
  }
});

app.get("/talk-business/:id", async (req, res) => {
  try {
    const dlt = await PortfolioTalkBusiness.deleteOne({
      talkbusiness_id: req.params.id,
    });
    res.status(200).json({
      message: "Fetch Completed",
      data: dlt,
      sttaus: 200,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Unable to fetch Talk Business.",
      status: 500,
    });
  }
});

app.listen(port, () => {
  console.log(`My Server is running on (http://localhost:${port}).`);
});
