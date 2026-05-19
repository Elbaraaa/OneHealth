"use client";

import { Camera, Check, Upload } from "lucide-react";
import type { FormValue, Question } from "@/lib/types";

interface QuestionRendererProps {
  question: Question;
  value: FormValue;
  onChange: (value: FormValue) => void;
  error?: string;
}

function valueAsString(value: FormValue): string {
  return typeof value === "string" ? value : "";
}

function valueAsArray(value: FormValue): string[] {
  return Array.isArray(value) ? value : [];
}

function toggleOption(values: string[], option: string): string[] {
  return values.includes(option)
    ? values.filter((value) => value !== option)
    : [...values, option];
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const fieldId = `field-${question.id}`;

  return (
    <fieldset className="space-y-3">
      <div>
        <legend className="text-sm font-semibold text-ink">
          {question.label}
          {question.required ? <span className="text-public-teal"> *</span> : null}
        </legend>
        {question.helperText ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {question.helperText}
          </p>
        ) : null}
      </div>

      {question.type === "text" ? (
        <input
          id={fieldId}
          className="focus-ring w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink shadow-sm"
          value={valueAsString(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder}
          inputMode={question.id === "zipCode" ? "numeric" : "text"}
        />
      ) : null}

      {question.type === "date" ? (
        <input
          id={fieldId}
          className="focus-ring w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink shadow-sm"
          type="date"
          value={valueAsString(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}

      {question.type === "textarea" ? (
        <textarea
          id={fieldId}
          className="focus-ring min-h-28 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-ink shadow-sm"
          value={valueAsString(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder}
        />
      ) : null}

      {question.type === "multiselect" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options?.map((option) => {
            const selected = valueAsArray(value).includes(option.value);

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm font-medium transition ${
                  selected
                    ? "border-public-teal bg-soft-mint text-public-teal"
                    : "border-slate-200 bg-white text-ink hover:border-teal-200"
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() =>
                    onChange(toggleOption(valueAsArray(value), option.value))
                  }
                />
                <span
                  className={`grid size-5 place-items-center rounded border ${
                    selected
                      ? "border-public-teal bg-public-teal text-white"
                      : "border-slate-300 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {selected ? <Check className="size-3.5" /> : null}
                </span>
              </label>
            );
          })}
        </div>
      ) : null}

      {question.type === "yesno" ? (
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((option) => {
            const selected = value === option;

            return (
              <button
                key={String(option)}
                type="button"
                onClick={() => onChange(option)}
                className={`focus-ring rounded-md border px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? "border-public-teal bg-public-teal text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-200"
                }`}
              >
                {option ? "Yes" : "No"}
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === "photo" ? (
        <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 transition hover:border-public-teal hover:bg-soft-mint/60">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-soft-sky text-public-blue">
            {value === true ? (
              <Check className="size-5" aria-hidden="true" />
            ) : (
              <Camera className="size-5" aria-hidden="true" />
            )}
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-ink">
              {value === true ? "Photo noted" : "Add a photo placeholder"}
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              The MVP does not upload or analyze images.
            </span>
          </span>
          <Upload className="size-4 text-slate-400" aria-hidden="true" />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => onChange(event.target.files?.length ? true : false)}
          />
        </label>
      ) : null}

      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
