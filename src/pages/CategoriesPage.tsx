import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { PageTransition } from "@/components/ui/PageTransition";

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <PageTransition>
      <Header />

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Kategorie</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj kategorię
          </button>
        </div>

        <CategoryManager />
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </PageTransition>
  );
}
