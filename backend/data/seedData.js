const CourseRepo = require('../models/Course');
const QuizRepo = require('../models/Quiz');

const coursesData = [
  {
    _id: "course_web_basics",
    title: "Introduction to Web Development",
    description: "Learn the foundational blocks of the web: HTML5, CSS3 styling, and JavaScript interactivity.",
    category: "Web Development",
    difficulty: "Beginner",
    lessons: [
      {
        _id: "lesson_html",
        title: "HTML5 Structure & Semantic Markup",
        content: `### Welcome to HTML5! 🌐
        
HTML (HyperText Markup Language) is the backbone of all web pages. It defines the structure of a webpage.

#### Core Structural Tags:
- \`<header>\` represents introductory content.
- \`<nav>\` defines navigation links.
- \`<main>\` contains the primary content of the document.
- \`<section>\` groups thematic content.
- \`<article>\` represents independent, self-contained content.
- \`<footer>\` contains author info, copyright, and footer links.

#### Why Semantic Markup matters:
1. **SEO**: Search engines can read and index your page content much better.
2. **Accessibility**: Screen readers rely on semantic structure to assist visually impaired users.
3. **Readability**: Makes code much easier to understand and maintain.

#### Simple Example:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>My First Semantic Site</title>
</head>
<body>
  <header>
    <h1>Web Dev Academy</h1>
  </header>
  <main>
    <article>
      <h2>Learning HTML is fun!</h2>
      <p>HTML elements form the blocks of visual layouts.</p>
    </article>
  </main>
</body>
</html>
\`\`\`
`,
        duration: 10
      },
      {
        _id: "lesson_css",
        title: "CSS Layouts: Flexbox and Grid",
        content: `### Mastering CSS Layouts 🎨

CSS (Cascading Style Sheets) controls how HTML elements are presented. Layout design was once complex, but Flexbox and Grid changed everything.

#### 1. Flexbox (1-Dimensional Layout)
Flexbox organizes elements in a single row or column. It handles distribution, alignment, and ordering.
\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between; /* Horizontal spacing */
  align-items: center;            /* Vertical alignment */
  flex-direction: row;            /* Row or Column */
}
\`\`\`

#### 2. CSS Grid (2-Dimensional Layout)
Grid is optimized for rows and columns simultaneously.
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px;                             /* Space between items */
}
\`\`\`

#### Key Comparison:
- Use **Flexbox** for aligning buttons in navigation bars, centering items, or small horizontal flows.
- Use **Grid** for complex grid galleries, dashboards, or structural page divisions.
`,
        duration: 15
      },
      {
        _id: "lesson_js",
        title: "JavaScript Basics: DOM Manipulation",
        content: `### Interactive Webs with JavaScript ⚡

JavaScript brings life to web pages. The **DOM (Document Object Model)** is the structured API that represents HTML.

#### Selecting Elements:
\`\`\`javascript
const title = document.querySelector('.main-title');
const btn = document.getElementById('submit-btn');
\`\`\`

#### Modifying Elements:
\`\`\`javascript
title.textContent = 'Welcome, Smart Learner!';
title.style.color = '#8b5cf6';
\`\`\`

#### Adding Event Listeners:
\`\`\`javascript
btn.addEventListener('click', (event) => {
  alert('Button clicked! Changing background...');
  document.body.style.backgroundColor = '#09090b';
});
\`\`\`

With DOM manipulation, you can build dynamic forms, rich popups, single-page application navigation, and custom animations!
`,
        duration: 20
      }
    ]
  },
  {
    _id: "course_react",
    title: "Modern Frontend with React",
    description: "Master React.js components, declarative state management, side effects, and lifecycle hooks.",
    category: "Web Development",
    difficulty: "Intermediate",
    lessons: [
      {
        _id: "lesson_react_comp",
        title: "React Components & JSX syntax",
        content: `### What is React? ⚛️

React is a declarative library for building component-based interfaces. 

#### JSX: JavaScript XML
JSX allows writing HTML-like code inside JavaScript. It compiles to standard \`React.createElement\` statements.

#### Example Component:
\`\`\`jsx
import React from 'react';

function UserCard({ name, role }) {
  return (
    <div className="glass-card">
      <h3>{name}</h3>
      <p className="muted-text">Role: {role}</p>
    </div>
  );
}

export default UserCard;
\`\`\`

**Core Rules of JSX:**
1. Return a single root element (or use fragments: \`<></>\`).
2. Close all tags (e.g. \`<img />\`).
3. Use camelCase attributes (e.g. \`className\` instead of \`class\`).
`,
        duration: 15
      },
      {
        _id: "lesson_react_hooks",
        title: "State Management & React Hooks",
        content: `### React Hooks: useState & Custom State 🛠️

Hooks let you use state and other React features in functional components.

#### 1. useState Hook
Allows functional components to store state values.
\`\`\`jsx
import React, { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      👍 Likes: {likes}
    </button>
  );
}
\`\`\`

#### 2. How React Re-renders
Whenever the state changes (via the set function), React triggers a re-render of the component and updates the DOM to reflect the state. Never mutate state directly (e.g. do not do \`likes = likes + 1\`). Always use the setter function.
`,
        duration: 20
      }
    ]
  },
  {
    _id: "course_ml_intro",
    title: "Introduction to Machine Learning",
    description: "Get started with Artificial Intelligence concepts, Supervised Models, and Artificial Neural Networks.",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    lessons: [
      {
        _id: "lesson_ml_basics",
        title: "Supervised vs. Unsupervised Learning",
        content: `### What is Machine Learning? 🤖

Machine Learning is the study of computer algorithms that improve automatically through experience.

#### 1. Supervised Learning
The model is trained on labeled training data. The model learns a map from inputs \(x\) to outputs \(y\).
- **Classification**: Predicting discrete values (e.g. is this email "spam" or "ham"?).
- **Regression**: Predicting continuous numeric values (e.g. predicting housing prices).

#### 2. Unsupervised Learning
The model is given unlabeled data and must discover structure independently.
- **Clustering**: Grouping similar items (e.g. customer segmentation).
- **Dimensionality Reduction**: Simplifying data by removing dimensions (e.g., Principal Component Analysis - PCA).
`,
        duration: 12
      },
      {
        _id: "lesson_neural_networks",
        title: "Introduction to Neural Networks",
        content: `### The Power of Neural Networks 🧠

Neural Networks, or Artificial Neural Networks (ANNs), are modeled loosely after the biological brain's networks of neurons.

#### Core Structure:
1. **Input Layer**: Receives features (e.g., pixel intensities).
2. **Hidden Layer(s)**: Mathematical nodes that compute weighted sums, apply activation functions, and extract features.
3. **Output Layer**: Yields final class probabilities or predictions.

#### Mathematics of a Single Neuron (Perceptron):
For inputs \(x_i\), weights \(w_i\) and bias \(b\):
\[z = \sum (x_i \cdot w_i) + b\]
\[a = \sigma(z)\]

Where \(\sigma\) is the **activation function** (e.g. Sigmoid, ReLU, Tanh) which introduces non-linearity, allowing the network to learn complex mathematical functions.
`,
        duration: 25
      }
    ]
  },
  {
    _id: "course_gate_cs",
    title: "GATE CS Syllabus: Theory of Computation",
    description: "Prepare for the GATE CS exam with this advanced course on Regular Expressions, Finite Automata, and Turing Machines.",
    category: "GATE Exam Preparation",
    difficulty: "Advanced",
    lessons: [
      {
        _id: "lesson_gate_toc_dfa",
        title: "Deterministic Finite Automata (DFA) Construction",
        content: `### Deterministic Finite Automata (DFA) ⚙️

In Theory of Computation, a **DFA** is a finite state machine that accepts or rejects strings of symbols and only produces a unique computation path for each input string.

#### Formal Definition:
A DFA is mathematically represented as a 5-tuple:
\\[M = (Q, \\Sigma, \\delta, q_0, F)\\]
- \\(Q\\) is a finite set of states.
- \\(\\Sigma\\) is a finite set of input symbols (alphabet).
- \\(\\delta: Q \\times \\Sigma \\rightarrow Q\\) is the transition function.
- \\(q_0 \\in Q\\) is the start state.
- \\(F \\subseteq Q\\) is the set of accept/final states.

#### Construction rules for GATE:
1. **Minimize States**: Always try to draw the state diagrams with the minimum possible number of states.
2. **Trap State**: If an transition path cannot lead to a final state, redirect it to a non-final trap state.

*Example*: Build a DFA accepting language \\(L = \\{ w \\in \\{0, 1\\}^* \\mid w \\text{ ends with } 01 \\}\\). Min states required is 3!
`,
        duration: 15
      },
      {
        _id: "lesson_gate_algo_asymptotic",
        title: "Algorithm Analysis & Recurrence Relations",
        content: `### Asymptotic Analysis for GATE CS 📈

Algorithm analysis is a core topic in the GATE CS syllabus. We measure execution time and space complexity based on the input size \\(n\\).

#### Standard Notations:
1. **O-Notation (Big-O)**: Describes the asymptotic upper bound.
2. **\\(\\Omega\\)-Notation (Big-Omega)**: Describes the asymptotic lower bound.
3. **\\(\\Theta\\)-Notation (Big-Theta)**: Describes the tight asymptotic bound.

#### Master Theorem for Recurrence Relations:
For divide-and-conquer recurrences of the form:
\\[T(n) = aT\\left(\\frac{n}{b}\\right) + f(n)\\]
We compare \\(f(n)\\) with \\(n^{\\log_b a}\\) to determine the time complexity class.

*GATE Tip: Keep close attention to special cases where the Master Theorem is not directly applicable, and use recursion trees instead.*
`,
        duration: 18
      }
    ]
  },
  {
    _id: "course_jee_math",
    title: "JEE Mathematics: Calculus and Limits",
    description: "Master limits, continuity, and differential calculus concepts required for the JEE Main and Advanced syllabus.",
    category: "JEE Exam Preparation",
    difficulty: "Advanced",
    lessons: [
      {
        _id: "lesson_jee_limits_continuity",
        title: "Limits & L'Hôpital's Rule",
        content: `### Limits in Calculus 📐

Calculus forms a large chunk of the JEE mathematics exam. Understanding limits is crucial to learning continuity and derivatives.

#### Indeterminate Forms:
When evaluating limits, we often encounter forms like:
\\[\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \\cdot \\infty, \\infty - \\infty, 0^0, 1^\\infty, \\infty^0\\]

#### L'Hôpital's Rule:
For indeterminate forms \\(\\frac{0}{0}\\) or \\(\\frac{\\infty}{\\infty}\\), if functions \\(f(x)\\) and \\(g(x)\\) are differentiable, then:
\\[\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}\\]

*JEE Shortcut: Learn standard expansion series (like \\(\\sin x\\), \\(\\cos x\\), \\(e^x\\)) to evaluate complex limits faster than using L'Hôpital repeatedly.*
`,
        duration: 20
      }
    ]
  },
  {
    _id: "course_upsc_polity",
    title: "UPSC GS Syllabus: Indian Constitution & Polity",
    description: "Comprehensive study of the Indian Constitution, Parliament, and fundamental rights for the Civil Services Examination.",
    category: "UPSC Exam Preparation",
    difficulty: "Intermediate",
    lessons: [
      {
        _id: "lesson_upsc_rights",
        title: "Fundamental Rights (Articles 12-35)",
        content: `### Fundamental Rights in India 🇮🇳

Fundamental Rights are enshrined in Part III of the Constitution of India (Articles 12-35). They are justiciable in nature, meaning they are enforceable by courts.

#### Key Categories of Rights:
1. **Right to Equality** (Articles 14-18)
2. **Right to Freedom** (Articles 19-22)
3. **Right against Exploitation** (Articles 23-24)
4. **Right to Freedom of Religion** (Articles 25-28)
5. **Cultural and Educational Rights** (Articles 29-30)
6. **Right to Constitutional Remedies** (Article 32 - described by Dr. B.R. Ambedkar as the 'Heart and Soul' of the Constitution)

#### Key UPSC prelims facts:
- These rights are not absolute but qualified (subject to reasonable restrictions).
- They can be suspended during a National Emergency (except Articles 20 and 21).
`,
        duration: 15
      }
    ]
  }
];

