import React from "react";

const Toolbar = ({ isBold, isItalic, isUnderline, formatText, undo, redo, insertList }) => (
  <div className="toolbar">
    <button onClick={() => insertList("ul")}>Unordered List</button>
    <button onClick={() => insertList("ol")}>Ordered List</button>
    {/* Other formatting buttons like bold, italic, underline */}
    <button onClick={() => formatText("bold")}><b>Bold</b></button>
    <button onClick={() => formatText("italic")}><i>Italic</i></button>
    <button onClick={() => formatText("underline")}><u>Underline</u></button>
    <button onClick={undo}>Undo &#8634;</button>
    <button onClick={redo}>Redo &#8635;</button>
  </div>
);

export default Toolbar;
