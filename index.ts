import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { sequelize } from "./src/config/database";
import "./src/models/relationships";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import type { RequestHandler } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});

const PORT = process.env.PORT || 3000;

const app = express();

const logger = pino({
	level: process.env.LOG_LEVEL || "info",
	transport: {
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
		customLogLevel: (_req: Request, res: Response, _err?: Error) => {
			if (res.statusCode >= 500) return "error";
			if (res.statusCode >= 400) return "warn";
			return "info";
		},
		serializers: {
			req(req: Request) {
				return {
					method: req.method,
					url: req.url,
				};
			},
			res(res: Response) {
				return {
					statusCode: res.statusCode,
				};
			},
		},
	}) as RequestHandler,
);

app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
});

async function main() {
	try {
		await sequelize.sync({ force: false });

		app.listen(PORT, () => {
			logger.info(`Server running on port ${PORT}`);
		});
	} catch (error: unknown) {
		logger.error({ err: error }, "Connection failed");
	}
}

main();

export default app;
