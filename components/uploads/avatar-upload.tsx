'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing-client'
import { updateAvatar } from '@/actions/uploads'
import { Button } from '@/components/ui/button'

interface AvatarUploadProps {
  currentImage: string | null
  name: string
}

export function AvatarUpload({ currentImage, name }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [error, setError] = useState<string | null>(null)

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const { startUpload, isUploading } = useUploadThing('avatarUploader', {
    onClientUploadComplete: async (res) => {
      const url = res[0]?.serverData?.ufsUrl
      if (!url) return
      setPreview(url)
      await updateAvatar(url)
    },
    onUploadError: (err) => {
      setError(err.message)
    },
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          {preview ? (
            <Image
              src={preview}
              alt={name}
              fill
              className="rounded-full object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {initials}
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              setError(null)
              const file = e.target.files?.[0]
              if (!file) return
              await startUpload([file])
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
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            {isUploading ? 'Uploading…' : 'Change photo'}
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 2 MB</p>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
