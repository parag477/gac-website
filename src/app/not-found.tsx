import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="section legal-page">
      <h1>
        A little
        <br />
        <em>off course.</em>
      </h1>
      <p>We couldn’t find that page. Let’s get you back to the commune.</p>
      <Link href="/" className="button button-dark">
        Back to home
      </Link>
    </main>
  );
}
