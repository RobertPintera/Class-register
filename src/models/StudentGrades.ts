export interface StudentGrades {
    studentId: string
    fullName: string;
    [testId: string]: number | string;
}