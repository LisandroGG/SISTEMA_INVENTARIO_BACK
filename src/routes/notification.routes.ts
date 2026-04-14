import { Router } from "express";
import {
	deleteNotification,
	getAllNotifications,
	markAllAsRead,
	markAsRead,
} from "../controllers/notification.controller.js";

export const notificationRouter = Router();

notificationRouter.get("/", getAllNotifications);
notificationRouter.put("/:id/read", markAsRead);
notificationRouter.put("/read-all", markAllAsRead);
notificationRouter.delete("/:id", deleteNotification);
