import Link from "next/link";
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
        request deletion, contact support@greenarc.com.
      </p>
      <p>
        This page describes the current prototype; it is not a finalized
        business privacy policy.
      </p>
    </main>
  );
}
