"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../_lib/supabase";
import { useLocalStorage } from "../_components/useLocalStorage";
import type { ClassRoom, Student, Attendance } from "../_types";

// Classes hook
export function useClasses() {
  const [localClasses, setLocalClasses] = useLocalStorage<ClassRoom[]>("classes", []);
  const [supabaseClasses, setSupabaseClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Use Supabase if configured, otherwise LocalStorage
  const classes = isSupabaseConfigured ? supabaseClasses : localClasses;
  const setClasses = isSupabaseConfigured ? setSupabaseClasses : setLocalClasses;

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      loadClasses();
      
      // Real-time subscription
      const channel = supabase
        .channel('classes-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, () => {
          loadClasses();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, []);

  async function loadClasses() {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSupabaseClasses(data?.map((c: any) => ({ id: c.id, name: c.name })) || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addClass(classRoom: ClassRoom) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalClasses([...localClasses, { id: crypto.randomUUID(), name: classRoom.name }]);
      return;
    }
    const { data, error } = await supabase
      .from('classes')
      .insert({ name: classRoom.name })
      .select()
      .single();

    if (error) throw error;
    if (data) setSupabaseClasses([...supabaseClasses, { id: data.id, name: data.name }]);
    return data;
  }

  async function updateClass(id: string, name: string) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalClasses(localClasses.map(c => c.id === id ? { ...c, name } : c));
      return;
    }
    const { error } = await supabase
      .from('classes')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
    setSupabaseClasses(supabaseClasses.map(c => c.id === id ? { ...c, name } : c));
  }

  async function deleteClass(id: string) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalClasses(localClasses.filter(c => c.id !== id));
      return;
    }
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setSupabaseClasses(supabaseClasses.filter(c => c.id !== id));
  }

  return { classes, loading, addClass, updateClass, deleteClass, refresh: loadClasses };
}

// Students hook
export function useStudents() {
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>("students", []);
  const [supabaseStudents, setSupabaseStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const students = isSupabaseConfigured ? supabaseStudents : localStudents;
  const setStudents = isSupabaseConfigured ? setSupabaseStudents : setLocalStudents;

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      loadStudents();
      
      const channel = supabase
        .channel('students-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
          loadStudents();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, []);

  async function loadStudents() {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSupabaseStudents(data?.map((s: any) => ({ id: s.id, name: s.name, classId: s.class_id })) || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addStudent(student: Student) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalStudents([...localStudents, { id: crypto.randomUUID(), name: student.name, classId: student.classId }]);
      return;
    }
    const { data, error } = await supabase
      .from('students')
      .insert({ name: student.name, class_id: student.classId })
      .select()
      .single();

    if (error) throw error;
    if (data) setSupabaseStudents([...supabaseStudents, { id: data.id, name: data.name, classId: data.class_id }]);
    return data;
  }

  async function updateStudent(id: string, name: string, classId: string) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalStudents(localStudents.map(s => s.id === id ? { id, name, classId } : s));
      return;
    }
    const { error } = await supabase
      .from('students')
      .update({ name, class_id: classId })
      .eq('id', id);

    if (error) throw error;
    setSupabaseStudents(supabaseStudents.map(s => s.id === id ? { id, name, classId } : s));
  }

  async function deleteStudent(id: string) {
    if (!isSupabaseConfigured || !supabase) {
      setLocalStudents(localStudents.filter(s => s.id !== id));
      return;
    }
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setSupabaseStudents(supabaseStudents.filter(s => s.id !== id));
  }

  return { students, loading, addStudent, updateStudent, deleteStudent, refresh: loadStudents };
}

// Attendance hook
export function useAttendance() {
  const [localAttendance, setLocalAttendance] = useLocalStorage<Attendance[]>("attendance", []);
  const [supabaseAttendance, setSupabaseAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const attendance = isSupabaseConfigured ? supabaseAttendance : localAttendance;
  const setAttendance = isSupabaseConfigured ? setSupabaseAttendance : setLocalAttendance;

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      loadAttendance();
      
      const channel = supabase
        .channel('attendance-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
          loadAttendance();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, []);

  async function loadAttendance() {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSupabaseAttendance(data?.map((a: any) => ({
        id: a.id,
        date: a.date,
        classId: a.class_id,
        studentId: a.student_id,
        status: a.status
      })) || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  }

  async function setAttendanceStatus(a: Attendance) {
    if (!isSupabaseConfigured || !supabase) {
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

    // Check if record exists
    const existing = attendance.find(
      (at) => at.date === a.date && at.classId === a.classId && at.studentId === a.studentId
    );

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('attendance')
        .update({ status: a.status })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updated = {
          id: data.id,
          date: data.date,
          classId: data.class_id,
          studentId: data.student_id,
          status: data.status
        };
        setSupabaseAttendance(supabaseAttendance.map(at => at.id === existing.id ? updated : at));
      }
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          date: a.date,
          class_id: a.classId,
          student_id: a.studentId,
          status: a.status
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newRecord = {
          id: data.id,
          date: data.date,
          classId: data.class_id,
          studentId: data.student_id,
          status: data.status
        };
        setSupabaseAttendance([...supabaseAttendance, newRecord]);
      }
    }
  }

  return { attendance, loading, setAttendanceStatus, refresh: loadAttendance };
}

