import React, { useState, useEffect, useRef } from "react";
import './Editor.css';
import useEditorState from "../../hooks/useEditorState";
import Toolbar from "./Toolbar";
import MentionList from "./MentionList";
import { users, tags, initialContent } from "./utils";
import BlockInserters from "./BlockInserters";

export default function Editor() {
  // Destructure custom hooks to manage content state and history
  const { content, setContent, saveToHistory, undo, redo } = useEditorState(initialContent);

  // Ref for the editor container
  const editorRef = useRef(null);

  // State variables for text formatting and mention handling
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionList, setMentionList] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [commandSequence, setCommandSequence] = useState("");

  const handleSelectionChange = () => {
    // Handle changes in the selection (text formatting)
    if (!editorRef.current) return;
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
  };

  const focusEditor = () => {
    // Focus the editor to allow text input or interaction
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }

  const formatText = (format, value = null) => {
    focusEditor();
    // Format selected text (bold, italic, underline)
    document.execCommand(format, false, value);
    saveToHistory();
  };

  const handleInput = (e) => {
    // Handle input change in the editor and update content state
    const html = e.target.innerHTML;
    // Update the content state with the HTML of the editor
    setContent(html);
    // Save the HTML to history
    saveToHistory(html);
  };


  const handleKeyDown = (e) => {
    // Handle keydown events for keyboard shortcuts and commands
    const selection = window.getSelection();
    const anchorNode = selection.anchorNode;

    // Handle Cmd+Shift+8 for unordered list
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "8") {
      e.preventDefault();
      insertList("ul");
    }

    // Handle custom key sequences (e.g., /bold)
    if (e.key === "/") {
      setCommandSequence("/");
      return;
    }

    if (commandSequence === "/" && e.key === "b") {
      e.preventDefault();
      formatText("bold");
      setCommandSequence("");
    } else if (commandSequence === "/" && e.key === "i") {
      e.preventDefault();
      formatText("italic");
      setCommandSequence("");
    }

    // Standard formatting shortcuts (bold, italic, underline)
    if (e.metaKey && e.key === "b") {
      e.preventDefault();
      document.execCommand("bold");
    }

    if (e.metaKey && e.key === "i") {
      e.preventDefault();
      document.execCommand("italic");
    }

    if (e.metaKey && e.key === "u") {
      e.preventDefault();
      document.execCommand("underline");
    }

    // Handle Tab for indentation (outdent/indent) in lists
    if (e.key === "Tab" && anchorNode) {
      if (e.shiftKey) {
        document.execCommand("outdent");
      } else {
        document.execCommand("indent");
      }
      e.preventDefault();
    }

    // Show mention list when "@" is pressed
    if (e.key === "@") {
      const { x, y } = getCaretCoordinates();
      setMentionPosition({ top: y, left: x });
      setShowMentionList(true);
      // start fresh query
      setMentionQuery("");
    }

    // Handle mention list filtering based on typed query
    if (showMentionList) {
      if (e.key === "Backspace") {
        setMentionQuery(prev => {
          const updated = prev.slice(0, -1);
          const currentText = window.getSelection()?.anchorNode?.textContent || "";
          if (!currentText.includes("@")) {
            setShowMentionList(false);
          }
          return updated;
        });
      } else if (e.key.length === 1) {
        setMentionQuery(prev => prev + e.key);
      } else if (e.key === "Escape") {
        // Hide the dropdown on escape
        setShowMentionList(false);
      }
    }
  };


  const getCaretCoordinates = () => {
    // Get caret coordinates to position mention list dropdown
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return { x: rect.left, y: rect.bottom };
  };

  const insertMention = (item) => {
    // Insert a mention into the editor
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const mentionLength = mentionQuery.length + 1;
    range.setStart(range.startContainer, range.startOffset - mentionLength);
    // Delete the @mention text
    range.deleteContents();

    const span = document.createElement("span");
    span.contentEditable = "false";
    span.className = "mention";
    span.style.background = "#e0e0ff";
    span.style.padding = "2px 5px";
    span.style.borderRadius = "5px";

    if (item.name) {
      span.innerText = `@${item.name}`;
      span.title = `Role: ${item.role}`;
    } else if (item.label) {
      span.innerText = `#${item.label}`;
      span.title = "Tag";
    }

    range.insertNode(span);

    // Insert a space after the mention
    const space = document.createTextNode(' ');
    range.insertNode(space);

    // Create a new range after the space
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    // Focus editor again after resetting range
    if (editorRef.current) {
      editorRef.current.focus();
    }

    setShowMentionList(false);
    saveToHistory();
  };

  const insertList = (type) => {
    focusEditor();
    // Insert a list (unordered or ordered) at the selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const listElement = document.createElement(type);
    const listItem = document.createElement("li");
    listItem.innerText = "";

    listElement.appendChild(listItem);

    range.deleteContents();
    range.insertNode(listElement);

    // Move the cursor inside the newly created list item
    const newRange = document.createRange();
    newRange.setStart(listItem, 0);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    saveToHistory();
  };

  const handlePaste = (e) => {
    // Handle paste event to process and insert pasted content
    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("text/html") || clipboardData.getData("text/plain");

    if (pastedData) {
      if (pastedData.includes("<")) {
        // Clean HTML content
        const cleanedData = cleanPastedHTML(pastedData);
        document.execCommand("insertHTML", false, cleanedData);
      } else {
        // Insert plain text
        document.execCommand("insertText", false, pastedData);
      }
      saveToHistory();
    }
  };

  const cleanPastedHTML = (html) => {
    // Function to clean up pasted HTML (remove unwanted styles or scripts)
    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;
    const elementsToRemove = body.querySelectorAll("style, script, link");
    elementsToRemove.forEach(el => el.remove());

    return body.innerHTML;
  };

  useEffect(() => {
    // Effect to handle dynamic mention list based on user input
    if (mentionQuery === "") {
      setMentionList([...users, ...tags]);
    } else {
      const filteredUsers = users.filter(user => user.name.toLowerCase().includes(mentionQuery.toLowerCase()));
      const filteredTags = tags.filter(tag => tag.label.toLowerCase().includes(mentionQuery.toLowerCase()));
      setMentionList([...filteredUsers, ...filteredTags]);
    }
  }, [mentionQuery]);

  useEffect(() => {
    // Set up event listener for selection changes in the editor
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div className="editor-container">
      <Toolbar
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        formatText={formatText}
        undo={undo}
        redo={redo}
        insertList={insertList}
      />

      <div
        className="editor"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{ minHeight: "200px", border: "1px solid #ccc", padding: "10px", position: "relative" }}
        dangerouslySetInnerHTML={{ __html: content.text }}
      ></div>

      {showMentionList && (
        <MentionList
          mentionList={mentionList}
          mentionPosition={mentionPosition}
          insertMention={(item) => insertMention(item)}
        />
      )}

      <BlockInserters saveToHistory={saveToHistory} focusEditor={focusEditor} />
    </div>
  );
}
