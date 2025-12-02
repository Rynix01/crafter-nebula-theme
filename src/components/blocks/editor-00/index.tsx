"use client"

import { useState, useEffect } from "react"
import { SerializedEditorState } from "lexical"

import { Editor } from "@/components/blocks/editor-00/editor"

export const initialValue = {
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
} as unknown as SerializedEditorState

interface Editor00Props {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (value: SerializedEditorState) => void;
}

export default function Editor00({ 
  editorSerializedState, 
  onSerializedChange 
}: Editor00Props) {
  const [editorState, setEditorState] = useState<SerializedEditorState>(
    editorSerializedState || initialValue
  )

  // External state değiştiğinde internal state'i güncelle
  useEffect(() => {
    if (editorSerializedState) {
      setEditorState(editorSerializedState)
    }
  }, [editorSerializedState])

  const handleChange = (value: SerializedEditorState) => {
    setEditorState(value)
    onSerializedChange?.(value)
  }

  // Editor00'ı sadece geçerli state varsa render et
  if (!editorState) {
    return (
      <div className="bg-background overflow-hidden rounded-lg border shadow p-4">
        <div className="text-muted-foreground text-center">Editor yükleniyor...</div>
      </div>
    )
  }

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={handleChange}
    />
  )
}
