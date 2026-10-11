import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const App = () => {
  const [code, setCode] = useState(`function fetchData() {
  let data = fetch("/api/data")
    .then((response) => response.json());

  return data;
}`);

  const [language, setLanguage] = useState("javascript");

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) {
      setReview("Please write or paste some code first.");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      // Apne backend API endpoint ke according URL change karna.
      const response = await fetch("http://localhost:3000/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to review your code.");
      }

      // Apne backend ke actual response structure ke according
      // data.review ko adjust karna.
      setReview(
        data.review ||
          data.result ||
          data.response ||
          data.message ||
          "No review was returned by the server.",
      );
    } catch (error) {
      setReview(
        `### ⚠️ Unable to review code\n\n${error.message}\n\nCheck whether your backend is running and the API endpoint is correct.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setReview("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error("Unable to copy code:", error);
    }
  };

  return (
    <main className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">&lt;/&gt;</div>

          <div>
            <h1>CodeLens</h1>
            <p>AI Code Reviewer</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          <span>AI Assistant</span>
        </div>
      </header>

      {/* Main workspace */}
      <section className="workspace">
        {/* Left: Code editor */}
        <div className="panel editor-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="panel-icon">&lt;/&gt;</span>
              <div>
                <h2>Code Editor</h2>
                <p>Write or paste your code</p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
              aria-label="Select programming language"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="jsx">JSX</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div className="editor-container">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                fontLigatures: true,
                lineNumbers: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                wordWrap: "on",
                padding: {
                  top: 18,
                  bottom: 18,
                },
                roundedSelection: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                bracketPairColorization: {
                  enabled: true,
                },
              }}
            />
          </div>

          <div className="editor-footer">
            <span>{code.split("\n").length} lines</span>

            <div className="editor-actions">
              <button
                className="secondary-btn"
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>

              <button
                className="secondary-btn"
                onClick={handleCopy}
                type="button"
              >
                Copy code
              </button>

              <button
                className="review-btn"
                onClick={handleReview}
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Reviewing...
                  </>
                ) : (
                  <>✦ Review Code</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI review */}
        <div className="panel review-panel">
          <div className="panel-header">
            <div className="panel-title">
              <div className="ai-icon">✦</div>

              <div>
                <h2>AI Review</h2>
                <p>Insights to improve your code</p>
              </div>
            </div>

            <span className="review-badge">
              {loading ? "Analyzing" : "Ready"}
            </span>
          </div>

          <div className="review-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-orb">✦</div>
                <h3>Analyzing your code</h3>
                <p>Checking bugs, code quality and possible improvements...</p>

                <div className="loading-bar">
                  <span></span>
                </div>
              </div>
            ) : review ? (
              <article className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1>{children}</h1>,
                    h2: ({ children }) => <h2>{children}</h2>,
                    h3: ({ children }) => <h3>{children}</h3>,
                    p: ({ children }) => <p>{children}</p>,
                    ul: ({ children }) => <ul>{children}</ul>,
                    ol: ({ children }) => <ol>{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote>{children}</blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="table-wrapper">
                        <table>{children}</table>
                      </div>
                    ),
                    pre: ({ children }) => (
                      <pre className="code-block">{children}</pre>
                    ),
                    code: ({ className, children, ...props }) => (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ),
                    hr: () => <hr />,
                  }}
                >
                  {review}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <span>✦</span>
                </div>

                <h3>Your code, reviewed smarter.</h3>

                <p>
                  Paste your code, click <strong>Review Code</strong>, and let
                  AI find bugs, explain problems and suggest better solutions.
                </p>

                <div className="feature-list">
                  <div>
                    <span>⌕</span>
                    <div>
                      <h4>Bug Detection</h4>
                      <p>Find errors and logical issues.</p>
                    </div>
                  </div>

                  <div>
                    <span>↗</span>
                    <div>
                      <h4>Better Solutions</h4>
                      <p>Get improved code with explanations.</p>
                    </div>
                  </div>

                  <div>
                    <span>◈</span>
                    <div>
                      <h4>Code Quality</h4>
                      <p>Improve readability and performance.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="review-footer">
            <span>
              <span className="footer-dot"></span>
              Powered by Gemini
            </span>

            <span>Built for developers ✦</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
