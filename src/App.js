import { useEffect, useState } from "react";
import {
  fetchDocs,
  getLevelOneDocs,
  getRootCollectionIds,
  getSubcollectionNamesInDoc,
} from "./helpers/readFromDb";

function App() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [collections, setCollections] = useState("");
  const [levelOneDocs, setLevelOneDocs] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);

  async function openFolder(name) {
    setCurrentLocation((prev) => (prev ? prev + "/" + name : name));
    setLevel((prev) => prev + 1);
  }

  function back() {
    const temp = currentLocation.split("/");
    temp.pop();
    const prevLocation = temp.join("/");
    setCurrentLocation(prevLocation);
    setLevel((prev) => prev - 1);
  }

  useEffect(() => {
    async function rootLevelCalls() {
      const res = await getRootCollectionIds();
      setCollections(res);
    }

    async function levelOneCalls() {
      const docIds = await getLevelOneDocs(currentLocation, setLoading);
      setLevelOneDocs(docIds);
    }

    async function evenLevelCalls() {
      const collectionNames = await getSubcollectionNamesInDoc(
        currentLocation,
        setLoading
      );
      setCollections(collectionNames);

      const evenLevelDocData = await fetchDocs(currentLocation, setLoading);
      setDocument(evenLevelDocData);
    }

    if (level === 0) rootLevelCalls();
    else if (level % 2 === 1) {
      levelOneCalls(currentLocation, setLoading);
    } else if (level % 2 === 0) {
      evenLevelCalls();
    }
  }, [currentLocation, level]);

  return (
    <>
      {level > 0 && (
        <button
          onClick={back}
          className="fixed px-4 py-1 mt-2 ml-2 text-white bg-blue-500 rounded-md cursor-pointer left-4 top-2"
        >
          Back
        </button>
      )}

      {loading ? (
        <div className="fixed m-4 top-20 left-4">Loading...</div>
      ) : (
        <main className="px-4 mt-20">
          {collections.length > 0 && (
            <h1 className="mx-2 my-2 text-xl text-blue-500">Collections</h1>
          )}
          <div className="flex flex-wrap items-center justify-start max-w-screen-md">
            {level % 2 === 0 &&
              collections &&
              collections.map((collection, index) => {
                return (
                  <div key={index}>
                    <div
                      className="flex flex-col items-center justify-center p-2 m-2 border rounded-md cursor-pointer select-none hover:bg-gray-200 "
                      onDoubleClick={() => openFolder(collection)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-20 h-20"
                        viewBox="0 0 20 20"
                        fill="#4571FF"
                      >
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                      {collection}
                    </div>
                  </div>
                );
              })}
            {document && level !== 0 && level % 2 === 0 && (
              <div className="w-full px-2 py-1 mt-4 border rounded-md">
                <h1 className="my-2 text-xl text-blue-500 border-b">Data</h1>
                <div>{JSON.stringify(document)}</div>
              </div>
            )}
            {level % 2 === 1 &&
              levelOneDocs &&
              levelOneDocs.map((collection, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-2 m-2 border rounded-md cursor-pointer select-none hover:bg-gray-200 "
                    onDoubleClick={() => openFolder(collection)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-20 h-20"
                      viewBox="0 0 20 20"
                      fill="#4571FF"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    {collection}
                  </div>
                );
              })}
          </div>
        </main>
      )}
    </>
  );
}

export default App;
