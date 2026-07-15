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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="relative overflow-hidden">
        <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">
            FindIt
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link
              to="/login"
              className="rounded-md px-4 py-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Create account
            </Link>
          </div>
        </header>

        <main className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:pt-14">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 font-medium">
              Lost and found, organized for real life.
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Reconnect people with the things they almost lost.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
                FindIt helps communities report, search, and track lost-and-found items from one clean dashboard.
                Share details fast, discover matches sooner, and keep the process simple.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 shadow-sm"
              >
                {user && !loading ? 'Go to dashboard' : 'Get started'}
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Explore reports
              </Link>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Live activity</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">A simple workflow that feels immediate</h2>
                </div>
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">Online</div>
              </div>

              <div className="mt-6 space-y-4">
                {highlights.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 transition duration-200 hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-sm font-bold text-blue-700 dark:text-blue-300">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Next step</p>
                  <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Report an item from any device</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Search mode</p>
                  <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Find items by title, status, or category</p>
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
            <div key={text} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-slate-600 dark:text-slate-300 shadow-sm">
              {text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}