import { useEffect, useRef } from "react";
import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: content is needed to re-apply buttons on content change
  useEffect(() => {
    if (!bodyRef.current) return;

    bodyRef.current.querySelectorAll("pre").forEach((pre) => {
      // Avoid double-injecting on hot reload
      if (pre.querySelector(".copy-code-btn")) return;

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>`;

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        navigator.clipboard
          .writeText(code?.innerText ?? pre.innerText)
          .then(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>`;
            btn.classList.add("copied");
            setTimeout(() => {
              btn.classList.remove("copied");
              btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>`;
            }, 2000);
          });
      });

      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }, [content]);

  return (
    <div
      ref={bodyRef}
      className={markdownStyles["markdown-body"]}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PostBody;
