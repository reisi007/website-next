import { ContractData } from '../api/contract.api';
import { formatDateTime } from '../images-next/utils/Age';
import { Markdown } from '../images-next/utils/Markdown';

export function DisplayContract({
  contractData,
}: { contractData: ContractData }) {
  const {
    markdown,
    dsgvo_markdown: dsgvoMarkdown,
    hash_value: hash,
    hash_algo: algo,
    due_date: dueDateTime,
    email,
  } = contractData;
  const formattedDateTime = formatDateTime(dueDateTime);
  return (
    <div className="my-4">
      <h1>
        Vertrag für
        {' '}
        {email}
        . Zu unterschrieben bis:
        {' '}
        {formattedDateTime}
      </h1>
      <Markdown className="text-center" content={markdown} />
      {dsgvoMarkdown !== undefined && dsgvoMarkdown !== null && (
        <>
          <br />
          <Markdown className="text-center" content={dsgvoMarkdown} />
        </>
      )}

      <small className="break-all font-mono text-sm">
        Hash:
        {' '}
        {hash}
        {' '}
        (
        {algo}
        )
      </small>
    </div>
  );
}
