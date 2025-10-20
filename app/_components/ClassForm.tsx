"use client";

import { FormEvent, useState } from "react";
import type { ClassRoom } from "../_types";

type Props = {
  onAdd: (c: ClassRoom) => void;
};

export default function ClassForm({ onAdd }: Props) {
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: crypto.randomUUID(), name: name.trim() });
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sınıf adı"
        className="flex-1 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
      />
      <button type="submit" className="rounded-md border border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]">
        Ekle
      </button>
    </form>
  );
}
