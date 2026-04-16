import cloudinary from "../config/cloudinary.js";

export const uploadImage = (
	buffer: Buffer,
	folder: string,
): Promise<string> => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ folder }, (error, result) => {
				if (error) {
					return reject(error);
				}
				if (!result?.secure_url) {
					return reject(new Error("No se obtuvo secure_url de Cloudinary"));
				} else resolve(result.secure_url);
			})
			.end(buffer);
	});
};

export const getPublicId = (url: string): string => {
	return url.split("/").slice(-2).join("/").split(".")[0];
};

export const deleteImage = async (url: string): Promise<void> => {
	const publicId = getPublicId(url);
	await cloudinary.uploader.destroy(publicId);
};
