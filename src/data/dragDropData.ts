export interface DragDropSlot {
  id: string; // e.g., 'SLOT_0', 'SLOT_1'
  correctAnswer: string;
}

export interface DragDropChallenge {
  id: string;
  title: string;
  titleHe: string;
  instruction: string;
  instructionHe: string;
  language: 'python' | 'javascript' | 'sql' | 'typescript' | 'html' | 'architecture';
  category: 'code' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate';
  codeTemplate: string; // Contains placeholders like {{SLOT_0}}, {{SLOT_1}}
  slots: DragDropSlot[];
  wordBank: string[]; // Options including correct answers and distractors
  explanation: string;
  explanationHe: string;
  xpReward: number;
}

export const DRAG_DROP_CHALLENGES: DragDropChallenge[] = [
  // Python Drag & Drop
  {
    id: 'dd-py-1',
    title: 'Even Numbers List Filter',
    titleHe: 'סינון מספרים זוגיים ב-Python',
    instruction: 'Complete the loop and condition so that it prints only even numbers.',
    instructionHe: 'השלם את הלולאה והתנאי כך שיודפסו אך ורק מספרים זוגיים.',
    language: 'python',
    category: 'code',
    difficulty: 'Beginner',
    codeTemplate: `numbers = [1, 2, 3, 4, 5, 6]

for num {{SLOT_0}} numbers:
    if num {{SLOT_1}} 2 == 0:
        {{SLOT_2}}(num)`,
    slots: [
      { id: 'SLOT_0', correctAnswer: 'in' },
      { id: 'SLOT_1', correctAnswer: '%' },
      { id: 'SLOT_2', correctAnswer: 'print' },
    ],
    wordBank: ['in', '%', 'print', 'for', '==', 'def', 'import', 'range'],
    explanation: 'The "in" keyword iterates over the list, "% 2 == 0" checks for parity, and "print()" outputs the value.',
    explanationHe: 'המילה in סורקת את הרשימה, המודולו % בודק זוגיות, ופונקציית print מדפיסה את התוצאה.',
    xpReward: 40,
  },

  // JavaScript Async Drag & Drop
  {
    id: 'dd-js-1',
    title: 'Async/Await Data Fetch',
    titleHe: 'שליפת נתונים ב-JavaScript עם Async/Await',
    instruction: 'Fill in the blanks to correctly define an async function and await the fetch response.',
    instructionHe: 'השלם את מילות המפתח להגדרת פונקציה אסינכרונית והמתנה לתשובה.',
    language: 'javascript',
    category: 'code',
    difficulty: 'Intermediate',
    codeTemplate: `{{SLOT_0}} function loadUserData(userId) {
  try {
    const response = {{SLOT_1}} fetch(\`/api/users/\${userId}\`);
    const data = await response.{{SLOT_2}}();
    return data;
  } catch (err) {
    console.error(err);
  }
}`,
    slots: [
      { id: 'SLOT_0', correctAnswer: 'async' },
      { id: 'SLOT_1', correctAnswer: 'await' },
      { id: 'SLOT_2', correctAnswer: 'json' },
    ],
    wordBank: ['async', 'await', 'json', 'then', 'promise', 'function', 'import'],
    explanation: 'Functions calling await must be marked "async", and response.json() parses the payload.',
    explanationHe: 'פונקציה המשתמשת ב-await חייבת להיות מסומנת ב-async, ו-response.json() מפרסר את ה-payload.',
    xpReward: 50,
  },

  // SQL Drag & Drop
  {
    id: 'dd-sql-1',
    title: 'SQL Join & Group By',
    titleHe: 'שאילתת SQL עם JOIN ו-GROUP BY',
    instruction: 'Complete the query to aggregate total orders per user.',
    instructionHe: 'השלם את שאילתת ה-SQL לחישוב סכום ההזמנות לכל משתמש.',
    language: 'sql',
    category: 'code',
    difficulty: 'Intermediate',
    codeTemplate: `SELECT users.id, {{SLOT_0}}(orders.amount) AS total_spent
FROM users
{{SLOT_1}} JOIN orders ON users.id = orders.user_id
GROUP {{SLOT_2}} users.id;`,
    slots: [
      { id: 'SLOT_0', correctAnswer: 'SUM' },
      { id: 'SLOT_1', correctAnswer: 'INNER' },
      { id: 'SLOT_2', correctAnswer: 'BY' },
    ],
    wordBank: ['SUM', 'INNER', 'BY', 'COUNT', 'WHERE', 'HAVING', 'OUTER'],
    explanation: 'SUM calculates aggregates, INNER JOIN merges tables, and GROUP BY groups by user ID.',
    explanationHe: 'הפונקציה SUM מחשבת סכום, INNER JOIN מחתך טבלאות, ו-GROUP BY מקבץ לפי מזהה משתמש.',
    xpReward: 50,
  },

  // Architecture Drag & Drop Refactoring
  {
    id: 'dd-arch-1',
    title: 'Architecture Refactoring: N+1 Bottleneck Fix',
    titleHe: 'ארכיטקטורה: תיקון צוואר בקבוק N+1',
    instruction: 'Refactor the crashing loop into a single batch database query using connection pooling.',
    instructionHe: 'עצב מחדש את הלולאה האיטית לשאילתה מרוכזת ויעילה במסד הנתונים.',
    language: 'architecture',
    category: 'architecture',
    difficulty: 'Intermediate',
    codeTemplate: `// Scalable Database Querying
async function getUsersWithPosts(userIds) {
  // Replace N+1 queries with a single batch WHERE IN query
  const users = await db.query('SELECT * FROM users WHERE id {{SLOT_0}} ($1)', [userIds]);
  const posts = await {{SLOT_1}}.query('SELECT * FROM posts WHERE user_id IN ($1)', [userIds]);
  
  return {{SLOT_2}}(users, posts);
}`,
    slots: [
      { id: 'SLOT_0', correctAnswer: 'IN' },
      { id: 'SLOT_1', correctAnswer: 'db' },
      { id: 'SLOT_2', correctAnswer: 'combine' },
    ],
    wordBank: ['IN', 'db', 'combine', 'JOIN', 'map', 'for', 'await'],
    explanation: 'Batching queries with WHERE IN prevents N+1 database roundtrips and avoids server crash.',
    explanationHe: 'שימוש בשאילתת אצווה עם WHERE IN מונע N+1 פניות למסד הנתונים ומונע קריסת שרת.',
    xpReward: 60,
  },
];
