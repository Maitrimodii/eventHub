const Files = require('../models/FileModel.js');
const fs = require('fs');
const path = require('path');
const errorHandler = require('../middlewares/errorMiddleware.js');
const asyncHandler = require('express-async-handler');
const { putObject, listObjects, deleteObject, getObjectURL } = require('../utils/aws.js');

///file download k view karva
const downloadFile = asyncHandler(async (req, res) => {
    try {
        const { projectName, filename } = req.params;
        const url = await getObjectURL(projectName, filename);
        res.json({ url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


///file upoloading , pn same project mate nhi thai
 const uploadFile = asyncHandler(async (req, res, next) => {
    try {
        const projectname = req.body.projectName;

        const promises = req.files.map(async (file) => {
            const contentType = file.mimetype;
            const filename = `${file.originalname}`;
            const fileUrl = await putObject(projectname, filename, contentType, fs.createReadStream(file.path));

            return fileUrl;
        });

        const fileUrls = await Promise.all(promises);


        if (fileUrls) {



            const projectName = req.body.projectName;
            const fileNames = req.files.map(file => file.filename);
            console.log(fileUrls);

            // Store file information in the database
            const filesData = {
                projectName: projectName,
                files: fileUrls.map((url, index) => ({
                    fileName: fileNames[index],
                    fileUrl: url,
                })),
            };

            await Files.create(filesData);

            // Delete files from server
            req.files.forEach(file => {
                const filePath = path.join("../backend/public/file", file.filename);
                fs.unlinkSync(filePath);
            });

            res.status(200).json({
                success: true,
                message: "Uploaded!",
                data: fileUrls,
            });
        }
        else {
            req.files.forEach(file => {
                const filePath = path.join("../backend/public/file", file.filename);
            });

            res.status(400).json({
                success: false,
                message: "Please try again !",
            });
        }
    } catch (error) {
        // Delete files from server
        req.files.forEach(file => {
            const filePath = path.join("../backend/public/file", file.filename);
            fs.unlinkSync(filePath);
        });

        next(error);
    }
});


///all file listing 
const getAllFiles =  asyncHandler(async (req, res, next) => {
    try {
        const projectName = req.params.projectName;
        console.log(projectName);

        const filesData = await Files.findOne({ projectName });
        console.log("hello", filesData);

        if (!filesData) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Get the list of objects (files) from AWS S3 for the specified project name

        if (filesData) {
            console.log("hello 2 ");
            const objectList = await listObjects(projectName);
            console.log("hello 3");

            res.status(200).json({
                success: true,
                message: "Files retrieved successfully",
                filedata: {
                    projectInfo: filesData,
                    objectList: objectList,
                },
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Please try again !",
            });

        }
    } catch (error) {
        // next(errorHandler(500, "Some error occured !"));
        next(error);
        console.log(error);
    }
});


///file deleting 
const deleteFile = asyncHandler(async (req, res, next) => {
        try {
            const { projectName, filename } = req.params;
    
            // console.log(req.params);
    
            // Delete the file from AWS S3
            await deleteObject(projectName, filename);
    
            // Delete the file information from the database
            const filesData = await Files.findOneAndUpdate(
                { projectName },
                { $pull: { files: { fileName: filename } } },
                { new: true }
            );
    
            if (!filesData) {
                return res.status(404).json({
                    success: false,
                    message: "Project or file not found",
                });
            }
    
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
                filedata: filesData,
            });
        } catch (error) {
            next(errorHandler(500, "Some error occurred while deleting the file"));
        }
    }
)



module.exports = { deleteFile, getAllFiles, uploadFile, downloadFile };