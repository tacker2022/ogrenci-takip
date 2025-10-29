"use client";

import { useClasses } from "../_hooks/useFirebase";
import ClassForm from "../_components/ClassForm";
import ClassList from "../_components/ClassList";

export default function ClassesPage() {
  const { classes, loading, addClass, deleteClass } = useClasses();

  function handleAdd(c: { name: string }) {
    addClass({ id: "", name: c.name });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Bu sınıfı silmek istediğinize emin misiniz? Sınıftaki tüm öğrenciler de silinecektir.")) return;
    deleteClass(id);
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-black/60 dark:text-white/60">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Sınıflar</h1>
      <ClassForm onAdd={handleAdd} />
      <ClassList classes={classes} onDelete={handleDelete} />
    </main>
  );
}
