const dotenv = require('dotenv');
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
dotenv.config();
// console.log(process.env.ACCESS_KEY_ID);

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

async function putObject(projectName, filename, contentType, body) {
    const key = `${projectName}/${filename}`;

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Body: body,
    });

    await s3Client.send(command);

    // Construct the public URL directly without signing
    const url = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${encodeURIComponent(key)}`;

    return url;
}

async function getObjectURL(projectName, filename) {
    const key = `${projectName}/${filename}`;

    // Construct the public URL directly without signing
    const url = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${encodeURIComponent(key)}`;
    return url;
}

async function listObjects(projectName) {
    const prefix =` ${projectName}/`;

    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
    });

    const result = await s3Client.send(command);
    console.log("result");
    console.log(result);
}

async function deleteObject(projectName, filename) {
    const key = `${projectName}/${filename}`;

    const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

module.exports = {
    putObject,
    getObjectURL,
    listObjects,
    deleteObject,
};