type ContentItem = {
  title: string;
  source: "YouTube" | "Twitter" | "Google Docs";
  time: string;
  description: string;
};

const recentContent: ContentItem[] = [
  {
    title: "How Docker Works",
    source: "YouTube",
    time: "2 hours ago",
    description: "Understanding containers, images and Docker architecture.",
  },
  {
    title: "Zero Trust Architecture",
    source: "Twitter",
    time: "Yesterday",
    description: "Notes and ideas about Zero Trust security.",
  },
  {
    title: "Network Security Notes",
    source: "Google Docs",
    time: "2 days ago",
    description: "Important concepts for cybersecurity research.",
  },
  {
    title: "Understanding MongoDB",
    source: "YouTube",
    time: "3 days ago",
    description: "MongoDB fundamentals and database concepts.",
  },
];

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">

      {/* SIDEBAR */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-5 md:flex">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl">
            🧠
          </div>

          <span className="text-lg font-bold">
            Second Brain
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">

          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100">
            <span>📚</span>
            All Content
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100">
            <span>⭐</span>
            Favorites
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100">
            <span>🏷️</span>
            Tags
          </button>

          <div className="my-5 border-t border-slate-200" />

          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sources
          </p>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <span className="text-red-500">▶</span>
            YouTube
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <span>𝕏</span>
            Twitter
          </button>

          <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <span>📄</span>
            Google Docs
          </button>

        </nav>

        {/* Bottom */}
        <div>

          <button className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <span>⚙️</span>
            Settings
          </button>

          <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              Y
            </div>

            <div>
              <p className="text-sm font-semibold">
                Yashvan
              </p>

              <p className="text-xs text-slate-400">
                My Brain
              </p>
            </div>
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="min-w-0 flex-1">

        {/* TOP BAR */}
        <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

          <div className="flex w-full max-w-lg items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">

            <span className="text-xl text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search your knowledge..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            <kbd className="hidden rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-400 sm:block">
              Ctrl K
            </kbd>

          </div>

          <div className="ml-4 flex items-center gap-3">
            <button className="text-lg">
              🔔
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              Y
            </div>
          </div>

        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">

          {/* WELCOME */}
          <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                Your Knowledge Space
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back, Yashvan 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Capture ideas, organize knowledge, and build your second brain.
              </p>
            </div>

            <button className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              <span className="text-lg">+</span>
              Add Content
            </button>

          </section>

          {/* STATS */}
          <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon="📚"
              label="Total Content"
              value="25"
              bg="bg-indigo-50"
            />

            <StatCard
              icon="▶"
              label="YouTube"
              value="12"
              bg="bg-red-50"
            />

            <StatCard
              icon="𝕏"
              label="Twitter"
              value="8"
              bg="bg-slate-100"
            />

            <StatCard
              icon="📄"
              label="Documents"
              value="5"
              bg="bg-blue-50"
            />

          </section>

          {/* RECENT CONTENT */}
          <section>

            <div className="mb-4 flex items-end justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  Recent Content
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Your recently saved knowledge
                </p>
              </div>

              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                View all →
              </button>

            </div>

            <div className="space-y-3">

              {recentContent.map((item, index) => (
                <ContentCard
                  key={index}
                  item={item}
                />
              ))}

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: string;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg ${bg}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}

function ContentCard({
  item,
}: {
  item: ContentItem;
}) {
  const icon =
    item.source === "YouTube"
      ? "▶"
      : item.source === "Twitter"
        ? "𝕏"
        : "📄";

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="truncate text-sm font-semibold">
          {item.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-500">
          {item.description}
        </p>

        <div className="mt-2 flex gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-indigo-600">
            {item.source}
          </span>

          <span>•</span>

          <span>{item.time}</span>
        </div>

      </div>

      <button className="px-2 text-slate-400 opacity-0 transition group-hover:opacity-100">
        •••
      </button>

    </div>
  );
}

export default App;  