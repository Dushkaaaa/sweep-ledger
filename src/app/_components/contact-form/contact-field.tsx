type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  name: string;
  required?: boolean;
};

export default function ContactField({
  label,
  placeholder,
  type = "text",
  name,
  required,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="
          w-full rounded-xl 
          border border-slate-200 
          px-4 py-3 
          outline-none
          transition
          focus:border-sky-500
        "
      />
    </div>
  );
}