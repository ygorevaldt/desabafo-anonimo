import { ChangeEvent, FormEvent, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { Loading } from "./Loading";
import { errorAlert, successAlert } from "@/utils/alert";
import axios from "axios";
import { CommentType } from "@/types";

type CommentFormProps = {
  unburdenId: string;
  handleNewCommentRegistred: (comment: CommentType) => void;
};

export function CommentForm({
  unburdenId,
  handleNewCommentRegistred,
}: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  async function handleSubmitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios({
        method: "POST",
        url: "/api/v1/comment",
        data: {
          unburden_id: unburdenId,
          content,
        },
      });

      successAlert("Mensagem registrada com sucesso");

      setContent("");
      handleNewCommentRegistred(data);
    } catch (error) {
      errorAlert(
        "Serviço indisponível, tente novamente dentro de alguns minutos",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewContentValue(event: ChangeEvent<HTMLTextAreaElement>) {
    const contentWithLineBreaks = event.target.value.replace(/\n/g, "\r\n");
    setContent(contentWithLineBreaks);
  }

  return (
    <>
      <form
        onSubmit={handleSubmitComment}
        className="flex flex-col items-end gap-4 w-full"
      >
        <section className="flex flex-col gap-4 w-full">
          <header className="flex flex-col gap-2">
            <h2 className="font-bold text-xl">Deixe uma mensagem de apoio</h2>
            <div className="flex items-start gap-2 lg:items-center">
              <FaHeartbeat className="text-red-500 text-4xl md:text-xl" />
              <p className=" text-zinc-500 text-md">
                Lembre-se: este é um espaço para deixar uma mensagem positiva
                para a pessoa que registrou o desabafo.
              </p>
            </div>
          </header>
          <textarea
            className="
              m-auto p-2 w-full
              border-2 border-zinc-300 rounded-lg 
              focus:outline-none focus:shadow-md
            "
            rows={4}
            placeholder="Escreva sua mensagem de apoio aqui:"
            value={content}
            onChange={handleNewContentValue}
            required
            maxLength={2500}
            minLength={25}
          ></textarea>
        </section>
        <button type="submit" className="rose-button w-full md:w-fit">
          Enviar
        </button>
      </form>
      {isLoading && <Loading />}
    </>
  );
}
