import { Exercise } from '../types';

export const ADDITIONAL_LANGUAGE_EXERCISES: Exercise[] = [
  // ==========================================
  // PYTHON (7 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-python-4',
    lessonId: 'python-2',
    courseId: 'python-beginners',
    title: 'Variables & f-String Formatting',
    titleHe: 'משתנים ועיצוב מחרוזות f-String',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Store the spider name `"Spidey"` in `hero` and `8` in `legs`, then print an f-string: `"Spidey weaves with 8 legs!"`.',
    taskDescriptionHe: 'שמור את השם `"Spidey"` במשתנה `hero` ואת המספר `8` במשתנה `legs`, והדפס בעזרת f-string את המשפט `"Spidey weaves with 8 legs!"`.',
    requirements: [
      { id: 'r1', text: 'Define hero = "Spidey" and legs = 8' },
      { id: 'r2', text: 'Use f-string prefix f"..." to interpolate variables' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר hero = "Spidey" ו-legs = 8' },
      { id: 'r2', text: 'השתמש בתחביר f"..." לשילוב המשתנים בהדפסה' },
    ],
    starterCode: `hero = "Spidey"\nlegs = 8\nprint(f"{hero} weaves with {legs} legs!")`,
    solutionCode: `hero = "Spidey"\nlegs = 8\nprint(f"{hero} weaves with {legs} legs!")`,
    codeTemplate: `hero = "Spidey"
legs = {{SLOT_0}}

{{SLOT_1}}(f"{hero} weaves with {legs} legs!")`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '8' },
      { id: 'SLOT_1', correctAnswer: 'print' },
    ],
    wordBank: ['8', 'print', 'echo', 'console.log', '"8"', 'printf', 'return'],
    expectedOutput: 'Spidey weaves with 8 legs!',
    hints: ['Use `print` in Python to output text to the console.'],
    hintsHe: ['השתמש בפונקציה `print` להדפסת פלט בפייתון.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-python-5',
    lessonId: 'python-14',
    courseId: 'python-beginners',
    title: 'For Loop with range()',
    titleHe: 'לולאת For ופונקציית range()',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Iterate 4 times using `for` and `range(4)` to print each web layer index.',
    taskDescriptionHe: 'רוץ בלולאת `for` 4 פעמים בעזרת `range(4)` והדפס את מספר שכבת הרשת.',
    requirements: [
      { id: 'r1', text: 'Use for layer in range(4):' },
      { id: 'r2', text: 'Print layer inside the loop' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-for layer in range(4):' },
      { id: 'r2', text: 'הדפס את המשתנה layer בגוף הלולאה' },
    ],
    starterCode: `for layer in range(4):\n    print(f"Web layer {layer}")`,
    solutionCode: `for layer in range(4):\n    print(f"Web layer {layer}")`,
    codeTemplate: `{{SLOT_0}} layer in {{SLOT_1}}(4):
    print(f"Web layer {layer}")`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'for' },
      { id: 'SLOT_1', correctAnswer: 'range' },
    ],
    wordBank: ['for', 'range', 'while', 'list', 'in', 'each', 'repeat'],
    expectedOutput: 'Web layer 0\nWeb layer 1\nWeb layer 2\nWeb layer 3',
    hints: ['`range(4)` generates numbers 0, 1, 2, 3.'],
    hintsHe: ['הפונקציה `range(4)` מייצרת את הרצף 0, 1, 2, 3.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-python-6',
    lessonId: 'python-14',
    courseId: 'python-beginners',
    title: 'Defining a Reusable Function',
    titleHe: 'הגדרת פונקציה והחזרת ערך (def / return)',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Define a function `calc_silk_strength(strands)` that returns `strands * 10`.',
    taskDescriptionHe: 'הגדר פונקציה בשם `calc_silk_strength(strands)` המחזירה את המכפלה `strands * 10`.',
    requirements: [
      { id: 'r1', text: 'Use def keyword to declare function' },
      { id: 'r2', text: 'Use return to send back strands * 10' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש במילת המפתח def להגדרת הפונקציה' },
      { id: 'r2', text: 'השתמש ב-return להחזרת התוצאה' },
    ],
    starterCode: `def calc_silk_strength(strands):\n    return strands * 10\n\nprint(calc_silk_strength(6))`,
    solutionCode: `def calc_silk_strength(strands):\n    return strands * 10\n\nprint(calc_silk_strength(6))`,
    codeTemplate: `{{SLOT_0}} calc_silk_strength(strands):
    {{SLOT_1}} strands * 10

print(calc_silk_strength(6))`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'def' },
      { id: 'SLOT_1', correctAnswer: 'return' },
    ],
    wordBank: ['def', 'return', 'function', 'func', 'yield', 'print', 'pass'],
    expectedOutput: '60',
    hints: ['Python functions start with `def` and output values with `return`.'],
    hintsHe: ['פונקציות בפייתון מוגדרות עם `def` ומחזירות ערך בעזרת `return`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-python-7',
    lessonId: 'python-14',
    courseId: 'python-beginners',
    title: 'List Comprehension Power',
    titleHe: 'בניית רשימה חכמה (List Comprehension)',
    language: 'python',
    difficulty: 'Intermediate',
    taskDescription: 'Create a list `squares` containing `n * n` for each number `n` in `[1, 2, 3, 4]`.',
    taskDescriptionHe: 'צור רשימה `squares` המכילה את הריבוע `n * n` עבור כל איבר ברשימה `[1, 2, 3, 4]`.',
    requirements: [
      { id: 'r1', text: 'Use [n * n for n in nums]' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש בתחביר [n * n for n in nums]' },
    ],
    starterCode: `nums = [1, 2, 3, 4]\nsquares = [n * n for n in nums]\nprint(squares)`,
    solutionCode: `nums = [1, 2, 3, 4]\nsquares = [n * n for n in nums]\nprint(squares)`,
    codeTemplate: `nums = [1, 2, 3, 4]
squares = [{{SLOT_0}} for n {{SLOT_1}} nums]
print(squares)`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'n * n' },
      { id: 'SLOT_1', correctAnswer: 'in' },
    ],
    wordBank: ['n * n', 'in', 'of', 'from', 'n + n', 'where', 'map'],
    expectedOutput: '[1, 4, 9, 16]',
    hints: ['List comprehension syntax is `[expression for item in iterable]`.'],
    hintsHe: ['תחביר List Comprehension בפייתון הוא `[expression for item in list]`.'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-python-8',
    lessonId: 'python-10',
    courseId: 'python-beginners',
    title: 'Dictionary Key-Value Lookup',
    titleHe: 'שליפת נתונים ממילון (Dictionary)',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Access the `"xp"` value safely from the `player` dictionary using `.get()` and print it.',
    taskDescriptionHe: 'שלוף בבטחה את הערך של `"xp"` מתוך המילון `player` בעזרת `.get()` והדפס אותו.',
    requirements: [
      { id: 'r1', text: 'Call player.get("xp", 0)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא למתודה player.get("xp", 0)' },
    ],
    starterCode: `player = {"name": "Spidey", "xp": 250}\nprint(player.get("xp", 0))`,
    solutionCode: `player = {"name": "Spidey", "xp": 250}\nprint(player.get("xp", 0))`,
    codeTemplate: `player = {"name": "Spidey", "xp": 250}
score = player.{{SLOT_0}}({{SLOT_1}}, 0)
print(score)`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'get' },
      { id: 'SLOT_1', correctAnswer: '"xp"' },
    ],
    wordBank: ['get', '"xp"', 'find', 'fetch', 'xp', 'value', 'keys'],
    expectedOutput: '250',
    hints: ['`.get(key, default)` prevents KeyError if the key is missing.'],
    hintsHe: ['המתודה `.get(key, default)` מונעת שגיאת KeyError אם המפתח אינו קיים.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-python-9',
    lessonId: 'python-10',
    courseId: 'python-beginners',
    title: 'String Slicing & Uppercase',
    titleHe: 'חיתוך מחרוזות (Slicing) והמרה לאותיות גדולות',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Slice the first 4 characters of `"codepath"` and convert them to uppercase.',
    taskDescriptionHe: 'חתוך את 4 התווים הראשונים של `"codepath"` והמר אותם לאותיות גדולות (UPPERCASE).',
    requirements: [
      { id: 'r1', text: 'Use word[:4].upper()' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-word[:4].upper()' },
    ],
    starterCode: `word = "codepath"\nprint(word[:4].upper())`,
    solutionCode: `word = "codepath"\nprint(word[:4].upper())`,
    codeTemplate: `word = "codepath"
prefix = word[{{SLOT_0}}].{{SLOT_1}}()
print(prefix)`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: ':4' },
      { id: 'SLOT_1', correctAnswer: 'upper' },
    ],
    wordBank: [':4', 'upper', 'toUpperCase', '0..4', 'capitalize', 'slice', '4:'],
    expectedOutput: 'CODE',
    hints: ['`[:4]` slices from index 0 up to (but not including) 4.'],
    hintsHe: ['החיתוך `[:4]` לוקח מתו 0 עד אינדקס 4 (לא כולל).'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-python-10',
    lessonId: 'python-15',
    courseId: 'python-beginners',
    title: 'Graceful Exception Handling (try / except)',
    titleHe: 'טיפול בשגיאות עם try ו-except',
    language: 'python',
    difficulty: 'Intermediate',
    taskDescription: 'Catch a `ZeroDivisionError` using `try` and `except` so the program does not crash.',
    taskDescriptionHe: 'תפוס שגיאת חלוקה באפס (`ZeroDivisionError`) באמצעות בלוק `try` ו-`except` כדי למנוע קריסה.',
    requirements: [
      { id: 'r1', text: 'Wrap risky division in try: block' },
      { id: 'r2', text: 'Catch ZeroDivisionError in except block' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'עטוף את החלוקה בבלוק try:' },
      { id: 'r2', text: 'תפוס את השגיאה באמצעות except ZeroDivisionError:' },
    ],
    starterCode: `try:\n    result = 100 // 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")`,
    solutionCode: `try:\n    result = 100 // 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")`,
    codeTemplate: `{{SLOT_0}}:
    result = 100 // 0
{{SLOT_1}} ZeroDivisionError:
    print("Cannot divide by zero!")`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'try' },
      { id: 'SLOT_1', correctAnswer: 'except' },
    ],
    wordBank: ['try', 'except', 'catch', 'finally', 'error', 'handle', 'raise'],
    expectedOutput: 'Cannot divide by zero!',
    hints: ['Python uses `try:` and `except:` (unlike JavaScript which uses `catch`).'],
    hintsHe: ['פייתון משתמשת ב-`try` וב-`except` לתפיסת חריגות.'],
    errorGuides: [],
    xpReward: 60,
  },

  // ==========================================
  // JAVASCRIPT (9 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-js-2',
    lessonId: 'js-1',
    courseId: 'javascript-beginners',
    title: 'Const Declarations & Template Literals',
    titleHe: 'הצהרת const ומחרוזות תבנית (Backticks)',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Declare a constant `spiderName = "Spidey"` and log `"Hello, Spidey!"` using template literals.',
    taskDescriptionHe: 'הצהר על קבוע `spiderName = "Spidey"` והדפס לקונסול `"Hello, Spidey!"` בעזרת `${...}`.',
    requirements: [
      { id: 'r1', text: 'Use const spiderName = "Spidey"' },
      { id: 'r2', text: 'Use ${spiderName} inside template literal' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר const spiderName = "Spidey"' },
      { id: 'r2', text: 'שלב את המשתנה עם ${spiderName}' },
    ],
    starterCode: `const spiderName = "Spidey";\nconsole.log(\`Hello, \${spiderName}!\`);`,
    solutionCode: `const spiderName = "Spidey";\nconsole.log(\`Hello, \${spiderName}!\`);`,
    codeTemplate: `{{SLOT_0}} spiderName = "Spidey";
console.log(\`Hello, {{SLOT_1}}!\`);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'const' },
      { id: 'SLOT_1', correctAnswer: '${spiderName}' },
    ],
    wordBank: ['const', '${spiderName}', 'def', '{spiderName}', '$spiderName', 'final', 'val'],
    expectedOutput: 'Hello, Spidey!',
    hints: ['Template literals in JS use `${variable}` inside backticks.'],
    hintsHe: ['מחרוזות תבנית ב-JS משתמשות ב-`${variable}` בתוך גרשיים הפוכים (Backticks).'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-js-3',
    lessonId: 'js-4',
    courseId: 'javascript-beginners',
    title: 'Array .map() Transformation',
    titleHe: 'המרת מערך באמצעות Array.map()',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Double every number in `prices` using `.map()` and an arrow function.',
    taskDescriptionHe: 'הכפל כל מספר במערך `prices` פי 2 באמצעות המתודה `.map()` ופונקציית חץ.',
    requirements: [
      { id: 'r1', text: 'Call prices.map(p => p * 2)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא ל-prices.map(p => p * 2)' },
    ],
    starterCode: `const prices = [10, 20, 30];\nconst doubled = prices.map(p => p * 2);\nconsole.log(doubled);`,
    solutionCode: `const prices = [10, 20, 30];\nconst doubled = prices.map(p => p * 2);\nconsole.log(doubled);`,
    codeTemplate: `const prices = [10, 20, 30];
const doubled = prices.{{SLOT_0}}(p => {{SLOT_1}});
console.log(doubled);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'map' },
      { id: 'SLOT_1', correctAnswer: 'p * 2' },
    ],
    wordBank: ['map', 'p * 2', 'filter', 'forEach', 'find', 'p + 2', 'reduce'],
    expectedOutput: '[ 20, 40, 60 ]',
    hints: ['`.map()` returns a new array of the same length with transformed items.'],
    hintsHe: ['המתודה `.map()` מחזירה מערך חדש באותו אורך לאחר הפעלת הפונקציה על כל איבר.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-js-4',
    lessonId: 'js-2',
    courseId: 'javascript-beginners',
    title: 'Object Destructuring',
    titleHe: 'פירוק אובייקטים (Object Destructuring)',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Extract `title` and `xp` directly from the `quest` object using destructuring.',
    taskDescriptionHe: 'חלץ את השדות `title` ו-`xp` ישירות מתוך האובייקט `quest` באמצעות תחביר פירוק.',
    requirements: [
      { id: 'r1', text: 'Use const { title, xp } = quest;' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-const { title, xp } = quest;' },
    ],
    starterCode: `const quest = { title: "Web Master", xp: 100 };\nconst { title, xp } = quest;\nconsole.log(title, xp);`,
    solutionCode: `const quest = { title: "Web Master", xp: 100 };\nconst { title, xp } = quest;\nconsole.log(title, xp);`,
    codeTemplate: `const quest = { title: "Web Master", xp: 100 };
const {{SLOT_0}} = {{SLOT_1}};
console.log(title, xp);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '{ title, xp }' },
      { id: 'SLOT_1', correctAnswer: 'quest' },
    ],
    wordBank: ['{ title, xp }', 'quest', '[ title, xp ]', '( title, xp )', 'this', 'Object'],
    expectedOutput: 'Web Master 100',
    hints: ['Object destructuring uses curly braces `{ key1, key2 } = obj`.'],
    hintsHe: ['פירוק אובייקטים מתבצע עם סוגריים מסולסלים `{ key1, key2 } = obj`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-js-5',
    lessonId: 'js-3',
    courseId: 'javascript-beginners',
    title: 'Async / Await API Fetch',
    titleHe: 'פונקציה אסינכרונית עם async ו-await',
    language: 'javascript',
    difficulty: 'Intermediate',
    taskDescription: 'Mark `loadProfile` as `async` and `await` the `fetchUser()` promise before logging.',
    taskDescriptionHe: 'הגדר את הפונקציה `loadProfile` כ-`async` והמתן לתוצאה בעזרת `await`.',
    requirements: [
      { id: 'r1', text: 'Use async function' },
      { id: 'r2', text: 'Use await fetchUser()' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר async function' },
      { id: 'r2', text: 'השתמש ב-await לפני הקריאה ל-fetchUser()' },
    ],
    starterCode: `async function loadProfile() {\n  const data = await fetchUser();\n  console.log(data.name);\n}`,
    solutionCode: `async function loadProfile() {\n  const data = await fetchUser();\n  console.log(data.name);\n}`,
    codeTemplate: `{{SLOT_0}} function loadProfile() {
  const data = {{SLOT_1}} fetchUser();
  console.log(data.name);
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'async' },
      { id: 'SLOT_1', correctAnswer: 'await' },
    ],
    wordBank: ['async', 'await', 'defer', 'yield', 'promise', 'then', 'sync'],
    expectedOutput: 'Spidey',
    hints: ['`await` can only be used inside an `async` function.'],
    hintsHe: ['ניתן להשתמש ב-`await` רק בתוך פונקציה שהוגדרה עם `async`.'],
    errorGuides: [],
    xpReward: 60,
  },
  {
    id: 'ex-js-6',
    lessonId: 'js-3',
    courseId: 'javascript-beginners',
    title: 'DOM Event Listener (addEventListener)',
    titleHe: 'האזנה לאירועי לחיצה ב-DOM',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Attach a `"click"` event listener to `btn` that logs `"Web shot!"`.',
    taskDescriptionHe: 'חבר מאזין לאירוע `"click"` על הכפתור `btn` המדפיס `"Web shot!"`.',
    requirements: [
      { id: 'r1', text: 'Call btn.addEventListener("click", ...)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא ל-btn.addEventListener("click", ...)' },
    ],
    starterCode: `const btn = document.querySelector("#web-btn");\nbtn.addEventListener("click", () => {\n  console.log("Web shot!");\n});`,
    solutionCode: `const btn = document.querySelector("#web-btn");\nbtn.addEventListener("click", () => {\n  console.log("Web shot!");\n});`,
    codeTemplate: `const btn = document.querySelector("#web-btn");
btn.{{SLOT_0}}({{SLOT_1}}, () => {
  console.log("Web shot!");
});`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'addEventListener' },
      { id: 'SLOT_1', correctAnswer: '"click"' },
    ],
    wordBank: ['addEventListener', '"click"', 'onClick', 'listen', '"hover"', 'attachEvent'],
    expectedOutput: 'Web shot!',
    hints: ['Standard DOM elements use `.addEventListener("click", callback)`.'],
    hintsHe: ['אלמנטי DOM משתמשים ב-`.addEventListener("click", callback)`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-js-7',
    lessonId: 'js-4',
    courseId: 'javascript-beginners',
    title: 'Spread Operator (...) for Arrays',
    titleHe: 'איחוד מערכים עם אופרטור Spread (...)',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Combine `coreSkills` and `newSkills` into a single array using the spread operator `...`.',
    taskDescriptionHe: 'אחד את המערכים `coreSkills` ו-`newSkills` למערך אחד באמצעות אופרטור הריסוס `...`.',
    requirements: [
      { id: 'r1', text: 'Use [...coreSkills, ...newSkills]' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-[...coreSkills, ...newSkills]' },
    ],
    starterCode: `const coreSkills = ["HTML", "CSS"];\nconst newSkills = ["JS", "React"];\nconst allSkills = [...coreSkills, ...newSkills];\nconsole.log(allSkills);`,
    solutionCode: `const coreSkills = ["HTML", "CSS"];\nconst newSkills = ["JS", "React"];\nconst allSkills = [...coreSkills, ...newSkills];\nconsole.log(allSkills);`,
    codeTemplate: `const coreSkills = ["HTML", "CSS"];
const newSkills = ["JS", "React"];
const allSkills = [{{SLOT_0}}, {{SLOT_1}}];
console.log(allSkills);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '...coreSkills' },
      { id: 'SLOT_1', correctAnswer: '...newSkills' },
    ],
    wordBank: ['...coreSkills', '...newSkills', 'coreSkills', '*coreSkills', '&newSkills', 'concat'],
    expectedOutput: '[ "HTML", "CSS", "JS", "React" ]',
    hints: ['Three dots `...` unpack all elements of an array into a new array literal.'],
    hintsHe: ['שלוש נקודות `...` פורסות את איברי המערך לתוך המערך החדש.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-js-8',
    lessonId: 'js-4',
    courseId: 'javascript-beginners',
    title: 'Accumulating Totals with .reduce()',
    titleHe: 'צבירת סכום מערך באמצעות .reduce()',
    language: 'javascript',
    difficulty: 'Intermediate',
    taskDescription: 'Sum all XP values in `points` starting from `0` using `.reduce()`.',
    taskDescriptionHe: 'סכום את כל ערכי ה-XP במערך `points` החל מ-`0` באמצעות `.reduce()`.',
    requirements: [
      { id: 'r1', text: 'Call points.reduce((acc, cur) => acc + cur, 0)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא ל-points.reduce((acc, cur) => acc + cur, 0)' },
    ],
    starterCode: `const points = [15, 25, 60];\nconst total = points.reduce((acc, cur) => acc + cur, 0);\nconsole.log(total);`,
    solutionCode: `const points = [15, 25, 60];\nconst total = points.reduce((acc, cur) => acc + cur, 0);\nconsole.log(total);`,
    codeTemplate: `const points = [15, 25, 60];
const total = points.{{SLOT_0}}((acc, cur) => {{SLOT_1}}, 0);
console.log(total);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'reduce' },
      { id: 'SLOT_1', correctAnswer: 'acc + cur' },
    ],
    wordBank: ['reduce', 'acc + cur', 'map', 'filter', 'sum', 'acc * cur', 'forEach'],
    expectedOutput: '100',
    hints: ['`.reduce((accumulator, current) => ..., initialValue)` folds an array into one value.'],
    hintsHe: ['המתודה `.reduce()` מצמצמת מערך שלם לערך יחיד באמצעות צובר (Accumulator).'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-js-9',
    lessonId: 'js-2',
    courseId: 'javascript-beginners',
    title: 'Ternary Operator Shorthand',
    titleHe: 'תנאי מקוצר (Ternary Operator)',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Assign `"Master"` if `xp >= 100`, otherwise `"Rookie"` using `?` and `:`.',
    taskDescriptionHe: 'הצב `"Master"` אם `xp >= 100`, אחרת `"Rookie"` באמצעות האופרטור הטרינארי `?` ו-`:`.',
    requirements: [
      { id: 'r1', text: 'Use condition ? trueVal : falseVal' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש בתחביר condition ? trueVal : falseVal' },
    ],
    starterCode: `const xp = 120;\nconst rank = xp >= 100 ? "Master" : "Rookie";\nconsole.log(rank);`,
    solutionCode: `const xp = 120;\nconst rank = xp >= 100 ? "Master" : "Rookie";\nconsole.log(rank);`,
    codeTemplate: `const xp = 120;
const rank = xp >= 100 {{SLOT_0}} "Master" {{SLOT_1}} "Rookie";
console.log(rank);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '?' },
      { id: 'SLOT_1', correctAnswer: ':' },
    ],
    wordBank: ['?', ':', 'then', 'else', '??', '&&', '||'],
    expectedOutput: 'Master',
    hints: ['The ternary operator takes 3 parts: `condition ? ifTrue : ifFalse`.'],
    hintsHe: ['האופרטור הטרינארי בנוי משלושה חלקים: `תנאי ? אם_אמת : אם_שקר`.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-js-10',
    lessonId: 'js-3',
    courseId: 'javascript-beginners',
    title: 'Nullish Coalescing & Optional Chaining',
    titleHe: 'גישה בטוחה לשדות (?. ו-??)',
    language: 'javascript',
    difficulty: 'Intermediate',
    taskDescription: 'Safely read `user.settings?.theme` and default to `"light"` using `??`.',
    taskDescriptionHe: 'קרא בבטחה את `user.settings?.theme` והגדר ברירת מחדל `"light"` באמצעות `??`.',
    requirements: [
      { id: 'r1', text: 'Use ?. for optional chaining and ?? for fallback' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-?. לגישה בטוחה וב-?? לערך ברירת מחדל' },
    ],
    starterCode: `const user = { name: "Spidey" };\nconst theme = user.settings?.theme ?? "light";\nconsole.log(theme);`,
    solutionCode: `const user = { name: "Spidey" };\nconst theme = user.settings?.theme ?? "light";\nconsole.log(theme);`,
    codeTemplate: `const user = { name: "Spidey" };
const theme = user.settings{{SLOT_0}}theme {{SLOT_1}} "light";
console.log(theme);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '?.' },
      { id: 'SLOT_1', correctAnswer: '??' },
    ],
    wordBank: ['?.', '??', '.', '::', '&&', '!=', '?:'],
    expectedOutput: 'light',
    hints: ['`?.` stops evaluation if the reference is undefined; `??` provides a fallback for null/undefined.'],
    hintsHe: ['האופרטור `?.` מונע קריסה כששדה חסר, ו-`??` מספק ברירת מחדל עבור null או undefined.'],
    errorGuides: [],
    xpReward: 55,
  },

  // ==========================================
  // SQL & DATABASES (9 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-sql-2',
    lessonId: 'sql-1',
    courseId: 'sql-fundamentals',
    title: 'Sorting & Limiting Results (ORDER BY / LIMIT)',
    titleHe: 'מיון והגבלת תוצאות (ORDER BY ו-LIMIT)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Fetch the top 5 highest-scoring players from `leaderboard` ordered by `xp` descending.',
    taskDescriptionHe: 'שלוף את 5 השחקנים המובילים מטבלת `leaderboard` ממוינים לפי `xp` בסדר יורד.',
    requirements: [
      { id: 'r1', text: 'Use ORDER BY xp DESC' },
      { id: 'r2', text: 'Use LIMIT 5' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-ORDER BY xp DESC' },
      { id: 'r2', text: 'הגבל ל-5 שורות עם LIMIT 5' },
    ],
    starterCode: `SELECT name, xp FROM leaderboard\nORDER BY xp DESC\nLIMIT 5;`,
    solutionCode: `SELECT name, xp FROM leaderboard\nORDER BY xp DESC\nLIMIT 5;`,
    codeTemplate: `SELECT name, xp FROM leaderboard
{{SLOT_0}} xp DESC
{{SLOT_1}} 5;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'ORDER BY' },
      { id: 'SLOT_1', correctAnswer: 'LIMIT' },
    ],
    wordBank: ['ORDER BY', 'LIMIT', 'SORT BY', 'TOP', 'GROUP BY', 'WHERE', 'MAX'],
    expectedOutput: '5 top rows returned',
    hints: ['Use `ORDER BY column DESC` followed by `LIMIT count`.'],
    hintsHe: ['השתמש ב-`ORDER BY column DESC` למיון יורד וב-`LIMIT` להגבלת כמות השורות.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-sql-3',
    lessonId: 'sql-3',
    courseId: 'sql-fundamentals',
    title: 'Counting Rows by Category (COUNT & GROUP BY)',
    titleHe: 'ספירה וקיבוץ לפי קטגוריה (COUNT ו-GROUP BY)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Count how many exercises exist per `language` in the `exercises` table.',
    taskDescriptionHe: 'ספור כמה תרגילים קיימים לכל שפה (`language`) בטבלת `exercises`.',
    requirements: [
      { id: 'r1', text: 'Use COUNT(*) and GROUP BY language' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-COUNT(*) וב-GROUP BY language' },
    ],
    starterCode: `SELECT language, COUNT(*) AS total\nFROM exercises\nGROUP BY language;`,
    solutionCode: `SELECT language, COUNT(*) AS total\nFROM exercises\nGROUP BY language;`,
    codeTemplate: `SELECT language, {{SLOT_0}} AS total
FROM exercises
{{SLOT_1}} language;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'COUNT(*)' },
      { id: 'SLOT_1', correctAnswer: 'GROUP BY' },
    ],
    wordBank: ['COUNT(*)', 'GROUP BY', 'SUM(*)', 'ORDER BY', 'PARTITION BY', 'HAVING'],
    expectedOutput: '6 grouped rows returned',
    hints: ['Aggregate functions like `COUNT(*)` pair with `GROUP BY`.'],
    hintsHe: ['פונקציות צבירה כמו `COUNT(*)` דורשות `GROUP BY` על העמודה שלפיה מקבצים.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-sql-4',
    lessonId: 'sql-3',
    courseId: 'sql-fundamentals',
    title: 'Joining Two Tables (INNER JOIN)',
    titleHe: 'איחוד טבלאות באמצעות INNER JOIN',
    language: 'sql',
    difficulty: 'Intermediate',
    taskDescription: 'Join `users` and `badges` where `users.id = badges.user_id`.',
    taskDescriptionHe: 'חבר בין טבלת `users` לטבלת `badges` לפי התאמת מפתח `users.id = badges.user_id`.',
    requirements: [
      { id: 'r1', text: 'Use INNER JOIN badges ON users.id = badges.user_id' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-INNER JOIN badges ON users.id = badges.user_id' },
    ],
    starterCode: `SELECT users.name, badges.title\nFROM users\nINNER JOIN badges ON users.id = badges.user_id;`,
    solutionCode: `SELECT users.name, badges.title\nFROM users\nINNER JOIN badges ON users.id = badges.user_id;`,
    codeTemplate: `SELECT users.name, badges.title
FROM users
{{SLOT_0}} badges {{SLOT_1}} users.id = badges.user_id;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'INNER JOIN' },
      { id: 'SLOT_1', correctAnswer: 'ON' },
    ],
    wordBank: ['INNER JOIN', 'ON', 'MERGE', 'WHERE', 'WITH', 'USING', 'UNION'],
    expectedOutput: 'Joined user badge rows returned',
    hints: ['`INNER JOIN table ON condition` links related rows across tables.'],
    hintsHe: ['`INNER JOIN` מחבר שורות משתי טבלאות כאשר התנאי שאחרי `ON` מתקיים.'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-sql-5',
    lessonId: 'sql-1',
    courseId: 'sql-fundamentals',
    title: 'Inserting a New Record (INSERT INTO)',
    titleHe: 'הוספת רשומה חדשה לטבלה (INSERT INTO)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Insert a new course `"Spider Web 101"` with `10` lessons into the `courses` table.',
    taskDescriptionHe: 'הוסף קורס חדש בשם `"Spider Web 101"` עם `10` שיעורים לטבלת `courses`.',
    requirements: [
      { id: 'r1', text: 'Use INSERT INTO courses (...) VALUES (...)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-INSERT INTO courses (...) VALUES (...)' },
    ],
    starterCode: `INSERT INTO courses (title, lessons)\nVALUES ('Spider Web 101', 10);`,
    solutionCode: `INSERT INTO courses (title, lessons)\nVALUES ('Spider Web 101', 10);`,
    codeTemplate: `{{SLOT_0}} courses (title, lessons)
{{SLOT_1}} ('Spider Web 101', 10);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'INSERT INTO' },
      { id: 'SLOT_1', correctAnswer: 'VALUES' },
    ],
    wordBank: ['INSERT INTO', 'VALUES', 'ADD TO', 'SET', 'UPDATE', 'CREATE', 'INTO'],
    expectedOutput: '1 row inserted',
    hints: ['`INSERT INTO table (cols) VALUES (vals);` adds a new row.'],
    hintsHe: ['הפקודה `INSERT INTO` יחד עם `VALUES` מוסיפה שורה חדשה לטבלה.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-sql-6',
    lessonId: 'sql-2',
    courseId: 'sql-fundamentals',
    title: 'Updating Existing Rows (UPDATE / SET)',
    titleHe: 'עדכון נתונים קיימים בטבלה (UPDATE / SET)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Update the `xp` column to `500` for user `"Spidey"` in the `users` table.',
    taskDescriptionHe: 'עדכן את עמודת `xp` לערך `500` עבור המשתמש `"Spidey"` בטבלת `users`.',
    requirements: [
      { id: 'r1', text: 'Use UPDATE users SET xp = 500 WHERE name = \'Spidey\'' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-UPDATE users SET xp = 500 WHERE name = \'Spidey\'' },
    ],
    starterCode: `UPDATE users\nSET xp = 500\nWHERE name = 'Spidey';`,
    solutionCode: `UPDATE users\nSET xp = 500\nWHERE name = 'Spidey';`,
    codeTemplate: `{{SLOT_0}} users
{{SLOT_1}} xp = 500
WHERE name = 'Spidey';`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'UPDATE' },
      { id: 'SLOT_1', correctAnswer: 'SET' },
    ],
    wordBank: ['UPDATE', 'SET', 'MODIFY', 'CHANGE', 'VALUES', 'WHERE', 'INSERT'],
    expectedOutput: '1 row updated',
    hints: ['Always pair `UPDATE table SET col = val` with a `WHERE` clause!'],
    hintsHe: ['השתמש ב-`UPDATE` יחד עם `SET` ותמיד זכור להוסיף `WHERE` כדי לא לדרוס את כל הטבלה!'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-sql-7',
    lessonId: 'sql-2',
    courseId: 'sql-fundamentals',
    title: 'Pattern Matching with LIKE',
    titleHe: 'חיפוש תבניות טקסט באמצעות LIKE',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Find all lessons whose `title` starts with `"Python"` using the `LIKE` operator and `%` wildcard.',
    taskDescriptionHe: 'מצא את כל השיעורים שהכותרת שלהם מתחילה במילה `"Python"` באמצעות `LIKE` והתו הכללי `%`.',
    requirements: [
      { id: 'r1', text: 'Use WHERE title LIKE \'Python%\'' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-WHERE title LIKE \'Python%\'' },
    ],
    starterCode: `SELECT * FROM lessons\nWHERE title LIKE 'Python%';`,
    solutionCode: `SELECT * FROM lessons\nWHERE title LIKE 'Python%';`,
    codeTemplate: `SELECT * FROM lessons
WHERE title {{SLOT_0}} {{SLOT_1}};`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'LIKE' },
      { id: 'SLOT_1', correctAnswer: "'Python%'" },
    ],
    wordBank: ['LIKE', "'Python%'", 'MATCHES', 'CONTAINS', "'*Python'", 'IN', '='],
    expectedOutput: '15 matching lessons returned',
    hints: ['In SQL, `%` matches any sequence of zero or more characters.'],
    hintsHe: ['ב-SQL התו `%` מייצג כל רצף תווים שהוא בבדיקת `LIKE`.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-sql-8',
    lessonId: 'sql-3',
    courseId: 'sql-fundamentals',
    title: 'Filtering Groups with HAVING',
    titleHe: 'סינון קבוצות לאחר קיבוץ (HAVING)',
    language: 'sql',
    difficulty: 'Intermediate',
    taskDescription: 'Select `course_id` and student count from `enrollments`, keeping only courses with more than 50 students.',
    taskDescriptionHe: 'שלוף קורסים מטבלת `enrollments` שבהם כמות הנרשמים (`COUNT(*)`) גדולה מ-50 באמצעות `HAVING`.',
    requirements: [
      { id: 'r1', text: 'Use GROUP BY course_id HAVING COUNT(*) > 50' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-GROUP BY course_id HAVING COUNT(*) > 50' },
    ],
    starterCode: `SELECT course_id, COUNT(*) AS students\nFROM enrollments\nGROUP BY course_id\nHAVING COUNT(*) > 50;`,
    solutionCode: `SELECT course_id, COUNT(*) AS students\nFROM enrollments\nGROUP BY course_id\nHAVING COUNT(*) > 50;`,
    codeTemplate: `SELECT course_id, COUNT(*) AS students
FROM enrollments
GROUP BY course_id
{{SLOT_0}} {{SLOT_1}} > 50;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'HAVING' },
      { id: 'SLOT_1', correctAnswer: 'COUNT(*)' },
    ],
    wordBank: ['HAVING', 'COUNT(*)', 'WHERE', 'FILTER', 'SUM(*)', 'LIMIT', 'ORDER BY'],
    expectedOutput: '3 popular courses returned',
    hints: ['`WHERE` filters rows before grouping; `HAVING` filters groups after `GROUP BY`.'],
    hintsHe: ['`WHERE` מסנן שורות בודדות לפני הקיבוץ, ואילו `HAVING` מסנן קבוצות לאחר `GROUP BY`.'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-sql-9',
    lessonId: 'sql-1',
    courseId: 'sql-fundamentals',
    title: 'Unique Values with SELECT DISTINCT',
    titleHe: 'שליפת ערכים ייחודיים ללא כפילויות (DISTINCT)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Query all unique `country` values from the `learners` table without duplicates.',
    taskDescriptionHe: 'שלוף את רשימת המדינות (`country`) הייחודיות מטבלת `learners` ללא כפילויות.',
    requirements: [
      { id: 'r1', text: 'Use SELECT DISTINCT country FROM learners;' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-SELECT DISTINCT country FROM learners;' },
    ],
    starterCode: `SELECT DISTINCT country\nFROM learners;`,
    solutionCode: `SELECT DISTINCT country\nFROM learners;`,
    codeTemplate: `SELECT {{SLOT_0}} country
{{SLOT_1}} learners;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'DISTINCT' },
      { id: 'SLOT_1', correctAnswer: 'FROM' },
    ],
    wordBank: ['DISTINCT', 'FROM', 'UNIQUE', 'ONLY', 'IN', 'WHERE', 'GROUP'],
    expectedOutput: '12 unique countries returned',
    hints: ['`SELECT DISTINCT` removes duplicate values from the result set.'],
    hintsHe: ['המילה `DISTINCT` מסירה ערכים כפולים מתוצאות השאילתה.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-sql-10',
    lessonId: 'sql-2',
    courseId: 'sql-fundamentals',
    title: 'Safe Row Deletion (DELETE FROM)',
    titleHe: 'מחיקת רשומות מבוקרת (DELETE FROM)',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Delete expired session tokens from `sessions` where `expired = true`.',
    taskDescriptionHe: 'מחק סשנים שפג תוקפם מטבלת `sessions` שבהם `expired = true`.',
    requirements: [
      { id: 'r1', text: 'Use DELETE FROM sessions WHERE expired = true;' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-DELETE FROM sessions WHERE expired = true;' },
    ],
    starterCode: `DELETE FROM sessions\nWHERE expired = true;`,
    solutionCode: `DELETE FROM sessions\nWHERE expired = true;`,
    codeTemplate: `{{SLOT_0}} sessions
{{SLOT_1}} expired = true;`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'DELETE FROM' },
      { id: 'SLOT_1', correctAnswer: 'WHERE' },
    ],
    wordBank: ['DELETE FROM', 'WHERE', 'REMOVE FROM', 'DROP', 'TRUNCATE', 'HAVING'],
    expectedOutput: '4 expired rows deleted',
    hints: ['Use `DELETE FROM table WHERE condition` to remove specific rows safely.'],
    hintsHe: ['השתמש ב-`DELETE FROM` בליווי תנאי `WHERE` למחיקה בטוחה של שורות ספציפיות.'],
    errorGuides: [],
    xpReward: 50,
  },

  // ==========================================
  // WEB DEVELOPMENT: HTML & CSS (9 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-web-2',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Responsive 3-Column CSS Grid',
    titleHe: 'פריסת רשת 3 עמודות עם CSS Grid',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Turn `.cards-grid` into a 3-column grid layout with a `16px` gap.',
    taskDescriptionHe: 'הגדר את `.cards-grid` כרשת CSS Grid בת 3 עמודות שוות עם מרווח `16px`.',
    requirements: [
      { id: 'r1', text: 'Set display: grid and grid-template-columns: repeat(3, 1fr)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר display: grid ו-grid-template-columns: repeat(3, 1fr)' },
    ],
    starterCode: `.cards-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
    solutionCode: `.cards-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
    codeTemplate: `.cards-grid {
  display: {{SLOT_0}};
  grid-template-columns: {{SLOT_1}};
  gap: 16px;
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'grid' },
      { id: 'SLOT_1', correctAnswer: 'repeat(3, 1fr)' },
    ],
    wordBank: ['grid', 'repeat(3, 1fr)', 'flex', 'block', '3 cols', 'inline-grid', 'auto'],
    expectedOutput: '3-column responsive grid rendered',
    hints: ['`repeat(3, 1fr)` creates three equal fractional columns.'],
    hintsHe: ['הביטוי `repeat(3, 1fr)` יוצר 3 עמודות ברוחב שווה.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-web-3',
    lessonId: 'html-1',
    courseId: 'html-css-essentials',
    title: 'Semantic HTML5 Navigation Header',
    titleHe: 'מבנה HTML5 סמנטי לתפריט ניווט (<header> ו-<nav>)',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Wrap the navigation links inside semantic `<header>` and `<nav>` landmarks.',
    taskDescriptionHe: 'עטוף את קישורי הניווט בתגיות הסמנטיות `<header>` ו-`<nav>`.',
    requirements: [
      { id: 'r1', text: 'Use <header> and <nav> semantic tags' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש בתגיות הסמנטיות <header> ו-<nav>' },
    ],
    starterCode: `<header>\n  <nav>\n    <a href="#home">Home</a>\n  </nav>\n</header>`,
    solutionCode: `<header>\n  <nav>\n    <a href="#home">Home</a>\n  </nav>\n</header>`,
    codeTemplate: `<{{SLOT_0}}>
  <{{SLOT_1}}>
    <a href="#home">Home</a>
  </nav>
