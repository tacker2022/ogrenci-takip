"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  where,
  onSnapshot
} from "firebase/firestore";
import { db, auth, isFirebaseConfigured } from "../_lib/firebase";
import { useLocalStorage } from "../_components/useLocalStorage";
import type { ClassRoom, Student, Attendance } from "../_types";

// Classes hook
export function useClasses() {
  const [localClasses, setLocalClasses] = useLocalStorage<ClassRoom[]>("classes", []);
  const [firebaseClasses, setFirebaseClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const classes = isFirebaseConfigured ? firebaseClasses : localClasses;
  const setClasses = isFirebaseConfigured ? setFirebaseClasses : setLocalClasses;

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      loadClasses();
      
      // Real-time subscription
      const q = query(collection(db, "classes"), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setFirebaseClasses(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadClasses() {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "classes"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setFirebaseClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addClass(classRoom: ClassRoom) {
    if (!isFirebaseConfigured || !db) {
      setLocalClasses([...localClasses, { id: crypto.randomUUID(), name: classRoom.name }]);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "classes"), {
        name: classRoom.name,
        userId: auth.currentUser?.uid || "",
        createdAt: new Date(),
      });
      return { id: docRef.id, name: classRoom.name };
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  }

  async function updateClass(id: string, name: string) {
    if (!isFirebaseConfigured || !db) {
      setLocalClasses(localClasses.map(c => c.id === id ? { ...c, name } : c));
      return;
    }
    try {
      await updateDoc(doc(db, "classes", id), { name });
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  async function deleteClass(id: string) {
    if (!isFirebaseConfigured || !db) {
      setLocalClasses(localClasses.filter(c => c.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, "classes", id));
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  return { classes, loading, addClass, updateClass, deleteClass, refresh: loadClasses };
}

// Students hook
export function useStudents() {
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>("students", []);
  const [firebaseStudents, setFirebaseStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const students = isFirebaseConfigured ? firebaseStudents : localStudents;
  const setStudents = isFirebaseConfigured ? setFirebaseStudents : setLocalStudents;

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      loadStudents();
      
      const q = query(collection(db, "students"), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          classId: doc.data().classId,
        }));
        setFirebaseStudents(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadStudents() {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "students"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        classId: doc.data().classId,
      }));
      setFirebaseStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addStudent(student: Student) {
    if (!isFirebaseConfigured || !db) {
      setLocalStudents([...localStudents, { id: crypto.randomUUID(), name: student.name, classId: student.classId }]);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "students"), {
        name: student.name,
        classId: student.classId,
        userId: auth.currentUser?.uid || "",
        createdAt: new Date(),
      });
      return { id: docRef.id, name: student.name, classId: student.classId };
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  async function updateStudent(id: string, name: string, classId: string) {
    if (!isFirebaseConfigured || !db) {
      setLocalStudents(localStudents.map(s => s.id === id ? { id, name, classId } : s));
      return;
    }
    try {
      await updateDoc(doc(db, "students", id), { name, classId });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async function deleteStudent(id: string) {
    if (!isFirebaseConfigured || !db) {
      setLocalStudents(localStudents.filter(s => s.id !== id));
      return;
    }
    try {
      await deleteDoc(doc(db, "students", id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  return { students, loading, addStudent, updateStudent, deleteStudent, refresh: loadStudents };
}

// Attendance hook
export function useAttendance() {
  const [localAttendance, setLocalAttendance] = useLocalStorage<Attendance[]>("attendance", []);
  const [firebaseAttendance, setFirebaseAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const attendance = isFirebaseConfigured ? firebaseAttendance : localAttendance;
  const setAttendance = isFirebaseConfigured ? setFirebaseAttendance : setLocalAttendance;

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      loadAttendance();
      
      const q = query(collection(db, "attendance"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date,
            classId: data.classId,
            studentId: data.studentId,
            status: data.status,
          };
        });
        setFirebaseAttendance(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadAttendance() {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }
    try {
      const q = query(collection(db, "attendance"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date,
          classId: data.classId,
          studentId: data.studentId,
          status: data.status,
        };
      });
      setFirebaseAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  }

  async function setAttendanceStatus(a: Attendance) {
    if (!isFirebaseConfigured || !db) {
      const existing = localAttendance.find(
        (at) => at.date === a.date && at.classId === a.classId && at.studentId === a.studentId
      );
      if (existing) {
        setLocalAttendance(localAttendance.map(at => 
          at.id === existing.id ? { ...at, status: a.status } : at
        ));
      } else {
        setLocalAttendance([...localAttendance, a]);
      }
      return;
    }

    try {
      // Check if record exists
      const q = query(
        collection(db, "attendance"),
        where("date", "==", a.date),
        where("classId", "==", a.classId),
        where("studentId", "==", a.studentId)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Update existing
        const docRef = snapshot.docs[0];
        await updateDoc(doc(db, "attendance", docRef.id), { status: a.status });
      } else {
        // Insert new
        await addDoc(collection(db, "attendance"), {
          date: a.date,
          classId: a.classId,
          studentId: a.studentId,
          status: a.status,
          userId: auth.currentUser?.uid || "",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error setting attendance:', error);
      throw error;
    }
  }

  return { attendance, loading, setAttendanceStatus, refresh: loadAttendance };
}

