import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore as adminGetFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();
const adminDb = adminGetFirestore();

const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];

const isAdminByEmail = (email?: string) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};

// Approve a listing submission
export const approveListing = onCall(async (request) => {
  const { submissionId, collectionName } = request.data;
  const userEmail = request.auth?.token.email;

  logger.info(`approveListing called by ${userEmail} for ${collectionName}/${submissionId}`);

  if (!isAdminByEmail(userEmail)) {
    throw new HttpsError("permission-denied", "You must be an admin to approve listings.");
  }

  const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(submissionId);
  const submissionDoc = await submissionRef.get();

  if (!submissionDoc.exists) {
    throw new HttpsError("not-found", "Submission document not found.");
  }

  const data = submissionDoc.data();
  if (!data) {
    throw new HttpsError("internal", "Submission data is empty.");
  }

  await adminDb.collection(collectionName).doc(submissionId).set({
    ...data,
    approved: true,
    approvedAt: FieldValue.serverTimestamp(),
    approvedBy: userEmail,
  });

  await submissionRef.update({ status: "approved" });

  return { success: true, message: `Listing ${submissionId} approved.` };
});

// Unapprove a listing (remove from public collection)
export const unapproveListing = onCall(async (request) => {
  const { docId, collectionName } = request.data;
  const userEmail = request.auth?.token.email;

  logger.info(`unapproveListing called by ${userEmail} for ${collectionName}/${docId}`);

  if (!isAdminByEmail(userEmail)) {
    throw new HttpsError("permission-denied", "You must be an admin.");
  }

  await adminDb.collection(collectionName).doc(docId).delete();

  const submissionRef = adminDb.collection(`${collectionName}_submissions`).doc(docId);
  await submissionRef.update({ status: "pending" });

  return { success: true, message: "Listing has been un-approved and returned to pending." };
});

// Delete a listing submission entirely
export const deleteListingSubmission = onCall(async (request) => {
  const { docId, collectionName } = request.data;
  const userEmail = request.auth?.token.email;

  logger.info(`deleteListingSubmission called by ${userEmail} for ${collectionName}/${docId}`);

  if (!isAdminByEmail(userEmail)) {
    throw new HttpsError("permission-denied", "You must be an admin to delete submissions.");
  }

  await adminDb.collection(collectionName).doc(docId).delete().catch(() => {});
  await adminDb.collection(`${collectionName}_submissions`).doc(docId).delete();

  return { success: true, message: "Submission has been deleted." };
});

const sendNotificationEmail = async (to: string[], subject: string, html: string) => {
  await adminDb.collection("mail").add({ to, message: { subject, html } });
};

const defineListingNotification = (collectionName: string) => {
  return onDocumentCreated(
    { document: `${collectionName}_submissions/{listingId}` },
    async (event) => {
      const snap = event.data;
      if (!snap) return;

      const listing = snap.data();
      const listingId = event.params.listingId;

      if (
        listing.status === "approved" ||
        (listing.ownerEmail && ADMIN_EMAILS.includes(listing.ownerEmail))
      ) {
        logger.info(`Listing ${listingId} submitted by admin — no notification sent.`);
        return;
      }

      const listingType = collectionName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      await sendNotificationEmail(
        ADMIN_EMAILS,
        `New Listing Submission: ${listing.name}`,
        `
          <p>A new <strong>${listingType}</strong> listing has been submitted for review.</p>
          <p><strong>Name:</strong> ${listing.name}</p>
          <p><strong>Town:</strong> ${listing.townSlug || "N/A"}</p>
          <p><strong>Submitted by:</strong> ${listing.ownerEmail || "Unknown"}</p>
          <p>Please log in to the admin panel to review and approve this listing.</p>
        `
      );

      logger.info(`Notification email queued for listing ${listingId} in ${collectionName}_submissions.`);
    }
  );
};

export const onAccommodationsSubmission = defineListingNotification("accommodations");
export const onRestaurantsSubmission = defineListingNotification("restaurants");
export const onServiceProvidersSubmission = defineListingNotification("service_providers");
export const onAttractionsSubmission = defineListingNotification("attractions");

export const onContactMessageCreate = onDocumentCreated(
  { document: "contactMessages/{messageId}" },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const message = snap.data();

    await sendNotificationEmail(
      ADMIN_EMAILS,
      `New Contact Message from ${message.name}: ${message.subject}`,
      `
        <p>You have received a new contact message.</p>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong> ${message.userMessage}</p>
      `
    );

    logger.info(`Contact notification email queued for message ${event.params.messageId}.`);
  }
);