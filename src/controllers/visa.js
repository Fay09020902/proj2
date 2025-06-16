const User = require("../models/User");
const EmployeeProfile = require("../models/EmployeeProfile");
const Document = require("../models/Document");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.visaStatusByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await EmployeeProfile.findOne({ userId }).populate(
      "documents"
    );
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const docTypes = [
      "opt_receipt",
      "opt_ead",
      "i_983",
      "i_20",
      "profile_picture",
      "drivers_license",
    ];
    const docResult = {};
    for (let type of docTypes) {
      const doc = (profile.documents || []).find((d) => d.type === type);
      docResult[type] = doc
        ? {
            path: doc.fileUrl,
            status: doc.status,
            feedback: doc.feedback,
            originalName: doc.originalName,
            _id: doc._id,
          }
        : null;
    }
    res.json({
      userId: profile.userId,
      optReceipt: docResult["opt_receipt"],
      optEAD: docResult["opt_ead"],
      i983: docResult["i_983"],
      i20: docResult["i_20"],
      driverslicense: docResult["drivers_license"],
      profilepicture: docResult["profile_picture"],
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch visa detail", error: err.message });
  }
};

exports.hrVisaStatusAll = async (req, res) => {
  try {
    // 找出所有 F1(OPT) 员工
    // const profiles = await EmployeeProfile.find({ "visa.visaType": "F1(CPT/OPT)" })
    const profiles = await EmployeeProfile.find({
      "visa.visaType": { $exists: true },
    })
      .populate("userId", "email onboardingStatus fullName firstName lastName")
      .populate("documents");
    const result = [];

    for (const profile of profiles) {
      const user = profile.userId;
      const docs = profile.documents || [];

      const submittedAll = ["opt_receipt", "opt_ead", "i_983", "i_20"].every(
        (type) =>
          docs.some((doc) => doc.type === type && doc.status === "Approved")
      );

      //返回状态 + 文件名 + 下载链接
      const getStatusAndFile = (type) => {
        const d = docs.find((d) => d.type === type);
        return d
          ? {
              _id: d._id,
              status: d.status,
              originalName: d.originalName,
              fileUrl: d.fileUrl,
              feedback: d.feedback || "",
            }
          : { status: "Not Submitted" };
      };
      result.push({
        userId: user._id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: `${profile.firstName} ${profile.lastName}`,
        email: user.email,
        workAuth: profile.visa?.visaType || "",
        onboardingStatus: user.onboardingStatus,
        optReceipt: getStatusAndFile("opt_receipt"),
        optEAD: getStatusAndFile("opt_ead"),
        i983: getStatusAndFile("i_983"),
        i20: getStatusAndFile("i_20"),
        driverslicense: getStatusAndFile("drivers_license"),
        profilepicture: getStatusAndFile("profile_picture"),
        startDate: profile.visa?.startDate || null,
        endDate: profile.visa?.endDate || null,
        submittedAllOPT: submittedAll,
      });
    }

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch all visa status", error: err.message });
  }
};

// {
//   fullName: 'John Doe',
//   email: 'john@example.com',
//   workAuth: 'F1(CPT/OPT)',
//   optReceipt: { status: 'Approved', ... },
//   optEAD: { status: 'Pending', ... },
//   i983: { status: 'Not Submitted' },
//   i20: { status: 'Not Available' }
// }

exports.hrVisaStatusReview = async (req, res) => {
  try {
    const { userId, docType, action, feedback } = req.body;
    function toSnakeCasePreserveAcronym(camel) {
      return camel.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
    }
    const type = toSnakeCasePreserveAcronym(docType);
    const doc = await Document.findOne({ userId, type }).sort({
      createdAt: -1,
    });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.status = action === "approve" ? "Approved" : "Rejected";
    doc.feedback = feedback || "";
    await doc.save();
    res.json({ message: "Document reviewed", status: doc.status });
  } catch (err) {
    res.status(500).json({ message: "Review failed", error: err.message });
  }
};

exports.sendReminder = async (req, res) => {
  const { userId, docType } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "fyj121322@gmail.com",
    subject: `Action Required: Please upload your ${docType}`,
    html: "Please login to exmployee portal to see visa status",
  });
  res.json({ message: "Email sent" });
};
