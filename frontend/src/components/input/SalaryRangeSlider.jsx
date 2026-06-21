const DEFAULT_MIN = 0;
const DEFAULT_MAX = 50000;
const DEFAULT_STEP = 500;

const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString()}`;
};

const clampValue = (value, min, max) => {
  return Math.min(Math.max(Number(value), min), max);
};

const SalaryRangeSlider = ({
  minValue = "",
  maxValue = "",
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  onChange,
  onClear,
}) => {
  const currentMin = minValue === "" ? min : clampValue(minValue, min, max);
  const currentMax = maxValue === "" ? max : clampValue(maxValue, min, max);

  const handleMinChange = (event) => {
    const nextMin = Math.min(Number(event.target.value), currentMax);
    onChange?.({ minSalary: String(nextMin), maxSalary: String(currentMax) });
  };

  const handleMaxChange = (event) => {
    const nextMax = Math.max(Number(event.target.value), currentMin);
    onChange?.({ minSalary: String(currentMin), maxSalary: String(nextMax) });
  };

  const hasValue = minValue !== "" || maxValue !== "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Salary range
          </p>
          <p className="mt-1 text-sm font-bold text-gray-900">
            {hasValue
              ? `${formatCurrency(currentMin)} - ${formatCurrency(currentMax)}`
              : "Any salary"}
          </p>
        </div>

        {hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Minimum</span>
            <span>{formatCurrency(currentMin)}</span>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentMin}
            onChange={handleMinChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-blue-100 accent-blue-600"
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Maximum</span>
            <span>{formatCurrency(currentMax)}</span>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentMax}
            onChange={handleMaxChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-blue-100 accent-blue-600"
          />
        </label>
      </div>
    </div>
  );
};

export default SalaryRangeSlider;
