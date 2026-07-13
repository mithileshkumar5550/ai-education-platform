const { OpenAI } = require('openai');

// Initialize OpenAI client only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Simulated replies for educational topics (Fallback)
const getSimulatedReply = (message) => {
  const query = message.toLowerCase();
  
  if (query.includes('react') || query.includes('hook') || query.includes('useeffect') || query.includes('usestate')) {
    return `### Welcome to the React Explorer! 🚀

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called **"components"**.

Here is a quick overview of **State (useState)** in React:
\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-card">
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click Me
      </button>
    </div>
  );
}
\`\`\`

**Key Takeaways:**
1. **useState** returns a pair: the current state value and a function to update it.
2. **useEffect** lets you perform side effects (data fetching, subscriptions) in function components.
3. Keep components small, reusable, and pure!

*Tip: Try checking out our **Advanced Web Development** course to master React!*`;
  }

  if (query.includes('javascript') || query.includes('js') || query.includes('promise') || query.includes('async')) {
    return `### Understanding JavaScript Promises & Async/Await ⚡

In JavaScript, asynchronous operations are handled using Promises. A **Promise** is a proxy for a value not necessarily known when the promise is created.

#### 1. Standard Promise Syntax
\`\`\`javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ user: 'Jane Doe', role: 'Learner' });
    }, 1000);
  });
};

fetchData()
  .then(data => console.log('Data received:', data))
  .catch(err => console.error('Error:', err));
\`\`\`

#### 2. Modern Async / Await Syntax
\`\`\`javascript
async function getStudentDashboard() {
  try {
    const data = await fetchData();
    console.log('Dashboard Data:', data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
\`\`\`

**Why use Async/Await?**
- It makes asynchronous code look and behave more like synchronous code.
- Greatly improves code readability and handles try/catch blocks gracefully.`;
  }

  if (query.includes('python') || query.includes('list comprehension') || query.includes('pandas')) {
    return `### Python: The Language of AI and Data Science 🐍

Python's simple, readable syntax makes it the most popular language for machine learning, automation, and general programming.

One of Python's most beloved features is **List Comprehension**:
\`\`\`python
# Traditional approach
squares = []
for x in range(10):
    squares.append(x**2)

# Pythonic approach (List Comprehension)
squares = [x**2 for x in range(10)]
print(squares) # Output: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
\`\`\`

**Top Data Science Libraries in Python:**
- **NumPy**: Support for large, multi-dimensional arrays and matrices.
- **Pandas**: Powerful data structures (DataFrames) for data analysis.
- **Scikit-Learn**: Simple and efficient tools for predictive data analysis and Machine Learning.`;
  }

  if (query.includes('ai') || query.includes('artificial intelligence') || query.includes('neural') || query.includes('machine learning') || query.includes('ml')) {
    return `### Artificial Intelligence & Machine Learning 🧠

Machine Learning (ML) is a subset of AI that allows software applications to become more accurate in predicting outcomes without being explicitly programmed.

#### How a simple Neural Network works:
\`\`\`
Input Layer        Hidden Layer       Output Layer
  (Data)        (Weight Adjustments)   (Prediction)
  [ x1 ] ---------> ( neuron ) ---------> [ Prediction ]
  [ x2 ] ---------> ( neuron )
\`\`\`

**The Three Core Types of Machine Learning:**
1. **Supervised Learning**: Training model with labeled data (e.g. classification, regression).
2. **Unsupervised Learning**: Uncovering hidden patterns in unlabeled data (e.g. clustering, PCA).
3. **Reinforcement Learning**: Software agents taking actions in an environment to maximize cumulative reward.

*Would you like to study deep neural network architectures, or start with simple linear regression models? Check out our **Introduction to Machine Learning** course!*`;
  }

  if (query.includes('quiz') || query.includes('test') || query.includes('score')) {
    return `### Boost Your Knowledge with Quizzes! 🏆

Taking quizzes is one of the most effective ways to reinforce your learning. It's called **Active Recall**. 

**How to prepare:**
1. Review the lessons inside a Course module.
2. Summarize key concepts in your own words.
3. Open the **Quiz Panel** for that course and test your knowledge.
4. Review correct/incorrect answers along with the explanations.

*If you score poorly, don't worry! You can retake quizzes as many times as you like to build confidence.*`;
  }

  if (query.includes('gate')) {
    return `### GATE CS Preparation: Theory of Computation & Algorithms ⚙️

The **Graduate Aptitude Test in Engineering (GATE)** requires strong conceptual fundamentals. Our platform currently hosts prep syllabus modules on:
- **Theory of Computation**: DFA construction, NFA, context-free languages.
- **Algorithms**: Recurrence relations, asymptotic analysis (Big-O), and complexity theory.

#### Key Tips for GATE:
1. **DFA Minimization**: Minimize DFA states before solving questions.
2. **Master Theorem**: Apply standard comparison limits:
   \\\\[T(n) = aT(n/b) + f(n)\\\\]
   Compare \\\\(f(n)\\\\) with \\\\(n^{\\\\log_b a}\\\\).

*Would you like to try the **GATE CS Syllabus** quiz? Go to the Courses page to start!*`;
  }

  if (query.includes('jee')) {
    return `### JEE Main & Advanced Preparation: Calculus & Limits 📐

The **Joint Entrance Examination (JEE)** requires high-level mathematical application. Our prep syllabus covers:
- **Limits, Continuity, and Differentiability**
- **L'Hôpital's Rule & expansions**

#### Essential Limits formula:
\\\\[\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin x}{x} = 1\\\\]
\\\\[\\\\lim_{x \\\\to 0} \\\\frac{e^x - 1}{x} = 1\\\\]

*Tip: In JEE, look for algebraic simplifications or standard Taylor expansions before blindly differentiating using L'Hôpital's rule.*`;
  }

  if (query.includes('upsc')) {
    return `### UPSC Civil Services Preparation: Indian Polity 🇮🇳

The **UPSC CSE** GS paper requires detail-oriented learning of the Indian Constitution, legislature, and federal structures. Our active module covers:
- **Fundamental Rights (Articles 12-35)**
- **Constitutional Remedies (Article 32)**

#### Core Pillars of Indian Polity:
1. **Legislature**: Parliament (Lok Sabha & Rajya Sabha)
2. **Executive**: President, Prime Minister, and Council of Ministers
3. **Judiciary**: Supreme Court and High Courts

*Use the Courses tab to read our **UPSC GS Syllabus** lesson and attempt Article 32 matching questions in the quiz!*`;
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('help')) {
    return `### Hello! I am your AI Study Companion. 🎓🤖

I am here to guide you on your educational journey. You can ask me anything about:
- **React & Front-End Design**
- **JavaScript & Backend Programming**
- **Python & Data Science**
- **AI & Machine Learning Concepts**
- **Learning techniques and study tips**

How can I help you learn today? Feel free to ask a specific programming question!`;
  }

  // Default synthesis reply
  return `### Interesting question! Let me break that down for you. 💡

You asked: *"${message}"*

To explore this concept, here is an organized way to study it:
1. **Deconstruct the concept**: Break it down into core principles (what is the inputs, outputs, and mechanism?).
2. **Write sandbox code**: The best way to learn is by typing and testing it locally.
3. **Take a practice test**: Solidify the knowledge by answering active questions.

If you have a specific topic like **React Hooks**, **JavaScript Promises**, **Python Data Science**, or **Machine Learning**, let me know and I will provide code snippets and guides!`;
};

exports.handleChatSession = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // If OpenAI is initialized, use it
    if (openai) {
      const messages = [
        {
          role: 'system',
          content: 'You are an elite, encouraging AI Education Assistant on an interactive learning platform. Explain concepts clearly, provide beautiful markdown structures, output compact readable code snippets when helpful, and encourage active recall. Keep answers digestible and structured.'
        }
      ];

      // Append user-assistant history (max last 6 entries to save tokens)
      if (history && Array.isArray(history)) {
        const slicedHistory = history.slice(-6);
        slicedHistory.forEach(h => {
          messages.push({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text
          });
        });
      }

      messages.push({ role: 'user', content: message });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7
      });

      const aiReply = completion.choices[0].message.content;
      return res.json({ reply: aiReply });
    }

    // Fallback simulated replies
    setTimeout(() => {
      const reply = getSimulatedReply(message);
      res.json({ reply });
    }, 800); // 800ms simulation latency for a premium natural feel
  } catch (error) {
    console.error('Chatbot controller error:', error);
    res.status(500).json({ message: 'Error processing AI chat query' });
  }
};
