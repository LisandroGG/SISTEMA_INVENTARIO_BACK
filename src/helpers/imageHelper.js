import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getImagesDir = () => {
	const imagesDir = process.env.USER_DATA_PATH
		? path.join(process.env.USER_DATA_PATH, "images")
		: path.resolve(__dirname, "../../images");

	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
	}

	return imagesDir;
};

export const uploadImage = async (buffer, mimetype) => {
	const ext = mimetype.split("/")[1];
	const filename = `${randomUUID()}.${ext}`;
	const imagesDir = getImagesDir();
	const filepath = path.join(imagesDir, filename);

	await fs.promises.writeFile(filepath, buffer);

	return `/images/${filename}`;
};

export const deleteImage = async (imgPath) => {
	if (!imgPath) return;
	const filename = path.basename(imgPath);
	const imagesDir = getImagesDir();
	const filepath = path.join(imagesDir, filename);

	if (fs.existsSync(filepath)) {
		await fs.promises.unlink(filepath);
	}
};
