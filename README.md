# Multi-modal Content Writing Tool

This project is a **content writing editor** built with React. It allows users to write, format, and insert various content blocks like code, callouts, and inline components. The editor also supports features like mentions, undo/redo actions, and content history tracking.

## Features

### 1. **Basic Text Formatting**
- **Bold**, **Italic**, and **Underline** text styles can be applied using keyboard shortcuts (e.g., `Cmd/Ctrl + B` for bold).
- Users can toggle these text styles using buttons in the toolbar.

### 2. **Mention Users and Tags**
- The editor supports mentions, allowing users to tag other users or tags (like topics).
- Typing `@` triggers the mention list, where users can search for and select a user or tag to insert into the text.
- The mention list is filtered dynamically based on the user's input after typing `@`.
- There is an array defined in utils.js which contains the mentioned list

### 3. **Undo and Redo Actions**
- Users can undo or redo their actions in the editor.
- The undo/redo history is tracked and can be triggered using keyboard shortcuts (`Cmd/Ctrl + Z` for undo, `Cmd/Ctrl + Shift + Z` for redo).

### 4. **Content Blocks**
- **Code Block**: Insert code blocks into the document with syntax highlighting.
- **Callout Block**: Insert a callout block for emphasizing important content, styled with an icon and color.
- **Inline Component**: Insert interactive inline components that are draggable and can be customized.

### 5. **Keyboard Shortcuts**
- Custom keyboard shortcuts are supported for various actions:
  - **Cmd/Ctrl + B**: Bold
  - **Cmd/Ctrl + I**: Italic
  - **Cmd/Ctrl + U**: Underline
  - **Cmd/Ctrl + Shift + 8**: Insert Unordered List

### 6. **Content History**
- The editor automatically saves the content to history after every change, allowing users to undo or redo their actions.
- This history tracking is managed with the `saveToHistory` function.

### 7. **Rich Content Support**
- The editor supports rich content such as formatted HTML, code snippets, and interactive components, making it versatile for different types of documents.

## Installation

To get started with this project:

1. Clone the repository

2. Install the dependencies:
    npm install

3. Start the development server:
    npm start

4. Open the application in your browser at `http://localhost:3000`.

## File Structure

- **`Editor.js`**: Main editor component where text formatting and content insertion are handled.
- **`useEditorState.js`**: Custom hook for managing the editor's content state and history.
- **`Toolbar.js`**: A component containing buttons for text formatting and undo/redo actions.
- **`MentionList.js`**: A component for displaying the mention list when the user types `@`.
- **`BlockInserters.js`**: A component for inserting various content blocks like code blocks and callouts.
- **`utils.js`**: Contains mock data for users, tags, and initial content.

## How It Works

1. **Editor**:
   - The editor area is a content-editable `div` that allows the user to input text and format it dynamically.
   - Content changes are automatically saved to the editor's state and history using the `saveToHistory` function.

2. **Text Formatting**:
   - The editor supports bold, italic, and underline styles using the `document.execCommand` API. Users can format text using the toolbar buttons or keyboard shortcuts.

3. **Mentions**:
   - When the user types `@`, the mention list is displayed, showing a list of users and tags.
   - Users can select a mention, and it is inserted into the content as a styled span element.

4. **Content Insertion**:
   - Users can insert different content blocks (e.g., code blocks, callouts) into the editor. Each block has its own styling and is inserted at the cursor position.
   - The editor tracks and saves all content changes to allow undo and redo functionality.

5. **Undo/Redo**:
   - The editor uses a history stack to manage undo and redo actions. Each change is added to the history, and users can revert or redo changes using keyboard shortcuts.

## Technologies Used

- **React**: The core library used to build the editor.
- **CSS**: Used for styling the editor components.
- **Custom Hooks**: `useEditorState` hook for managing state and history.
- **ContentEditable**: HTML attribute used to make the editor area editable.

## Contact

For any questions, feel free to reach out to [Shalini Singh](mailto:singh832shalini@gmail.com).
