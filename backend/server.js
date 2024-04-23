const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data"); // Require FormData explicitly
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB file size limit
    }
});

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const data = new FormData();
        data.append("file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        data.append("isSync", "true");

        // Make request to IPFS API
        const ipfsResponse = await uploadToIPFS(data);
        console.log(ipfsResponse);
        // if (ipfsResponse && ipfsResponse.data && ipfsResponse.data.Hash) {
        //     const ipfsHash = ipfsResponse.data.Hash;
        //     console.log("IPFS upload successful. Hash:", ipfsHash);
        //     res.status(200).json({ ipfsHash });
        // } else {
        //     console.error("IPFS upload failed. Response:", ipfsResponse.data);
        //     res.status(500).json({ error: "IPFS upload failed" });
        // }
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function uploadToIPFS(data) {
    try{
          const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
            maxBodyLength: "Infinity",
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
              
            }
          });
          console.log("res.data:",res.data);
        } catch (error) {
          console.log("res.data-Error:",error);
        }
}

async function main() {
    try {
      const res = await fetch(
        "https://violet-defiant-kite-65.mypinata.cloud/ipfs/bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4"
      );
      const resData = await res.json();
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  }
  
 
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// const axios = require('axios')
// const FormData = require('form-data')
// const fs = require('fs')
// const JWT = {JWT}

// const pinFileToIPFS = async () => {
//     const formData = new FormData();
//     const src = "path/to/file.png";
    
//     const file = fs.createReadStream(src)
//     formData.append('file', file)
    
//     const pinataMetadata = JSON.stringify({
//       name: 'File name',
//     });
//     formData.append('pinataMetadata', pinataMetadata);
    
//     const pinataOptions = JSON.stringify({
//       cidVersion: 0,
//     })
//     formData.append('pinataOptions', pinataOptions);

//     try{
//       const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
//         maxBodyLength: "Infinity",
//         headers: {
//           'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//           'Authorization': `Bearer ${JWT}`
//         }
//       });
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
// }
// pinFileToIPFS()

