import { useParams, useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal/ChatModal";

export default function ChatPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
      <ChatModal
        requestId={requestId}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}
