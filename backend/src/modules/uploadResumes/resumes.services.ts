import "../../utils/polyfill.js";
import { getTextExtractor } from 'office-text-extractor';
import { extractResumeData } from "../../services/llm.service.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js"
import { generateFileHash } from "../../utils/hash.js"
import { Resume } from "./resumes.model.js"
import { ApiError } from "../../utils/ApiError.js";
import { getPaginatedData } from "../../utils/pagination.js";

export const processResume = async (file: Express.Multer.File) => {

    if (file.mimetype !== 'application/pdf') {
        throw new ApiError(400, "Only pdf files are allowed");
    }

    const hashKey = generateFileHash(file.buffer)

    //1.check for duplicates
    const existingResume = await Resume.findOne({
        "resume.hashKey": hashKey
    })

    if (existingResume) {
        console.log("⚠️ Duplicate resume found, returning existing data");
        return existingResume;
    }


    //2. Upload file to cloud
    const cloudinaryResponse: any = await uploadOnCloudinary(file.buffer, file.originalname)

    //3.parse to PDF
    const extractor = getTextExtractor();
    const text = await extractor.extractText({ input: file.buffer, type: 'buffer' });

    if (!text) {
        throw new ApiError(400, "Failed to extract text from PDF");
    }

    //extract data using llm
    const extractedData = await extractResumeData(text)

    //save to database
    const newResume = await Resume.create({
        ...extractedData,
        resume: {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
            hashKey
        }
    })

    console.log("🎉 Resume processed successfully:", newResume._id);

    return newResume
}


export const getAllResumes = async (page: number, limit: number, pagination: boolean = true) => {
    const resumes = await getPaginatedData(Resume, {}, page, limit, { createdAt: -1 }, pagination);
    return resumes;
}

export const getResumeById = async (id: string) => {
    const resume = await Resume.findById(id);
    return resume;
}

export const deleteResume = async (id: string) => {
    const resume = await Resume.findById(id);

    if (resume?.resume?.public_id) {
        await deleteFromCloudinary(resume.resume.public_id);
    }

    const deletedResume = await Resume.findByIdAndDelete(id);
    return deletedResume;
}

