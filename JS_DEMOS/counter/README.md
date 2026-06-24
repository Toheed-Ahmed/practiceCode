# Chronos // High-Fidelity Utility Engine

Chronos is a dual-purpose interface application containing a structured state counter and a performance stopwatch split utility tracking tool. Built natively using vanilla technologies, the project highlights semantic clean design principles alongside efficient script lifecycle executions.

---

## 🚀 Features

### Core Counter Module
- **Fluid Stateful Mutation Engine:** Increment, decrement, and clear operations running seamlessly at runtime.
- **Dynamic Variable Validations:** Interactive configuration controls preventing counter thresholds from entering negative states when checked.
- **Action UI Transitions:** Micro-interaction physics styling triggers visual frame scaling depending on button behaviors.

### Performance Stopwatch Module
- **Delta Timestamp Evaluations:** Re-calculates intervals using precise server timestamps (`Date.now()`) instead of counting execution loops directly, preventing operational drift.
- **Dynamic Layout Visibility:** Buttons switch visibility states reactively between active operation views (Start, Pause, Resume).
- **Reverse Split Lap Array Stack:** Dynamic runtime fragments assemble and sort lap variables efficiently using performant memory management.

---

## 🛠️ Technologies Used
- **Markup Layer:** HTML5 Structure
- **Design Layout Sheets:** CSS3 Custom Properties Variables, Flexbox Grids, Component Transition Layers
- **Logic Matrix Processing:** JavaScript ES6+ Architecture
- **Web Type Foundry:** Plus Jakarta Sans & JetBrains Mono Fonts via Google Fonts

---

## 💡 JavaScript Concepts Practiced
1. **Dynamic High-Frequency Tickers:** Orchestrating `setInterval` and `clearInterval` window processes to draw clean frames at 10ms rates.
2. **Tabbed Panel Navigation Routings:** Driving state toggles cleanly using custom dataset attributes (`data-target`) to minimize DOM overhead.
3. **Optimized Batch Mutations:** Utilizing offscreen document fragments (`document.createDocumentFragment()`) to safely iterate and inject arrays without triggering continuous reflow processes.
4. **Isolated Operational State Scope Variables:** Restricting metrics tightly to local module structures to fully decouple modules from polluting global namespaces.

---

## 📦 How to Run
1. Download or clone this repository structure into a workspace directory.
2. Ensure `index.html`, `style.css`, and `script.js` live alongside each other within the same tree.
3. Open `index.html` inside any web browser, or launch using extensions like Visual Studio Code Live Server.

---

## 🔮 Future Improvements
- **Keyboard Shortcuts:** Listen to key events like Spacebar to toggle the stopwatch status instantly.
- **Persistent State Cache:** Save the current counter state and lap lists to browser local storage across page refreshes.