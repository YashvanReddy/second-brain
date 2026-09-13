import { useEffect, useState } from "react";

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
  LogOut,
} from "lucide-react";

import {
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
type ContentType = "tweet" | "video" | "document" | "link";

type Note = {
  id: string;
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | ContentType | "tags"
  >("all");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] =
    useState<ContentType>("link");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");



  const filteredNotes = notes.filter((note) => {
    const matchesFilter =
      activeFilter === "all" ||
      activeFilter === "tags" ||
      note.type === activeFilter;

    const matchesTag =
      selectedTag === null ||
      note.tags.includes(selectedTag);

    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      note.title.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      ) ||
      note.type.toLowerCase().includes(query);

    return matchesFilter && matchesTag && matchesSearch;
  });
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags))
  );
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/content",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to fetch content:", data);

          if (response.status === 401) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setNotes([]);
          }

          return;
        }

        const fetchedNotes: Note[] = data.content.map((item: any) => ({
          id: item._id,
          title: item.title,
          type: item.type as ContentType,
          content: item.content ?? "",
          url: item.link ?? "",
          tags: item.tags ?? [],
          date: new Date(item.createdAt).toLocaleDateString("en-GB"),
        }));

        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchNotes();
  }, []);
  const handleLogin = async () => {
    setAuthError("");

    if (!username.trim() || !password.trim()) {
      setAuthError("Please enter username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    const noteTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            link: url.trim(),
            type: contentType,
            content: content.trim(),
            tags: noteTags,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to add content:", data);
        return;
      }

      const newNote: Note = {
        id: data.content?._id ?? Date.now().toString(),
        title: title.trim(),
        type: contentType,
        url: url.trim(),
        content: content.trim(),
        tags: noteTags,
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
    } catch (error) {
      console.error("Add content error:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNotes([]);
  };
  const handleDelete = async () => {
    if (!deleteNote) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/content",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentId: deleteNote.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to delete content:", data);
        return;
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== deleteNote.id)
      );

      setDeleteNote(null);
    } catch (error) {
      console.error("Delete content error:", error);
    }
  };


  const handleEdit = async (updatedNote: Note) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/content/${updatedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: updatedNote.title.trim(),
            link: updatedNote.url?.trim() || "https://example.com",
            type: updatedNote.type,
            content: updatedNote.content?.trim() || "",
            tags: updatedNote.tags,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update content:", data);
        return;
      }

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );

      setEditNote(null);
    } catch (error) {
      console.error("Edit content error:", error);
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Second Brain
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your knowledge base
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {authError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

        </div>
      </div>
    );
  }




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
              onClick={() => {
                setActiveFilter("all");
                setSelectedTag(null);
              }}
            />
            <SidebarItem
              icon={<FaTwitter size={26} />}
              label="Tweets"
              active={activeFilter === "tweet"}
              onClick={() => {
                setActiveFilter("all");
                setSelectedTag(null);
              }}
            />

            <SidebarItem
              icon={<FaYoutube size={28} />}
              label="Videos"
              active={activeFilter === "video"}
              onClick={() => {
                setActiveFilter("all");
                setSelectedTag(null);
              }}
            />

            <SidebarItem
              icon={<FileText size={28} />}
              label="Documents"
              active={activeFilter === "document"}
              onClick={() => {
                setActiveFilter("all");
                setSelectedTag(null);
              }}
            />

            <SidebarItem
              icon={<Link size={28} />}
              label="Links"
              active={activeFilter === "link"}
              onClick={() => {
                setActiveFilter("all");
                setSelectedTag(null);
              }}
            />

            <SidebarItem
              icon={<Hash size={29} />}
              label="Tags"
              active={activeFilter === "tags"}
              onClick={() => setActiveFilter("tags")}
            />
            <button
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>

          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex items-center justify-between gap-6 px-8 py-10 lg:px-12">

            <h2 className="text-4xl font-bold tracking-tight">
              {activeFilter === "all" && "All Notes"}
              {activeFilter === "tweet" && "Tweets"}
              {activeFilter === "video" && "Videos"}
              {activeFilter === "document" && "Documents"}
              {activeFilter === "link" && "Links"}

              {activeFilter === "tags" && "Tags"}
            </h2>

            <div className="flex flex-1 justify-center">

              <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">

                <span className="text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your knowledge..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-slate-400 hover:text-slate-700"
                  >
                    
                  </button>
                )}

              </div>

            </div>
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
          {activeFilter === "tags" && (
            <div className="mb-8 px-8 lg:px-12">
              <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedTag === tag
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <section className="grid grid-cols-1 gap-8 px-8 pb-12 lg:grid-cols-2 xl:grid-cols-3 lg:px-12">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={() => setDeleteNote(note)}

                  onEdit={(note) => setEditNote(note)}

                />
              ))
            ) : (
              <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">

                <div className="mb-4 text-4xl">
                  🔍
                </div>

                <h3 className="text-lg font-semibold text-slate-700">
                  No content found
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Try a different search or filter.
                </p>

              </div>
            )}

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
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          )}  {deleteNote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-slate-900">
                    Delete Content?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-700">
                      "{deleteNote.title}"
                    </span>
                    ?
                  </p>

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => setDeleteNote(null)}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          )}{editNote && (
            <EditContentModal
              note={editNote}
              onClose={() => setEditNote(null)}
              onSave={handleEdit}
            />
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
  onDelete,
  onEdit,
}: {
  note: Note;
  onDelete: () => void;
  onEdit: (note: Note) => void;
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

          <button
            onClick={onDelete}
            className="transition hover:text-red-500"
          >
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
        <button
          onClick={() => onEdit(note)}
          className="text-slate-400 hover:text-slate-600"
        >
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

function EditContentModal({
  note,
  onClose,
  onSave,
}: {
  note: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [url, setUrl] = useState(note.url ?? "");
  const [content, setContent] = useState(note.content ?? "");
  const [tags, setTags] = useState(note.tags.join(", "));

  const handleSave = () => {
    onSave({
      ...note,
      title: title.trim(),
      url: url.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Edit Content
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your saved content.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={22} />
          </button>

        </div>

        {/* TITLE */}
        <div className="mb-4">

          <label className="mb-2 block text-sm font-semibold">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* URL */}
        <div className="mb-4">

          <label className="mb-2 block text-sm font-semibold">
            URL
          </label>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* CONTENT */}
        <div className="mb-4">

          <label className="mb-2 block text-sm font-semibold">
            Content
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* TAGS */}
        <div className="mb-6">

          <label className="mb-2 block text-sm font-semibold">
            Tags
          </label>

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="learning, productivity, coding"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;