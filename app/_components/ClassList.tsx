"use client";

import type { ClassRoom } from "../_types";

type Props = {
  classes: ClassRoom[];
  onDelete: (id: string) => void;
};

export default function ClassList({ classes, onDelete }: Props) {
  if (classes.length === 0) {
    return <p className="text-black/60 dark:text-white/60">Henüz sınıf eklenmedi.</p>;
  }

  return (
    <ul className="divide-y divide-black/[.08] dark:divide-white/[.145] border border-black/[.08] dark:border-white/[.145] rounded-md">
      {classes.map((c) => (
        <li key={c.id} className="flex items-center justify-between px-4 py-3">
          <div className="font-medium">{c.name}</div>
          <button onClick={() => onDelete(c.id)} className="text-red-600 hover:underline text-sm">Sil</button>
        </li>
      ))}
    </ul>
  );
}
