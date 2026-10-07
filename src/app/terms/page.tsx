import Link from "next/link";
export const metadata = {
  title: "Terms & disclosures — development preview",
  robots: { index: false },
};
export default function Terms() {
  return (
    <main id="main" className="section legal-page">
      <Link href="/" className="text-link">
        Back to home
      </Link>
      <h1>
        Good learning starts
        <br />
        <em>with clear expectations.</em>
      </h1>
      <p className="lead">
        Development preview — final programme terms pending.
      </p>
      <p>
        Green Arc Commune focuses on trading education. Trading involves risk.
        Educational materials and member experiences are not guarantees of
        future performance.
      </p>
      <p>
        Before enrolling, ask for the current programme fees, schedule,
        inclusions, access period, support, cancellation and refund terms. This
        website does not accept payments or complete enrollment.
      </p>
      <p>
        Team photographs come from the existing project. Some photographs
        are illustrative; owner-supplied community images are also used. The
        testimonial video is a member recording supplied by the owner.
      </p>
      <p>
        Approved contractual terms will replace this development notice before
        public launch.
      </p>
    </main>
  );
}