const quizzesData = [
  {
    _id: "quiz_web_basics",
    title: "Web Development Basics Quiz",
    courseId: "course_web_basics",
    questions: [
      {
        questionText: "Which HTML5 tag is used to define navigation links?",
        options: ["<navigation>", "<nav>", "<links>", "<menu>"],
        correctOptionIndex: 1,
        explanation: "<nav> is the correct semantic element designed for navigation blocks. Tag names like <navigation> do not exist in standard HTML5."
      },
      {
        questionText: "Which CSS tool layout works in two dimensions (rows & columns) simultaneously?",
        options: ["Flexbox", "Floats", "CSS Grid", "Absolute Position"],
        correctOptionIndex: 2,
        explanation: "CSS Grid is a 2-Dimensional layout model suited for rows and columns. Flexbox is optimized for 1-Dimensional layouts (along a single row or column)."
      },
      {
        questionText: "How do you select an HTML element with id='submit-btn' in JavaScript?",
        options: [
          "document.select('#submit-btn')",
          "document.getElementById('submit-btn')",
          "document.querySelector('.submit-btn')",
          "document.find('submit-btn')"
        ],
        correctOptionIndex: 1,
        explanation: "document.getElementById('submit-btn') selects by ID. Alternatively, document.querySelector('#submit-btn') (using hash selector) can be used, but querySelector('.submit-btn') would select by class."
      }
    ]
  },
  {
    _id: "quiz_react",
    title: "Modern React.js Quiz",
    courseId: "course_react",
    questions: [
      {
        questionText: "What is JSX in React?",
        options: [
          "A server-side scripting template tool",
          "A XML-like extension to JavaScript for writing interface structure",
          "A custom package manager replacing npm",
          "A strict database query model"
        ],
        correctOptionIndex: 1,
        explanation: "JSX is JavaScript XML. It allows us to write HTML-like markup directly inside React components, compileable into browser-compatible JavaScript."
      },
      {
        questionText: "Which hook should you use to store mutable variables inside functional components that trigger re-rendering on change?",
        options: ["useEffect", "useMemo", "useRef", "useState"],
        correctOptionIndex: 3,
        explanation: "useState is the core hook for components that require active, mutable state variables. Changes to values returned by useState automatically trigger React component re-rendering."
      }
    ]
  },
  {
    _id: "quiz_ml_intro",
    title: "Machine Learning Concepts Quiz",
    courseId: "course_ml_intro",
    questions: [
      {
        questionText: "What is the key difference between Supervised and Unsupervised Learning?",
        options: [
          "Supervised learning requires constant user input, unsupervised is automatic.",
          "Supervised learning uses labeled training data, whereas unsupervised uses unlabeled data.",
          "Supervised learning is only used for statistics, unsupervised is only for text.",
          "Supervised learning does not use weights, unsupervised does."
        ],
        correctOptionIndex: 1,
        explanation: "Supervised learning models are trained using input-output pairs (labeled data), predicting tags or targets. Unsupervised models search for internal clusters/patterns without pre-assigned target labels."
      },
      {
        questionText: "What is the purpose of an activation function in a neural network?",
        options: [
          "To speed up network data transmission",
          "To introduce non-linearity so the network can learn complex patterns",
          "To clean bad training entries",
          "To count the number of layers"
        ],
        correctOptionIndex: 1,
        explanation: "Activation functions (like ReLU or Sigmoid) introduce non-linear mapping. Without non-linearity, a deep network reduces to a single massive linear equation, unable to model complex data patterns."
      }
    ]
  },
  {
    _id: "quiz_gate_cs",
    title: "GATE Theory of Computation Assessment",
    courseId: "course_gate_cs",
    questions: [
      {
        questionText: "What is the minimum number of states required in a DFA that accepts all strings over {0,1} ending with the pattern '01'?",
        options: ["2 states", "3 states", "4 states", "5 states"],
        correctOptionIndex: 1,
        explanation: "The minimum states required is 3: State q0 (start/reject), q1 (received '0'), and q2 (received '1' after '0' - accepting state). If a string terminates in q2, it is accepted."
      },
      {
        questionText: "Which complexity class describes the solution of T(n) = 2T(n/2) + n using the Master Theorem?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        correctOptionIndex: 1,
        explanation: "Here, a=2, b=2, and f(n)=n. We compare f(n) with n^(log_b a) = n^(log_2 2) = n. Since f(n) matches n, it falls into Case 2 of the Master Theorem, giving T(n) = Theta(n log n)."
      }
    ]
  },
  {
    _id: "quiz_jee_math",
    title: "JEE Limits & Calculus Assessment",
    courseId: "course_jee_math",
    questions: [
      {
        questionText: "Evaluate the limit: lim (x -> 0) [sin(x) / x].",
        options: ["0", "1", "Does not exist", "Infinity"],
        correctOptionIndex: 1,
        explanation: "Using L'Hôpital's Rule on the 0/0 form, we differentiate the numerator (cos x) and the denominator (1). Substituting x=0 yields cos(0)/1 = 1."
      }
    ]
  },
  {
    _id: "quiz_upsc_polity",
    title: "UPSC Indian Polity Assessment",
    courseId: "course_upsc_polity",
    questions: [
      {
        questionText: "Which Article of the Constitution of India provides the 'Right to Constitutional Remedies'?",
        options: ["Article 19", "Article 21", "Article 32", "Article 226"],
        correctOptionIndex: 2,
        explanation: "Article 32 empowers citizens to move the Supreme Court for enforcement of Fundamental Rights. Article 226 empowers the High Courts."
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const seededCourses = await CourseRepo.createMany(coursesData);
    console.log(`🌱 Seeded ${seededCourses.length} Courses.`);

    const seededQuizzes = await QuizRepo.createMany(quizzesData);
    console.log(`🌱 Seeded ${seededQuizzes.length} Quizzes.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;
