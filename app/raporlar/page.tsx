"use client";

import { useMemo, useState } from "react";
import { useClasses, useStudents, useAttendance } from "../_hooks/useFirebase";

function parseDate(s: string) {
  return new Date(s + "T00:00:00");
}

export default function ReportsPage() {
  const { classes, loading: classesLoading } = useClasses();
  const { students, loading: studentsLoading } = useStudents();
  const { attendance, loading: attendanceLoading } = useAttendance();

  const [classId, setClassId] = useState<string>(classes[0]?.id ?? "");
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10));

  const filteredStudents = useMemo(
    () => students.filter((s) => s.classId === classId),
    [students, classId]
  );

  const rows = useMemo(() => {
    const fromD = parseDate(from);
    const toD = parseDate(to);
    return filteredStudents.map((s) => {
      const items = attendance.filter(
        (a) => a.classId === classId && a.studentId === s.id && parseDate(a.date) >= fromD && parseDate(a.date) <= toD
      );
      const present = items.filter((i) => i.status === "present").length;
      const absent = items.filter((i) => i.status === "absent").length;
      const late = items.filter((i) => i.status === "late").length;
      return { student: s, present, absent, late };
    });
  }, [attendance, filteredStudents, classId, from, to]);

  if (classesLoading || studentsLoading || attendanceLoading) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <p className="text-black/60 dark:text-white/60">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Raporlar</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent">
          <option value="" disabled={classes.length>0}>{classes.length>0?"Sınıf seçin":"Önce sınıf ekleyin"}</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent" />
      </div>

      {rows.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">Seçili aralıkta kayıt bulunamadı.</p>
      ) : (
        <table className="w-full text-left border border-black/[.08] dark:border-white/[.145] rounded-md overflow-hidden">
          <thead className="bg-black/[.03] dark:bg-white/[.06]">
            <tr>
              <th className="px-4 py-2">Öğrenci</th>
              <th className="px-4 py-2">Var</th>
              <th className="px-4 py-2">Yok</th>
              <th className="px-4 py-2">Geç</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.student.id} className="border-t border-black/[.08] dark:border-white/[.145]">
                <td className="px-4 py-2">{r.student.name}</td>
                <td className="px-4 py-2">{r.present}</td>
                <td className="px-4 py-2">{r.absent}</td>
                <td className="px-4 py-2">{r.late}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
