"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListingSubmission = exports.unapproveListing = exports.approveListing = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
const adminDb = (0, firestore_1.getFirestore)();
const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];
const isAdminByEmail = (email) => {
    if (!email)
        return false;
    return ADMIN_EMAILS.includes(email);
};
// Approve a listing submission
exports.approveListing = (0, https_1.onCall)(async (request) => {
    const { submissionId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    logger.info(`approveListing called by ${userEmail} for ${collectionName}/${submissionId}`);
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin to approve listings.");
    }
    const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(submissionId);
    const submissionDoc = await submissionRef.get();
    if (!submissionDoc.exists) {
        throw new https_1.HttpsError("not-found", "Submission document not found.");
    }
    const data = submissionDoc.data();
    if (!data) {
        throw new https_1.HttpsError("internal", "Submission data is empty.");
    }
    await adminDb.collection(collectionName).doc(submissionId).set({
        ...data,
        approved: true,
        approvedAt: firestore_1.FieldValue.serverTimestamp(),
        approvedBy: userEmail,
    });
    await submissionRef.update({ status: "approved" });
    return { success: true, message: `Listing ${submissionId} approved.` };
});
// Unapprove a listing (remove from public collection)
exports.unapproveListing = (0, https_1.onCall)(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    logger.info(`unapproveListing called by ${userEmail} for ${collectionName}/${docId}`);
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin.");
    }
    await adminDb.collection(collectionName).doc(docId).delete();
    const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(docId);
    await submissionRef.update({ status: "pending" });
    return { success: true, message: "Listing has been un-approved and returned to pending." };
});
// Delete a listing submission entirely
exports.deleteListingSubmission = (0, https_1.onCall)(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    logger.info(`deleteListingSubmission called by ${userEmail} for ${collectionName}/${docId}`);
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin to delete submissions.");
    }
    await adminDb.collection(collectionName).doc(docId).delete().catch(() => { });
    await adminDb.collection(`${collectionName}_submissions`).doc(docId).delete();
    return { success: true, message: "Submission has been deleted." };
});
//# sourceMappingURL=index.js.map