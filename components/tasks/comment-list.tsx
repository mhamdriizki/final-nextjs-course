import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { deleteComment } from '@/actions/comments'

interface Comment {
  id: string
  body: string
  createdAt: Date
  authorId: string
  author: { name: string; email: string }
}

interface CommentListProps {
  comments: Comment[]
  currentUserId: string
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => {
        const initials = comment.author.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <li key={comment.id} className="flex gap-3">
            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
                {comment.authorId === currentUserId && (
                  <form action={deleteComment.bind(null, comment.id)}>
                    <button
                      type="submit"
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                )}
              </div>
              <p className="text-sm mt-0.5 whitespace-pre-wrap">{comment.body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
