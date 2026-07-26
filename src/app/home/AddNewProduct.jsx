"use client";

// We need "useState" from React to remember things like:
// 1) Is the modal open or closed?
// 2) Which step of the modal are we on?
// 3) Which category did the user click on?
import { useState } from "react";

// Icons from the lucide-react package.
// Each one is just a small ready-made SVG component we can drop into our JSX.
import { Package, X, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------
// STEP 1 DATA: The list of categories shown in the first modal.
// We keep this as a simple array so it's easy to add/remove categories later.
// ---------------------------------------------------------
const categoryList = [
  { name: "PS5 CDs", code: "D001Y" },
  { name: "PS4 CDs", code: "D002Y" },
  { name: "Pre Orders", code: "D003Y" },
  { name: "Others", code: null },
];

export default function AddNewProduct() {
  const router = useRouter();

  // isModalOpen tells us whether to show the popup (modal) or not.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // currentStep tells us which "screen" inside the modal we are on.
  // Step 1 = choose a category
  // Step 2 = only shown if the user picked "Others" (choose Add Variant / Add New Product)
  const [currentStep, setCurrentStep] = useState(1);

  // selectedCategory remembers which category card the user clicked.
  const [selectedCategory, setSelectedCategory] = useState(null);

  // This function runs when the big "Add New Product" button is clicked.
  // It opens the modal and makes sure we always start fresh at step 1.
  function openModal() {
    setIsModalOpen(true);
    setCurrentStep(1);
    setSelectedCategory(null);
  }

  // This function closes the modal completely and resets everything.
  function closeModal() {
    setIsModalOpen(false);
    setCurrentStep(1);
    setSelectedCategory(null);
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category.name);

    if (category.name === "Others") {
      setCurrentStep(2);
    } else {
      const categoryName = encodeURIComponent(category.name);
      const categoryCode = encodeURIComponent(category.code);

      router.push(
        `/add-items?category_name=${categoryName}&code=${categoryCode}`
      );
    }
  }

  // This function runs when the user clicks "Back" on Step 2.
  // It just takes them back to Step 1.
  function handleStep2Back() {
    setCurrentStep(1);
  }

  function handleAddVariant() {
    router.push("/add-variant");
  }

  function handleAddNewProduct() {
    setCurrentStep(3);
  }

  function handleStep3Back() {
    setCurrentStep(2);
  }

  function handleAddFreshProduct() {
    router.push("/add-product");
  }

  function handleAddSpecialEdition() {
    router.push("/add-special-edition");
  }

  return (
    <div>
      {/* This is the ONLY button on the page, as requested. */}
      <button
        onClick={openModal}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Plus className="h-5 w-5" />
        Add New Product
      </button>

      {/* We only render the modal when isModalOpen is true. */}
      {isModalOpen && (
        // This dark, semi-transparent background covers the whole screen
        // and sits behind the white modal box.
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:px-20">
          {/* The white modal box itself */}
          <div className="w-full rounded-xl bg-white p-8 shadow-lg">
            {/* ---------------- STEP 1: Choose Category ---------------- */}
            {currentStep === 1 && (
              <div>
                {/* Header row: title on the left, close (X) button on the right */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Product</h2>
                    <p className="text-gray-500">
                      Select a product category to get started
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <h3 className="mb-3 font-semibold">Select Category</h3>

                {/* Grid of category cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {categoryList.map((category) => {
                    // Check if this specific card is the one the user selected.
                    const isSelected = selectedCategory === category.name;

                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category)}
                        className={`cursor-pointer rounded-xl border p-6 text-center hover:border-blue-400 ${
                          isSelected
                            ? "border-blue-600 ring-2 ring-blue-600"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Box icon */}
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                        <p className="font-semibold">{category.name}</p>
                        {category.code && (
                          <p className="text-sm text-gray-400">
                            {category.code}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ---------------- STEP 2: Only shown for "Others" ---------------- */}
            {currentStep === 2 && (
              <div>
                {/* Header row: title on the left, close (X) button on the right */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Product</h2>
                    <p className="text-gray-500">
                      Choose whether to add a variant or a new product
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Two big choice boxes side by side */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="w-full cursor-pointer rounded-xl border-2 border-gray-200 p-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold">Add Variant</p>
                    <p className="mt-2 text-gray-500">
                      Add a new variant to an existing product
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddNewProduct}
                    className="w-full cursor-pointer rounded-xl border-2 border-gray-200 p-10 text-center transition-colors hover:border-green-400 hover:bg-green-50"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-500">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-lg font-semibold">Add New Product</p>
                    <p className="mt-2 text-gray-500">
                      Create a completely new product with specifications
                    </p>
                  </button>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleStep2Back}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="mb-10 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Add New Product</h2>
                    <p className="mt-1 text-gray-500">
                      Choose the type of new product to add
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddSpecialEdition}
                    className="w-full cursor-pointer rounded-xl border-2 border-gray-200 p-10 text-center transition-colors hover:border-amber-300 hover:bg-amber-50"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-200">
                      <Package className="h-6 w-6 text-amber-700" />
                    </div>
                    <p className="text-lg font-semibold">Add Special Edition</p>
                    <p className="mt-2 text-gray-500">
                      Add a special edition of an existing product
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddFreshProduct}
                    className="w-full cursor-pointer rounded-xl border-2 border-gray-200 p-10 text-center transition-colors hover:border-green-400 hover:bg-green-50"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-200">
                      <Plus className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold">Add Fresh Product</p>
                    <p className="mt-2 text-gray-500">
                      Create a completely new product with fresh specifications
                    </p>
                  </button>
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={handleStep3Back}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
