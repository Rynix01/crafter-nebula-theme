import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { nodes as editorNodes } from "@/components/blocks/editor-00/nodes";

interface LexicalViewerProps {
  content: any; // Lexical JSON
  className?: string;
}

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1 rounded text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  },
  quote: "border-l-4 border-blue-400 pl-4 text-gray-600 dark:text-gray-300 my-2",
  list: {
    nested: { listitem: "ml-6" },
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
    listitem: "mb-1",
  },
  code: "bg-gray-100 p-2 rounded text-sm font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-100 my-2",
  heading: {
    h1: "text-3xl font-bold my-2",
    h2: "text-2xl font-bold my-2",
    h3: "text-xl font-bold my-2",
    h4: "text-lg font-bold my-2",
    h5: "text-base font-bold my-2",
    h6: "text-sm font-bold my-2",
  },
  link: "text-blue-600 underline hover:text-blue-800",
};

function onError(error: Error) {
  console.error(error);
}

// Default empty editor state to prevent Lexical errors
const defaultEditorState = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

export default function LexicalViewer({ content, className }: LexicalViewerProps) {
  // Validate content before rendering
  const isValidContent = content && 
    typeof content === 'object' && 
    content.root && 
    content.root.children && 
    content.root.children.length > 0;

  // If content is invalid or empty, show the alert
  if (!isValidContent) {
    return (
      <Alert className="max-w-2xl mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          İçerik görüntülenemiyor. Bu alanı <b>Crafter Yönetim Paneli → Ayarlar → Legal Sayfa Ayarları</b> bölümünden güncelleyebilirsiniz.
        </AlertDescription>
      </Alert>
    );
  }

  try {
    const initialConfig = {
      namespace: "Viewer",
      theme,
      onError,
      editable: false,
      editorState: JSON.stringify(content),
      nodes: editorNodes,
    };

    return (
      <LexicalComposer initialConfig={initialConfig} key={JSON.stringify(content)}>
        <div className={"prose dark:prose-invert max-w-none " + (className || "") }>
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none" readOnly />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    );
  } catch (e) {
    return (
      <Alert className="max-w-2xl mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          İçerik görüntülenemiyor. Bu alanı <b>Crafter Yönetim Paneli → Ayarlar → Legal Sayfa Ayarları</b> bölümünden güncelleyebilirsiniz.
        </AlertDescription>
      </Alert>
    );
  }
}   