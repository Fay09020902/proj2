const express = require('express');
const Document = require('../models/Document');
const EmployeeProfile = require('../models/EmployeeProfile')
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { type, userId } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    if (!type) {
      return res.status(400).json({ success: false, message: 'Document type is required.' });
    }

    // 删除这个用户这个类型的所有旧文档
    await Document.deleteMany({ userId, type });

    const newDoc = new Document({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      type,
      status: 'Pending',
    });
    await newDoc.save();

    // 更新 EmployeeProfile 的 documents 字段
    //    - 先移除该类型文档，再加上新 id
    const userProfile = await EmployeeProfile.findOne({ userId }).populate('documents');
    if (userProfile) {
      // 只保留非本 type 的文档 id
      userProfile.documents = userProfile.documents
        .filter(doc => !doc || doc.type !== type)
        .map(doc => doc._id);

      // 添加新文档 id
      userProfile.documents.push(newDoc._id);
      await userProfile.save();
    }

    res.status(201).json({ message: 'Document uploaded successfully', document: newDoc });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to upload' });
  }
};

exports.listDocuments = async (req, res) => {
  try {
     const { userId } = req.params;
    const myDocuments = await Document.find({ userId});
    res.json(myDocuments);
  } catch (err) {
    console.log(err)
     res.status(500).json({ message: err.errmsg });
  }
};



exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.fileUrl);

    // 判断文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // 用原始文件名作为下载名
    res.download(filePath, doc.originalName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.previewDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    const filePath = path.join(__dirname, '..', doc.fileUrl);
    //const fullPath = path.join(UPLOAD_DIR, doc.filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ message: 'Failed to preview document' });
  }
};
