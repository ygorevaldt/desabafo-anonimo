import { CommentType } from "@/types";

type CommentListProps = {
  comments: CommentType[];
};

export function CommentList({ comments }: CommentListProps) {
  return (
    <ul className="flex flex-col gap-4 pl-4 items-start list-decimal">
      {comments[0] ? (
        comments.map((comment) => (
          <li
            key={comment.id}
            className="w-full border-b-2 py-4 px-2 hover:rounded-lg hover:bg-zinc-100 duration-200"
          >
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </li>
        ))
      ) : (
        <p className="text-zinc-500 text-md">Nenhuma mensagem registrada.</p>
      )}
    </ul>
  );
}
