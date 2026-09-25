"use client";

// submit button that guards a destructive form action behind a native confirm dialog
export default function ConfirmSubmit({ confirmMessage }: { confirmMessage: string }) {
  return (
    <button
      type="submit"
      className="ad-delete"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      삭제
    </button>
  );
}
