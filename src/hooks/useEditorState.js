import { useState, useCallback } from "react";

export default function useEditorState(initialContent) {
    // The useEditorState hook is responsible for managing the content of the editor and handling undo/redo functionality.

    // Stores the current content of the editor
    const [content, setContent] = useState(initialContent);
    // History stack to implement undo/redo
    const [history, setHistory] = useState([initialContent]);
    // Tracks the current position in the history
    const [currentIndex, setCurrentIndex] = useState(0);

    // Save the content to history
    const saveToHistory = useCallback((newContent) => {
        // If we're not at the end of the history stack, discard future redo states
        const newHistory = history.slice(0, currentIndex + 1);
        // Add the new content to the history stack
        setHistory([...newHistory, newContent]);
        // Update currentIndex to the latest state
        setCurrentIndex(newHistory.length);
    }, [history, currentIndex]);

    // Undo functionality
    const undo = useCallback(() => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            // Set the editor content to the previous history
            setContent(prev => ({ ...prev, text: history[prevIndex] }));
            // Move to the previous history index
            setCurrentIndex(prevIndex);
        }
    }, [currentIndex, history]);

    // Redo functionality
    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            const nextIndex = currentIndex + 1;
            // Set the editor content to the next history
            setContent(prev => ({ ...prev, text: history[nextIndex] }));
            // Move to the next history index
            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, history]);

    return {
        content,
        setContent,
        saveToHistory,
        undo,
        redo
    };
}
