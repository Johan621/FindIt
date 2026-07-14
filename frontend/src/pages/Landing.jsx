import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const highlights = [
  {
    title: 'Report in seconds',
    description:
      'Submit lost or found items with photos, location details, and clear status updates.',
  },
  {
    title: 'Search with confidence',
    description:
      'Filter items by category, type, and status to narrow down matches quickly.',
  },
  {
    title: 'Stay notified',
    description:
      'Track new reports and updates from the dashboard so you never miss a possible match.',
  },
];

const stats = [
  { value: '24/7', label: 'access to reports' },
  { value: 'Fast', label: 'item submission flow' },
  { value: 'Clear', label: 'status tracking' },
];

export default function Landing() {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_26%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />
        <div className="absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

        <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link to="/" className="text-lg font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            FindIt
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              to="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-cyan-300/50 hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-cyan-400 px-4 py-2 text-slate-950 transition hover:bg-cyan-300"
            >
              Create account
            </Link>
          </div>
        </header>

        <main className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:pt-14">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
              Lost and found, organized for real life.
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                Reconnect people with the things they almost lost.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                FindIt helps communities report, search, and track lost-and-found items from one clean dashboard.
                Share details fast, discover matches sooner, and keep the process simple.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                {user && !loading ? 'Go to dashboard' : 'Get started'}
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-base font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/5"
              >
                Explore reports
              </Link>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-cyan-400/10 blur-2xl" />
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">Live activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">A simple workflow that feels immediate</h2>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">Online</div>
              </div>

              <div className="mt-6 space-y-4">
                {highlights.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/7"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-sm font-bold text-slate-950">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Next step</p>
                  <p className="mt-2 text-lg font-semibold text-white">Report an item from any device</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Search mode</p>
                  <p className="mt-2 text-lg font-semibold text-white">Find items by title, status, or category</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            'Built for students, staff, and community spaces.',
            'Fast enough for quick reporting, structured enough for follow-up.',
            'Clean account flow with login, register, and dashboard access.',
          ].map((text) => (
            <div key={text} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
              {text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}