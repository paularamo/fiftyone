import React, { useLayoutEffect } from "react";
import Results from "../Results";

export type UseSearch<T> = {
  (search: string): { values?: T[]; total?: number };
};

type Props<T> = {
  active?: number;
  cy?: string;
  footer?: React.JSX.Element;
  search: string;
  useSearch: UseSearch<T>;
  onSelect: (value: T) => void;
  onResults: (results?: T[]) => void;
  component: React.FC<{ value: T; className?: string }>;
  toKey?: (value: T) => string;
};

export default function SearchResults<T>({
  active,
  component,
  cy,
  onResults,
  onSelect,
  search,
  footer,
  toKey = (value) => String(value),
  useSearch,
}: Props<T>) {
  const { values, total } = useSearch(search);

  useLayoutEffect(() => {
    onResults(values);
  }, [values, onResults]);

  return (
    <Results
      toKey={toKey}
      active={active}
      footer={footer}
      component={component}
      results={values}
      onSelect={onSelect}
      total={total}
      cy={cy}
    />
  );
}
