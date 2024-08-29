const AWS = require('aws-sdk');
require('dotenv').config({ path: '../.env' });


//set the region
AWS.config.update({ region: process.env.AWS_REGION ,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
});
 
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

//call S3 to retrieve upload file to specified bucket

const uploadFileToS3 = async (file_path,  object_key) => {
    var uploadParams = { Bucket: process.env.BUCKET_NAME,Key: "", Body: "" };
    var fs = require("fs"); 
    var fileStream = fs.createReadStream(file_path);
    //read the file
    fileStream.on("error", function (err) {
        console.log("File reading Error", err);
      });
    uploadParams.Body = fileStream;
    uploadParams.Key =  object_key;
    // upload file to S3
    return await s3.upload(uploadParams).promise().then((data) => {
        console.log("Upload Success", data.Location);
        return data.Location; 
      })
      .catch((err) => {
        console.log("Error", err);
        return err;
      } );
;
  
}

//this function is used when the file content is already in memory
const  uploadFileContentToS3 = async (file_content,  object_key) => {
    var uploadParams = { Bucket: process.env.BUCKET_NAME,Key: "", Body: "" };
    var fs = require("fs"); 
    //read the file
    fileStream.on("error", function (err) {
        console.log("File reading Error", err);
      });
    uploadParams.Body = file_content;
    uploadParams.Key = object_key;
    // upload file to S3
    await s3.upload(uploadParams).promise().then((data) => {
        console.log("Upload Success", data.Location);
        return data.Location; 
      }
    ).catch((err) => {
        console.log("Error", err);
        return err;
      } );

  
}
const processS3Upload =  ()=>{
   return {
         uploadFileToS3: uploadFileToS3,
         uploadFileContentToS3: uploadFileContentToS3
    
   }

}



module.exports = processS3Upload();