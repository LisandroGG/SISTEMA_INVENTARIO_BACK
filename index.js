import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import { sequelize } from "./src/config/database.js";
import "./src/models/relationships.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { mainRouter } from "./src/routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});

const PORT = process.env.PORT || 3000;

const app = express();

const imagesDir = process.env.USER_DATA_PATH
	? path.join(process.env.USER_DATA_PATH, "images")
	: path.resolve(__dirname, "images");

console.log("imagesDir:", imagesDir);
console.log("existe:", fs.existsSync(imagesDir));

if (!fs.existsSync(imagesDir)) {
	fs.mkdirSync(imagesDir, { recursive: true });
}

app.use("/images", express.static(imagesDir));

app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
	}),
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const isProduction = process.env.ELECTRON_RUN_AS_NODE === "1";

const logger = pino({
	level: process.env.LOG_LEVEL || "info",
	transport: isProduction
		? undefined
		: {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "yyyy-mm-dd HH:MM:ss",
					ignore: "pid,hostname",
				},
			},
});

app.use(
	pinoHttp({
		logger,
		customLogLevel: (_req, res, _err) => {
			if (res.statusCode >= 500) return "error";
			if (res.statusCode >= 400) return "warn";
			return "info";
		},
		serializers: {
			req(req) {
				return { method: req.method, url: req.url };
			},
			res(res) {
				return { statusCode: res.statusCode };
			},
		},
	}),
);

app.use(cors({ origin: true, credentials: true }));

app.use("/", mainRouter);

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

async function main() {
	try {
		await sequelize.sync({ force: false });
		app.listen(PORT, () => {
			logger.info(`Server running on port ${PORT}`);
		});
	} catch (error) {
		logger.error({ err: error }, "Connection failed");
	}
}

main();

export default app;
