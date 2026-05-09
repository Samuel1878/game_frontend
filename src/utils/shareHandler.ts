export const useShare = () => {
  const share = async (payload: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    const data = {
      title: payload.title || "",
      text: payload.text || "",
      url: payload.url || window.location.href,
    };

    // ✅ Native mobile share (best option)
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        console.log("Share cancelled or failed", err);
      }
    }

    // ❌ Fallback: copy to clipboard
    const fallbackText = `${data.title}\n${data.text}\n${data.url}`;

    await navigator.clipboard.writeText(fallbackText);
    alert("Copied to clipboard");
  };

  return { share };
};