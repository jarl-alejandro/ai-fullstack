import { Chatbot } from "@/components/ui/Chatbot/Chatbot";
import Image from 'next/image';
import { UserIcon } from 'lucide-react';

// Avatares como componentes para mantener la página limpia
const AssistantAvatar = () => (
  <Image
    src="/aaron-swartz-avatar.png" // Necesitarás añadir esta imagen a tu carpeta /public
    alt="Aaron Swartz"
    width={32}
    height={32}
    className="rounded-full"
  />
);

const UserAvatar = () => (
  <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0">
    <UserIcon className="text-white w-5 h-5" />
  </div>
);

export default function AaronSwartzAssistantPage() {
  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] md:h-[90vh]">
        <Chatbot
          apiEndpoint="/api/rag"
          assistantName="Recordando a Aaron Swartz"
          assistantDescription="Un tributo a su lucha por un internet libre."
          assistantAvatar={<AssistantAvatar />}
          userAvatar={<UserAvatar />}
          initialMessageTitle="Hola, soy un asistente dedicado al legado de Aaron Swartz."
          initialMessageDescription="Puedes preguntarme sobre su vida, sus logros y su impacto en el mundo digital."
          inputPlaceholder="Pregunta sobre la vida de Aaron..."
        />
      </div>
    </div>
  );
}