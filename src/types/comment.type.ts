export type CommentType = {
  id: string;
  content: string;
  created_at: string;
  unburden_id?: string | null;
  subcomment_id?: string | null;
  subcomments?: CommentType[];
};
