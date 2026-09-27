import { Course, Lesson, Exercise, Quiz, Achievement, MentorMessage, DailyActivity, TopicProficiency, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex',
  email: 'alex.dev@codepath.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  level: 'Beginner+',
  xp: 1240,
  streak: 7,
  streakActiveToday: true,
  totalHours: 14.5,
  language: 'en',
  activeCourseId: 'python-beginners',
  activeLessonId: 'python-13',
  activeExerciseId: 'ex-python-while-1',
  activeQuizId: 'quiz-python-loops',
  completedLessons: [
    'python-1', 'python-2', 'python-3', 'python-4',
    'python-5', 'python-6', 'python-7', 'python-8',
    'python-9', 'python-10', 'python-11', 'python-12'
  ],
  completedExercises: ['ex-python-intro', 'ex-python-vars', 'ex-python-if-else'],
  completedArchitectureChallenges: ['arch-n-plus-one'],
  quizScores: {
    'quiz-python-basics': { score: 5, total: 5, percentage: 100 },
    'quiz-python-ifs': { score: 4, total: 5, percentage: 80 },
  },
  unlockedAchievements: ['ach-streak-7', 'ach-first-run', 'ach-quiz-ace', 'ach-syntax-explorer'],
  dailyGoalMinutes: 15,
  editorFontSize: 'md',
  soundEnabled: true,
};

