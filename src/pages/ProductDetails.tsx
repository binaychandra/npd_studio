import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductForm, ClientData } from '../types';

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
  useEffect(() => {
    if (forms.length > 0) {
      const updatedForms = forms.map(form => ({
        ...form,
        country: selectedCountry || '',
        category: selectedCategory || '',
        levelOfSugar: '', // Reset sugar level when category changes
      }));
      onFormsUpdate(updatedForms);
    }
  }, [selectedCountry, selectedCategory, forms, onFormsUpdate]);

  const [editingForm, setEditingForm] = useState<ProductForm | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      baseNumberInMultipack: 0,
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

      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={forms.length === 0}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
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