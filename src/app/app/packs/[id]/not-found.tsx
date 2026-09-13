import Link from "next/link";

export default function PackNotFound() {
  return (
    <main className="py-16">
      <h1 className="serif text-4xl">That pack is not in your library</h1>
      <Link href="/app" className="mt-6 inline-block text-sm text-navy underline-offset-4 hover:underline">
        Back to library
      </Link>
    </main>
  );
}
