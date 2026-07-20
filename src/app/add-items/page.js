import AddPreorderCd from "./AddPreorderCd";

export default async function Page({ searchParams }) {
  const query = await searchParams;
  const categoryNameValue = query.category_name;
  const codeValue = query.code;

  const categoryName = Array.isArray(categoryNameValue)
    ? categoryNameValue[0]
    : categoryNameValue || "";
  const code = Array.isArray(codeValue) ? codeValue[0] : codeValue || "";

  return (
    <AddPreorderCd categoryName={categoryName} code={code} />
  );
}
