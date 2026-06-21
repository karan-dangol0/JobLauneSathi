import { ChevronDown, DollarSign, Filter, Layers, X } from "lucide-react";
import SalaryRangeSlider from "../../../components/input/SalaryRangeSlider";
import { CATEGORIES, JOB_TYPES } from "../../../utils/data";

const FilterSection = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <section className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
          <Icon className="size-4 text-blue-600" />
          {title}
        </span>
        <ChevronDown
          className={`size-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </section>
  );
};

const RadioOption = ({ name, label, checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
};

const FilterContent = ({
  filters,
  filtes,
  expandedSections,
  expandedSection,
  toggleSection,
  clearAllFilters,
  handleFilterChange,
  handleFilterchange,
}) => {
  const activeFilters = filters || filtes || {};
  const activeExpandedSections = expandedSections || expandedSection || {};
  const onFilterChange = handleFilterChange || handleFilterchange || (() => {});

  const hasActiveFilters = [
    activeFilters.category,
    activeFilters.type,
    activeFilters.minSalary,
    activeFilters.maxSalary,
  ].some(Boolean);

  const handleSalaryChange = ({ minSalary, maxSalary }) => {
    onFilterChange("minSalary", minSalary);
    onFilterChange("maxSalary", maxSalary);
  };

  const clearSalary = () => {
    onFilterChange("minSalary", "");
    onFilterChange("maxSalary", "");
  };

  return (
    <div className="max-h-[calc(100vh-12rem)] space-y-5 overflow-y-auto overflow-x-hidden pr-2 overscroll-contain">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-500">Refine results</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            <X className="size-3.5" />
            Clear
          </button>
        )}
      </div>

      <FilterSection
        title="Job Type"
        icon={Filter}
        isOpen={activeExpandedSections.jobType ?? true}
        onToggle={() => toggleSection?.("jobType")}
      >
        <RadioOption
          name="job-type"
          label="All job types"
          checked={!activeFilters.type}
          onChange={() => onFilterChange("type", "")}
        />
        {JOB_TYPES.map((type) => (
          <RadioOption
            key={type.value}
            name="job-type"
            label={type.label}
            checked={activeFilters.type === type.value}
            onChange={() => onFilterChange("type", type.value)}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Salary Range"
        icon={DollarSign}
        isOpen={activeExpandedSections.salary ?? true}
        onToggle={() => toggleSection?.("salary")}
      >
        <SalaryRangeSlider
          minValue={activeFilters.minSalary || ""}
          maxValue={activeFilters.maxSalary || ""}
          onChange={handleSalaryChange}
          onClear={clearSalary}
        />
      </FilterSection>

      <FilterSection
        title="Categories"
        icon={Layers}
        isOpen={activeExpandedSections.categories ?? true}
        onToggle={() => toggleSection?.("categories")}
      >
        <RadioOption
          name="category"
          label="All categories"
          checked={!activeFilters.category}
          onChange={() => onFilterChange("category", "")}
        />
        {CATEGORIES.map((category) => (
          <RadioOption
            key={category.value}
            name="category"
            label={category.label}
            checked={activeFilters.category === category.value}
            onChange={() => onFilterChange("category", category.value)}
          />
        ))}
      </FilterSection>
    </div>
  );
};

export default FilterContent;
