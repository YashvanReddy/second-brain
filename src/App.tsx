import { useState } from "react";

import {
  Brain,
  FileText,
  Link,
  Hash,
  Share2,
  Plus,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";

import {
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
type ContentType = "tweet" | "video" | "document" | "link";

type Note = {
  id: number;
  title: string;
  type: ContentType;
  content?: string;
  url?: string;
  tags: string[];
  date: string;
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Project Ideas",
    type: "document",
    content:
      "Future Projects\n\n• Build a personal knowledge base\n• Create a habit tracker\n• Design a minimalist todo app",
    tags: ["productivity", "ideas"],
    date: "10/03/2024",
  },
  {
    id: 2,
    title: "How to Build a Second Brain",
    type: "video",
    url: "https://youtube.com/",
    tags: ["productivity", "learning"],
    date: "09/03/2024",
  },
  {
    id: 3,
    title: "Productivity Tip",
    type: "tweet",
    url: "https://twitter.com/",
    content:
      "The best way to learn is to build in public. Share your progress, get feedback, and help others along the way.",
    tags: ["productivity", "learning"],
    date: "08/03/2024",
  },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | ContentType
  >("all");

  const [contentType, setContentType] =
    useState<ContentType>("link");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const filteredNotes =
    activeFilter === "all"
      ? notes
      : notes.filter((note) => note.type === activeFilter);
  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      type: contentType,
      url: url.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: new Date().toLocaleDateString("en-GB"),
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setTitle("");
    setUrl("");
    setTags("");
    setContent("");
    setContentType("link");

    setIsModalOpen(false);
  };

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
              icon={<FileText size={28} />}
              label="All Notes"
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            <SidebarItem
              icon={<FaTwitter size={26} />}
              label="Tweets"
              active={activeFilter === "tweet"}
              onClick={() => setActiveFilter("tweet")}
            />

            <SidebarItem
              icon={<FaYoutube size={28} />}
              label="Videos"
              active={activeFilter === "video"}
              onClick={() => setActiveFilter("video")}
            />

            <SidebarItem
              icon={<FileText size={28} />}
              label="Documents"
              active={activeFilter === "document"}
              onClick={() => setActiveFilter("document")}
            />

            <SidebarItem
              icon={<Link size={28} />}
              label="Links"
              active={activeFilter === "link"}
              onClick={() => setActiveFilter("link")}
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
              {activeFilter === "all" && "All Notes"}
              {activeFilter === "tweet" && "Tweets"}
              {activeFilter === "video" && "Videos"}
              {activeFilter === "document" && "Documents"}
              {activeFilter === "link" && "Links"}
            </h2>

            <div className="flex items-center gap-4">

              <button className="flex items-center gap-3 rounded-xl bg-indigo-100 px-7 py-4 text-lg font-medium text-indigo-700 transition hover:bg-indigo-200">
                <Share2 size={24} />
                Share Brain
              </button>

              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-indigo-700">
                <Plus size={26} />
                Add Content
              </button>

            </div>

          </header>

          {/* NOTES */}
          <section className="grid grid-cols-1 gap-8 px-8 pb-12 lg:grid-cols-2 xl:grid-cols-3 lg:px-12">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
              />
            ))}

          </section>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Add Content
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Save something to your Second Brain.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={22} />
                  </button>

                </div>

                <div className="mb-5">

                  <label className="mb-2 block text-sm font-semibold">
                    Content Type
                  </label>

                  <div className="grid grid-cols-2 gap-2">

                    <ContentTypeButton
                      type="video"
                      active={contentType === "video"}
                      onClick={() => setContentType("video")}
                      icon={<FaYoutube />}
                      label="YouTube"
                    />

                    <ContentTypeButton
                      type="tweet"
                      active={contentType === "tweet"}
                      onClick={() => setContentType("tweet")}
                      icon={<FaTwitter />}
                      label="Tweet"
                    />

                    <ContentTypeButton
                      type="document"
                      active={contentType === "document"}
                      onClick={() => setContentType("document")}
                      icon={<FileText size={18} />}
                      label="Document"
                    />

                    <ContentTypeButton
                      type="link"
                      active={contentType === "link"}
                      onClick={() => setContentType("link")}
                      icon={<Link size={18} />}
                      label="Link"
                    />

                  </div>

                </div>

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold">
                    Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold">
                    URL
                  </label>

                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                </div>

                {contentType === "document" && (
                  <div className="mb-4">

                    <label className="mb-2 block text-sm font-semibold">
                      Content
                    </label>

                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write or paste your content..."
                      rows={4}
                      className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                  </div>
                )}

                <div className="mb-6">

                  <label className="mb-2 block text-sm font-semibold">
                    Tags
                  </label>

                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="learning, productivity, coding"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Separate tags with commas.
                  </p>

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Save Content
                  </button>

                </div>

              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-6 rounded-xl px-3 py-3 text-[22px] transition ${active
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-700 hover:bg-slate-100"
        }`}
    >
      <span>
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

function ContentTypeButton({
  type,
  active,
  onClick,
  icon,
  label,
}: {
  type: ContentType;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition ${active
        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
        : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}


export default App;