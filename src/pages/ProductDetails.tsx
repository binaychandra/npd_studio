import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductForm, ClientData, ProductSubmissionResponse } from '../types';
import { submitAllProducts } from '../services/api';

const MAX_CARDS = 6;

interface ProductDetailsProps {
  forms: ProductForm[];
  distributionData: Map<string, ClientData[]>;
  onFormsUpdate: (forms: ProductForm[]) => void;
  onDistributionDataUpdate: (formId: string, data: ClientData[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  selectedCountry: string | null;
  selectedCategory: string | null;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  forms,
  distributionData,
  onFormsUpdate,
  onDistributionDataUpdate,
  onBack,
  onSubmit,
  selectedCountry,
  selectedCategory,
}) => {
  // Update forms when country or category changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (forms.length > 0 && (selectedCountry !== null || selectedCategory !== null)) {
      const updatedForms = forms.map(form => ({
        ...form,
        country: selectedCountry || form.country || '',
        category: selectedCategory || form.category || '',
        ...(selectedCategory !== null && form.category !== selectedCategory ? { levelOfSugar: '' } : {}),
      }));
      
      // Check if there are actual changes to avoid unnecessary updates
      const hasChanges = updatedForms.some((updatedForm, index) => {
        const originalForm = forms[index];
        return (
          updatedForm.country !== originalForm.country ||
          updatedForm.category !== originalForm.category ||
          updatedForm.levelOfSugar !== originalForm.levelOfSugar
        );
      });

      if (hasChanges) {
        onFormsUpdate(updatedForms);
      }
    }
  }, [selectedCountry, selectedCategory]); // Remove forms and onFormsUpdate from dependencies

  const [editingForm, setEditingForm] = useState<ProductForm | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createNewForm = () => {
    const newForm: ProductForm = {
      id: Date.now().toString(),
      baseCode: '',
      scenario: '',
      weekDate: '',
      levelOfSugar: '',
      packGroup: '',
      productRange: '',
      segment: '',
      superSegment: '',
      baseNumberInMultipack: '',
      flavor: '',
      choco: '',
      salty: '',
      weightPerUnitMl: 0,
      listPricePerUnitMl: 0,
      isMinimized: false,
      isDetailedModel: false,
      country: selectedCountry || '',
      category: selectedCategory || '',
    };
    setEditingForm(newForm);
    setShowModal(true);
  };

  const handleClone = (form: ProductForm) => {
    const clonedForm: ProductForm = {
      ...form,
      id: Date.now().toString(),
      baseCode: `Clone of ${form.baseCode}`,
      scenario: `Clone of ${form.scenario}`,
      isDetailedModel: false, // Reset to general model for cloned card
      country: selectedCountry || form.country || '', // Use selected country or original form's country
      category: selectedCategory || form.category || '', // Use selected category or original form's category
    };
    setEditingForm(clonedForm);
    setShowModal(true);
  };

  const handleEdit = (form: ProductForm) => {
    setEditingForm({ ...form });
    setShowModal(true);
  };

  const handleDelete = (formId: string) => {
    onFormsUpdate(forms.filter(form => form.id !== formId));
  };

  const handleSave = () => {
    if (editingForm) {
      const isNewForm = !forms.some(f => f.id === editingForm.id);
      if (isNewForm && forms.length >= MAX_CARDS) {
        alert(`Maximum ${MAX_CARDS} products allowed`);
        return;
      }

      const updatedForms = forms.some(f => f.id === editingForm.id)
        ? forms.map(f => f.id === editingForm.id ? editingForm : f)
        : [...forms, editingForm];
      onFormsUpdate(updatedForms);
    }
    setShowModal(false);
    setEditingForm(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <button
          onClick={createNewForm}
          disabled={forms.length >= MAX_CARDS}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            forms.length >= MAX_CARDS
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Plus size={20} />
          Add New Product {forms.length >= MAX_CARDS && `(Max ${MAX_CARDS})`}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {forms.map((form) => (
          <ProductCard
            key={form.id}
            product={form}
            onEdit={() => handleEdit(form)}
            onDelete={() => handleDelete(form.id)}
            onClone={() => handleClone(form)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {submitError && (
          <div className="text-red-500 text-sm mb-2">
            Error: {submitError}
          </div>
        )}
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={async () => {
              setSubmitError(null);
              setIsSubmitting(true);
              try {
                const responses = await submitAllProducts(forms);
                // Check if any submission failed
                const failedSubmissions = responses.filter(r => r.status === 'error');
                if (failedSubmissions.length > 0) {
                  setSubmitError(`Failed to submit ${failedSubmissions.length} products`);
                  return;
                }
                onSubmit();
              } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Failed to submit products');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={forms.length === 0 || isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>

      {showModal && editingForm && (
        <ProductFormModal
          form={editingForm}
          distributionData={distributionData.get(editingForm.id) || []}
          onUpdate={setEditingForm}
          onClose={() => {
            setShowModal(false);
            setEditingForm(null);
          }}
          onSave={handleSave}
          onDistributionDataUpdate={(data) => onDistributionDataUpdate(editingForm.id, data)}
        />
      )}
    </div>
  );
};