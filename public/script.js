const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

let messages = [];

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  // tampilkan pesan user
  addMessage(text, "user");
  messages.push({ role: "user", content: text });
  input.value = "";

  // indikator loading
  addMessage("⏳ Gemini sedang berpikir...", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();

    // hapus indikator loading
    chatBox.lastChild.remove();

    if (data.reply) {
      addMessage(data.reply, "bot");
      messages.push({ role: "assistant", content: data.reply });
    } else {
      addMessage("Maaf, AI tidak memberikan jawaban.", "bot");
    }

  } catch (err) {
    chatBox.lastChild.remove();
    addMessage("❌ Gagal terhubung ke server.", "bot");
    console.error(err);
  }
});
