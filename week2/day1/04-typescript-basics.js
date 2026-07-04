"use strict";
// TypeScript Basics
let username = "Aarav";
let age = 24;
let isEnrolled = true;
let skills = ["HTML", "CSS", "JavaScript"];
function add(a, b) {
    return a + b;
}
const student = {
    name: "Priya",
    track: "Backend",
    age: undefined,
};
function printStudent(s) {
    console.log(s.name, s.track);
}
printStudent(student);
const z = { x: 1, y: 2 };
// Generics
function identity(value) {
    return value;
}
const test = identity("test");
const number = identity(1);
function getFirst(items, arg) {
    return items[0];
}
const numberBox = { content: 42 };
const stringBox = { content: "hello" };
class Stack {
    items = [];
    push(item) {
        this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
}
const numberStack = new Stack();
numberStack.push(1);
numberStack.push(2);
const course = {
    instructor: "test",
    title: "test",
    weeks: 1,
};
const courseOmit = {
    title: "test",
    weeks: 1,
};
const rec = {
    rec1: course,
    rec2: course,
    rec3: course,
};
const draftCourse = { title: "JS Fundamentals" };
const lockedCourse = {
    title: "React",
    weeks: 3,
    instructor: "Robin",
};
const courseCatalog = {
    js: { title: "JS Fundamentals", weeks: 1, instructor: "Robin" },
};
