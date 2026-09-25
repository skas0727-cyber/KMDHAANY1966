"use client";

// submit button that guards a destructive form action behind a native confirm dialog
export default function ConfirmSubmit({ label, confirmMessage }: { label: string; confirmMessage: string }) {
  return (
    <button
      type="submit"
      className="ad-delete"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
