import { useState } from "react";
import { useAddDocument, useDocuments, useSearch, useUpdate } from "../../features/store/store.hooks"

const Interface = () => {
  useUpdate();
  const documents = useDocuments();
  const [createInput, setCreateInput] = useState('');
  const addMutation = useAddDocument();
  const [searchInput, setSearchInput] = useState('What does the animal which greets say?');
  const search = useSearch();

  const add = () => {
    addMutation.mutate(createInput, {
      onSuccess: () => {
        setCreateInput('');
      }
    })
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Documents</h2>
        {!documents.data || documents.data.results.length === 0 && <div>Loading</div>}
        {documents.data?.results.map(a => ({ ...a, embeddings: undefined })).map((document) => (
          <div key={document.chunkId}>
            {document.body}
          </div>
        ))}
        <h3>Add</h3>
        <textarea value={createInput} onChange={(e) => setCreateInput(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Search</h2>
        <div style={{ display: 'flex' }}>
          <input style={{ flex: 1 }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button onClick={() => search.mutate(searchInput)}>Search</button>
        </div>
        {search.isLoading && <div>Loading</div>}
        {search.data?.results.map((result) => (
          <pre key={result.chunkId}>{JSON.stringify(result, null, '  ')}</pre>
        ))}
      </div>
    </div>
  )
}

export { Interface };
