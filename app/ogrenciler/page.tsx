"use client";

import StudentForm from "../_components/StudentForm";
import StudentList from "../_components/StudentList";
import { useLocalStorage } from "../_components/useLocalStorage";
import type { ClassRoom, Student } from "../_types";

export default function StudentsPage() {
  const [students, setStudents] = useLocalStorage<Student[]>("students", []);
  const [classes] = useLocalStorage<ClassRoom[]>("classes", []);

  function handleAdd(student: Student) {
    setStudents([...students, student]);
  }

  function handleDelete(id: string) {
    setStudents(students.filter((s) => s.id !== id));
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Öğrenciler</h1>
      <StudentForm onAdd={handleAdd} classes={classes} />
      <StudentList students={students} classes={classes} onDelete={handleDelete} />
    </main>
  );
}
