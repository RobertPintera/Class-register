import type { Student } from "@/models/Student";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGradesStore } from "./useGradesStore";
import { studentService } from "@/services/studentSerivce";

export const useStudentsStore = defineStore('students', () => {
  const gradesStore = useGradesStore();
  const _students = ref<Student[]>([]);
  const students = computed(() => _students.value);

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent = await studentService.addStudent(student);
    _students.value.push(newStudent);
  };

  const updateStudent = async (id: string, updated: Partial<Omit<Student, 'id'>>) => {
    await studentService.updateStudent(id, updated);
    const index = _students.value.findIndex(s => s.id === id);
    if (index !== -1) {
      _students.value[index] = { ..._students.value[index], ...updated };
    }
  };

  const deleteStudent = async (studentId: string) => {
    await studentService.deleteStudent(studentId);
    _students.value = _students.value.filter(s => s.id !== studentId);
    gradesStore.setGrades(gradesStore.grades.filter(g => g.studentId !== studentId));
  };

  const setStudents = (newStudents: Student[]) => {
    _students.value = newStudents;
  };
  
  const getStudent = (studentId: string) => {
    return _students.value.find(s => s.id === studentId);
  };

  return{
    students,
    addStudent, updateStudent, deleteStudent, getStudent, setStudents
  };
});