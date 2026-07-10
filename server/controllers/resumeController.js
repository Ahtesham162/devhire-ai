const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    res.json({
      message: 'Resume uploaded and parsed successfully',
      filename: req.file.filename,
      extractedText: pdfData.text,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process resume', error: err.message });
  }
};