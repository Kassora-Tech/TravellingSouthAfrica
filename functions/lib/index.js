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
exports.onContactMessageCreate = exports.onAttractionsSubmission = exports.onServiceProvidersSubmission = exports.onRestaurantsSubmission = exports.onAccommodationsSubmission = exports.deleteListingSubmission = exports.unapproveListing = exports.approveListing = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
const adminDb = (0, firestore_2.getFirestore)();
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
        approvedAt: firestore_2.FieldValue.serverTimestamp(),
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
const sendNotificationEmail = async (to, subject, html) => {
    await adminDb.collection("mail").add({ to, message: { subject, html } });
};
const defineListingNotification = (collectionName) => {
    return (0, firestore_1.onDocumentCreated)({ document: `${collectionName}_submissions/{listingId}` }, async (event) => {
        const snap = event.data;
        if (!snap)
            return;
        const listing = snap.data();
        const listingId = event.params.listingId;
        if (listing.status === "approved" ||
            (listing.ownerEmail && ADMIN_EMAILS.includes(listing.ownerEmail))) {
            logger.info(`Listing ${listingId} submitted by admin — no notification sent.`);
            return;
        }
        const listingType = collectionName
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        await sendNotificationEmail(ADMIN_EMAILS, `New Listing Submission: ${listing.name}`, `
          <p>A new <strong>${listingType}</strong> listing has been submitted for review.</p>
          <p><strong>Name:</strong> ${listing.name}</p>
          <p><strong>Town:</strong> ${listing.townSlug || "N/A"}</p>
          <p><strong>Submitted by:</strong> ${listing.ownerEmail || "Unknown"}</p>
          <p>Please log in to the admin panel to review and approve this listing.</p>
        `);
        logger.info(`Notification email queued for listing ${listingId} in ${collectionName}_submissions.`);
    });
};
exports.onAccommodationsSubmission = defineListingNotification("accommodations");
exports.onRestaurantsSubmission = defineListingNotification("restaurants");
exports.onServiceProvidersSubmission = defineListingNotification("service_providers");
exports.onAttractionsSubmission = defineListingNotification("attractions");
exports.onContactMessageCreate = (0, firestore_1.onDocumentCreated)({ document: "contactMessages/{messageId}" }, async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const message = snap.data();
    await sendNotificationEmail(ADMIN_EMAILS, `New Contact Message from ${message.name}: ${message.subject}`, `
        <p>You have received a new contact message.</p>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong> ${message.userMessage}</p>
      `);
    logger.info(`Contact notification email queued for message ${event.params.messageId}.`);
});
//# sourceMappingURL=index.js.map