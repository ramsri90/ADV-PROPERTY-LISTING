import { MessageCircle } from 'lucide-react';
import { FLOATING_WHATSAPP_NUMBER, getWhatsAppLink } from '@/lib/whatsapp';

const floatingMessage = "Hi, I'm looking for a property on Webb Heads. Can you help?";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={getWhatsAppLink(FLOATING_WHATSAPP_NUMBER, floatingMessage)}
      target="_blank"
      rel="noreferrer"
      title="Chat on WhatsApp for details"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform duration-200 hover:scale-105 hover:bg-[#1ebe5d]"
    >
      <MessageCircle size={28} />
    </a>
  );
}
