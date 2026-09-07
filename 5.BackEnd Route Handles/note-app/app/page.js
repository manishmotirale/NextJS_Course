"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      console.log(data);
      setNotes(data);
    } catch (error) {
      console.error("Error Fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        const res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
          fetchNotes();
          alert("Note Updated Successfully!");
          setTitle("");
          setContent("");
          setEditingId(null);
        }

        return;
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
          fetchNotes();
          alert("Notes Created Successfully!");
          setTitle("");
          setContent("");
        }
      }
    } catch (error) {
      console.error("Error saving Note:", error);
      alert("Error Saving Note");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you Sure?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Error Deleting Note:", error);
      alert("Error Deleting Note");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  // Today's date for newspaper header
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-100 font-serif text-stone-900">
      {/* Main container – like a newspaper page */}
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white shadow-lg border-x border-stone-300">
        {/* Newspaper Header */}
        <div className="text-center border-b-4 border-stone-800 pb-4 mb-8">
          <div className="flex justify-between text-sm text-stone-600 border-b border-stone-300 pb-1 mb-2">
            <span>VOL. XLII • No. 187</span>
            <span>© THE DAILY CHRONICLE</span>
            <span>PRICE: ONE MIND</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tighter text-stone-900 uppercase">
            The Daily Chronicle
          </h1>
          <p className="text-stone-600 text-sm mt-1 italic">
            “All the Notes That Fit, We Print”
          </p>
          <div className="flex justify-between text-xs text-stone-500 mt-2 pt-1 border-t border-stone-300">
            <span>ESTABLISHED 2026</span>
            <span>{formattedDate}</span>
            <span>FOUR PAGES TODAY</span>
          </div>
        </div>

        {/* Form Section – looks like a 'Letter to the Editor' box */}
        <div className="mb-12 border-2 border-stone-800/10 bg-stone-50 p-6 max-w-2xl mx-auto shadow-md">
          <h2 className="text-2xl font-bold border-l-4 border-stone-800 pl-3 mb-4">
            {editingId ? "✍️ EDIT NOTE" : "📝 SUBMIT A NOTE"}
          </h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-stone-700 text-sm font-semibold uppercase tracking-wide mb-1">
                Headline
              </label>
              <input
                type="text"
                value={title}
                placeholder="Enter a compelling title..."
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-stone-300 bg-white focus:ring-1 focus:ring-stone-800 focus:outline-none rounded-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-stone-700 text-sm font-semibold uppercase tracking-wide mb-1">
                Story Content
              </label>
              <textarea
                value={content}
                placeholder="What's the news?"
                rows={5}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-stone-300 bg-white focus:ring-1 focus:ring-stone-800 focus:outline-none rounded-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-stone-900 text-stone-100 px-5 py-2 font-semibold uppercase tracking-wider text-sm hover:bg-stone-700 transition disabled:opacity-50 rounded-none"
              >
                {loading
                  ? "SAVING..."
                  : editingId
                    ? "UPDATE NOTE"
                    : "PUBLISH NOTE"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-stone-600 text-stone-700 px-5 py-2 font-semibold uppercase tracking-wider text-sm hover:bg-stone-100 transition rounded-none"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes Grid – Newspaper columns */}
        <div>
          <h2 className="text-3xl font-bold border-b-2 border-stone-800 pb-2 mb-6 inline-block">
            RECENT EDITIONS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {notes.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-stone-50 border border-stone-200">
                <p className="text-stone-500 text-lg italic">
                  No notes yet — be the first to publish.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <article
                  key={note._id}
                  className="border-b border-stone-300 pb-6 hover:bg-stone-50 transition p-3"
                >
                  <h3 className="text-2xl font-bold text-stone-800 mb-2 leading-tight">
                    {note.title}
                  </h3>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    {note.content}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-xs text-stone-500 border-t border-stone-200 pt-3">
                    <span className="italic">
                      Published: {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-stone-800 hover:text-stone-600 underline text-sm"
                      >
                        Revise
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-red-700 hover:text-red-500 underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Fake newspaper footer */}
        <div className="mt-12 pt-4 border-t border-stone-300 text-center text-xs text-stone-500">
          <p>
            THE DAILY CHRONICLE — ALL THE WORLD'S A NOTE, AND ALL THE MEN AND
            WOMEN MERELY SCRIBES
          </p>
          <p className="mt-1">
            * No AI was harmed in the making of this newspaper.
          </p>
        </div>
      </div>
    </div>
  );
}
