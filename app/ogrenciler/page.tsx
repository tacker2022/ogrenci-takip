"use client";

import { useMemo, useState } from "react";
import StudentForm from "../_components/StudentForm";
import StudentList from "../_components/StudentList";
import { useLocalStorage } from "../_components/useLocalStorage";
import type { ClassRoom, Student } from "../_types";

export default function StudentsPage() {
  const [students, setStudents] = useLocalStorage<Student[]>("students", []);
  const [classes] = useLocalStorage<ClassRoom[]>("classes", []);

  const [query, setQuery] = useState("");
  const [filterClassId, setFilterClassId] = useState<string>("");

  function handleAdd(student: Student) {
    setStudents([...students, student]);
  }

  function handleUpdate(updated: Student) {
    setStudents(students.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleDelete(id: string) {
    if (!window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;
    setStudents(students.filter((s) => s.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const okQuery = q === "" || s.name.toLowerCase().includes(q);
      const okClass = filterClassId === "" || s.classId === filterClassId;
      return okQuery && okClass;
    });
  }, [students, query, filterClassId]);

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Öğrenciler</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ada göre ara"
          className="flex-1 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
        />
        <select
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="w-full sm:w-56 rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
        >
          <option value="">Tüm sınıflar</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <StudentForm onAdd={handleAdd} classes={classes} />
      <StudentList
        students={filtered}
        classes={classes}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </main>
  );
}
