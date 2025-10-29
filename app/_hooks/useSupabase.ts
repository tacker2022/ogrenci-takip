"use client";

import { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import type { ClassRoom, Student, Attendance } from "../_types";

// Classes hook
export function useClasses() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  async function loadClasses() {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addClass(classRoom: ClassRoom) {
    const { data, error } = await supabase
      .from('classes')
      .insert({ name: classRoom.name })
      .select()
      .single();

    if (error) throw error;
    if (data) setClasses([...classes, { id: data.id, name: data.name }]);
    return data;
  }

  async function updateClass(id: string, name: string) {
    const { error } = await supabase
      .from('classes')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
    setClasses(classes.map(c => c.id === id ? { ...c, name } : c));
  }

  async function deleteClass(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setClasses(classes.filter(c => c.id !== id));
  }

  return { classes, loading, addClass, updateClass, deleteClass, refresh: loadClasses };
}

// Students hook
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  async function loadStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStudents(data?.map(s => ({ id: s.id, name: s.name, classId: s.class_id })) || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addStudent(student: Student) {
    const { data, error } = await supabase
      .from('students')
      .insert({ name: student.name, class_id: student.classId })
      .select()
      .single();

    if (error) throw error;
    if (data) setStudents([...students, { id: data.id, name: data.name, classId: data.class_id }]);
    return data;
  }

  async function updateStudent(id: string, name: string, classId: string) {
    const { error } = await supabase
      .from('students')
      .update({ name, class_id: classId })
      .eq('id', id);

    if (error) throw error;
    setStudents(students.map(s => s.id === id ? { id, name, classId } : s));
  }

  async function deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setStudents(students.filter(s => s.id !== id));
  }

  return { students, loading, addStudent, updateStudent, deleteStudent, refresh: loadStudents };
}

// Attendance hook
export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  async function loadAttendance() {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data?.map(a => ({
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
        setAttendance(attendance.map(at => at.id === existing.id ? updated : at));
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
        setAttendance([...attendance, newRecord]);
      }
    }
  }

  return { attendance, loading, setAttendanceStatus, refresh: loadAttendance };
}