</header>`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'header' },
      { id: 'SLOT_1', correctAnswer: 'nav' },
    ],
    wordBank: ['header', 'nav', 'div', 'span', 'top', 'menu', 'section'],
    expectedOutput: 'Semantic landmarks mounted',
    hints: ['Screen readers rely on `<header>` and `<nav>` to navigate pages.'],
    hintsHe: ['תגיות `<header>` ו-`<nav>` משפרות נגישות ו-SEO משמעותית לעומת `<div>` רגיל.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-web-4',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Mobile Media Query Breakpoint',
    titleHe: 'התאמה למובייל באמצעות @media query',
    language: 'web',
    difficulty: 'Intermediate',
    taskDescription: 'Stack `.sidebar` vertically when viewport width is `768px` or smaller.',
    taskDescriptionHe: 'התאם את `.sidebar` למובייל כאשר רוחב המסך הוא עד `768px` באמצעות `@media`.',
    requirements: [
      { id: 'r1', text: 'Use @media (max-width: 768px)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-@media (max-width: 768px)' },
    ],
    starterCode: `@media (max-width: 768px) {\n  .layout {\n    flex-direction: column;\n  }\n}`,
    solutionCode: `@media (max-width: 768px) {\n  .layout {\n    flex-direction: column;\n  }\n}`,
    codeTemplate: `{{SLOT_0}} ({{SLOT_1}}: 768px) {
  .layout {
    flex-direction: column;
  }
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '@media' },
      { id: 'SLOT_1', correctAnswer: 'max-width' },
    ],
    wordBank: ['@media', 'max-width', '@screen', 'device-width', '@responsive', 'width'],
    expectedOutput: 'Mobile layout active <= 768px',
    hints: ['`@media (max-width: 768px)` applies styles on screens up to 768px wide.'],
    hintsHe: ['הכלל `@media (max-width: 768px)` מפעיל עיצוב ייעודי למסכים ברוחב 768 פיקסלים ומטה.'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-web-5',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Smooth Hover Transition & Scale',
    titleHe: 'אנימציית ריחוף חלקה (transition ו-transform)',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Scale `.cose-btn` up slightly on `:hover` with a smooth `0.2s` transition.',
    taskDescriptionHe: 'הגדל מעט את הכפתור בעת ריחוף (`:hover`) באמצעות `transform: scale(1.05)` ומעבר חלק.',
    requirements: [
      { id: 'r1', text: 'Use transition and transform: scale(1.05)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-transition וב-transform: scale(1.05)' },
    ],
    starterCode: `.cose-btn {\n  transition: transform 0.2s ease;\n}\n.cose-btn:hover {\n  transform: scale(1.05);\n}`,
    solutionCode: `.cose-btn {\n  transition: transform 0.2s ease;\n}\n.cose-btn:hover {\n  transform: scale(1.05);\n}`,
    codeTemplate: `.cose-btn {
  {{SLOT_0}}: transform 0.2s ease;
}
.cose-btn:hover {
  transform: {{SLOT_1}};
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'transition' },
      { id: 'SLOT_1', correctAnswer: 'scale(1.05)' },
    ],
    wordBank: ['transition', 'scale(1.05)', 'animation', 'zoom(1.05)', 'grow', 'rotate'],
    expectedOutput: 'Smooth button hover animation ready',
    hints: ['`transform: scale(1.05)` enlarges the element by 5% without shifting layout.'],
    hintsHe: ['`transform: scale(1.05)` מגדיל את האלמנט ב-5% בצורה חלקה מבלי להזיז אלמנטים שכנים.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-web-6',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'CSS Custom Properties (Variables)',
    titleHe: 'משתני CSS מותאמים אישית (--var)',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Define `--spidey-green: #58CC02` in `:root` and use it via `var(--spidey-green)`.',
    taskDescriptionHe: 'הגדר משתנה `--spidey-green: #58CC02` ב-`:root` והשתמש בו באמצעות `var(...)`.',
    requirements: [
      { id: 'r1', text: 'Define --spidey-green and apply var(--spidey-green)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר --spidey-green והשתמש בפונקציה var(--spidey-green)' },
    ],
    starterCode: `:root {\n  --spidey-green: #58CC02;\n}\n.badge {\n  background: var(--spidey-green);\n}`,
    solutionCode: `:root {\n  --spidey-green: #58CC02;\n}\n.badge {\n  background: var(--spidey-green);\n}`,
    codeTemplate: `:root {
  {{SLOT_0}}: #58CC02;
}
.badge {
  background: {{SLOT_1}};
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '--spidey-green' },
      { id: 'SLOT_1', correctAnswer: 'var(--spidey-green)' },
    ],
    wordBank: ['--spidey-green', 'var(--spidey-green)', '$spidey-green', '@spidey-green', 'env(--spidey-green)'],
    expectedOutput: 'Custom CSS variable applied',
    hints: ['CSS variables start with `--` and are read with `var(--name)`.'],
    hintsHe: ['משתני CSS מתחילים במקף כפול `--` ונקראים באמצעות `var(--name)`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-web-7',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Navbar Space-Between Alignment',
    titleHe: 'פיזור אלמנטים לקצוות עם space-between',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Push the logo and profile menu to opposite ends of `.navbar` using Flexbox.',
    taskDescriptionHe: 'רווח את הלוגו והתפריט לקצוות המנוגדים של `.navbar` באמצעות `justify-content: space-between`.',
    requirements: [
      { id: 'r1', text: 'Use justify-content: space-between' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'השתמש ב-justify-content: space-between' },
    ],
    starterCode: `.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
    solutionCode: `.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
    codeTemplate: `.navbar {
  display: flex;
  {{SLOT_0}}: {{SLOT_1}};
  align-items: center;
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'justify-content' },
      { id: 'SLOT_1', correctAnswer: 'space-between' },
    ],
    wordBank: ['justify-content', 'space-between', 'align-items', 'space-around', 'center', 'float'],
    expectedOutput: 'Navbar items spaced evenly to edges',
    hints: ['`justify-content: space-between` places maximum space between flex children.'],
    hintsHe: ['`justify-content: space-between` מצמיד את האלמנט הראשון והאחרון לקצוות ומפזר רווח שווה ביניהם.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-web-8',
    lessonId: 'html-1',
    courseId: 'html-css-essentials',
    title: 'Accessible Form Input & Label',
    titleHe: 'שדה טופס נגיש עם <label> ו-required',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Link `<label for="email">` to `<input id="email" type="email" required>`.',
    taskDescriptionHe: 'קשר בין תגית ה-`<label>` לבין שדה ה-`<input>` באמצעות `for` ו-`id`, והגדר את השדה כחובה (`required`).',
    requirements: [
      { id: 'r1', text: 'Match label for="email" with input id="email" and required' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'התאם את for="email" ל-id="email" והוסף required' },
    ],
    starterCode: `<label for="email">Email</label>\n<input id="email" type="email" required />`,
    solutionCode: `<label for="email">Email</label>\n<input id="email" type="email" required />`,
    codeTemplate: `<label {{SLOT_0}}="email">Email</label>
<input id="email" type="email" {{SLOT_1}} />`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'for' },
      { id: 'SLOT_1', correctAnswer: 'required' },
    ],
    wordBank: ['for', 'required', 'target', 'mandatory', 'bind', 'validate'],
    expectedOutput: 'Accessible required email input rendered',
    hints: ['The `for` attribute on `<label>` must match the `id` of the `<input>`.'],
    hintsHe: ['המאפיין `for` בתגית `<label>` חייב להתאים למאפיין `id` של שדה הקלט.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-web-9',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Sticky Sidebar Positioning',
    titleHe: 'הצמדת סרגל צד בגלילה (position: sticky)',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Keep `.sidebar` pinned to the top of the viewport during vertical scroll using `position: sticky`.',
    taskDescriptionHe: 'השאר את `.sidebar` מוצמד לראש המסך בזמן גלילה באמצעות `position: sticky` ו-`top: 0`.',
    requirements: [
      { id: 'r1', text: 'Set position: sticky and top: 0' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר position: sticky ו-top: 0' },
    ],
    starterCode: `.sidebar {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n}`,
    solutionCode: `.sidebar {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n}`,
    codeTemplate: `.sidebar {
  position: {{SLOT_0}};
  {{SLOT_1}}: 0;
  height: 100vh;
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'sticky' },
      { id: 'SLOT_1', correctAnswer: 'top' },
    ],
    wordBank: ['sticky', 'top', 'static', 'relative', 'float', 'margin-top'],
    expectedOutput: 'Sticky sidebar pinned at top: 0',
    hints: ['`position: sticky` requires a threshold offset such as `top: 0`.'],
    hintsHe: ['`position: sticky` דורש הגדרת סף הצמדה כגון `top: 0`.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-web-10',
    lessonId: 'html-2',
    courseId: 'html-css-essentials',
    title: 'Predictable Box Sizing (border-box)',
    titleHe: 'חישוב רוחב מדויק עם box-sizing: border-box',
    language: 'web',
    difficulty: 'Beginner',
    taskDescription: 'Ensure padding and borders are included inside element widths using `box-sizing: border-box`.',
    taskDescriptionHe: 'ודא שהשוליים הפנימיים (padding) והמסגרת (border) נכללים ברוחב האלמנט בעזרת `box-sizing: border-box`.',
    requirements: [
      { id: 'r1', text: 'Apply box-sizing: border-box to all elements' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר box-sizing: border-box' },
    ],
    starterCode: `* {\n  box-sizing: border-box;\n  margin: 0;\n}`,
    solutionCode: `* {\n  box-sizing: border-box;\n  margin: 0;\n}`,
    codeTemplate: `* {
  {{SLOT_0}}: {{SLOT_1}};
  margin: 0;
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'box-sizing' },
      { id: 'SLOT_1', correctAnswer: 'border-box' },
    ],
    wordBank: ['box-sizing', 'border-box', 'content-box', 'box-model', 'inner-box', 'width-mode'],
    expectedOutput: 'Universal border-box reset applied',
    hints: ['`border-box` prevents padding from unexpectedly expanding element width.'],
    hintsHe: ['`border-box` מונע מ-padding להגדיל את הרוחב החיצוני של הקופסה מעבר ל-100%.'],
    errorGuides: [],
    xpReward: 45,
  },

  // ==========================================
  // GIT & VERSION CONTROL (9 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-git-2',
    lessonId: 'git-1',
    courseId: 'git-fundamentals',
    title: 'Initialize Repo & Check Status',
    titleHe: 'אתחול מאגר ובדיקת מצב (git init / status)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Initialize a new Git repository in the current folder and inspect modified files.',
    taskDescriptionHe: 'אתחל מאגר Git חדש בתיקייה הנוכחית ובדוק את סטטוס הקבצים.',
    requirements: [
      { id: 'r1', text: 'Run git init and git status' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git init ולאחר מכן git status' },
    ],
    starterCode: `git init\ngit status`,
    solutionCode: `git init\ngit status`,
    codeTemplate: `# 1. Initialize new repository
git {{SLOT_0}}

# 2. Check working tree status
git {{SLOT_1}}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'init' },
      { id: 'SLOT_1', correctAnswer: 'status' },
    ],
    wordBank: ['init', 'status', 'start', 'create', 'check', 'info', 'new'],
    expectedOutput: 'Initialized empty Git repository in .git/',
    hints: ['`git init` creates a new repo; `git status` shows untracked and modified files.'],
    hintsHe: ['`git init` יוצר מאגר חדש, ו-`git status` מציג אילו קבצים השתנו.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-git-3',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Create & Switch to a Feature Branch',
    titleHe: 'יצירה ומעבר לענף פיתוח חדש (git switch -c)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Create and immediately switch to a new branch named `feat/spidey-ui`.',
    taskDescriptionHe: 'צור ועבור מיד לענף חדש בשם `feat/spidey-ui` באמצעות `git switch -c`.',
    requirements: [
      { id: 'r1', text: 'Run git switch -c feat/spidey-ui' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git switch -c feat/spidey-ui' },
    ],
    starterCode: `git switch -c feat/spidey-ui`,
    solutionCode: `git switch -c feat/spidey-ui`,
    codeTemplate: `git {{SLOT_0}} {{SLOT_1}} feat/spidey-ui`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'switch' },
      { id: 'SLOT_1', correctAnswer: '-c' },
    ],
    wordBank: ['switch', '-c', 'branch', '-m', 'merge', 'new', 'push'],
    expectedOutput: "Switched to a new branch 'feat/spidey-ui'",
    hints: ['`git switch -c <branch>` creates and checks out the branch in one step.'],
    hintsHe: ['הפקודה `git switch -c` יוצרת ענף חדש ועוברת אליו בפקודה אחת.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-git-4',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Merging a Feature Branch into Main',
    titleHe: 'מיזוג ענף פיתוח לתוך main (git merge)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Switch back to `main` and merge the completed `feat/spidey-ui` branch.',
    taskDescriptionHe: 'חזור לענף `main` ומזג לתוכו את הענף `feat/spidey-ui`.',
    requirements: [
      { id: 'r1', text: 'Switch to main and run git merge feat/spidey-ui' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'עבור ל-main והרץ git merge feat/spidey-ui' },
    ],
    starterCode: `git switch main\ngit merge feat/spidey-ui`,
    solutionCode: `git switch main\ngit merge feat/spidey-ui`,
    codeTemplate: `git switch {{SLOT_0}}
git {{SLOT_1}} feat/spidey-ui`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'main' },
      { id: 'SLOT_1', correctAnswer: 'merge' },
    ],
    wordBank: ['main', 'merge', 'join', 'combine', 'rebase', 'commit', 'origin'],
    expectedOutput: 'Fast-forward: 3 files changed, 84 insertions(+)',
    hints: ['First switch to the target branch (`main`), then run `git merge <source-branch>`.'],
    hintsHe: ['תחילה עוברים לענף היעד (`main`), ואז מריצים `git merge` עם שם הענף למיזוג.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-git-5',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Pulling & Pushing Remote Changes',
    titleHe: 'משיכה ודחיפת קוד לשרת המרוחק (pull / push)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Pull the latest changes from `origin main`, then push your local commits.',
    taskDescriptionHe: 'משוך את השינויים האחרונים מ-`origin main` ולאחר מכן דחוף את הקומיטים המקומיים שלך.',
    requirements: [
      { id: 'r1', text: 'Run git pull origin main and git push origin main' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git pull origin main ולאחר מכן git push origin main' },
    ],
    starterCode: `git pull origin main\ngit push origin main`,
    solutionCode: `git pull origin main\ngit push origin main`,
    codeTemplate: `# 1. Fetch and integrate remote updates
git {{SLOT_0}} origin main

# 2. Upload local commits to remote
git {{SLOT_1}} origin main`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'pull' },
      { id: 'SLOT_1', correctAnswer: 'push' },
    ],
    wordBank: ['pull', 'push', 'fetch', 'send', 'upload', 'sync', 'download'],
    expectedOutput: 'Everything up-to-date -> main -> main',
    hints: ['Always `git pull` before `git push` to stay in sync with teammates.'],
    hintsHe: ['תמיד מומלץ לבצע `git pull` לפני `git push` כדי למנוע התנגשויות מול הענן.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-git-6',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Compact Commit History (git log --oneline)',
    titleHe: 'צפייה בהיסטוריית קומיטים מקוצרת (git log --oneline)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'View the commit history in a clean, one-line-per-commit format.',
    taskDescriptionHe: 'הצג את היסטוריית הקומיטים בתצוגה קומפקטית של שורה אחת לכל קומיט.',
    requirements: [
      { id: 'r1', text: 'Run git log --oneline' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git log --oneline' },
    ],
    starterCode: `git log --oneline`,
    solutionCode: `git log --oneline`,
    codeTemplate: `git {{SLOT_0}} {{SLOT_1}}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'log' },
      { id: 'SLOT_1', correctAnswer: '--oneline' },
    ],
    wordBank: ['log', '--oneline', 'history', '--short', 'commits', '--compact'],
    expectedOutput: 'a1b2c3d feat: add spider mascot\n9f8e7d6 init project',
    hints: ['`git log --oneline` prints short commit hashes and titles.'],
    hintsHe: ['הדגל `--oneline` מציג מזהה קומיט מקוצר ואת כותרת הקומיט בשורה אחת.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-git-7',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Stashing Work in Progress (git stash)',
    titleHe: 'שמירה זמנית של שינויים בצד (git stash / pop)',
    language: 'git',
    difficulty: 'Intermediate',
    taskDescription: 'Temporarily shelve uncommitted changes with `git stash`, then restore them with `git stash pop`.',
    taskDescriptionHe: 'שמור זמנית בצד שינויים שטרם בוצע להם Commit בעזרת `git stash`, ושחזר אותם עם `git stash pop`.',
    requirements: [
      { id: 'r1', text: 'Run git stash and git stash pop' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git stash ולאחר מכן git stash pop' },
    ],
    starterCode: `git stash\ngit stash pop`,
    solutionCode: `git stash\ngit stash pop`,
    codeTemplate: `# 1. Save uncommitted work temporarily
git {{SLOT_0}}

# 2. Restore stashed changes back
git stash {{SLOT_1}}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'stash' },
      { id: 'SLOT_1', correctAnswer: 'pop' },
    ],
    wordBank: ['stash', 'pop', 'save', 'restore', 'shelve', 'back', 'apply-all'],
    expectedOutput: 'Saved working directory and restored WIP state',
    hints: ['`git stash` shelves dirty changes; `git stash pop` re-applies and removes them from the stash list.'],
    hintsHe: ['`git stash` שומר שינויים בצד, ו-`git stash pop` מחזיר אותם לעץ העבודה.'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-git-8',
    lessonId: 'git-1',
    courseId: 'git-fundamentals',
    title: 'Cloning a Remote Repository (git clone)',
    titleHe: 'שכפול מאגר מרוחק למחשב (git clone)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Download a full copy of a remote GitHub repository to your machine.',
    taskDescriptionHe: 'הורד עותק מלא של מאגר מרוחק מ-GitHub למחשב המקומי בעזרת `git clone`.',
    requirements: [
      { id: 'r1', text: 'Run git clone <repo-url>' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git clone <repo-url>' },
    ],
    starterCode: `git clone https://github.com/codepath/spidey.git`,
    solutionCode: `git clone https://github.com/codepath/spidey.git`,
    codeTemplate: `{{SLOT_0}} {{SLOT_1}} https://github.com/codepath/spidey.git`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'git' },
      { id: 'SLOT_1', correctAnswer: 'clone' },
    ],
    wordBank: ['git', 'clone', 'copy', 'download', 'fork', 'pull', 'init'],
    expectedOutput: "Cloning into 'spidey'... done.",
    hints: ['`git clone <url>` downloads the project and sets up `origin` automatically.'],
    hintsHe: ['`git clone` מוריד את כל היסטוריית הפרויקט ומגדיר אוטומטית את השרת המרוחק `origin`.'],
    errorGuides: [],
    xpReward: 40,
  },
  {
    id: 'ex-git-9',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Inspecting Line-by-Line Changes (git diff)',
    titleHe: 'השוואת שינויים שורה-אחר-שורה (git diff)',
    language: 'git',
    difficulty: 'Beginner',
    taskDescription: 'Inspect the exact lines added or removed in your staged files using `git diff --staged`.',
    taskDescriptionHe: 'בדוק את השורות המדויקות שהתווספו או נמחקו בקבצים שב-Staging באמצעות `git diff --staged`.',
    requirements: [
      { id: 'r1', text: 'Run git diff --staged' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git diff --staged' },
    ],
    starterCode: `git diff --staged`,
    solutionCode: `git diff --staged`,
    codeTemplate: `git {{SLOT_0}} {{SLOT_1}}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'diff' },
      { id: 'SLOT_1', correctAnswer: '--staged' },
    ],
    wordBank: ['diff', '--staged', 'compare', '--all', 'changes', 'status'],
    expectedOutput: '+ const spidey = true;\n- const owl = false;',
    hints: ['`git diff` shows unstaged edits; `git diff --staged` shows what will go into the next commit.'],
    hintsHe: ['`git diff --staged` מציג את ההבדלים המדויקים שייכנסו לקומיט הבא.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-git-10',
    lessonId: 'git-2',
    courseId: 'git-fundamentals',
    title: 'Safely Undoing a Commit (git revert)',
    titleHe: 'ביטול בטוח של קומיט קודם (git revert)',
    language: 'git',
    difficulty: 'Intermediate',
    taskDescription: 'Create a new commit that safely undoes the changes of the latest commit (`HEAD`) without rewriting history.',
    taskDescriptionHe: 'צור קומיט חדש המבטל בבטחה את השינויים של הקומיט האחרון (`HEAD`) מבלי למחוק את ההיסטוריה.',
    requirements: [
      { id: 'r1', text: 'Run git revert HEAD' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הרץ git revert HEAD' },
    ],
    starterCode: `git revert HEAD`,
    solutionCode: `git revert HEAD`,
    codeTemplate: `git {{SLOT_0}} {{SLOT_1}}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'revert' },
      { id: 'SLOT_1', correctAnswer: 'HEAD' },
    ],
    wordBank: ['revert', 'HEAD', 'delete', 'destroy', 'ORIGIN', 'remove'],
    expectedOutput: '[main 8d3c1a] Revert "buggy commit"',
    hints: ['`git revert HEAD` is safe for shared branches because it adds a new undo commit instead of erasing history.'],
    hintsHe: ['`git revert HEAD` היא הדרך הבטוחה לבטל קומיט בענף משותף מכיוון שהיא יוצרת קומיט הופכי חדש.'],
    errorGuides: [],
    xpReward: 55,
  },

  // ==========================================
  // GAME DEV: HTML5 CANVAS (9 additional -> 10 total)
  // ==========================================
  {
    id: 'ex-game-2',
    lessonId: 'game-1',
    courseId: 'game-dev-canvas',
    title: 'Initializing the 2D Rendering Context',
    titleHe: 'אתחול קונטקסט ציור דו-ממדי ב-Canvas',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Select the `<canvas>` element and retrieve its `"2d"` drawing context.',
    taskDescriptionHe: 'בחר את אלמנט ה-`<canvas>` ושלוף ממנו את אובייקט הציור הדו-ממדי `"2d"`.',
    requirements: [
      { id: 'r1', text: 'Call canvas.getContext("2d")' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא למתודה canvas.getContext("2d")' },
    ],
    starterCode: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");`,
    solutionCode: `const canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");`,
    codeTemplate: `const canvas = document.getElementById("game");
const ctx = canvas.{{SLOT_0}}({{SLOT_1}});`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'getContext' },
      { id: 'SLOT_1', correctAnswer: '"2d"' },
    ],
    wordBank: ['getContext', '"2d"', 'getCanvas', '"3d"', 'createContext', 'init2D'],
    expectedOutput: 'CanvasRenderingContext2D initialized',
    hints: ['`canvas.getContext("2d")` unlocks all 2D drawing methods like `fillRect` and `arc`.'],
    hintsHe: ['המתודה `getContext("2d")` מחזירה את מנוע הציור הדו-ממדי של ה-Canvas.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-game-3',
    lessonId: 'game-1',
    courseId: 'game-dev-canvas',
    title: 'Clearing the Frame (ctx.clearRect)',
    titleHe: 'ניקוי הפריים הקודם בלולאת המשחק (clearRect)',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Erase the entire canvas at the start of each frame using `ctx.clearRect(0, 0, width, height)`.',
    taskDescriptionHe: 'נקה את כל שטח ה-Canvas בתחילת כל פריים כדי למנוע מריחה של דמות העכביש.',
    requirements: [
      { id: 'r1', text: 'Call ctx.clearRect(0, 0, canvas.width, canvas.height)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא ל-ctx.clearRect(0, 0, canvas.width, canvas.height)' },
    ],
    starterCode: `ctx.clearRect(0, 0, canvas.width, canvas.height);`,
    solutionCode: `ctx.clearRect(0, 0, canvas.width, canvas.height);`,
    codeTemplate: `ctx.{{SLOT_0}}(0, 0, {{SLOT_1}}, canvas.height);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'clearRect' },
      { id: 'SLOT_1', correctAnswer: 'canvas.width' },
    ],
    wordBank: ['clearRect', 'canvas.width', 'fillRect', 'eraseAll', 'reset', 'screen.width'],
    expectedOutput: 'Frame buffer cleared cleanly',
    hints: ['Without `clearRect`, moving sprites leave trails across the screen.'],
    hintsHe: ['ללא `clearRect` בתחילת כל פריים, הדמויות ישאירו שובל מרוח על המסך.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-game-4',
    lessonId: 'game-2',
    courseId: 'game-dev-canvas',
    title: 'Sprite Velocity & Position Update',
    titleHe: 'עדכון מיקום ספרייט לפי מהירות (Velocity)',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Move `spider` each frame by adding `spider.vx` to `spider.x` and `spider.vy` to `spider.y`.',
    taskDescriptionHe: 'עדכן את מיקום העכביש בכל פריים על ידי הוספת מהירות הציר `vx` ל-`x` ו-`vy` ל-`y`.',
    requirements: [
      { id: 'r1', text: 'Add spider.vx to spider.x and spider.vy to spider.y' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הוסף את spider.vx ל-spider.x ואת spider.vy ל-spider.y' },
    ],
    starterCode: `spider.x += spider.vx;\nspider.y += spider.vy;`,
    solutionCode: `spider.x += spider.vx;\nspider.y += spider.vy;`,
    codeTemplate: `spider.x {{SLOT_0}} spider.vx;
spider.y += {{SLOT_1}};`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '+=' },
      { id: 'SLOT_1', correctAnswer: 'spider.vy' },
    ],
    wordBank: ['+=', 'spider.vy', '==', 'spider.vx', '-=', 'speed', 'delta'],
    expectedOutput: 'Spider position updated to (124, 88)',
    hints: ['In 2D physics, position increases by velocity (`+= vx`, `+= vy`) every tick.'],
    hintsHe: ['בפיזיקת משחקים, המיקום מתעדכן בכל פריים על ידי חיבור המהירות (`+= vx`, `+= vy`).'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-game-5',
    lessonId: 'game-2',
    courseId: 'game-dev-canvas',
    title: 'Keyboard Controls (ArrowRight)',
    titleHe: 'שליטה בדמות באמצעות המקלדת (keydown)',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Listen for `"keydown"` and set `spider.vx = 5` when `e.key === "ArrowRight"`.',
    taskDescriptionHe: 'האזן לאירוע `"keydown"` וקבע מהירות `spider.vx = 5` כאשר נלחץ מקש חץ ימינה `"ArrowRight"`.',
    requirements: [
      { id: 'r1', text: 'Check e.key === "ArrowRight" inside keydown listener' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'בדוק e.key === "ArrowRight" בתוך מאזין keydown' },
    ],
    starterCode: `window.addEventListener("keydown", (e) => {\n  if (e.key === "ArrowRight") {\n    spider.vx = 5;\n  }\n});`,
    solutionCode: `window.addEventListener("keydown", (e) => {\n  if (e.key === "ArrowRight") {\n    spider.vx = 5;\n  }\n});`,
    codeTemplate: `window.addEventListener({{SLOT_0}}, (e) => {
  if ({{SLOT_1}} === "ArrowRight") {
    spider.vx = 5;
  }
});`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '"keydown"' },
      { id: 'SLOT_1', correctAnswer: 'e.key' },
    ],
    wordBank: ['"keydown"', 'e.key', '"keypress"', 'e.codeName', '"click"', 'key.id'],
    expectedOutput: 'Right arrow pressed -> spider.vx = 5',
    hints: ['`e.key` returns human-readable key names like `"ArrowRight"`, `"ArrowUp"`, or `" "`.'],
    hintsHe: ['המאפיין `e.key` מחזיר את שם המקש שנלחץ, כגון `"ArrowRight"` או `"ArrowUp"`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-game-6',
    lessonId: 'game-2',
    courseId: 'game-dev-canvas',
    title: 'Gravity & Jumping Physics',
    titleHe: 'כוח משיכה (Gravity) וקפיצה אנכית',
    language: 'gamedev',
    difficulty: 'Intermediate',
    taskDescription: 'Apply downward `gravity = 0.5` to `spider.vy` each frame, and set `spider.vy = -12` on jump.',
    taskDescriptionHe: 'הוסף תאוצת כבידה `gravity = 0.5` למהירות האנכית בכל פריים, ותן דחף שלילי `-12` בקפיצה.',
    requirements: [
      { id: 'r1', text: 'Add gravity to spider.vy and use negative velocity for jumping up' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הוסף את gravity ל-spider.vy והצב -12 לקפיצה כלפי מעלה' },
    ],
    starterCode: `const gravity = 0.5;\nspider.vy += gravity;\n\nfunction jump() {\n  spider.vy = -12;\n}`,
    solutionCode: `const gravity = 0.5;\nspider.vy += gravity;\n\nfunction jump() {\n  spider.vy = -12;\n}`,
    codeTemplate: `const gravity = 0.5;
spider.vy += {{SLOT_0}};

function jump() {
  spider.vy = {{SLOT_1}};
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'gravity' },
      { id: 'SLOT_1', correctAnswer: '-12' },
    ],
    wordBank: ['gravity', '-12', '12', '0', 'spider.x', 'bounce'],
    expectedOutput: 'Jump impulse applied: vy = -12',
    hints: ['In Canvas, Y=0 is at the top, so moving UP requires a negative `vy`!'],
    hintsHe: ['ב-Canvas ציר ה-Y מתחיל ב-0 למעלה, ולכן קפיצה כלפי מעלה דורשת מהירות שלילית (`-12`)!'],
    errorGuides: [],
    xpReward: 55,
  },
  {
    id: 'ex-game-7',
    lessonId: 'game-2',
    courseId: 'game-dev-canvas',
    title: 'Circle / Coin Collision Detection',
    titleHe: 'זיהוי התנגשות מעגלית (איסוף מטבע ברשת)',
    language: 'gamedev',
    difficulty: 'Intermediate',
    taskDescription: 'Check if the distance `dist` between `spider` and `coin` is less than `spider.r + coin.r`.',
    taskDescriptionHe: 'בדוק האם המרחק `dist` בין העכביש למטבע קטן מסכום הרדיוסים שלהם (`spider.r + coin.r`).',
    requirements: [
      { id: 'r1', text: 'Use Math.hypot(dx, dy) and compare dist < spider.r + coin.r' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'חשב מרחק עם Math.hypot(dx, dy) ובדוק אם קטן מסכום הרדיוסים' },
    ],
    starterCode: `const dist = Math.hypot(spider.x - coin.x, spider.y - coin.y);\nif (dist < spider.r + coin.r) {\n  score += 10;\n}`,
    solutionCode: `const dist = Math.hypot(spider.x - coin.x, spider.y - coin.y);\nif (dist < spider.r + coin.r) {\n  score += 10;\n}`,
    codeTemplate: `const dist = Math.{{SLOT_0}}(spider.x - coin.x, spider.y - coin.y);
if (dist {{SLOT_1}} spider.r + coin.r) {
  score += 10;
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'hypot' },
      { id: 'SLOT_1', correctAnswer: '<' },
    ],
    wordBank: ['hypot', '<', 'random', '>', 'floor', '===', 'abs'],
    expectedOutput: 'Collision detected! Score +10',
    hints: ['`Math.hypot(dx, dy)` computes the Euclidean distance $\\sqrt{dx^2 + dy^2}$.'],
    hintsHe: ['הפונקציה `Math.hypot(dx, dy)` מחשבת את המרחק הישר בין שתי נקודות לפי משפט פיתגורס.'],
    errorGuides: [],
    xpReward: 60,
  },
  {
    id: 'ex-game-8',
    lessonId: 'game-1',
    courseId: 'game-dev-canvas',
    title: 'Drawing a Circular Sprite (ctx.arc)',
    titleHe: 'ציור מעגל מלא על ה-Canvas (beginPath / arc / fill)',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Draw a filled circle at `(100, 100)` with radius `20` using `ctx.beginPath()`, `ctx.arc()`, and `ctx.fill()`.',
    taskDescriptionHe: 'צייר מעגל מלא במיקום `(100, 100)` ברדיוס `20` באמצעות `beginPath`, `arc` ו-`fill`.',
    requirements: [
      { id: 'r1', text: 'Call ctx.beginPath(), ctx.arc(...), and ctx.fill()' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'קרא לפי הסדר ל-beginPath, ל-arc ול-fill' },
    ],
    starterCode: `ctx.beginPath();\nctx.arc(100, 100, 20, 0, Math.PI * 2);\nctx.fill();`,
    solutionCode: `ctx.beginPath();\nctx.arc(100, 100, 20, 0, Math.PI * 2);\nctx.fill();`,
    codeTemplate: `ctx.beginPath();
ctx.{{SLOT_0}}(100, 100, 20, 0, Math.PI * 2);
ctx.{{SLOT_1}}();`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'arc' },
      { id: 'SLOT_1', correctAnswer: 'fill' },
    ],
    wordBank: ['arc', 'fill', 'circle', 'draw', 'paint', 'rect', 'close'],
    expectedOutput: 'Circular sprite rendered at (100, 100)',
    hints: ['`Math.PI * 2` is 360 degrees in radians, creating a full circle with `ctx.arc`.'],
    hintsHe: ['זווית של `Math.PI * 2` רדיאנים שווה ל-360 מעלות ויוצרת מעגל שלם בפקודת `arc`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-game-9',
    lessonId: 'game-1',
    courseId: 'game-dev-canvas',
    title: 'Rendering Score HUD Text (ctx.fillText)',
    titleHe: 'הצגת ניקוד השחקן על המסך (fillText)',
    language: 'gamedev',
    difficulty: 'Beginner',
    taskDescription: 'Set the font and draw `"Score: 150"` at coordinates `(20, 40)` on the canvas.',
    taskDescriptionHe: 'הגדר גופן וצייר את הטקסט `"Score: 150"` בקואורדינטות `(20, 40)` על גבי המסך.',
    requirements: [
      { id: 'r1', text: 'Set ctx.font and call ctx.fillText("Score: 150", 20, 40)' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'הגדר ctx.font וקרא ל-ctx.fillText("Score: 150", 20, 40)' },
    ],
    starterCode: `ctx.font = "bold 20px sans-serif";\nctx.fillText("Score: 150", 20, 40);`,
    solutionCode: `ctx.font = "bold 20px sans-serif";\nctx.fillText("Score: 150", 20, 40);`,
    codeTemplate: `ctx.{{SLOT_0}} = "bold 20px sans-serif";
ctx.{{SLOT_1}}("Score: 150", 20, 40);`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: 'font' },
      { id: 'SLOT_1', correctAnswer: 'fillText' },
    ],
    wordBank: ['font', 'fillText', 'textStyle', 'drawText', 'write', 'printText'],
    expectedOutput: 'HUD Score: 150 rendered at (20, 40)',
    hints: ['`ctx.fillText(text, x, y)` draws solid text at `(x, y)`.'],
    hintsHe: ['המתודה `ctx.fillText(text, x, y)` מציירת טקסט מלא במיקום המבוקש על ה-Canvas.'],
    errorGuides: [],
    xpReward: 45,
  },
  {
    id: 'ex-game-10',
    lessonId: 'game-2',
    courseId: 'game-dev-canvas',
    title: 'Screen Wall Bounce Reflection',
    titleHe: 'החזרת הדמות מקצוות המסך (Wall Bounce)',
    language: 'gamedev',
    difficulty: 'Intermediate',
    taskDescription: 'Reverse horizontal velocity `spider.vx = -spider.vx` when `spider.x` hits the right canvas edge.',
    taskDescriptionHe: 'הפוך את כיוון המהירות האופקית (`spider.vx = -spider.vx`) כאשר העכביש פוגע בקצה הימני של המסך.',
    requirements: [
      { id: 'r1', text: 'Check spider.x > canvas.width and negate spider.vx' },
    ],
    requirementsHe: [
      { id: 'r1', text: 'בדוק אם spider.x > canvas.width והפוך את הסימן של spider.vx' },
    ],
    starterCode: `if (spider.x > canvas.width || spider.x < 0) {\n  spider.vx = -spider.vx;\n}`,
    solutionCode: `if (spider.x > canvas.width || spider.x < 0) {\n  spider.vx = -spider.vx;\n}`,
    codeTemplate: `if (spider.x > canvas.width {{SLOT_0}} spider.x < 0) {
  spider.vx = {{SLOT_1}};
}`,
    syntaxSlots: [
      { id: 'SLOT_0', correctAnswer: '||' },
      { id: 'SLOT_1', correctAnswer: '-spider.vx' },
    ],
    wordBank: ['||', '-spider.vx', '&&', '0', 'spider.vy', '+spider.vx'],
    expectedOutput: 'Wall bounce! Velocity reversed',
    hints: ['Negating velocity (`vx = -vx`) bounces the sprite in the opposite direction.'],
    hintsHe: ['היפוך הסימן של המהירות (`vx = -vx`) גורם לדמות לקפוץ חזרה בכיוון הנגדי.'],
    errorGuides: [],
    xpReward: 55,
  },
];
