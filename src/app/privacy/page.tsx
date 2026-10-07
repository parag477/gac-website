import Link from "next/link";
import { site } from "@/lib/content";
export const metadata = {
  title: "Privacy — development preview",
  robots: { index: false },
};
export default function Privacy() {
  return (
    <main id="main" className="section legal-page">
      <Link href="/" className="text-link">
        Back to home
      </Link>
      <h1>
        Your information.
        <br />
        <em>Handled clearly.</em>
      </h1>
      <p className="lead">
        Development preview — final privacy policy pending.
      </p>
      <p>
        The enquiry form collects your name, email address, chosen programme and
        message. When you submit it, these details and the submission time are
        saved in our website’s enquiry database so the team can respond. Please
        avoid including sensitive financial or account information.
      </p>
      <p>
        External social and community links take you to those platforms, where
        their own policies apply. Final retention periods and business policies
        will be documented before public launch. To ask about your enquiry or
        request deletion, contact {site.email}.
      </p>
      <h2>Optional website analytics</h2>
      <p>
        If you allow analytics, we use Google Analytics to understand visits,
        programme interest, successful enquiry submissions and WhatsApp link
        clicks. We do not send your name, email address or enquiry message to
        Google Analytics. Advertising storage and advertising personalisation
        are disabled in our website integration.
      </p>
      <p>
        Analytics is optional and is not needed to submit an enquiry. You can
        change your choice through “Analytics preferences” in the footer. Your
        preference is stored in this browser. Declining stops future analytics
        collection through this integration and removes its accessible Google
        Analytics cookies; it does not delete data previously collected.
      </p>
      <p>
        This page describes the current prototype; it is not a finalized
        business privacy policy.
      </p>
    </main>
  );
}
