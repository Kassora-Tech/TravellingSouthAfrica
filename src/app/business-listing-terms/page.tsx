import { Translatable } from '@/components/translatable';

export default function BusinessListingTermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline text-primary">
          <Translatable text="Business Listing Terms & Conditions" />
        </h1>
        <p className="mt-4 text-muted-foreground">
          <Translatable text="By submitting a business listing to TravellingSouthAfrica.co.za, you acknowledge and agree to the following terms:" />
        </p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="1. 60-Day Free Trial" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="Approved businesses receive a 60-day free trial of their TravellingSouthAfrica.co.za business listing." /></p>
              <p><Translatable text="The 60-day trial allows businesses to experience the platform and its potential value before deciding whether they would like to continue with a paid annual listing." /></p>
              <p><Translatable text="No payment is required to start the free trial, and no payment or card details are required when submitting your application." /></p>
              <p><Translatable text="Before the end of the 60-day trial period, TravellingSouthAfrica.co.za will contact the business to confirm whether they would like to continue their listing." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="2. Annual Listing Fee" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="If the business chooses to continue after the 60-day free trial, the annual listing fee is R350 per year." /></p>
              <p><Translatable text="The business will then be invoiced for the annual listing." /></p>
              <p><Translatable text="There is no automatic payment or automatic renewal following the free trial." /></p>
              <p><Translatable text="If the business chooses not to continue, the listing may be removed or deactivated at the end of the trial period and no annual listing fee will be charged." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="3. Listing Approval" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="TravellingSouthAfrica.co.za reserves the right to review, approve, decline, suspend or remove any business listing at its discretion." /></p>
              <p><Translatable text="Listings may be declined or removed where information is found to be false, misleading, inappropriate, unlawful, unsafe, harmful, or otherwise inconsistent with the purpose and standards of TravellingSouthAfrica.co.za." /></p>
              <p><Translatable text="Submitting a listing does not guarantee approval or publication." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="4. Accuracy of Information" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="Businesses are responsible for ensuring that all information submitted to TravellingSouthAfrica.co.za is accurate, current and not misleading." /></p>
              <p><Translatable text="This includes business details, contact information, operating hours, pricing, descriptions, photographs, services and any other information supplied as part of the listing." /></p>
              <p><Translatable text="Businesses should notify TravellingSouthAfrica.co.za of significant changes to their information so that the listing can remain as accurate as reasonably possible." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="5. No Commission on Transactions" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="TravellingSouthAfrica.co.za is a travel discovery and information platform." /></p>
              <p><Translatable text="The platform does not act as a booking agent, travel agent or intermediary for transactions between businesses and travellers." /></p>
              <p><Translatable text="Any enquiries, bookings, purchases, payments, cancellations, refunds, disputes or other transactions are made directly between the traveller and the listed business." /></p>
              <p><Translatable text="TravellingSouthAfrica.co.za does not charge commission on transactions made directly between travellers and listed businesses." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="6. Responsibility for Products and Services" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="Each listed business is solely responsible for the products, services, experiences, accommodation or other offerings it provides." /></p>
              <p><Translatable text="TravellingSouthAfrica.co.za does not guarantee the quality, availability, pricing, safety, legality or suitability of any product or service offered by a listed business." /></p>
              <p><Translatable text="Travellers are responsible for making their own enquiries and decisions before entering into any transaction with a listed business." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="7. Listing Content" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="By submitting photographs, descriptions, logos or other content for use on a business listing, the business confirms that it has the necessary rights or permission to provide that content for publication." /></p>
              <p><Translatable text="TravellingSouthAfrica.co.za may reasonably edit or format submitted content where necessary for presentation, consistency or technical purposes." /></p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="8. Removal or Suspension of a Listing" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="TravellingSouthAfrica.co.za reserves the right to suspend or remove a listing where:" /></p>
              <ul className="list-disc list-inside space-y-1">
                <li><Translatable text="the business information is materially false or misleading;" /></li>
                <li><Translatable text="the business no longer operates;" /></li>
                <li><Translatable text="the business or listing is unlawful, unsafe or harmful;" /></li>
                <li><Translatable text="the listing does not comply with the platform's standards;" /></li>
                <li><Translatable text="the annual listing fee remains unpaid after the business has chosen to continue; or" /></li>
                <li><Translatable text="there are other reasonable grounds for removal." /></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-bold mb-3">
              <Translatable text="9. Acceptance of These Terms" />
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p><Translatable text="By submitting a business listing, you confirm that you have read, understood and accepted these Business Listing Terms & Conditions." /></p>
              <p><Translatable text="You confirm that the information supplied in your application is accurate to the best of your knowledge." /></p>
            </div>
          </section>
        </div>

        <div className="mt-10 space-y-4 rounded-lg border bg-secondary p-6">
          <h2 className="font-headline text-2xl font-bold">
            <Translatable text="Your Listing" />
          </h2>
          <div>
            <p className="font-semibold text-foreground">
              <Translatable text="60-Day Free Trial: R0" />
            </p>
            <p className="text-sm text-muted-foreground">
              <Translatable text="There is no obligation to continue after the trial." />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              <Translatable text="If you choose to continue after your free trial:" />
            </p>
            <p className="font-semibold text-foreground mt-1">
              <Translatable text="Annual Listing: R350 per year" />
            </p>
            <p className="text-sm text-muted-foreground">
              <Translatable text="You will be contacted before the end of your trial to confirm whether you would like to continue." />
            </p>
          </div>
        </div>

        <p className="mt-10 text-center font-headline text-lg font-semibold text-primary">
          <Translatable text="TravellingSouthAfrica.co.za — Every Town Matters." />
        </p>
      </div>
    </div>
  );
}
