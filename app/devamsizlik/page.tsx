"use client";

import { useMemo, useState } from "react";
import { useClasses, useStudents, useAttendance } from "../_hooks/useSupabase";
import type { Attendance } from "../_types";

export default function AttendancePage() {
  const { classes, loading: classesLoading } = useClasses();
  const { students, loading: studentsLoading } = useStudents();
  const { attendance, setAttendanceStatus } = useAttendance();

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [classId, setClassId] = useState<string>(classes[0]?.id ?? "");

  const filteredStudents = useMemo(
    () => students.filter((s) => s.classId === classId),
    [students, classId]
  );

  function getStatus(studentId: string): Attendance["status"] | undefined {
    return attendance.find((a) => a.date === date && a.classId === classId && a.studentId === studentId)?.status;
  }

  function setStatus(studentId: string, status: Attendance["status"]) {
    const existing = attendance.find((a) => a.date === date && a.classId === classId && a.studentId === studentId);
    const id = existing?.id || crypto.randomUUID();
    setAttendanceStatus({ id, date, classId, studentId, status });
  }

  if (classesLoading || studentsLoading) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-black/60 dark:text-white/60">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Devamsızlık</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent" />
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent">
          <option value="" disabled={classes.length>0}>{classes.length>0?"Sınıf seçin":"Önce sınıf ekleyin"}</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">Seçili sınıfta öğrenci yok.</p>
      ) : (
        <table className="w-full text-left border border-black/[.08] dark:border-white/[.145] rounded-md overflow-hidden">
          <thead className="bg-black/[.03] dark:bg-white/[.06]">
            <tr>
              <th className="px-4 py-2">Öğrenci</th>
              <th className="px-4 py-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const status = getStatus(s.id) ?? "present";
              return (
                <tr key={s.id} className="border-t border-black/[.08] dark:border-white/[.145]">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {(["present","absent","late"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatus(s.id, st)}
                          className={`px-3 py-1 rounded-md border text-sm ${status===st?"bg-black text-white dark:bg-white dark:text-black":"hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"}`}
                        >
                          {st === "present" ? "Var" : st === "absent" ? "Yok" : "Geç"}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
