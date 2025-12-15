"use client";

import Link from "next/link";

export default function Home() {
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
          <h1 className="text-xl font-semibold text-slate-900">Chọn tính năng</h1>
          <p className="mt-2 text-slate-600">
            Dùng thanh điều hướng để vào các màn hình. Hiện có màn Upload ảnh (S3).
            Các màn khác sẽ bổ sung sau.
          </p>
        </section>
      </main>
    </div>
  );
}
