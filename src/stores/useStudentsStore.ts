import type { Student } from "@/models/Student";
import { defineStore } from "pinia";
import { computed, onScopeDispose, ref } from "vue";
import { studentService } from "@/services/studentSerivce";

export const useStudentsStore = defineStore('students', () => {
  const _students = ref<Student[]>([]);
  const students = computed(() => _students.value);

  const subscription = studentService
    .getAllStudents()
    .subscribe((data) => {
      _students.value = data;
    });

  onScopeDispose(() => {
    subscription.unsubscribe();
  });

  const addStudent = async (student: Omit<Student, 'id'>) => {
    await studentService.addStudent(student);
  };

  const updateStudent = async (id: string, updated: Partial<Omit<Student, 'id'>>) => {
    await studentService.updateStudent(id, updated);
  };

  const deleteStudent = async (studentId: string) => {
    await studentService.deleteStudent(studentId);
  };
  
  const getStudent = (studentId: string) => {
    return _students.value.find(s => s.id === studentId);
  };

  return{
    students,
    addStudent, updateStudent, deleteStudent, getStudent
  };
});