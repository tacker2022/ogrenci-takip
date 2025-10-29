"use client";

import { useState } from "react";
import type { ClassRoom } from "../_types";

type Student = { id: string; name: string; classId: string };

type Props = {
  students: Student[];
  classes?: ClassRoom[];
  onDelete: (id: string) => void;
  onUpdate?: (student: Student) => void;
};

export default function StudentList({ students, classes = [], onDelete, onUpdate }: Props) {
  if (students.length === 0) {
    return <p className="text-black/60 dark:text-white/60">Henüz öğrenci eklenmedi.</p>;
  }

  const classMap = new Map(classes.map((c) => [c.id, c.name] as const));

  return (
    <ul className="divide-y divide-black/[.08] dark:divide-white/[.145] border border-black/[.08] dark:border-white/[.145] rounded-md">
      {students.map((s) => (
        <EditableRow key={s.id} student={s} classes={classes} classMap={classMap} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  );
}

function EditableRow({ student, classes, classMap, onDelete, onUpdate }: {
  student: Student;
  classes: ClassRoom[];
  classMap: Map<string, string>;
  onDelete: (id: string) => void;
  onUpdate?: (student: Student) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [classId, setClassId] = useState(student.classId);

  function save() {
    if (!onUpdate) return setIsEditing(false);
    const trimmed = name.trim();
    if (!trimmed) return;
    onUpdate({ id: student.id, name: trimmed, classId });
    setIsEditing(false);
  }

  return (
    <li className="px-4 py-3">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full sm:w-56 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={save} className="text-sm px-3 py-1 rounded-md border hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]">Kaydet</button>
            <button onClick={() => setIsEditing(false)} className="text-sm text-black/60 dark:text-white/60 hover:underline">Vazgeç</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-black/60 dark:text-white/60">{classMap.get(student.classId) ?? "Sınıf yok"}</div>
          </div>
          <div className="flex items-center gap-3">
            {onUpdate && (
              <button onClick={() => setIsEditing(true)} className="text-sm hover:underline">Düzenle</button>
            )}
            <button
              onClick={() => onDelete(student.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Sil
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
