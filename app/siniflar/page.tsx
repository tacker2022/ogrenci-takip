"use client";

import { useLocalStorage } from "../_components/useLocalStorage";
import ClassForm from "../_components/ClassForm";
import ClassList from "../_components/ClassList";
import type { ClassRoom } from "../_types";

export default function ClassesPage() {
  const [classes, setClasses] = useLocalStorage<ClassRoom[]>("classes", []);

  function handleAdd(c: ClassRoom) {
    setClasses([...classes, c]);
  }

  function handleDelete(id: string) {
    setClasses(classes.filter((c) => c.id !== id));
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Sınıflar</h1>
      <ClassForm onAdd={handleAdd} />
      <ClassList classes={classes} onDelete={handleDelete} />
    </main>
  );
}
