// ./components/BlogAdmin/MarkdownEditor.jsx
import React from "react";
import { marked } from "marked";
import "./MarkdownEditor.css";

export default function MarkdownEditor({ value, onChange }) {
  const insertText = (text) => {
    const textarea = document.querySelector(".md-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.slice(0, start) + text + value.slice(end);
    onChange(newValue);

    // Կուրսորը տեղափոխել նոր ավելացված տեքստի վերջը
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="md-editor-container">
      <div className="md-editor">
        <div className="md-toolbar">
          {/* Text formatting */}
          <button type="button" onClick={() => insertText("**bold**")}>B</button>
          <button type="button" onClick={() => insertText("*italic*")}>I</button>
          <button type="button" onClick={() => insertText("~~strikethrough~~")}>S</button>
          <button type="button" onClick={() => insertText("`inline code`")}>Code</button>

          {/* Headings */}
          <button type="button" onClick={() => insertText("# Heading 1\n")}>H1</button>
          <button type="button" onClick={() => insertText("## Heading 2\n")}>H2</button>
          <button type="button" onClick={() => insertText("### Heading 3\n")}>H3</button>

          {/* Lists */}
          <button type="button" onClick={() => insertText("- List item\n")}>UL</button>
          <button type="button" onClick={() => insertText("1. List item\n")}>OL</button>

          {/* Links and Images */}
          <button type="button" onClick={() => insertText("[link text](https://example.com)")}>Link</button>
          <button
            type="button"
            onClick={() =>
              insertText("![image description](https://example.com/image.jpg)")
            }
          >
            Img
          </button>

          {/* Blockquote */}
          <button type="button" onClick={() => insertText("> Blockquote\n")}>Quote</button>

          {/* Horizontal line */}
          <button type="button" onClick={() => insertText("---\n")}>HR</button>

          {/* Code block */}
          <button type="button" onClick={() => insertText("```\nCode block\n```\n")}>Code Block</button>
        </div>

        <textarea
          className="md-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write markdown content..."
        />
      </div>

      {/* Live preview */}
      <div
        className="md-preview"
        dangerouslySetInnerHTML={{ __html: marked(value || "") }}
      />
    </div>
  );
}
