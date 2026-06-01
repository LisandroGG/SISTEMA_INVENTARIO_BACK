import { Router } from "express";
import {
	deleteNotification,
	getAllNotifications,
	getUnreadNotifications,
	markAllAsRead,
	markAsRead,
} from "../controllers/notification.controller.js";

export const notificationRouter = Router();

notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/unread", getUnreadNotifications);
notificationRouter.put("/:id/read", markAsRead);
notificationRouter.put("/read-all", markAllAsRead);
notificationRouter.delete("/:id", deleteNotification);
