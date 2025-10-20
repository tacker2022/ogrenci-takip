"use client";

import type { ClassRoom } from "../_types";

type Student = { id: string; name: string; classId: string };

type Props = {
  students: Student[];
  classes?: ClassRoom[];
  onDelete: (id: string) => void;
};

export default function StudentList({ students, classes = [], onDelete }: Props) {
  if (students.length === 0) {
    return <p className="text-black/60 dark:text-white/60">Henüz öğrenci eklenmedi.</p>;
  }

  const classMap = new Map(classes.map((c) => [c.id, c.name] as const));

  return (
    <ul className="divide-y divide-black/[.08] dark:divide-white/[.145] border border-black/[.08] dark:border-white/[.145] rounded-md">
      {students.map((s) => (
        <li key={s.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-black/60 dark:text-white/60">{classMap.get(s.classId) ?? "Sınıf yok"}</div>
          </div>
          <button
            onClick={() => onDelete(s.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Sil
          </button>
        </li>)
      )}
    </ul>
  );
}
