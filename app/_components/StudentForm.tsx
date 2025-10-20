"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ClassRoom } from "../_types";

type Props = {
  classes?: ClassRoom[];
  onAdd: (student: { id: string; name: string; classId: string }) => void;
};

export default function StudentForm({ onAdd, classes = [] }: Props) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const hasClasses = classes.length > 0;
  const defaultClassId = useMemo(() => (hasClasses ? classes[0].id : ""), [hasClasses, classes]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const useClassId = classId || defaultClassId;
    if (!name.trim() || !useClassId) return;
    onAdd({ id: crypto.randomUUID(), name: name.trim(), classId: useClassId });
    setName("");
    setClassId("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ad Soyad"
        className="flex-1 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
      />
      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="w-full sm:w-48 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
      >
        <option value="" disabled={!hasClasses}>
          {hasClasses ? "Sınıf seçin" : "Önce sınıf ekleyin"}
        </option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!hasClasses}
        className="rounded-md border border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] disabled:opacity-50"
      >
        Ekle
      </button>
    </form>
  );
}
