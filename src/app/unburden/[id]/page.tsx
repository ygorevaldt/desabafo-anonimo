"use client";

import { useEffect, useState } from "react";
import { UnburdenType } from "@/types/unburden.type";
import { errorAlert } from "@/utils/alert";
import { Loading } from "@/components/Loading";
import { Unburden } from "@/components/Unburden";
import { DinamicPage } from "@/components/DinamicPage";
import { SupportButton } from "@/components/SupportButton";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { CommentType } from "@/types";
import {
  fetchUnburdenComments,
  fetchUniqueUnburden,
  registerSupportToUnburden,
} from "@/http";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [unburden, setUnburden] = useState<UnburdenType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    async function execute() {
      try {
        setIsLoading(true);
        const unburdenId = (await params).id;

        const unburden = await fetchUniqueUnburden(unburdenId);
        setUnburden(unburden);

        const comments = await fetchUnburdenComments(unburdenId);
        setComments(comments);
      } catch (error) {
        errorAlert("Serviço indisponível, tente novamente em alguns minutos");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    execute();
  }, [params, setIsLoading, setUnburden, setComments]);

  async function handleRegisterSupport() {
    if (!unburden) return;

    setUnburden({
      ...unburden,
      supports_amount: unburden.supports_amount + 1,
      supported: true,
    });
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
                sumSupport={handleRegisterSupport}
                unburden={unburden}
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
