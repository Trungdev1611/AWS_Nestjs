"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type UploadResponse = { url?: string; key?: string };

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [message, setMessage] = useState("");

  const apiBase = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(
        /\/$/,
        "",
      ),
    [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setUploadedUrl("");

    if (!file) {
      setMessage("Chọn một ảnh trước khi upload.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage("Chỉ cho phép upload ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${apiBase}/upload/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload failed");
      }
      const data = (await res.json()) as UploadResponse;
      setUploadedUrl(data.url ?? "");
      setMessage("Upload thành công.");
    } catch (err) {
      console.error(err);
      setMessage("Upload thất bại. Kiểm tra server/log.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold text-slate-900">AWS Upload FE</div>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
            <Link className="hover:text-slate-900" href="/">
              Home
            </Link>
            <Link
              className="rounded-md bg-slate-900 px-3 py-1.5 text-white shadow-sm hover:bg-slate-800"
              href="/upload"
            >
              Upload ảnh
            </Link>
            <span className="cursor-not-allowed rounded-md bg-slate-100 px-3 py-1.5 text-slate-400">
              Tính năng khác (soon)
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Upload ảnh</h1>
              <p className="text-sm text-slate-600">
                Endpoint: <span className="font-mono">{apiBase}/upload/image</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Chọn file ảnh (tối đa 5MB)
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={uploading}
              />
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {uploading ? "Đang upload..." : "Upload"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-slate-700" role="status">
              {message}
            </p>
          )}

          {uploadedUrl && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Đã upload</h2>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-700 underline underline-offset-4"
                >
                  Mở URL
                </a>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-100 p-3">
                <p className="break-all font-mono text-xs text-slate-700">
                  {uploadedUrl}
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="mx-auto max-h-[420px] w-full object-contain"
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

