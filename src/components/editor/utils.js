/*
    1. Define an array of user objects, each containing a name and a role.
    2. This is used for populating the mention list with users. The role can be useful for displaying different kinds of information when a user is mentioned.    
*/
export const users = [
    { name: "Shalini Singh", role: "Admin" },
    { name: "Prantik Sarkar", role: "Editor" },
    { name: "Shivangi Verma", role: "Contributor" },
];

/*
    1. Define an array of tag objects, each containing a label.
    2. This is used for populating the mention list with tags (e.g., topics).
*/
export const tags = [
    { label: "JavaScript" },
    { label: "React" },
    { label: "CSS" },
];

/*
    1. Define an initial content state for the editor.
    2. The structure allows for easy updating of the content state when users start editing.
*/
export const initialContent = [
    { text: "<p>Start writing here</p>" }
];
