import * as activityLogService from "../services/activity-log-service.js";

const METHODS_TO_LOG = new Set(["POST", "PUT", "DELETE"]);

export const activityLog = (req, res, next) => {
  const log = () => {
    try {
      if (!METHODS_TO_LOG.has(req.method)) {
        return;
      }
      const endpoint = req.originalUrl ?? req.path;
      const status = res.statusCode;
      const user =
          req.user?._id ? String(req.user._id) : req.user?.id ? String(
              req.user.id) : null;

      void activityLogService.createActivity({
        method: req.method,
        endpoint,
        user,
        status,
      });
    } catch (err) {
      console.error("Activity log failed:", err);
    }
  };
  res.once("finish", log);
  next();
};
