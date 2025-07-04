/*

import nc from 'next-connect';
import multer from 'multer';
import tesseract from 'node-tesseract-ocr';
import fs from 'fs';
import path from 'path';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Temporary storage for uploaded files
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

const config = {
  lang: "eng", // "eng+msa" for both English and Malay
  oem: 1,      // OCR Engine Mode (1: LSTM Only, 0: Legacy only, 2: Legacy + LSTM, 3: Default)
  psm: 3,      // Page Segmentation Mode (3: Fully automatic page segmentation)
};

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
.use(upload.single('image')) // 'image' is the field name for the file input
.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const imagePath = req.file.path;

  try {
    const text = await tesseract.recognize(imagePath, config);

    // After OCR, delete the temporary file
    fs.unlinkSync(imagePath);

    // Implement your regex extraction logic here
    const extractedData = {};
    // ... (same regex logic as in the client-side example)
    const icNoMatch = text.match(/(\d{6}-\d{2}-\d{4}|\d{12})/);
    if (icNoMatch) {
      extractedData.icNo = icNoMatch[0];
    }
    // Add other regexes for unit, noPendaftaran, date, noSijil

    const unitMatch = text.match(/PEMIMPIN PENGAKAP KANAK-KANAK\s*(DAERAH KLUANG KE-70, JOHOR)?/i);
    if (unitMatch) {
      extractedData.unit = unitMatch[0].trim();
    }

    const noPendaftaranMatch = text.match(/No\. Pendaftaran\s*:\s*([A-Za-z]-\d{5})/);
    if (noPendaftaranMatch) {
      extractedData.noPendaftaran = noPendaftaranMatch[1];
    }

    const dateMatch = text.match(/Tarikh\s*:\s*(\d{2}\.\d{2}\.\d{4})/);
    if (dateMatch) {
      extractedData.date = dateMatch[1];
    }

    const noSijilMatch = text.match(/(PKK\d{4})/);
    if (noSijilMatch) {
      extractedData.noSijil = noSijilMatch[1];
    } else {
        const lastLineWords = text.split('\n').pop().split(/\s+/);
        const potentialNoSijil = lastLineWords[lastLineWords.length -1]
        if (potentialNoSijil && potentialNoSijil.startsWith('PKK') && potentialNoSijil.length >= 7) {
            extractedData.noSijil = potentialNoNoSijil;
        }
    }


    res.status(200).json({ rawText: text, extractedData });
  } catch (error) {
    console.error("Server-side OCR Error:", error);
    if (fs.existsSync(imagePath)) { // Clean up if error occurs before deletion
        fs.unlinkSync(imagePath);
    }
    res.status(500).json({ message: 'Error performing OCR', error: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser as multer handles it
  },
};

export default handler;

*/