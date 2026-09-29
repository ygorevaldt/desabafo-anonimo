import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenForm } from "@/components/UnburdenForm";

export default function Unburden() {
  return (
    <DinamicPage className="py-6 sm:py-10">
      <main>
        <UnburdenForm />
      </main>
    </DinamicPage>
  );
}
