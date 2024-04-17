import express from "express";
import * as ProfileController from "./../controller/profile-controller.js";

const router = express.Router();

router.route('/:userId')
    .get(ProfileController.get)
    .put(ProfileController.update)
    .delete(ProfileController.remove);
router.route('/')
    .post(ProfileController.save);
router.route('/expand/:userId')
    .get(ProfileController.searchByUserId);
export default router;