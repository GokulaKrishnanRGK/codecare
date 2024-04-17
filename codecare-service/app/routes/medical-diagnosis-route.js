import express from "express";
import * as MedicalDiagnosisController from "./../controller/medical-diagnosis-controller.js";

const router = express.Router();

router.route('/')
    .post(MedicalDiagnosisController.add);
router.route('/:id')
    .put(MedicalDiagnosisController.update)
    .delete(MedicalDiagnosisController.remove);
router.route('/:userId')
    .get(MedicalDiagnosisController.search);
   

export default router;