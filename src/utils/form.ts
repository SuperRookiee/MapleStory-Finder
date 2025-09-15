/**
 * FormData를 일반 객체로 변환하는 범용 유틸 함수
 * - key에 값이 1개면 단일값
 * - key에 값이 여러 개면 배열로 변환
 *
 * @param formData FormData 객체
 * @returns 객체 형태의 데이터 (Record<string, FormDataEntryValue | FormDataEntryValue[]>)
 */
export const convertFormData = (
  formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> => {
  const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  const keys = Array.from(formData.keys());
  const uniqueKeys = [...new Set(keys)];
  for (const key of uniqueKeys) {
    const values = formData.getAll(key);
    result[key] = values.length === 1 ? values[0] : values;
  }
  return result;
};

/**
 * FormData를 객체 배열로 변환하는 유틸 함수
 * - 각 key에 대해 getAll()로 배열 수집
 * - 인덱스를 기준으로 동일 위치 데이터를 묶어 객체 배열 생성
 */
export const convertFormDataToObjectList = <T>(
  formData: FormData,
  keys: (keyof T)[]
): T[] => {
  const result: T[] = [];
  const valueMap: Record<string, FormDataEntryValue[]> = {};
  keys.forEach((key) => {
    valueMap[key as string] = formData.getAll(key as string);
  });
  const length = Math.max(
    ...Object.values(valueMap).map((values) => values.length)
  );
  for (let i = 0; i < length; i++) {
    const item: Partial<T> = {};
    keys.forEach((key) => {
      item[key] = valueMap[key as string]?.[i] as T[typeof key];
    });
    result.push(item as T);
  }
  return result;
};
