"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UnburdenType } from "@/types/unburden.type";
import { errorAlert } from "@/utils/alert";
import { Loading } from "@/components/Loading";
import { Unburden } from "@/components/Unburden";
import { DinamicPage } from "@/components/DinamicPage";
import { SupportButton } from "@/components/SupportButton";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { CommentType } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [unburden, setUnburden] = useState<UnburdenType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    async function fetchUnburden() {
      setIsLoading(true);

      const unburdenId = (await params).id;

      const response = await axios.get(`/api/v1/unburden/${unburdenId}`, {
        withCredentials: true,
      });
      const { unburden } = response.data;
      setUnburden(unburden);
    }

    async function fetchComments() {
      const unburdenId = (await params).id;

      const response = await axios.get(`/api/v1/comment`, {
        params: {
          unburden_id: unburdenId,
        },
        withCredentials: true,
      });

      const { comments } = response.data;
      setComments(comments);
      setIsLoading(false);
    }

    fetchUnburden();
    fetchComments();
  }, []);

  async function handleRegisterSupport() {
    try {
      if (unburden?.supported) {
        alert("Você já apoiou este desabafo.");
        return;
      }

      if (unburden === null) return;

      await axios.post("/api/v1/support", { unburden_id: unburden.id });
      setUnburden({
        ...unburden,
        supports_amount: unburden.supports_amount + 1,
        supported: true,
      });
    } catch (error) {
      errorAlert("Serviço indisponível, tente novamente em alguns minutos");
      console.error(error);
    }
  }

  function handleNewCommentRegistred(comment: CommentType) {
    setUnburden({
      ...unburden!,
      comments_amount: unburden!.comments_amount + 1,
    });
    setComments((currentState) => {
      return [comment, ...currentState];
    });
  }

  return (
    <DinamicPage className="max-w-6xl md:px-4">
      {unburden !== null && (
        <div className="flex flex-col gap-10">
          <div className=" md:bg-zinc-50 md:p-4 rounded-lg md:shadow-md">
            <Unburden data={unburden} />
            <div className="flex justify-end mt-2">
              <SupportButton
                registerSupport={handleRegisterSupport}
                disabled={unburden.supported}
                className="bg-white"
              />
            </div>
          </div>
          <article
            className="
            w-[95%] mx-auto flex flex-col gap-12 md:gap-8
            "
          >
            <CommentForm
              unburdenId={unburden.id}
              handleNewCommentRegistred={handleNewCommentRegistred}
            />
            <section className="flex flex-col gap-2">
              <h2 className="font-bold text-xl">Mensagens de apoio</h2>
              <CommentList comments={comments} />
            </section>
          </article>
        </div>
      )}
      {isLoading && <Loading />}
    </DinamicPage>
  );
}
