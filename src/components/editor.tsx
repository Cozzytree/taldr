import StarterKit from "@tiptap/starter-kit";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";

import { Color } from "@tiptap/extension-color";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Button } from "./ui/button";
import {
  Bold,
  Code,
  Redo,
  List,
  Undo,
  Minus,
  Quote,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ListOrdered,
  Strikethrough,
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-5 bg-background z-50 mb-9">
      <div className="px-3 py-2 button-group flex flex-wrap gap-1 border-b border-b-foreground/30">
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Bold />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <Italic />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <Strikethrough />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <Code />
        </Button>
        <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </Button>
        <Button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </Button>
        <Button
          size={"sm"}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "bg-foreground/60" : ""}
        >
          Paragraph
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-foreground/65" : ""
          }
        >
          <Heading1 />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-foreground/60" : ""
          }
        >
          <Heading2 />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-foreground/60" : ""
          }
        >
          <Heading3 />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "bg-foreground/60" : ""
          }
        >
          <Heading4 />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "bg-foreground/60" : ""
          }
        >
          <Heading5 />
        </Button>
        <Button
          size={"icon"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "bg-foreground/60" : ""
          }
        >
          <Heading6 />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-foreground/60" : ""}
        >
          <List />
        </Button>
        <Button
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-foreground/60" : ""}
        >
          <ListOrdered />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-foreground/60" : ""}
        >
          <Code />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-foreground/60" : ""}
        >
          <Quote />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </Button>
        <Button
          size={"sm"}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo />
        </Button>
        <Button
          size={"icon"}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "bg-foreground/60"
              : ""
          }
        >
          Purple
        </Button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ HTMLAttributes: [ListItem.name] }),
  // TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const content = `
<h2>
  Hi there,
</h2>
`;

const Editor = ({
  id,
  userId,
  initialData,
  editable = true,
  handleUpdateDocument,
}: {
  id?: string;
  userId?: string;
  editable?: boolean;
  initialData?: string;
  handleUpdateDocument?: () => (document: string) => void;
}) => {
  return (
    <EditorProvider
      editable={editable}
      onTransaction={(data) => {
        if (!userId || !id) return;
        handleUpdateDocument?.()(data.editor.getHTML());
      }}
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={initialData || content}
    />
  );
};
export default Editor;