export const COURSES: Course[] = [
  {
    id: 'python-beginners',
    title: 'Python for Beginners',
    titleHe: 'פייתון למתחילים',
    description: 'Learn computational thinking, clean syntax, loops, and conditions with gentle, hands-on micro-challenges.',
    descriptionHe: 'למד חשיבה אלגוריתמית, תחביר נקי, לולאות ותנאים באמצעות אתגרי מיקרו מעשיים ואינטראקטיביים.',
    difficulty: 'Beginner',
    category: 'Python',
    totalLessons: 28,
    estimatedHours: 8,
    iconName: 'Terminal',
    badge: 'Popular',
    badgeHe: 'פופולרי',
    tags: ['Beginner', 'Practical', 'Interactive'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations & Variables',
        titleHe: 'מודול 1: יסודות ומשתנים',
        description: 'Set up your mind for code, store data, and print results.',
        descriptionHe: 'הבנת צורת החשיבה התכנותית, שמירת נתונים במשתנים והדפסת פלט.',
        lessons: [
          { id: 'python-1', title: 'Say Hello to Python', titleHe: 'שלום לפייתון', durationMinutes: 5, order: 1, type: 'concept' },
          { id: 'python-2', title: 'Variables and Storage', titleHe: 'משתנים ואחסון מידע', durationMinutes: 6, order: 2, type: 'practice' },
          { id: 'python-3', title: 'Data Types: Strings & Ints', titleHe: 'סוגי נתונים: מחרוזות ומספרים', durationMinutes: 8, order: 3, type: 'concept' },
          { id: 'python-4', title: 'Arithmetic Operations', titleHe: 'פעולות חשבוניות בסיסיות', durationMinutes: 7, order: 4, type: 'practice' },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Decisions & Branching',
        titleHe: 'מודול 2: קבלת החלטות והסתעפויות',
        description: 'Make your program choose different paths using if-statements.',
        descriptionHe: 'הורו לתוכנית לפעול בדרכים שונות בהתאם לתנאים ובדיקות בוליאניות.',
        lessons: [
          { id: 'python-5', title: 'Boolean Logic & Comparisons', titleHe: 'לוגיקה בוליאנית והשוואות', durationMinutes: 6, order: 5, type: 'concept' },
          { id: 'python-6', title: 'The if-Statement', titleHe: 'תנאי if בפייתון', durationMinutes: 7, order: 6, type: 'practice' },
          { id: 'python-7', title: 'else and elif Branches', titleHe: 'הסתעפויות elif ו-else', durationMinutes: 8, order: 7, type: 'concept' },
          { id: 'python-8', title: 'Combining Logic with and / or', titleHe: 'שילוב תנאים עם and ו-or', durationMinutes: 8, order: 8, type: 'practice' },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Repetition & Loops',
        titleHe: 'מודול 3: חזרתיות ולולאות',
        description: 'Automate repetitive tasks with while and for loops.',
        descriptionHe: 'אוטומציה של משימות חוזרות באמצעות לולאות while ולולאות for.',
        lessons: [
          { id: 'python-9', title: 'Why Programs Need Loops', titleHe: 'מדוע תוכניות זקוקות ללולאות', durationMinutes: 5, order: 9, type: 'concept' },
          { id: 'python-10', title: 'String Manipulation & Slicing', titleHe: 'מניפולציית מחרוזות וחיתוכים', durationMinutes: 7, order: 10, type: 'concept' },
          { id: 'python-11', title: 'Conditional Logic in Real Scenarios', titleHe: 'לוגיקה מותנית בתרחישי אמת', durationMinutes: 8, order: 11, type: 'practice' },
          { id: 'python-12', title: 'Comparison Operators & Booleans', titleHe: 'אופרטורי השוואה ובוליאנים', durationMinutes: 6, order: 12, type: 'quiz' },
          { id: 'python-13', title: 'Loops and Conditions', titleHe: 'לולאות ותנאי עצירה', durationMinutes: 10, order: 13, type: 'practice' },
          { id: 'python-14', title: 'The For Loop & Range Function', titleHe: 'לולאות For ופונקציית Range', durationMinutes: 9, order: 14, type: 'concept' },
          { id: 'python-15', title: 'Loop Control: Break and Continue', titleHe: 'בקרת לולאה: Break ו-Continue', durationMinutes: 8, order: 15, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'javascript-beginners',
    title: 'JavaScript for Beginners',
    titleHe: 'ג\'אווהסקריפט למתחילים',
    description: 'Breathe life into web pages. Master variables, arrow functions, DOM events, and basic array methods.',
    descriptionHe: 'הפח רוח חיים באתרי אינטרנט. למד משתנים, פונקציות חץ, אירועי DOM ומניפולציית מערכים מודרנית.',
    difficulty: 'Beginner',
    category: 'JavaScript',
    totalLessons: 24,
    estimatedHours: 10,
    iconName: 'Code',
    badge: 'Popular',
    badgeHe: 'פופולרי',
    tags: ['Beginner', 'Frontend', 'Web'],
    modules: [
      {
        id: 'js-mod-1',
        title: 'Module 1: JavaScript Building Blocks',
        titleHe: 'מודול 1: אבני היסוד של JS',
        description: 'Console, variables (let/const), and dynamic types.',
        descriptionHe: 'הדפסה לקונסול, הצהרת משתנים (let/const) וטיפוסים דינמיים.',
        lessons: [
          { id: 'js-1', title: 'Welcome to JavaScript', titleHe: 'ברוכים הבאים ל-JavaScript', durationMinutes: 6, order: 1, type: 'concept' },
          { id: 'js-2', title: 'Declaring Variables with const & let', titleHe: 'הצהרת משתנים עם let ו-const', durationMinutes: 7, order: 2, type: 'practice' },
          { id: 'js-3', title: 'Functions and Parameters', titleHe: 'פונקציות ופרמטרים', durationMinutes: 8, order: 3, type: 'concept' },
          { id: 'js-4', title: 'Array Methods: Map and Filter', titleHe: 'מערכים: map ו-filter', durationMinutes: 9, order: 4, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'sql-fundamentals',
    title: 'SQL & Database Queries',
    titleHe: 'בסיסי נתונים ושאילתות SQL',
    description: 'Learn how modern applications query millions of rows with SELECT, WHERE, JOINs, and aggregates.',
    descriptionHe: 'למד כיצד לשלוף ולנתח מיליוני רשומות באמצעות שאילתות SELECT, סינוני WHERE, חיבורי JOIN ופונקציות קיבוץ.',
    difficulty: 'Beginner',
    category: 'SQL',
    totalLessons: 18,
    estimatedHours: 6,
    iconName: 'Database',
    badge: 'Practical',
    badgeHe: 'מעשי',
    tags: ['Data', 'Practical', 'Backend'],
    modules: [
      {
        id: 'sql-mod-1',
        title: 'Module 1: Querying Data with SELECT',
        titleHe: 'מודול 1: שליפת נתונים באמצעות SELECT',
        description: 'Extracting specific columns and filtering records.',
        descriptionHe: 'שליפת עמודות ספציפיות וסינון רשומות באמצעות תנאי WHERE.',
        lessons: [
          { id: 'sql-1', title: 'Your First SELECT Query', titleHe: 'שאילתת ה-SELECT הראשונה שלך', durationMinutes: 6, order: 1, type: 'concept' },
          { id: 'sql-2', title: 'Filtering with WHERE Clauses', titleHe: 'סינון תוצאות עם WHERE', durationMinutes: 8, order: 2, type: 'practice' },
          { id: 'sql-3', title: 'Aggregating Data with COUNT and SUM', titleHe: 'פונקציות סיכום: COUNT ו-SUM', durationMinutes: 7, order: 3, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'html-css-essentials',
    title: 'HTML & Modern CSS',
    titleHe: 'בניית אתרים: HTML ו-CSS מודרני',
    description: 'Structure modern layouts with semantic HTML5 and style them with Flexbox, CSS Grid, and custom colors.',
    descriptionHe: 'בנה ממשקי משתמש מודרניים עם HTML5 סמנטי ועצב אותם באמצעות Flexbox, Grid וערכות צבעים עשירות.',
    difficulty: 'Beginner',
    category: 'Web',
    totalLessons: 16,
    estimatedHours: 5,
    iconName: 'Layout',
    badge: 'Beginner',
    badgeHe: 'למתחילים',
    tags: ['Design', 'UI', 'Beginner'],
    modules: [
      {
        id: 'html-mod-1',
        title: 'Module 1: Semantic Foundations & Layout',
        titleHe: 'מודול 1: יסודות סמנטיים ופריסות Flexbox',
        description: 'Tags, headers, forms, and responsive design.',
        descriptionHe: 'תגיות HTML5, טפסים, פריסת אלמנטים ועיצוב רספונסיבי.',
        lessons: [
          { id: 'html-1', title: 'Document Structure & Semantics', titleHe: 'מבנה מסמך ותגיות סמנטיות', durationMinutes: 5, order: 1, type: 'concept' },
          { id: 'html-2', title: 'Centering with Flexbox', titleHe: 'מירכוז ועימוד עם Flexbox', durationMinutes: 7, order: 2, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'git-fundamentals',
    title: 'Git & Version Control',
    titleHe: 'ניהול גרסאות עם Git',
    description: 'Never lose work again. Understand repositories, staging, commits, branches, and resolving merge conflicts.',
    descriptionHe: 'שליטה מלאה בגרסאות קוד. מאגרים, שלב ה-Staging, קומיטים, ענפים ופתרון קונפליקטים.',
    difficulty: 'Intermediate',
    category: 'Git',
    totalLessons: 12,
    estimatedHours: 4,
    iconName: 'GitBranch',
    badge: 'Practical',
    badgeHe: 'מעשי',
    tags: ['DevTools', 'Practical', 'Career'],
    modules: [
      {
        id: 'git-mod-1',
        title: 'Module 1: Snapshots & History',
        titleHe: 'מודול 1: צילומי מצב והיסטוריה',
        description: 'git init, add, commit, and log essentials.',
        descriptionHe: 'פקודות יסוד: init, add, commit וקריאת היסטוריית הקומיטים.',
        lessons: [
          { id: 'git-1', title: 'What is a Repository?', titleHe: 'מהו מאגר (Repository)?', durationMinutes: 6, order: 1, type: 'concept' },
          { id: 'git-2', title: 'Creating Commits & Inspecting Diff', titleHe: 'יצירת קומיטים ובדיקת שינויים', durationMinutes: 7, order: 2, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'game-dev-canvas',
    title: 'Introduction to Game Development',
    titleHe: 'פיתוח משחקים ב-HTML5 Canvas',
    description: 'Create interactive 2D arcade games from scratch using the 60fps game loop, sprites, and physics.',
    descriptionHe: 'צור משחקי ארקייד דו-ממדיים מאפס באמצעות לולאת המשחק (60 FPS), ספרייטים וזיהוי התנגשויות.',
    difficulty: 'Intermediate',
    category: 'Game Dev',
    totalLessons: 20,
    estimatedHours: 12,
    iconName: 'Gamepad2',
    badge: 'Popular',
    badgeHe: 'פופולרי',
    tags: ['Creative', 'Game Dev', 'Interactive'],
    modules: [
      {
        id: 'game-mod-1',
        title: 'Module 1: The 60 FPS Game Loop',
        titleHe: 'מודול 1: לולאת המשחק (Game Loop)',
        description: 'Clear, update, and draw cycles on HTML5 Canvas.',
        descriptionHe: 'מחזורי ניקוי, עדכון מצב וציור על גבי HTML5 Canvas.',
        lessons: [
          { id: 'game-1', title: 'The Heartbeat of a Game', titleHe: 'הדופק של המשחק: requestAnimationFrame', durationMinutes: 8, order: 1, type: 'concept' },
          { id: 'game-2', title: 'Moving Sprites with Velocity', titleHe: 'תנועת ספרייט עם מהירות ותאוצה', durationMinutes: 10, order: 2, type: 'practice' },
        ],
      },
    ],
  },
];

export const LESSONS: Record<string, Lesson> = {
  'python-13': {
    id: 'python-13',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 13,
    totalInCourse: 28,
    title: 'Loops and Conditions',
    titleHe: 'לולאות ותנאי עצירה',
    subtitle: 'Learn how while loops test a condition before every single cycle to automate work.',
    subtitleHe: 'למד כיצד לולאת while בודקת תנאי לפני כל סיבוב כדי לבצע אוטומציה של משימות.',
    conceptTitle: 'Automating Repetition with while Loops',
    conceptTitleHe: 'אוטומציה וחזרתיות באמצעות לולאות While',
    explanation: [
      'Computers excel at doing repetitive chores millions of times without fatigue. In Python, a while loop repeats a block of code as long as a specified condition evaluates to True.',
      'Before each repetition (called an iteration), Python evaluates the test condition. If the condition is True, the indented body runs. If it evaluates to False, Python skips straight to the next lines after the loop.',
      'To prevent an infinite loop, you must ensure that something inside the loop modifies a variable so the condition eventually turns False.'
    ],
    explanationHe: [
      'מחשבים מצטיינים בביצוע משימות חוזרות מיליוני פעמים ללא עייפות. בפייתון, לולאת while חוזרת על בלוק קוד כל עוד תנאי מסוים נשאר True.',
      'לפני כל סיבוב (המכונה איטרציה), פייתון בודקת את התנאי. אם הוא מתקיים, גוף הלולאה המוזח פנימה מתבצע. ברגע שהתנאי הופך ל-False, פייתון מדלגת הלאה להמשך התוכנית.',
      'כדי למנוע לולאה אינסופית, חובה לוודא שמשתנה התנאי משתנה בתוך הלולאה כך שבסופו של דבר התנאי יהפוך ל-False.'
    ],
    realWorldAnalogy: 'Think of pouring water into a glass: while the glass is not full, you keep pouring. As soon as the water reaches the rim (condition is no longer True), you stop pouring.',
    realWorldAnalogyHe: 'חשבו על מזיגת מים לכוס: כל עוד הכוס אינה מלאה, ממשיכים למזוג. ברגע שהמים מגיעים לקצה (התנאי כבר אינו מתקיים), מפסיקים את המזיגה מיד.',
    codeSnippet: `# Initialize our starting tracker
counter = 1

# Repeat as long as counter is 5 or less
while counter <= 5:
    print(f"Cycle number: {counter}")
    # Crucial step: increment counter by 1
    counter += 1

print("Loop finished successfully!")`,
    language: 'python',
    simulatedOutput: `Cycle number: 1
Cycle number: 2
Cycle number: 3
Cycle number: 4
Cycle number: 5
Loop finished successfully!`,
    lineBreakdown: [
      {
        lineNumber: 2,
        code: 'counter = 1',
        explanation: 'We create a state variable called counter and give it an initial value of 1.',
        explanationHe: 'אנו מגדירים משתנה מעקב בשם counter ומאתחלים אותו בערך 1.',
      },
      {
        lineNumber: 5,
        code: 'while counter <= 5:',
        explanation: 'The loop condition. Python asks: "Is counter less than or equal to 5?" If yes, execute the indented block below.',
        explanationHe: 'תנאי הלולאה. פייתון שואלת: "האם counter קטן או שווה ל-5?" כל עוד התשובה חיובית, הבלוק רץ.',
      },
      {
        lineNumber: 6,
        code: '    print(f"Cycle number: {counter}")',
        explanation: 'Indented 4 spaces. Displays the current iteration count on the console.',
        explanationHe: 'מוזח 4 רווחים פנימה. מדפיס את מספר הסיבוב הנוכחי לקונסול.',
      },
      {
        lineNumber: 8,
        code: '    counter += 1',
        explanation: 'Short for counter = counter + 1. Increments our number so we eventually reach 6 and exit the loop.',
        explanationHe: 'קיצור ל-counter = counter + 1. מקדם את המונה כדי שבסופו של דבר נגיע ל-6 והלולאה תסתיים.',
      },
      {
        lineNumber: 10,
        code: 'print("Loop finished successfully!")',
        explanation: 'Notice this is not indented. It only runs after the while loop has completed all cycles.',
        explanationHe: 'שימו לב ששורה זו אינה מוזחת, ולכן היא תרוץ רק לאחר שהלולאה השלימה את כל סיבוביה.',
      },
    ],
    importantTip: {
      title: 'Beware of the Infinite Loop Trap',
      titleHe: 'זהירות ממלכודת הלולאה האינסופית',
      description: 'If you forget to increment your counter (line 8), counter will always stay 1, meaning counter <= 5 will always be True, running forever. Always ensure your loop has a clear exit pathway!',
      descriptionHe: 'אם תשכח לקדם את המונה (שורה 8), המשתנה יישאר תמיד 1, מה שיוביל לריצה נצחית ולתקיעת התוכנית. וודא תמיד שיש נתיב יציאה מוגדר היטב!',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-14',
    prevLessonId: 'python-12',
  },
};

export const EXERCISES: Exercise[] = [
  {
    id: 'ex-python-while-1',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Countdown with a While Loop',
    titleHe: 'ספירה לאחור באמצעות לולאת While',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Write a while loop that starts at `seconds = 5` and counts down to `1`. In each iteration, print `"T-minus " + str(seconds)`. Once the loop finishes, print `"Blast off!"`.',
    taskDescriptionHe: 'כתוב לולאת while שמתחילה מ-`seconds = 5` וסופרת לאחור עד `1`. בכל סיבוב הדפס `T-minus {seconds}`, ובסיום הלולאה הדפס `Blast off!`.',
    requirements: [
      { id: 'req-1', text: 'Initialize seconds variable to 5' },
      { id: 'req-2', text: 'Construct a while loop that runs while seconds > 0' },
      { id: 'req-3', text: 'Print "T-minus {seconds}" during each cycle' },
      { id: 'req-4', text: 'Decrease seconds by 1 in each cycle (seconds -= 1)' },
      { id: 'req-5', text: 'Print "Blast off!" after the loop has concluded' },
    ],
    requirementsHe: [
      { id: 'req-1', text: 'אתחל את המשתנה seconds לערך 5' },
      { id: 'req-2', text: 'בנה לולאת while שרצה כל עוד seconds > 0' },
      { id: 'req-3', text: 'הדפס "T-minus {seconds}" בכל סיבוב' },
      { id: 'req-4', text: 'הפחת את seconds ב-1 בכל איטרציה (seconds -= 1)' },
      { id: 'req-5', text: 'הדפס "Blast off!" לאחר סיום הלולאה' },
    ],
    starterCode: `# 1. Set the initial countdown timer
seconds = 5

# 2. Write your while loop below
while seconds > 0:
    # TODO: Print current second and decrement
    pass

# 3. Print the final message
`,
    solutionCode: `seconds = 5

while seconds > 0:
    print(f"T-minus {seconds}")
    seconds -= 1

print("Blast off!")`,
    expectedOutput: `T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1\nBlast off!`,
    hints: [
      'Hint 1 (Concept): Remember that a while loop needs a condition that tests the seconds variable, like `seconds > 0`.',
      'Hint 2 (Syntax): Inside the loop body, make sure to decrement: `seconds = seconds - 1` or `seconds -= 1`.',
      'Hint 3 (Indentation): Print "Blast off!" at the root indentation level (no spaces on the left), so it only executes when the loop finishes.',
    ],
    hintsHe: [
      'רמז 1: זכור שלולאת while זקוקה לתנאי הבודק את המשתנה, כגון `seconds > 0`.',
      'רמז 2: בתוך גוף הלולאה, הקפד להפחית: `seconds -= 1`.',
      'רמז 3: הדפס את "Blast off!" ללא הזחה (משמאל לגמרי), כך שירוץ רק בסיום.',
    ],
    errorGuides: [
      {
        triggerPattern: 'pass',
        title: 'Unreplaced Starter Placeholder',
        titleHe: 'שומר מקום "pass" לא הוחלף',
        explanation: 'You still have "pass" inside your loop. Replace it with your print and decrement statements.',
        explanationHe: 'הביטוי pass עדיין קיים. החלף אותו בקוד שלך.',
        hint: 'Remove "pass" and add `print(f"T-minus {seconds}")` followed by `seconds -= 1`.',
        hintHe: 'מחק את pass והוסף הדפסה והפחתה.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'ex-python-while-2',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Summing Even Numbers',
    titleHe: 'סכום מספרים זוגיים',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Calculate the sum of all even numbers between 2 and 10 (inclusive: 2, 4, 6, 8, 10). Use a while loop to accumulate the total into a variable named `total_sum` and print it.',
    taskDescriptionHe: 'חשב את סכום כל המספרים הזוגיים בין 2 ל-10 בעזרת לולאת while והדפס את הסכום הכולל `Total: {total_sum}`.',
    requirements: [
      { id: 'req-1', text: 'Initialize total_sum = 0 and current_num = 2' },
      { id: 'req-2', text: 'Loop while current_num <= 10' },
      { id: 'req-3', text: 'Add current_num to total_sum' },
      { id: 'req-4', text: 'Increment current_num by 2' },
      { id: 'req-5', text: 'Print the final total_sum (should equal 30)' },
    ],
    requirementsHe: [
      { id: 'req-1', text: 'אתחל total_sum = 0 ו-current_num = 2' },
      { id: 'req-2', text: 'הרץ לולאה כל עוד current_num <= 10' },
      { id: 'req-3', text: 'הוסף את current_num ל-total_sum' },
      { id: 'req-4', text: 'קדם את current_num ב-2' },
      { id: 'req-5', text: 'הדפס את הסכום הכולל (שווה ל-30)' },
    ],
    starterCode: `total_sum = 0
current_num = 2

# Write your loop here
while current_num <= 10:
    total_sum += current_num
    current_num += 2

print(f"Total: {total_sum}")`,
    solutionCode: `total_sum = 0
current_num = 2

while current_num <= 10:
    total_sum += current_num
    current_num += 2

print(f"Total: {total_sum}")`,
    expectedOutput: `Total: 30`,
    hints: [
      'Hint 1: To add to a total, use `total_sum += current_num`.',
      'Hint 2: Since we only want even numbers, increment `current_num += 2` each step.',
    ],
    hintsHe: [
      'רמז 1: כדי להוסיף לסכום, השתמש ב-`total_sum += current_num`.',
      'רמז 2: קדם את המספר ב-2 בכל שלב כדי לדלג על אי-זוגיים.',
    ],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-python-while-3',
    lessonId: 'python-11',
    courseId: 'python-beginners',
    title: 'Ticket Price Evaluator',
    titleHe: 'מחשבון מחירי כרטיסים לפי גיל',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Create a program that determines the ticket price based on age: under 12 costs $8, 12 to 64 costs $15, and 65 or older costs $10. Test with `age = 70`.',
    taskDescriptionHe: 'קבע את מחיר הכרטיס לפי גיל: מתחת ל-12 עולה $8, בין 12 ל-64 עולה $15, ומעל 65 עולה $10. בדוק עבור `age = 70`.',
    requirements: [
      { id: 'req-1', text: 'Set age = 70' },
      { id: 'req-2', text: 'Use if / elif / else to check age' },
      { id: 'req-3', text: 'Assign the price to a variable called price' },
      { id: 'req-4', text: 'Print f"Ticket price: ${price}"' },
    ],
    requirementsHe: [
      { id: 'req-1', text: 'הגדר age = 70' },
      { id: 'req-2', text: 'השתמש ב-if / elif / else לבדיקת הגיל' },
      { id: 'req-3', text: 'שמור את המחיר במשתנה price' },
      { id: 'req-4', text: 'הדפס "Ticket price: $10"' },
    ],
    starterCode: `age = 70
price = 0

# Add your conditional logic here
if age < 12:
    price = 8
elif age >= 65:
    price = 10
else:
    price = 15

print(f"Ticket price: \${price}")`,
    solutionCode: `age = 70
price = 0

if age < 12:
    price = 8
elif age >= 65:
    price = 10
else:
    price = 15

print(f"Ticket price: \${price}")`,
    expectedOutput: `Ticket price: $10`,
    hints: [
      'Hint 1: Start with `if age < 12:` to catch children first.',
      'Hint 2: Use `elif age >= 65:` to assign the senior discount ($10).',
    ],
    hintsHe: [
      'רמז 1: התחל עם בדיקת ילדים (`if age < 12:`)',
      'רמז 2: השתמש ב-`elif age >= 65:` להנחת אזרח ותיק ($10).',
    ],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-js-filter-1',
    lessonId: 'js-4',
    courseId: 'javascript-beginners',
    title: 'Array Filter & Arrow Functions',
    titleHe: 'סינון מערכים ופונקציות חץ ב-JS',
    language: 'javascript',
    difficulty: 'Beginner',
    taskDescription: 'Filter an array of numbers to keep only numbers greater than 50 using `Array.prototype.filter`.',
    taskDescriptionHe: 'סנן מערך של מספרים כך שיכיל רק מספרים הגדולים מ-50 בעזרת הפונקציה filter.',
    requirements: [
      { id: 'req-1', text: 'Use numbers.filter(n => n > 50)' },
      { id: 'req-2', text: 'Print the resulting array' }
    ],
    requirementsHe: [
      { id: 'req-1', text: 'השתמש ב-numbers.filter(n => n > 50)' },
      { id: 'req-2', text: 'הדפס את המערך המסונן לקונסול' }
    ],
    starterCode: `const scores = [25, 60, 45, 80, 95, 30];

// Filter scores greater than 50
const passing = scores.filter(s => s > 50);
console.log(passing);`,
    solutionCode: `const scores = [25, 60, 45, 80, 95, 30];
const passing = scores.filter(s => s > 50);
console.log(passing);`,
    expectedOutput: `[ 60, 80, 95 ]`,
    hints: ['Use arrow syntax `s => s > 50`.'],
    hintsHe: ['השתמש בתחביר חץ `s => s > 50`.'],
    errorGuides: [],
    xpReward: 50,
  },
  {
    id: 'ex-sql-select-1',
    lessonId: 'sql-2',
    courseId: 'sql-fundamentals',
    title: 'SQL Filtering with WHERE',
    titleHe: 'סינון טבלאות SQL עם WHERE',
    language: 'sql',
    difficulty: 'Beginner',
    taskDescription: 'Write a SQL query to select all active users from the `users` table where `status = "active"`.',
    taskDescriptionHe: 'כתוב שאילתת SQL לשליפת כל המשתמשים הפעילים מטבלת users שבהם status = "active".',
    requirements: [
      { id: 'req-1', text: 'SELECT * FROM users WHERE status = "active";' }
    ],
    requirementsHe: [
      { id: 'req-1', text: 'כתוב SELECT * FROM users WHERE status = "active";' }
    ],
    starterCode: `-- Select active users from table
SELECT * FROM users WHERE status = 'active';`,
    solutionCode: `SELECT * FROM users WHERE status = 'active';`,
    expectedOutput: `2 rows returned`,
    hints: ['Remember the WHERE keyword filters rows before they are returned.'],
    hintsHe: ['זכור שמילת המפתח WHERE מסננת שורות לפני החזרתן.'],
    errorGuides: [],
    xpReward: 50,
  },
];

export const QUIZZES: Record<string, Quiz> = {
  'quiz-python-loops': {
    id: 'quiz-python-loops',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Loops and Conditions Checkpoint',
    titleHe: 'מבחן מחסום: לולאות ותנאים',
    description: 'Test your understanding of while loops, iteration variables, and termination conditions.',
    descriptionHe: 'בחן את הבנתך בלולאות while, קידום מונה ותנאי עצירה.',
    questions: [
      {
        id: 'q-1',
        question: 'What is the exact output of this code snippet?',
        questionHe: 'מהו הפלט המדויק של קטע קוד זה?',
        codeSnippet: `num = 1
while num < 4:
    print(num)
    num += 1`,
        options: [
          { 
            id: 'opt-1', 
            text: '1, 2, 3, 4', 
            textHe: '1, 2, 3, 4',
            isCorrect: false, 
            explanation: 'Incorrect. The condition is "num < 4", which is False when num reaches 4.',
            explanationHe: 'לא נכון. התנאי הוא num < 4, וברגע ש-num מגיע ל-4 התנאי כבר אינו מתקיים.'
          },
          { 
            id: 'opt-2', 
            text: '1, 2, 3', 
            textHe: '1, 2, 3',
            isCorrect: true, 
            explanation: 'Correct! The loop prints 1, 2, and 3. When num becomes 4, the condition (4 < 4) evaluates to False and the loop stops.',
            explanationHe: 'נכון מאוד! הלולאה מדפיסה 1, 2 ו-3. כאשר num מגיע ל-4, התנאי (4 < 4) הופך ל-False והלולאה מסתיימת.'
          },
          { 
            id: 'opt-3', 
            text: '0, 1, 2, 3', 
            textHe: '0, 1, 2, 3',
            isCorrect: false, 
            explanation: 'Incorrect. Notice num starts at 1, not 0.',
            explanationHe: 'לא נכון. שים לב שהמונה מתחיל מ-1 ולא מ-0.'
          },
        ],
        xpReward: 15,
      },
      {
        id: 'q-2',
        question: 'What happens if the condition in a while loop never evaluates to False?',
        questionHe: 'מה קורה כאשר התנאי בלולאת while לעולם אינו הופך ל-False?',
        options: [
          { 
            id: 'opt-1', 
            text: 'Python automatically fixes it by stopping after 100 loops', 
            textHe: 'פייתון מתקנת זאת אוטומטית ועוצרת אחרי 100 סיבובים',
            isCorrect: false, 
            explanation: 'Incorrect. Python will not guess your intentions; it will continue executing.',
            explanationHe: 'לא נכון. פייתון אינה מנחשת כוונות וממשיכה להריץ.'
          },
          { 
            id: 'opt-2', 
            text: 'The program throws a SyntaxError before running', 
            textHe: 'התוכנית זורקת שגיאת תחביר SyntaxError לפני ההרצה',
            isCorrect: false, 
            explanation: 'Incorrect. Syntactically it is valid code; it is a logical runtime trap.',
            explanationHe: 'לא נכון. תחבירית הקוד תקין; זוהי מלכודת לוגית בזמן ריצה.'
          },
          { 
            id: 'opt-3', 
            text: 'It creates an infinite loop that runs forever until stopped', 
            textHe: 'נוצרת לולאה אינסופית שרצה ללא הפסקה עד לעצירת התהליך',
            isCorrect: true, 
            explanation: 'Spot on! Without a condition turning False or a break statement, the program remains locked in an infinite loop.',
            explanationHe: 'בול! ללא שינוי התנאי או פקודת break, התוכנית נשארת נעולה בלולאה אינסופית.'
          },
        ],
        xpReward: 15,
      },
      {
        id: 'q-3',
        question: 'Which keyword can you place inside a loop to immediately exit it, regardless of the condition?',
        questionHe: 'איזו מילת מפתח מאפשרת לצאת מיד מלולאה, ללא תלות בתנאי הראשי שלה?',
        options: [
          { 
            id: 'opt-1', 
            text: 'break', 
            textHe: 'break',
            isCorrect: true, 
            explanation: 'Correct! The "break" keyword immediately stops the active loop and moves execution to the line directly after the loop.',
            explanationHe: 'נכון מאוד! הפקודה break עוצרת את הלולאה מיד ומעבירה את השליטה לשורה שאחריה.'
          },
          { 
            id: 'opt-2', 
            text: 'exit()', 
            textHe: 'exit()',
            isCorrect: false, 
            explanation: 'Incorrect. exit() terminates the whole script, not just the enclosing loop.',
            explanationHe: 'לא נכון. exit() סוגרת את כל הסקריפט ולא רק את הלולאה.'
          },
          { 
            id: 'opt-3', 
            text: 'continue', 
            textHe: 'continue',
            isCorrect: false, 
            explanation: 'Incorrect. "continue" skips the rest of the current iteration and jumps to the next iteration.',
            explanationHe: 'לא נכון. continue מדלגת לסיבוב הבא של הלולאה.'
          },
        ],
        xpReward: 15,
      },
      {
        id: 'q-4',
        question: 'Why does Python rely on indentation inside loop blocks?',
        questionHe: 'מדוע פייתון מסתמכת על הזחה (Indentation) בתוך בלוקי לולאות?',
        options: [
          { 
            id: 'opt-1', 
            text: 'Indentation is purely cosmetic and does not affect execution', 
            textHe: 'ההזחה היא רק עניין אסתטי ואינה משפיעה על ההרצה',
            isCorrect: false, 
            explanation: 'Incorrect. In Python, indentation defines block scope and program structure.',
            explanationHe: 'לא נכון. בפייתון ההזחה מגדירה את גוף הבלוק ומבנה התוכנית.'
          },
          { 
            id: 'opt-2', 
            text: 'To determine which lines of code belong inside the loop body', 
            textHe: 'כדי לקבוע אילו שורות קוד שייכות לגוף הלולאה ורצות בכל סיבוב',
            isCorrect: true, 
            explanation: 'Exactly right! Python uses consistent 4-space indentation instead of curly braces {} to know which statements repeat.',
            explanationHe: 'מדויק! פייתון משתמשת בהזחה בת 4 רווחים כדי לדעת אילו שורות שייכות לגוף הלולאה.'
          },
          { 
            id: 'opt-3', 
            text: 'To tell the operating system how much RAM to allocate', 
            textHe: 'כדי להגדיר למערכת ההפעלה כמה זיכרון RAM להקצות',
            isCorrect: false, 
            explanation: 'Incorrect. Indentation has nothing to do with memory management.',
            explanationHe: 'לא נכון. הזחה אינה קשורה לניהול זיכרון.'
          },
        ],
        xpReward: 15,
      },
      {
        id: 'q-5',
        question: 'Consider this code. What will be printed after execution?',
        questionHe: 'התבונן בקוד שלפניך. מה יודפס לאחר סיום ההרצה?',
        codeSnippet: `count = 5
while count > 0:
    count -= 2
print(count)`,
        options: [
          { 
            id: 'opt-1', 
            text: '1', 
            textHe: '1',
            isCorrect: false, 
            explanation: 'Close! When count is 1, 1 > 0 is still True, so it executes one more time: 1 - 2 = -1.',
            explanationHe: 'קרוב! כאשר count שווה 1, התנאי 1 > 0 עדיין מתקיים, ולכן הלולאה רצה עוד פעם: 1 - 2 = -1.'
          },
          { 
            id: 'opt-2', 
            text: '-1', 
            textHe: '-1',
            isCorrect: true, 
            explanation: 'Outstanding! Trace: Start 5 -> 3 -> 1 -> -1. When count is -1, -1 > 0 is False, so the loop exits and prints -1.',
            explanationHe: 'מצוין! מעקב: מתחילים מ-5 -> 3 -> 1 -> -1. כש-count הוא 1-, התנאי הופך ל-False והלולאה מסתיימת עם הדפסת 1-.'
          },
          { 
            id: 'opt-3', 
            text: '0', 
            textHe: '0',
            isCorrect: false, 
            explanation: 'Incorrect. 5 minus 2 is 3, minus 2 is 1, minus 2 is -1. It never lands on 0.',
            explanationHe: 'לא נכון. הפחתה של 2 מ-5 לעולם אינה מגיעה ל-0.'
          },
        ],
        xpReward: 15,
      },
    ],
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-streak-7',
    title: '7-Day Streak Master',
    titleHe: 'אלוף רצף 7 ימים',
    description: 'Maintained a consistent daily learning streak for 7 consecutive days.',
    descriptionHe: 'שמרת על רצף למידה עקבי של 7 ימים ברציפות.',
    icon: 'Flame',
    category: 'streak',
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    xpBonus: 100,
    unlockedDate: 'Today',
  },
  {
    id: 'ach-first-run',
    title: 'First Code Run',
    titleHe: 'הרצת קוד ראשונה',
    description: 'Executed your very first live code practice exercise in the terminal.',
    descriptionHe: 'הרצת את תרגיל הקוד המעשי הראשון שלך בטרמינל.',
    icon: 'Play',
    category: 'practice',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    xpBonus: 50,
    unlockedDate: '6 days ago',
  },
  {
    id: 'ach-quiz-ace',
    title: 'Quiz Ace',
    titleHe: 'אשף הבחנים',
    description: 'Achieved a perfect 100% score on any course milestone checkpoint quiz.',
    descriptionHe: 'השגת ציון 100% מושלם בבוחן מחסום שלב.',
    icon: 'Award',
    category: 'quiz',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    xpBonus: 75,
    unlockedDate: '3 days ago',
  },
  {
    id: 'ach-syntax-explorer',
    title: 'Syntax Explorer',
    titleHe: 'חוקר התחביר',
    description: 'Complete 10 interactive lessons in any foundational curriculum.',
    descriptionHe: 'השלמת 10 שיעורים אינטראקטיביים במסלולי הלמידה.',
    icon: 'BookOpen',
    category: 'lessons',
    progress: 12,
    maxProgress: 10,
    unlocked: true,
    xpBonus: 150,
    unlockedDate: 'Yesterday',
  },
  {
    id: 'ach-bug-hunter',
    title: 'Bug Hunter',
    titleHe: 'צייד הבאגים',
    description: 'Fix 5 errors reported by Code Mentor and compiler diagnostics.',
    descriptionHe: 'תיקנת 5 שגיאות קוד שזוהו על ידי מנטור הקוד והקומפיילר.',
    icon: 'Bug',
    category: 'practice',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    xpBonus: 100,
  },
  {
    id: 'ach-marathoner',
    title: 'Code Marathoner',
    titleHe: 'מרתוניסט הקוד',
    description: 'Accumulate 2,000 total XP points across exercises and quizzes.',
    descriptionHe: 'צברת מעל 2,000 נקודות XP בתרגולים ובחנים.',
    icon: 'Zap',
    category: 'mastery',
    progress: 1240,
    maxProgress: 2000,
    unlocked: false,
    xpBonus: 250,
  },
  {
    id: 'ach-arch-sentinel',
    title: 'Code Architect Sentinel',
    titleHe: 'שומר הארכיטקטורה',
    description: 'Diagnose fragile code, memory leaks, and anti-patterns in the Architecture Lab.',
    descriptionHe: 'אבחנת קוד שביר, דליפות זיכרון ואנטי-פאטרנים במעבדת הארכיטקטורה.',
    icon: 'ShieldCheck',
    category: 'mastery',
    progress: 1,
    maxProgress: 3,
    unlocked: false,
    xpBonus: 150,
  },
];

export const INITIAL_MENTOR_MESSAGES: MentorMessage[] = [
  {
    id: 'm-1',
    sender: 'mentor',
    text: "Hello Alex! 👋 I'm Code Mentor, your personal coding guide. Whenever you feel stuck on a loop, wonder why an error occurred, or need a gentle hint, just ask! How can I assist you with Loops and Conditions today?",
    timestamp: '10:00 AM',
    mode: 'hint',
  },
  {
    id: 'm-2',
    sender: 'user',
    text: 'Why does Python care so much about indentation?',
    timestamp: '10:02 AM',
  },
  {
    id: 'm-3',
    sender: 'mentor',
    text: "Great question! Most languages use curly brackets `{}` or keywords like `begin` / `end` to mark what's inside a loop or function. Python wanted code to look clean and readable, so it uses indentation (typically 4 spaces) directly as syntax.\n\nEverything pushed 4 spaces to the right belongs inside that loop block. When you slide back to the left margin, Python knows you've finished the loop!",
    codeSnippet: `# Inside the loop:
while count < 3:
    print("I repeat!")  # Indented

# Outside the loop:
print("I run once!")    # Left aligned`,
    timestamp: '10:03 AM',
    mode: 'explanation',
  },
];

export const WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: 'Monday', shortDay: 'Mon', dateStr: 'Sep 16', minutes: 22, xp: 140, completedGoal: true, isToday: false },
  { day: 'Tuesday', shortDay: 'Tue', dateStr: 'Sep 17', minutes: 18, xp: 110, completedGoal: true, isToday: false },
  { day: 'Wednesday', shortDay: 'Wed', dateStr: 'Sep 18', minutes: 35, xp: 220, completedGoal: true, isToday: false },
  { day: 'Thursday', shortDay: 'Thu', dateStr: 'Sep 19', minutes: 25, xp: 160, completedGoal: true, isToday: false },
  { day: 'Friday', shortDay: 'Fri', dateStr: 'Sep 20', minutes: 15, xp: 100, completedGoal: true, isToday: false },
  { day: 'Saturday', shortDay: 'Sat', dateStr: 'Sep 21', minutes: 40, xp: 260, completedGoal: true, isToday: false },
  { day: 'Sunday', shortDay: 'Sun', dateStr: 'Sep 22', minutes: 30, xp: 250, completedGoal: true, isToday: true },
];

export const TOPIC_PROFICIENCY: TopicProficiency[] = [
  { name: 'Variable Assignment & Naming', proficiency: 96, status: 'strong', lessonCount: 4 },
  { name: 'Print Formatting & F-Strings', proficiency: 92, status: 'strong', lessonCount: 3 },
  { name: 'Basic Arithmetic Operators', proficiency: 90, status: 'strong', lessonCount: 3 },
  { name: 'String Slicing & Indexing', proficiency: 84, status: 'strong', lessonCount: 2 },
  { name: 'Nested If/Elif Statements', proficiency: 64, status: 'needs_practice', lessonCount: 3 },
  { name: 'While Loop Exit Conditions', proficiency: 58, status: 'needs_practice', lessonCount: 2 },
];

export const DAILY_CHALLENGE = {
  id: 'daily-2026-09-22',
  title: 'Odd or Even Sieve',
  titleHe: 'בדיקת מספר זוגי או אי-זוגי',
  description: 'Write a concise expression to test if a given number `n = 42` is even or odd using the modulo `%` operator.',
  descriptionHe: 'כתוב ביטוי קצר לבדיקה האם המספר `n = 42` הוא זוגי או אי-זוגי בעזרת אופרטור המודולו `%`.',
  xpReward: 50,
  language: 'python',
  difficulty: 'Quick (3 min)',
  timeRemaining: '14 hrs 18 mins',
};
