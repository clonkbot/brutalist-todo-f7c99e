import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutalist-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem('brutalist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim().toUpperCase(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-mono relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid lines background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Diagonal warning stripe */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#FFB800,#FFB800_10px,#1a1a1a_10px,#1a1a1a_20px)]" />

      <main className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-16 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex items-baseline gap-2 md:gap-4 mb-2">
            <span className="text-[#FFB800] text-xs md:text-sm tracking-[0.3em]">SYS://</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter">
              TODO
            </h1>
          </div>
          <div className="h-1 bg-white w-full" />
          <div className="flex justify-between items-center mt-2 text-[10px] md:text-xs text-neutral-500 tracking-wider">
            <span>TASK_MANAGEMENT_v1.0</span>
            <span>{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
          </div>
        </header>

        {/* Input Section */}
        <div className="mb-6 md:mb-8 border-2 border-white bg-black">
          <div className="flex items-center border-b-2 border-white px-2 md:px-4 py-1 bg-[#FFB800] text-black">
            <span className="text-[10px] md:text-xs font-bold tracking-widest">NEW_TASK</span>
          </div>
          <div className="flex flex-col sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="ENTER TASK..."
              className="flex-1 bg-transparent px-3 md:px-4 py-3 md:py-4 text-sm md:text-base placeholder:text-neutral-600 focus:outline-none uppercase tracking-wide"
            />
            <button
              onClick={addTodo}
              className="sm:border-l-2 border-t-2 sm:border-t-0 border-white px-4 md:px-6 py-3 md:py-4 bg-white text-black font-bold text-sm hover:bg-[#FFB800] transition-colors duration-100 tracking-widest min-h-[44px]"
            >
              ADD+
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex mb-4 md:mb-6 border-2 border-white overflow-hidden">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 md:py-3 text-[10px] md:text-xs font-bold tracking-widest transition-colors duration-100 min-h-[44px] ${
                filter === f
                  ? 'bg-white text-black'
                  : 'bg-transparent text-white hover:bg-neutral-800'
              }`}
            >
              {f.toUpperCase()}
              <span className="ml-1 md:ml-2 opacity-60">
                [{f === 'all' ? todos.length : f === 'active' ? activeCount : completedCount}]
              </span>
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="flex-1 border-2 border-white bg-black/50 overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-white px-3 md:px-4 py-2 bg-neutral-900">
            <span className="text-[10px] md:text-xs text-neutral-500 tracking-widest">TASK_LIST</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-[10px] md:text-xs text-[#FFB800] hover:text-white transition-colors tracking-widest px-2 py-1 min-h-[36px] flex items-center"
              >
                PURGE_DONE
              </button>
            )}
          </div>

          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-neutral-600">
              <div className="text-4xl md:text-6xl mb-4">[ ]</div>
              <span className="text-xs md:text-sm tracking-widest">NO_TASKS_FOUND</span>
            </div>
          ) : (
            <ul className="divide-y-2 divide-neutral-800">
              {filteredTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 hover:bg-neutral-900/50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Index number */}
                  <span className="text-[10px] md:text-xs text-neutral-600 w-6 md:w-8 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 md:w-7 md:h-7 border-2 shrink-0 flex items-center justify-center transition-all duration-100 min-w-[24px] ${
                      todo.completed
                        ? 'bg-[#FFB800] border-[#FFB800]'
                        : 'border-neutral-500 hover:border-white'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task text */}
                  <span
                    className={`flex-1 text-xs md:text-sm tracking-wide transition-all duration-100 break-words min-w-0 ${
                      todo.completed
                        ? 'line-through text-neutral-600 decoration-[#FFB800] decoration-2'
                        : ''
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 md:opacity-0 opacity-60 text-neutral-500 hover:text-red-500 transition-all px-2 py-1 text-lg md:text-xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Delete task"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs text-neutral-500 tracking-widest">
          <div className="border border-neutral-700 px-2 md:px-3 py-1 md:py-2">
            TOTAL: <span className="text-white">{todos.length}</span>
          </div>
          <div className="border border-neutral-700 px-2 md:px-3 py-1 md:py-2">
            PENDING: <span className="text-[#FFB800]">{activeCount}</span>
          </div>
          <div className="border border-neutral-700 px-2 md:px-3 py-1 md:py-2">
            COMPLETE: <span className="text-green-500">{completedCount}</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 pt-4 border-t border-neutral-800">
          <p className="text-[10px] md:text-xs text-neutral-600 text-center tracking-wider">
            Requested by @web-user · Built by @clonkbot
          </p>
        </footer>
      </main>

      {/* Bottom warning stripe */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(-45deg,#FFB800,#FFB800_10px,#1a1a1a_10px,#1a1a1a_20px)]" />
    </div>
  );
}

export default App;
