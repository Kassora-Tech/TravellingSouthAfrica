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
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const sgMail = __importStar(require("@sendgrid/mail"));
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
// Get SendGrid API key from environment variables (configured as a secret)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
}
else {
    logger.warn("SENDGRID_API_KEY secret not set. Emails will not be sent.");
}
const ADMIN_EMAILS = [
    "maryke@travellingsouthafrica.co.za",
    "tristan@industrialgrowthhub.com",
];
const FROM_EMAIL = "notifications@travellingsouthafrica.co.za"; // This must be a verified sender in SendGrid
// Helper function to define the Cloud Function for a given collection
const defineListingNotification = (collectionName) => {
    return (0, firestore_1.onDocumentCreated)({
        document: `${collectionName}/{listingId}`,
        secrets: ["SENDGRID_API_KEY"], // Declare the secret to be used
    }, async (event) => {
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
// Helper function to define the Cloud Function for a new contact message
const defineContactNotification = () => {
    return (0, firestore_1.onDocumentCreated)({
        document: `contactMessages/{messageId}`,
        secrets: ["SENDGRID_API_KEY"],
    }, async (event) => {
        const snap = event.data;
        if (!snap) {
            logger.log("No data associated with the event, skipping.");
            return;
        }
        const message = snap.data();
        const msg = {
            to: ADMIN_EMAILS,
            from: {
                name: "Travelling South Africa Contact Form",
                email: FROM_EMAIL,
            },
            subject: `New Contact Message: ${message.subject}`,
            replyTo: message.email,
            html: `
          <p>You have received a new message from the website contact form:</p>
          <ul>
            <li><strong>Name:</strong> ${message.name || "N/A"}</li>
            <li><strong>Email:</strong> ${message.email || "N/A"}</li>
            <li><strong>Subject:</strong> ${message.subject || "N/A"}</li>
          </ul>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.message || "N/A"}</p>
        `,
        };
        if (!SENDGRID_API_KEY) {
            logger.error("SendGrid API Key is not configured. Cannot send email.");
            return;
        }
        try {
            await sgMail.send(msg);
            logger.info(`Contact form notification email sent for message ${event.params.messageId}.`);
        }
        catch (error) {
            logger.error(`Failed to send contact form email for message ${event.params.messageId}:`, error);
            if (error instanceof Error && 'response' in error) {
                const sgError = error;
                logger.error("SendGrid response error:", sgError.response.body);
            }
        }
    });
};
// Define and export a function for each collection
exports.onAccommodationsCreate = defineListingNotification("accommodations");
exports.onRestaurantsCreate = defineListingNotification("restaurants");
exports.onServiceProvidersCreate = defineListingNotification("service_providers");
exports.onAttractionsCreate = defineListingNotification("attractions");
exports.onContactMessageCreate = defineContactNotification();
//# sourceMappingURL=index.js.map