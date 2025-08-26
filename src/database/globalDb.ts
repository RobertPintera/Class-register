import { v4 as uuidv4 } from "uuid";
import { db } from "./database";
import type { Grade } from "@/models/Grade";
import type { Test } from "@/models/Test";
import type { Student } from "@/models/Student";

export async function createDemoDataDb(){
  await db.transaction("rw", db.students, db.tests, db.grades, async () => {
    await db.students.clear();
    await db.tests.clear();
    await db.grades.clear();

    const students: Student[] = [
      { id: uuidv4(), name: "Jan", surname: "Kowalski", gender: "Male" },
      { id: uuidv4(), name: "John", surname: "Smith", gender: "Male" },
      { id: uuidv4(), name: "William", surname: "Brown", gender: "Male" },
      { id: uuidv4(), name: "Daniel", surname: "Novak", gender: "Male" },
      { id: uuidv4(), name: "Katarzyna", surname: "Wiśniewska", gender: "Female" },
      { id: uuidv4(), name: "Emily", surname: "Johnson", gender: "Female" },
      { id: uuidv4(), name: "Sofia", surname: "Rossi", gender: "Female" },
      { id: uuidv4(), name: "Maria", surname: "Silva", gender: "Female" },
    ];

    const tests: Test[] = [
      { id: uuidv4(), name: "Math - Algebra", maxPoints: 20, weight: 2, requiredPoints: 10, isMandatory: true },
      { id: uuidv4(), name: "English - Grammar", maxPoints: 15, weight: 1, requiredPoints: 8, isMandatory: true },
      { id: uuidv4(), name: "History - Ancient Rome", maxPoints: 25, weight: 3, requiredPoints: null, isMandatory: true },
      { id: uuidv4(), name: "Science - Physics Basics", maxPoints: 30, weight: 2, requiredPoints: 15, isMandatory: true },
      { id: uuidv4(), name: "Geography - Europe", maxPoints: 20, weight: 1, requiredPoints: 12, isMandatory: true },
      { id: uuidv4(), name: "Biology - Human Body", maxPoints: 25, weight: 2, requiredPoints: 14, isMandatory: true },
      { id: uuidv4(), name: "Computer Science - Basics", maxPoints: 40, weight: 3, requiredPoints: 20, isMandatory: false },
      { id: uuidv4(), name: "Art - Paiting", maxPoints: 50, weight: 3, requiredPoints: null, isMandatory: false },
      { id: uuidv4(), name: "Music - Jazz", maxPoints: 50, weight: 3, requiredPoints: 20, isMandatory: false },
      { id: uuidv4(), name: "Chemistry - Chemical Reactions", maxPoints: 50, weight: 3, requiredPoints: 20, isMandatory: false },
    ];

    const grades: Grade[] = [
      // Jan Kowalski (9 grades, very good student)
      { studentId: students[0].id, testId: tests[0].id, points: 18 }, // Math
      { studentId: students[0].id, testId: tests[1].id, points: 14 }, // English
      { studentId: students[0].id, testId: tests[2].id, points: 23 }, // History
      { studentId: students[0].id, testId: tests[3].id, points: 27 }, // Science
      { studentId: students[0].id, testId: tests[4].id, points: 19 }, // Geography
      { studentId: students[0].id, testId: tests[5].id, points: 22 }, // Biology
      { studentId: students[0].id, testId: tests[6].id, points: 37 }, // Computer Science
      { studentId: students[0].id, testId: tests[7].id, points: 46 }, // Art
      { studentId: students[0].id, testId: tests[9].id, points: 41 }, // Chemistry

      // John Smith (7 grades, mixed results, some failed)
      { studentId: students[1].id, testId: tests[0].id, points: 9 },  // failed Math
      { studentId: students[1].id, testId: tests[1].id, points: 7 },  // failed English
      { studentId: students[1].id, testId: tests[2].id, points: 15 }, // History
      { studentId: students[1].id, testId: tests[3].id, points: 14 }, // failed Science
      { studentId: students[1].id, testId: tests[5].id, points: 19 }, // Biology
      { studentId: students[1].id, testId: tests[6].id, points: 25 }, // Computer Science
      { studentId: students[1].id, testId: tests[8].id, points: 30 }, // Music

      // William Brown (10 grades, full set but several failed)
      { studentId: students[2].id, testId: tests[0].id, points: 8 },   // failed Math
      { studentId: students[2].id, testId: tests[1].id, points: 12 },  // Englis
      { studentId: students[2].id, testId: tests[2].id, points: 10 },  // History
      { studentId: students[2].id, testId: tests[3].id, points: 12 },  // failed Science
      { studentId: students[2].id, testId: tests[4].id, points: 11 },  // failed Geography 
      { studentId: students[2].id, testId: tests[5].id, points: 15 },  // Biology
      { studentId: students[2].id, testId: tests[6].id, points: 38 },  // Computer Science 
      { studentId: students[2].id, testId: tests[7].id, points: 20 },  // Art
      { studentId: students[2].id, testId: tests[8].id, points: 48 },  // Music
      { studentId: students[2].id, testId: tests[9].id, points: 17 },  // failed Chemistry

      // Daniel Novak (6 grades, mostly negative)
      { studentId: students[3].id, testId: tests[0].id, points: 7 },   // failed Math
      { studentId: students[3].id, testId: tests[1].id, points: 6 },   // failed English
      { studentId: students[3].id, testId: tests[2].id, points: 19 },  // History
      { studentId: students[3].id, testId: tests[3].id, points: 13 },  // failed Science
      { studentId: students[3].id, testId: tests[5].id, points: 10 },  // failed Biology
      { studentId: students[3].id, testId: tests[7].id, points: 25 },  // Art

      // Katarzyna Wiśniewska (8 grades, excellent student)
      { studentId: students[4].id, testId: tests[0].id, points: 20 }, // Math
      { studentId: students[4].id, testId: tests[1].id, points: 15 }, // English
      { studentId: students[4].id, testId: tests[2].id, points: 23 }, // History
      { studentId: students[4].id, testId: tests[3].id, points: 29 }, // Science
      { studentId: students[4].id, testId: tests[4].id, points: 18 }, // Geography
      { studentId: students[4].id, testId: tests[5].id, points: 24 }, // Biology
      { studentId: students[4].id, testId: tests[6].id, points: 39 }, // Computer Science
      { studentId: students[4].id, testId: tests[9].id, points: 45 }, // Chemistry 

      // Emily Johnson (7 grades, mixed, some very weak)
      { studentId: students[5].id, testId: tests[0].id, points: 5 },   // failed Math
      { studentId: students[5].id, testId: tests[1].id, points: 8 },   // English
      { studentId: students[5].id, testId: tests[2].id, points: 22 },  // History
      { studentId: students[5].id, testId: tests[3].id, points: 12 },  // failed Science
      { studentId: students[5].id, testId: tests[4].id, points: 9 },   // failed Geography
      { studentId: students[5].id, testId: tests[8].id, points: 45 },  // Music
      { studentId: students[5].id, testId: tests[9].id, points: 30 },  // Chemistry

      // Sofia Rossi (6 grades, mostly good, one failed)
      { studentId: students[6].id, testId: tests[0].id, points: 19 }, // Math
      { studentId: students[6].id, testId: tests[1].id, points: 13 }, // English
      { studentId: students[6].id, testId: tests[2].id, points: 22 }, // History
      { studentId: students[6].id, testId: tests[3].id, points: 29 }, // Science
      { studentId: students[6].id, testId: tests[5].id, points: 9 },  // failed Biology 
      { studentId: students[6].id, testId: tests[6].id, points: 36 }, // Computer Science

      // Maria Silva (10 grades, full set, 2 failed)
      { studentId: students[7].id, testId: tests[0].id, points: 15 }, // Math 
      { studentId: students[7].id, testId: tests[1].id, points: 6 },  // failed English
      { studentId: students[7].id, testId: tests[2].id, points: 20 }, // History 
      { studentId: students[7].id, testId: tests[3].id, points: 28 }, // Science
      { studentId: students[7].id, testId: tests[4].id, points: 11 }, // failed Geography
      { studentId: students[7].id, testId: tests[5].id, points: 18 }, // Biology
      { studentId: students[7].id, testId: tests[6].id, points: 32 }, // Computer Science
      { studentId: students[7].id, testId: tests[7].id, points: 47 }, // Art
      { studentId: students[7].id, testId: tests[8].id, points: 40 }, // Music
      { studentId: students[7].id, testId: tests[9].id, points: 42 }, // Chemistry
    ];

    await db.students.bulkAdd(students);
    await db.tests.bulkAdd(tests);
    await db.grades.bulkAdd(grades);
  });
}