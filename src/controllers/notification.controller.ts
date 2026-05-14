import type { Request, Response } from "express";
import { messages } from "../helpers/messages.js";
import { buildPagedResponse, getPagination } from "../helpers/pagination.js";
import { Notification } from "../models/notification.js";

export const getAllNotifications = async (_req: Request, res: Response) => {
	try {
		const { page, limit, offset } = getPagination(_req.query, 7);
		const { count: total, rows } = await Notification.findAndCountAll({
			order: [
				["read", "ASC"],
				["createdAt", "DESC"],
			],
			limit,
			offset,
		});
		res.status(200).json(buildPagedResponse(rows, total, page, limit));
	} catch (_error) {
		res.status(500).json({ message: messages.notification.getError });
	}
};

export const getUnreadNotifications = async (_req: Request, res: Response) => {
	try {
		const notifications = await Notification.count({
			where: { read: false },
		});
		res.status(200).json(notifications);
	} catch (_error) {
		res.status(500).json({ message: messages.notification.getError });
	}
};

export const markAsRead = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByPk(Number(id));
		if (!notification) {
			return res.status(404).json({ message: messages.notification.notFound });
		}
		await notification.update({ read: true });
		res.status(200).json({ message: messages.notification.markAsReadSuccess });
	} catch (_error) {
		res.status(500).json({ message: messages.notification.markAsReadError });
	}
};

export const markAllAsRead = async (_req: Request, res: Response) => {
	try {
		const notifications = await Notification.findAll({
			where: { read: false },
		});
		await Promise.all(
			notifications.map((notification) => notification.update({ read: true })),
		);
		res
			.status(200)
			.json({ message: messages.notification.markAllAsReadSuccess });
	} catch (_error) {
		res.status(500).json({ message: messages.notification.markAllAsReadError });
	}
};

export const deleteNotification = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByPk(Number(id));
		if (!notification) {
			return res.status(404).json({ message: messages.notification.notFound });
		}
		await notification.destroy();
		res.status(200).json({ message: messages.notification.deleteSuccess });
	} catch (_error) {
		res.status(500).json({ message: messages.notification.deleteError });
	}
};
