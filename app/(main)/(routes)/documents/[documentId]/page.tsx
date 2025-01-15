
const DocumentIdPage = async ({
  params,
}: {
  params: { documentId: string };
}) => {
  const { documentId } = await params;
  return <div className="">{documentId} Page</div>;
};

export default DocumentIdPage;
