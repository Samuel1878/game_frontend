import { toBlob } from "html-to-image";
import type { Ref } from "vue";
import { toast } from "vue-sonner";

export async function captureElement(
  elementRef: Ref<HTMLElement | null>,
  fileName: string
) {
  if (!elementRef.value) return;
  try {
    const blob = await toBlob(elementRef.value, {
    cacheBust: true,
    pixelRatio: 2,
  });

  if (!blob) return;

  const file = new File([blob], fileName, {
    type: "image/png",
  });

  if (
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
    });
    return;
  }

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
    toast.error("something_went_wrong")
  }
  
}