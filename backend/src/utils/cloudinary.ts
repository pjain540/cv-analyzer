import cloudinary from '../config/cloudinary.js';

export const uploadOnCloudinary = async (fileBuffer: Buffer, fileName: string) => {
    return new Promise((resolve, reject) => {
        const cleanFileName = fileName.split('.')[0];
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                format: 'pdf',
                folder: 'resumes',
                public_id: `${Date.now()}-${cleanFileName}`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (public_id: string, resource_type: string = 'raw') => {
    try {
        if (!public_id) return null;
        const response = await cloudinary.uploader.destroy(public_id, { resource_type });
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
}
