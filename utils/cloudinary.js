const cloudinary = require('cloudinary').v2
const fs =require("fs");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
       if(!localFilePath) return null
        // upload the file on cloudinary
     const response= await  cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        // file has been uploaded successfully
        console.log("file is uploaded on clodinary",response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
      fs.unlinkSync(localFilePath)//remove the locally save temporary file as the upload operatin got failed
      return null;  
    }
}


// const uploadShareablePDF = async (pdfUrl) => {
//     try {
//         // Download the PDF from the URL (you can use axios or any other package)
//         const response = await axios({
//             method: 'get',
//             url: pdfUrl,
//             responseType: 'arraybuffer'
//         });

//         // Convert the response data into a file
//         const pdfBuffer = Buffer.from(response.data, 'binary');
//         const tempFilePath = path.join(__dirname, 'temp.pdf'); // Temporary file path

//         // Write the PDF data to a temporary file
//         fs.writeFileSync(tempFilePath, pdfBuffer);

//         // Upload the temporary file to Cloudinary
//         const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);
//         return cloudinaryResponse ? cloudinaryResponse.url : null;
//     } catch (error) {
//         console.error("Error uploading shareable PDF URL", error);
//         return null;
//     }
// };

module.exports =uploadOnCloudinary


