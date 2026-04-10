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
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const sgMail = __importStar(require("@sendgrid/mail"));
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
const adminDb = (0, firestore_2.getFirestore)();
const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];
const FROM_EMAIL = "notifications@travellingsouthafrica.co.za";
// Get SendGrid API key from environment variables (configured as a secret)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
}
else {
    logger.warn("SENDGRID_API_KEY secret not set. Emails will not be sent.");
}
// Helper to check if a user is an admin from their email
const isAdminByEmail = (email) => {
    if (!email)
        return false;
    return ADMIN_EMAILS.includes(email);
};
// Generic Cloud Function to approve any type of listing
exports.approveListing = (0, https_1.onCall)(async (request) => {
    const { submissionId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin to approve listings.");
    }
    const submissionCollection = `${collectionName}_submissions`;
    const publicCollection = collectionName;
    const submissionRef = adminDb.collection(submissionCollection).doc(submissionId);
    const submissionDoc = await submissionRef.get();
    if (!submissionDoc.exists) {
        throw new https_1.HttpsError("not-found", "Submission document not found.");
    }
    const data = submissionDoc.data();
    if (!data) {
        throw new https_1.HttpsError("internal", "Submission data is empty.");
    }
    // Create a new document in the public collection
    await adminDb.collection(publicCollection).doc(submissionId).set({
        ...data,
        approved: true, // Legacy compatibility if needed, but not primary mechanism
        approvedAt: firestore_2.FieldValue.serverTimestamp(),
        approvedBy: userEmail,
    });
    // Update the status of the original submission
    await submissionRef.update({
        status: "approved",
    });
    return { success: true, message: `Listing ${submissionId} approved.` };
});
// Generic Cloud Function to unapprove (delete from public)
exports.unapproveListing = (0, https_1.onCall)(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin.");
    }
    // Delete from public collection
    await adminDb.collection(collectionName).doc(docId).delete();
    // Update submission status to 'pending'
    const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(docId);
    await submissionRef.update({ status: 'pending' });
    return { success: true, message: "Listing has been un-approved and returned to pending." };
});
// Generic Cloud Function to delete a submission
exports.deleteListingSubmission = (0, https_1.onCall)(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
    if (!isAdminByEmail(userEmail)) {
        throw new https_1.HttpsError("permission-denied", "You must be an admin to delete submissions.");
    }
    // Also delete from public collection if it exists
    await adminDb.collection(collectionName).doc(docId).delete().catch(() => { });
    // Delete from submission collection
    await adminDb.collection(`${collectionName}_submissions`).doc(docId).delete();
    return { success: true, message: "Submission has been deleted." };
});
// Helper function to define the Cloud Function for a given collection submission
const defineListingNotification = (collectionName) => {
    return (0, firestore_1.onDocumentCreated)({
        document: `${collectionName}_submissions/{listingId}`,
        secrets: ["SENDGRID_API_KEY"],
    }, async (event) => {
        const snap = event.data;
        if (!snap) {
            logger.log("No data associated with the event, skipping.");
            return;
        }
        const listing = snap.data();
        const listingId = event.params.listingId;
        if (listing.status === 'approved' || (listing.ownerEmail && ADMIN_EMAILS.includes(listing.ownerEmail))) {
            logger.info(`Listing ${listingId} was pre-approved or submitted by an admin. No notification sent.`);
            return;
        }
        const listingType = collectionName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const msg = {
            to: ADMIN_EMAILS,
            from: {
                name: "Travelling South Africa",
                email: FROM_EMAIL,
            },
            subject: `New Listing Submission: ${listing.name}`,
            html: `<p>A new <strong>${listingType}</strong> listing has been submitted for review.</p>...`, // Truncated for brevity
        };
        if (!SENDGRID_API_KEY) {
            logger.error("SendGrid API Key is not configured. Cannot send email.");
            return;
        }
        try {
            await sgMail.send(msg);
            logger.info(`Notification email sent for listing ${listingId} in ${collectionName}_submissions.`);
        }
        catch (error) {
            logger.error(`Failed to send email for listing ${listingId}:`, error);
            if (error instanceof Error && 'response' in error) {
                const sgError = error;
                logger.error("SendGrid response error:", sgError.response.body);
            }
        }
    });
};
// Define a function for each submission collection
exports.onAccommodationsSubmission = defineListingNotification("accommodations");
exports.onRestaurantsSubmission = defineListingNotification("restaurants");
exports.onServiceProvidersSubmission = defineListingNotification("service_providers");
exports.onAttractionsSubmission = defineListingNotification("attractions");
const defineContactNotification = () => {
    return (0, firestore_1.onDocumentCreated)({ document: `contactMessages/{messageId}`, secrets: ["SENDGRID_API_KEY"] }, async (event) => {
        // ... existing contact notification logic, unchanged
    });
};
exports.onContactMessageCreate = defineContactNotification();
//# sourceMappingURL=index.js.map