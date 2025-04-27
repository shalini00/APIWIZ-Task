import React from "react";

const BlockInserters = ({saveToHistory, focusEditor}) => {


    const insertCodeBlock = () => {
        // Insert code block 
        focusEditor();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
    
        // Get the selected text
        let selectedText = selection.toString();
        const defaultText = "// Write your code here...";
        // Check if no text is selected
        const isDefault = !selectedText;
    
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.contentEditable = "true";
        code.textContent = isDefault ? defaultText : selectedText;
    
        // Style the <pre> block
        pre.appendChild(code);
        pre.style.background = "#f4f4f4";
        pre.style.padding = "10px";
        pre.style.borderRadius = "5px";
        pre.style.overflowX = "auto";
        pre.style.whiteSpace = "pre-wrap";
    
        // Insert pre into document
        range.deleteContents();
        range.insertNode(pre);
    
        // Insert a space after
        const space = document.createTextNode(' ');
        range.insertNode(space);
        range.setStartAfter(space);
        range.collapse(true);
    
        selection.removeAllRanges();
        selection.addRange(range);
    
        // focus the <code> so that user can type immediately
        code.focus();
    
        // After focusing, check if it is default text, then clear it
        setTimeout(() => {
            if (code.textContent === defaultText) {
                code.textContent = "";
            }
        }, 0);
    };
    
    
    const insertCalloutBlock = () => {
        // Insert a callout block with a default message
        focusEditor();
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.innerText = "💡 Callout: Write something important!";
        div.style.background = "#e0f7fa";
        div.style.padding = "10px";
        div.style.borderLeft = "5px solid #00bcd4";
        div.style.margin = "10px 0";
        div.style.borderRadius = "5px";

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(div);
        const space = document.createTextNode(' ');
        range.insertNode(space);
        range.setStartAfter(space);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleDragStart = (event) => {
        // Handle drag events for inline components
        event.dataTransfer.setData("text", event.target.innerText);
    };

    const insertInlineComponent = () => {
        // Insert an inline component with drag support
        focusEditor();
        const span = document.createElement("span");
        span.contentEditable = "false";
        span.className = "inline-component";
        span.innerText = "Interactive";
        span.style.backgroundColor = "yellow";
        span.draggable = true;
        span.tabIndex = 0;
        span.addEventListener("dragstart", handleDragStart);
    
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
        const space = document.createTextNode(' ');
        range.insertNode(space);
        range.setStartAfter(space);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        saveToHistory();
    };

    return (
        <div className="block-inserters">
            <button onClick={() => insertInlineComponent()}>Insert Inline Component</button>
            <button onClick={insertCodeBlock}>Insert Code Block</button>
            <button onClick={insertCalloutBlock}>Insert Callout Block</button>
        </div>
    );
};

export default BlockInserters;
