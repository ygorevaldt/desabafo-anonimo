import { DinamicPage } from "@/components/DinamicPage";
import { UnburdenForm } from "@/components/UnburdenForm";

export default function Unburden() {
  return (
    <DinamicPage>
      <main className="h-screen">
        <UnburdenForm />
      </main>
    </DinamicPage>
  );
}
