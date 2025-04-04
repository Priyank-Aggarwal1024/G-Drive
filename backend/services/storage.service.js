import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const handleAWSError = (error, operation) => {
  console.error(`AWS ${operation} error:`, error);

  if (error.code === "NetworkingError") {
    throw new Error(`Network error during AWS ${operation}: ${error.message}`);
  } else if (error.code === "AccessDenied") {
    throw new Error(
      `Access denied during AWS ${operation}. Check your AWS credentials.`
    );
  } else if (error.code === "NoSuchBucket") {
    throw new Error(`S3 bucket '${BUCKET_NAME}' does not exist.`);
  } else if (error.code === "NoSuchKey") {
    throw new Error(`File not found in S3 bucket.`);
  } else if (
    error.message &&
    error.message.includes("does not exist in our records")
  ) {
    throw new Error(
      `Invalid AWS credentials. The access key ID does not exist in AWS records. Please check your AWS credentials in the .env file.`
    );
  } else if (
    error.message &&
    error.message.includes(
      "The security token included in the request is invalid"
    )
  ) {
    throw new Error(
      `Invalid AWS credentials. The secret access key is incorrect. Please check your AWS credentials in the .env file.`
    );
  } else {
    throw new Error(`AWS ${operation} error: ${error.message}`);
  }
};

export const uploadToStorage = async (file) => {
  try {
    if (file.buffer) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const result = await s3.upload(params).promise();
      console.log("result", result);
      return result;
    } else if (file.path) {
      return file;
    } else {
      throw new Error("Invalid file object provided");
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

export const deleteFromStorage = async (file) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: file.Key,
  };

  try {
    console.log("Attempting to delete:", params);
    await s3.deleteObject(params).promise();
    console.log("✅ File deleted successfully:", params.Key);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const getFileFromStorage = async (file) => {
  try {
    if (!file) {
      throw new Error("File is required for retrieval");
    }

    console.log(
      `Generating signed URL for file: ${file.Key} from bucket: ${BUCKET_NAME}`
    );

    const params = {
      Bucket: BUCKET_NAME,
      Key: file.Key,
      Expires: 3600, // URL expires in 1 hour
    };

    const signedUrl = s3.getSignedUrl("getObject", params);

    console.log(
      `Signed URL generated successfully for: ${file.Key}`,
      signedUrl
    );
    return signedUrl;
  } catch (error) {
    if (error.code) {
      handleAWSError(error, "get signed URL");
    } else {
      console.error("Error getting file from S3:", error);
      throw new Error(`Failed to get file from S3: ${error.message}`);
    }
  }
};
