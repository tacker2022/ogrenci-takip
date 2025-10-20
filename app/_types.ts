export type ClassRoom = { id: string; name: string };
export type Student = { id: string; name: string; classId: string };
export type Attendance = {
  id: string;
  date: string; // yyyy-mm-dd
  classId: string;
  studentId: string;
  status: "present" | "absent" | "late";
};
