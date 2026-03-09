import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
initializeApp();

// Get SendGrid API key from environment variables (configured as a secret)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  logger.warn("SENDGRID_API_KEY secret not set. Emails will not be sent.");
}

const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];
const FROM_EMAIL = "notifications@travellingsouthafrica.co.za"; // This must be a verified sender in SendGrid

// Helper function to define the Cloud Function for a given collection
const defineListingNotification = (collectionName: string) => {
  return onDocumentCreated(
    {
      document: `${collectionName}/{listingId}`,
      secrets: ["SENDGRID_API_KEY"], // Declare the secret to be used
    },
    async (event) => {
      const snap = event.data;
      if (!snap) {
        logger.log("No data associated with the event, skipping.");
        return;
      }
      const listing = snap.data();
      const listingId = event.params.listingId;

      // Don't send notification if the listing was auto-approved (i.e., submitted by an admin)
      if (listing.approved) {
        logger.info(`Listing ${listingId} in ${collectionName} was pre-approved. No notification sent.`);
        return;
      }

      // Also check the owner's email just in case
      if (listing.ownerEmail && ADMIN_EMAILS.includes(listing.ownerEmail)) {
        logger.info(`Listing ${listingId} created by an admin (${listing.ownerEmail}). No notification sent.`);
        return;
      }

      const listingType = collectionName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      
      const townName = listing.townSlug || "N/A"; // Use slug as fallback

      const msg = {
        to: ADMIN_EMAILS,
        from: {
          name: "Travelling South Africa",
          email: FROM_EMAIL,
        },
        subject: `New Listing Submission: ${listing.name}`,
        html: `
          <p>A new <strong>${listingType}</strong> listing has been submitted for review:</p>
          <ul>
            <li><strong>Name:</strong> ${listing.name || "N/A"}</li>
            <li><strong>Town:</strong> ${townName}</li>
            <li><strong>Category:</strong> ${listing.category || listing.cuisine || "N/A"}</li>
            <li><strong>Contact Email:</strong> ${listing.contactEmail || "N/A"}</li>
            <li><strong>Contact Phone:</strong> ${listing.contactPhone || "N/A"}</li>
            <li><strong>Description:</strong> ${listing.description || "N/A"}</li>
          </ul>
          <p>Please log in to the <a href="https://travellingsouthafrica.co.za/admin">Admin Dashboard</a> to review and approve it.</p>
        `,
      };

      if (!SENDGRID_API_KEY) {
        logger.error("SendGrid API Key is not configured. Cannot send email.");
        return;
      }

      try {
        await sgMail.send(msg);
        logger.info(`Notification email sent for listing ${listingId} in ${collectionName}.`);
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

// Define and export a function for each collection
exports.onAccommodationsCreate = defineListingNotification("accommodations");
exports.onRestaurantsCreate = defineListingNotification("restaurants");
exports.onServiceProvidersCreate = defineListingNotification("service_providers");
exports.onAttractionsCreate = defineListingNotification("attractions");
