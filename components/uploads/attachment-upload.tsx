'use client'

import { useRef, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing-client'
import { createAttachment } from '@/actions/uploads'
import { Button } from '@/components/ui/button'

interface AttachmentUploadProps {
  taskId: string
}

export function AttachmentUpload({ taskId }: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const { startUpload, isUploading } = useUploadThing('taskAttachment', {
    onClientUploadComplete: async (res) => {
      const file = res[0]
      if (!file) return
      const url = file.serverData?.ufsUrl ?? file.ufsUrl
      const filename = file.serverData?.filename ?? file.name
      await createAttachment(taskId, url, filename)
    },
    onUploadError: (err) => {
      setError(err.message)
    },
  })

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={async (e) => {
          setError(null)
          const file = e.target.files?.[0]
          if (!file) return
          await startUpload([file], { taskId })
          e.target.value = ''
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <Paperclip className="mr-1.5 h-3.5 w-3.5" />
        {isUploading ? 'Uploading…' : 'Add attachment'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
