import React from "react";

const MentionList = ({ mentionList, mentionPosition, insertMention }) => (
    <ul
        className="mention-list"
        style={{
            position: "absolute",
            top: mentionPosition.top + 5,
            left: mentionPosition.left,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            listStyle: "none",
            padding: "5px",
            margin: 0,
            zIndex: 1000,
            width: "200px",
        }}
    >
        {mentionList.map((item, index) => (
            <li
                key={index}
                onMouseDown={() => insertMention(item)}
                style={{ padding: "5px", cursor: "pointer" }}
            >
                {item.name ? `👤 ${item.name}` : `🏷️ ${item.label}`}
            </li>
        ))}
    </ul>
);

export default MentionList;
