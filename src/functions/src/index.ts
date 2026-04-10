'use server';
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore as adminGetFirestore, FieldValue } from "firebase-admin/firestore";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
initializeApp();
const adminDb = adminGetFirestore();

const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];
const FROM_EMAIL = "notifications@travellingsouthafrica.co.za";

// Get SendGrid API key from environment variables (configured as a secret)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  logger.warn("SENDGRID_API_KEY secret not set. Emails will not be sent.");
}

// Helper to check if a user is an admin from their email
const isAdminByEmail = (email?: string) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};

// Generic Cloud Function to approve any type of listing
export const approveListing = onCall(async (request) => {
  const { submissionId, collectionName } = request.data;
  const userEmail = request.auth?.token.email;

  if (!isAdminByEmail(userEmail)) {
    throw new HttpsError("permission-denied", "You must be an admin to approve listings.");
  }

  const submissionCollection = `${collectionName}_submissions`;
  const publicCollection = collectionName;
  
  const submissionRef = adminDb.collection(submissionCollection).doc(submissionId);
  const submissionDoc = await submissionRef.get();

  if (!submissionDoc.exists) {
    throw new HttpsError("not-found", "Submission document not found.");
  }

  const data = submissionDoc.data();
  if (!data) {
    throw new HttpsError("internal", "Submission data is empty.");
  }

  // Sanitize the data to remove any fields that have `undefined` values.
  // Firestore does not allow `undefined` in document writes.
  const sanitizedData: { [key: string]: any } = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
      sanitizedData[key] = data[key];
    }
  }

  // Create a new document in the public collection
  await adminDb.collection(publicCollection).doc(submissionId).set({
    ...sanitizedData,
    approved: true, // Legacy compatibility if needed, but not primary mechanism
    approvedAt: FieldValue.serverTimestamp(),
    approvedBy: userEmail,
  });

  // Update the status of the original submission
  await submissionRef.update({
    status: "approved",
  });

  return { success: true, message: `Listing ${submissionId} approved.` };
});

// Generic Cloud Function to unapprove (delete from public)
export const unapproveListing = onCall(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
  
    if (!isAdminByEmail(userEmail)) {
      throw new HttpsError("permission-denied", "You must be an admin.");
    }

    // Delete from public collection
    await adminDb.collection(collectionName).doc(docId).delete();

    // Update submission status to 'pending'
    const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(docId);
    await submissionRef.update({ status: 'pending' });

    return { success: true, message: "Listing has been un-approved and returned to pending." };
});

// Generic Cloud Function to delete a submission
export const deleteListingSubmission = onCall(async (request) => {
    const { docId, collectionName } = request.data;
    const userEmail = request.auth?.token.email;
  
    if (!isAdminByEmail(userEmail)) {
      throw new HttpsError("permission-denied", "You must be an admin to delete submissions.");
    }
    
    // Also delete from public collection if it exists
    await adminDb.collection(collectionName).doc(docId).delete().catch(() => {});
    // Delete from submission collection
    await adminDb.collection(`${collectionName}_submissions`).doc(docId).delete();

    return { success: true, message: "Submission has been deleted." };
});

// Helper function to define the Cloud Function for a given collection submission
const defineListingNotification = (collectionName: string) => {
  return onDocumentCreated(
    {
      document: `${collectionName}_submissions/{listingId}`,
      secrets: ["SENDGRID_API_KEY"], 
    },
    async (event) => {
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
      const townName = listing.townSlug || "N/A";

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
      } catch (error) {
        logger.error(`Failed to send email for listing ${listingId}:`, error);
        if (error instanceof Error && 'response' in error) {
            const sgError = error as any;
            logger.error("SendGrid response error:", sgError.response.body);
        }
      }
    }
  );
};

// Define a function for each submission collection
exports.onAccommodationsSubmission = defineListingNotification("accommodations");
exports.onRestaurantsSubmission = defineListingNotification("restaurants");
exports.onServiceProvidersSubmission = defineListingNotification("service_providers");
exports.onAttractionsSubmission = defineListingNotification("attractions");

const defineContactNotification = () => {
  return onDocumentCreated({ document: `contactMessages/{messageId}`, secrets: ["SENDGRID_API_KEY"] }, async (event) => {
    // ... existing contact notification logic, unchanged
  });
};
exports.onContactMessageCreate = defineContactNotification();
