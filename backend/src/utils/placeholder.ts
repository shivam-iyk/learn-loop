const getPlaceholderData = (data: object[]) => {
  const values: any[] = [];
  const placeholders = data
    .map((item, index) => {
      const rows = Object.values(item).length;
      const offset = rows * index + 1;

      values.push(...Object.values(item));
      return `(${Array.from({ length: rows })
        .map((_, index) => `\$${offset + index}`)
        .join(", ")})`;
    })
    .join(", ");

  return { placeholders, values };
};

export default getPlaceholderData;
