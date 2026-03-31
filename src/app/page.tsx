import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white font-sans">
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Complaint System
            </h1>
            <p className="text-indigo-300 font-semibold text-lg">Report Issues. Track Progress. Get Solutions.</p>
            <p className="max-w-2xl text-muted">
              A smart platform to register complaints, monitor their status, and ensure timely resolution with transparency.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/complaints/submit" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-3 text-sm font-semibold shadow-lg hover:scale-105 transition-transform focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M2 5a2 2 0 012-2h3.5a1 1 0 01.7.3l1.5 1.5a1 1 0 00.7.3H16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                </svg>
                Submit Complaint
              </Link>

              <Link href="/dashboard" className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-emerald-300 ring-1 ring-white/10 backdrop-blur hover:scale-105 transition-transform">
                Go to Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl card-surface p-6 shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Quick Overview</h3>
                  <p className="mt-1 text-sm text-muted">Submit complaints and track progress from a single dashboard.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-indigo-300">24/7</div>
                  <div className="text-xs text-muted-2">Support</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl card-surface p-4 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-.894.553L6.382 6H4a1 1 0 000 2h2l1.606 3.447A1 1 0 009 12h2a1 1 0 00.894-.553L13.618 8H16a1 1 0 100-2h-2.382l-1.724-3.447A1 1 0 0011 2H9z"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Real-time Tracking</div>
                      <div className="text-xs text-muted">Live updates on complaint status</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl card-surface p-4 shadow-lg hover:scale-105 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 106 0 3 3 0 00-6 0z"/><path fillRule="evenodd" d="M2 13.5A6.5 6.5 0 0110.5 7h.5a6.5 6.5 0 016.5 6.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1v-2.5z" clipRule="evenodd"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Secure Authentication</div>
                      <div className="text-xs text-muted">Safe login for users and admins</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">How Complaint System Works</h2>
          <p className="mt-2 text-muted max-w-2xl">A simple four-step flow to lodge and resolve issues efficiently.</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-500/20 p-3 text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-.894.553L6.382 6H4a1 1 0 000 2h2l1.606 3.447A1 1 0 009 12h2a1 1 0 00.894-.553L13.618 8H16a1 1 0 100-2h-2.382l-1.724-3.447A1 1 0 0011 2H9z"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Submit Complaint</h3>
                  <p className="mt-1 text-sm text-muted">User fills form with title, description, and details.</p>
                </div>
              </div>
            </div>

                <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/20 p-3 text-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 106 0 3 3 0 00-6 0z"/><path fillRule="evenodd" d="M2 13.5A6.5 6.5 0 0110.5 7h.5a6.5 6.5 0 016.5 6.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1v-2.5z" clipRule="evenodd"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Review by Admin</h3>
                  <p className="mt-1 text-sm text-muted">Admin checks and assigns status.</p>
                </div>
              </div>
            </div>

                <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-500/20 p-3 text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 10.5L11 13l4-6-1-1-3 4-1.5-1.5L8.5 10.5z"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Track Status</h3>
                  <p className="mt-1 text-sm text-muted">User can see updates (Pending, In Progress, Resolved).</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/20 p-3 text-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold">Issue Resolved</h3>
                  <p className="mt-1 text-sm text-muted">Complaint is marked resolved with feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Key Features</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <h3 className="font-semibold">Real-time tracking</h3>
              <p className="mt-2 text-sm text-muted">Live updates and status notifications.</p>
            </div>
            <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <h3 className="font-semibold">Secure authentication</h3>
              <p className="mt-2 text-sm text-muted">Role-based access and secure sign-in flows.</p>
            </div>
            <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <h3 className="font-semibold">Admin dashboard control</h3>
              <p className="mt-2 text-sm text-muted">Powerful tools for complaint triage and reporting.</p>
            </div>
            <div className="rounded-2xl card-surface p-6 shadow-lg hover:scale-105 transition-transform">
              <h3 className="font-semibold">User complaint history</h3>
              <p className="mt-2 text-sm text-muted">View past submissions and feedback at any time.</p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-16">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-emerald-600/10 p-8 shadow-lg backdrop-blur-lg">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-300">1000+</div>
                <div className="mt-1 text-sm text-muted">Complaints Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-300">500+</div>
                <div className="mt-1 text-sm text-muted">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-300">24/7</div>
                <div className="mt-1 text-sm text-muted">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
            <div className="rounded-2xl card-surface p-8 shadow-2xl flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">Start Managing Complaints Efficiently</h3>
              <p className="mt-2 text-sm text-muted">Streamline reporting, tracking, and resolution with our platform.</p>
            </div>

            <div className="flex gap-4">
              <Link href="/complaints/submit" className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                Submit Complaint
              </Link>
              <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
