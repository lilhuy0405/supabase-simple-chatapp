import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { supabase } from "../supbase";

const ChatRoom = ({ user }: any) => {
  const dummy = useRef<any>();
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    try {
      //show last 50 messages
      const { data, error } = await supabase
        .from("messages")
        .select()
        .order("created_at", { ascending: true })
        .limit(50);
      if (error) throw error;
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  //listen for new messages
  useEffect(() => {
    const chanel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async () => {
          await fetchMessages();
          if (dummy.current)
            dummy.current.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(chanel);
    };
  }, []);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    try {
      if (!user) throw new Error("You must be logged in");
      console.log(user);
      const { error } = await supabase.from("messages").insert({
        text: formValue,
        user_id: user.id,
        sender_name: user.email,
        created_at: new Date(),
      });
      if (error) throw error;
    } catch (err) {
      console.log(err);
    } finally {
      setFormValue("");
      if (dummy.current) dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} user={user} />
          ))}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
};

export default ChatRoom;
