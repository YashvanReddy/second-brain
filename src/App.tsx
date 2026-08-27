import {
  Brain,
  FileText,
  Link,
  Hash,
  Share2,
  Plus,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import {
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

type Note = {
  title: string;
  type: "tweet" | "video" | "document";
  content?: string;
  tags: string[];
  date: string;
};

const notes: Note[] = [
  {
    title: "Project Ideas",
    type: "document",
    content:
      "Future Projects\n\n• Build a personal knowledge base\n• Create a habit tracker\n• Design a minimalist todo app",
    tags: ["productivity", "ideas"],
    date: "10/03/2024",
  },
  {
    title: "How to Build a Second Brain",
    type: "video",
    tags: ["productivity", "learning"],
    date: "09/03/2024",
  },
  {
    title: "Productivity Tip",
    type: "tweet",
    content:
      "The best way to learn is to build in public. Share your progress, get feedback, and help others along the way.",
    tags: ["productivity", "learning"],
    date: "08/03/2024",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[360px] shrink-0 border-r border-slate-200 bg-white px-8 py-7 lg:block">

          {/* LOGO */}
          <div className="mb-16 flex items-center gap-3">
            <Brain
              size={44}
              strokeWidth={2}
              className="text-indigo-600"
            />

            <h1 className="text-[30px] font-bold tracking-tight">
              Second Brain
            </h1>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-4">

            <SidebarItem
              icon={<FaTwitter size={26} />}
              label="Tweets"
            />
            <SidebarItem
              icon={<FaYoutube size={28} />}
              label="Videos"
            />

            <SidebarItem
              icon={<FileText size={28} />}
              label="Documents"
            />

            <SidebarItem
              icon={<Link size={28} />}
              label="Links"
            />

            <SidebarItem
              icon={<Hash size={29} />}
              label="Tags"
            />

          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex items-center justify-between px-8 py-10 lg:px-12">

            <h2 className="text-4xl font-bold tracking-tight">
              All Notes
            </h2>

            <div className="flex items-center gap-4">

              <button className="flex items-center gap-3 rounded-xl bg-indigo-100 px-7 py-4 text-lg font-medium text-indigo-700 transition hover:bg-indigo-200">
                <Share2 size={24} />
                Share Brain
              </button>

              <button className="flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-indigo-700">
                <Plus size={26} />
                Add Content
              </button>

            </div>

          </header>

          {/* NOTES */}
          <section className="grid grid-cols-1 gap-8 px-8 pb-12 lg:grid-cols-2 xl:grid-cols-3 lg:px-12">

            {notes.map((note) => (
              <NoteCard
                key={note.title}
                note={note}
              />
            ))} 

          </section>

        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-6 rounded-xl px-3 py-3 text-[22px] text-slate-700 transition hover:bg-slate-100">
      <span className="text-slate-700">
        {icon}
      </span>

      <span>
        {label}
      </span>
    </button>
  );
}

function NoteCard({
  note,
}: {
  note: Note;
}) {
  return (
    <article className="min-h-[450px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* CARD HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex min-w-0 items-center gap-4">

          <SourceIcon type={note.type} />

          <h3 className="truncate text-xl font-medium">
            {note.title}
          </h3>

        </div>

        <div className="flex items-center gap-4 text-slate-400">

          <button className="transition hover:text-indigo-600">
            <Share2 size={22} />
          </button>

          <button className="transition hover:text-red-500">
            <Trash2 size={22} />
          </button>

        </div>

      </div>

      {/* CONTENT */}
      {note.type === "video" ? (
        <div className="mb-6 flex h-44 items-center justify-center rounded-xl bg-slate-200">
          <FileText
            size={58}
            strokeWidth={1.5}
            className="text-slate-400"
          />
        </div>
      ) : (
        <div className="mb-6 whitespace-pre-line text-[20px] leading-8 text-slate-700">
          {note.content}
        </div>
      )}

      {/* TAGS */}
      <div className="mb-7 flex flex-wrap gap-3">

        {note.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
          >
            #{tag}
          </span>
        ))}

      </div>

      {/* DATE */}
      <div className="flex items-center justify-between text-base text-slate-500">

        <span>
          Added on {note.date}
        </span>

        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={22} />
        </button>

      </div>

    </article>
  );
}

function SourceIcon({
  type,
}: {
  type: Note["type"];
}) {
  if (type === "tweet") {
    return (
      <FaTwitter
        size={24}
        className="shrink-0 text-slate-600"
      />
    );
  }

  if (type === "video") {
    return (
      <FaYoutube
        size={26}
        className="shrink-0 text-slate-600"
      />
    );
  }

  return (
    <FileText
      size={26}
      className="shrink-0 text-slate-600"
    />
  );
}


export default App;