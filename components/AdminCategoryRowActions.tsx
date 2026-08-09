"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export default function AdminCategoryRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/categories/${id}`);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/admin/categories/${id}/edit`} className="text-ash/60 hover:text-ash" aria-label="Edit category">
        <Pencil size={16} />
      </Link>
      <button onClick={handleDelete} disabled={deleting} className="text-ash/60 hover:text-red-600" aria-label="Delete category">
        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
