import type { SerializableParam } from "recoil";
import { selectorFamily } from "recoil";
import { lightningQuery, queryPerformanceMaxSearch } from "../queryPerformance";

export const lightningStringResults = selectorFamily<
  string[],
  {
    path: string;
    exclude?: string[];
    filters: SerializableParam;
    index?: string;
    search?: string;
    maxDocumentsSearch?: number;
  }
>({
  key: "lightningStringResults",
  get:
    (params) =>
    ({ get }) => {
      const [data] = get(
        lightningQuery([
          { ...params, maxDocumentsSearch: get(queryPerformanceMaxSearch) },
        ])
      );

      if (
        data.__typename !== "StringLightningResult" &&
        data.__typename !== "ObjectIdLightningResult"
      ) {
        throw new Error(
          `unexpected ${data.__typename} for path '${params.path}' in lightningStringResults`
        );
      }

      if (!data.values) {
        return null;
      }

      return [...data.values];
    },
});
