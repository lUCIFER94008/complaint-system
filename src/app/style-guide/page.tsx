import TopNav from '@/components/TopNav';
import Link from 'next/link';

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <TopNav title="Style Guide" />

      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-semibold mb-4">Style Guide</h1>

        <section className="mb-6">
          <h2 className="font-semibold mb-2">Buttons</h2>
          <div className="flex gap-3">
            <button className="btn-primary">Primary</button>
            <button className="btn-outline">Outline</button>
            <button className="btn-outline" disabled>
              Disabled
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold mb-2">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl p-4">Card content</div>
            <div className="rounded-2xl p-4">Another card</div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold mb-2">Typography</h2>
          <p className="text-lg">This is a paragraph demonstrating text color and spacing.</p>
          <p className="text-sm text-[var(--muted)] mt-2">Muted helper text.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold mb-2">Navigation example</h2>
          <div className="flex gap-3">
            <Link href="/" className="btn-outline">Home</Link>
            <Link href="/style-guide" className="btn-primary">Style Guide</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
