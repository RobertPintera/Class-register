import { v4 as uuidv4 } from "uuid";
import { db } from "./database";
import { importDB, exportDB, importInto } from "dexie-export-import";
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
      { id: uuidv4(), name: "Math - Algebra", maxPoints: 20, weight: 3, requiredPoints: 10, isMandatory: true },
      { id: uuidv4(), name: "English - Grammar", maxPoints: 15, weight: 3, requiredPoints: 8, isMandatory: true },
      { id: uuidv4(), name: "History - Ancient Rome", maxPoints: 25, weight: 2, requiredPoints: null, isMandatory: true },
      { id: uuidv4(), name: "Science - Physics Basics", maxPoints: 30, weight: 2, requiredPoints: 15, isMandatory: true },
      { id: uuidv4(), name: "Geography - Europe", maxPoints: 20, weight: 2, requiredPoints: 12, isMandatory: true },
      { id: uuidv4(), name: "Biology - Human Body", maxPoints: 25, weight: 2, requiredPoints: 14, isMandatory: true },
      { id: uuidv4(), name: "Computer Science - Basics", maxPoints: 40, weight: 2, requiredPoints: 20, isMandatory: false },
      { id: uuidv4(), name: "Art - Painting", maxPoints: 50, weight: 1, requiredPoints: null, isMandatory: false },
      { id: uuidv4(), name: "Music - Jazz", maxPoints: 50, weight: 1, requiredPoints: 20, isMandatory: false },
      { id: uuidv4(), name: "Chemistry - Chemical Reactions", maxPoints: 50, weight: 3, requiredPoints: 20, isMandatory: false },
    ];

    const grades: Grade[] = [
      // Jan Kowalski
      { studentId: students[0].id, testId: tests[0].id, points: 20 }, // Math
      { studentId: students[0].id, testId: tests[1].id, points: 14 }, // English
      { studentId: students[0].id, testId: tests[2].id, points: 23 }, // History
      { studentId: students[0].id, testId: tests[3].id, points: 27 }, // Science
      { studentId: students[0].id, testId: tests[4].id, points: 19 }, // Geography
      { studentId: students[0].id, testId: tests[5].id, points: 18 }, // Biology
      { studentId: students[0].id, testId: tests[6].id, points: 37 }, // Computer Science
      { studentId: students[0].id, testId: tests[7].id, points: 46 }, // Art
      { studentId: students[0].id, testId: tests[9].id, points: 47 }, // Chemistry

      // John Smith
      { studentId: students[1].id, testId: tests[0].id, points: 16 }, // Math
      { studentId: students[1].id, testId: tests[1].id, points: 7 },  // English
      { studentId: students[1].id, testId: tests[2].id, points: 21 }, // History
      { studentId: students[1].id, testId: tests[3].id, points: 20 }, // Science
      { studentId: students[1].id, testId: tests[5].id, points: 17 }, // Biology
      { studentId: students[1].id, testId: tests[6].id, points: 25 }, // Computer Science
      { studentId: students[1].id, testId: tests[8].id, points: 30 }, // Music

      // William Brown
      { studentId: students[2].id, testId: tests[0].id, points: 18 },  // Math
      { studentId: students[2].id, testId: tests[1].id, points: 12 },  // English
      { studentId: students[2].id, testId: tests[2].id, points: 24 },  // History
      { studentId: students[2].id, testId: tests[3].id, points: 25 },  // Science
      { studentId: students[2].id, testId: tests[4].id, points: 15 },  // Geography 
      { studentId: students[2].id, testId: tests[5].id, points: 23 },  // Biology
      { studentId: students[2].id, testId: tests[6].id, points: 38 },  // Computer Science 
      { studentId: students[2].id, testId: tests[7].id, points: 40 },  // Art
      { studentId: students[2].id, testId: tests[8].id, points: 48 },  // Music
      { studentId: students[2].id, testId: tests[9].id, points: 19 },  // Chemistry

      // Daniel Novak
      { studentId: students[3].id, testId: tests[0].id, points: 17 },   // Math
      { studentId: students[3].id, testId: tests[1].id, points: 6 },   // English
      { studentId: students[3].id, testId: tests[2].id, points: 19 },  // History
      { studentId: students[3].id, testId: tests[3].id, points: 27 },  // Science
      { studentId: students[3].id, testId: tests[5].id, points: 10 },  // Biology
      { studentId: students[3].id, testId: tests[7].id, points: 25 },  // Art

      // Katarzyna Wiśniewska
      { studentId: students[4].id, testId: tests[0].id, points: 20 }, // Math
      { studentId: students[4].id, testId: tests[1].id, points: 15 }, // English
      { studentId: students[4].id, testId: tests[2].id, points: 23 }, // History
      { studentId: students[4].id, testId: tests[3].id, points: 29 }, // Science
      { studentId: students[4].id, testId: tests[4].id, points: 18 }, // Geography
      { studentId: students[4].id, testId: tests[5].id, points: 24 }, // Biology
      { studentId: students[4].id, testId: tests[6].id, points: 39 }, // Computer Science
      { studentId: students[4].id, testId: tests[9].id, points: 45 }, // Chemistry 

      // Emily Johnson
      { studentId: students[5].id, testId: tests[0].id, points: 5 },   // Math
      { studentId: students[5].id, testId: tests[1].id, points: 8 },   // English
      { studentId: students[5].id, testId: tests[2].id, points: 18 },  // History
      { studentId: students[5].id, testId: tests[3].id, points: 12 },  // Science
      { studentId: students[5].id, testId: tests[4].id, points: 9 },   // Geography
      { studentId: students[5].id, testId: tests[8].id, points: 45 },  // Music
      { studentId: students[5].id, testId: tests[9].id, points: 30 },  // Chemistry

      // Sofia Rossi
      { studentId: students[6].id, testId: tests[0].id, points: 11 }, // Math
      { studentId: students[6].id, testId: tests[1].id, points: 13 }, // English
      { studentId: students[6].id, testId: tests[2].id, points: 14 }, // History
      { studentId: students[6].id, testId: tests[3].id, points: 25 }, // Science
      { studentId: students[6].id, testId: tests[5].id, points: 19 },  // Biology 
      { studentId: students[6].id, testId: tests[6].id, points: 36 }, // Computer Science

      // Maria Silva
      { studentId: students[7].id, testId: tests[0].id, points: 15 }, // Math 
      { studentId: students[7].id, testId: tests[1].id, points: 6 },  // English
      { studentId: students[7].id, testId: tests[2].id, points: 10 }, // History 
      { studentId: students[7].id, testId: tests[3].id, points: 21 }, // Science
      { studentId: students[7].id, testId: tests[4].id, points: 11 }, // Geography
      { studentId: students[7].id, testId: tests[5].id, points: 24 }, // Biology
      { studentId: students[7].id, testId: tests[6].id, points: 10 }, // Computer Science
      { studentId: students[7].id, testId: tests[7].id, points: 47 }, // Art
      { studentId: students[7].id, testId: tests[8].id, points: 40 }, // Music
      { studentId: students[7].id, testId: tests[9].id, points: 42 }, // Chemistry
    ];

    await db.students.bulkAdd(students);
    await db.tests.bulkAdd(tests);
    await db.grades.bulkAdd(grades);
  });
}

export async function exportToJson() {
  const blob = await exportDB(db, { prettyJson: true });
  const json = await blob.text();
  return json;
}

export async function importFromJson(json: string) {
  const blob = new Blob([json], { type: "application/json" });
  await db.transaction("rw", db.tables, async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });
  await importInto(db, blob);
}