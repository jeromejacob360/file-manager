import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { getFunctions, httpsCallable } from "@firebase/functions";
import { db } from "../firebase/firebase";

// Root level -> get collection IDs
export async function getRootCollectionIds() {
  let collectionNames = [];
  const snap = await getDocs(collection(db, "rootLevelDetails"));

  snap.forEach((doc) => {
    const collection = Object.keys(doc.data());
    if (collection[0] !== "rootLevelDetails")
      collectionNames.push(...collection);
  });
  return collectionNames;
}

// level 1 -> Documents and sub collections
//// for documentIds,

export async function getLevelOneDocs(currentLocation, setLoading) {
  setLoading(true);
  let docIds = [];
  const snap = await getDocs(collection(db, currentLocation));
  snap.forEach((doc) => {
    docIds.push(doc.id);
  });
  setLoading(false);
  return docIds;
}

// level 2 -> collections and data of previous level's documents
//// for collectionIDs,
export async function getSubcollectionNamesInDoc(currentLocation, setLoading) {
  console.log(`currentLocation`, currentLocation);
  setLoading(true);
  try {
    const getSubCollections = httpsCallable(
      getFunctions(),
      "getSubCollections"
    );

    const result = await getSubCollections({ docPath: currentLocation });

    const collections = result.data.collections;
    setLoading(false);
    return collections;
  } catch (error) {
    console.log(`error`, error);
    console.log(`error.message`, error.message);
    console.log(`error.details`, error.details);
    setLoading(false);
  }
}

// level 2 -> collections and data of previous level's documents
//// for document data,
export async function fetchDocs(currentLocation, setLoading) {
  setLoading(true);
  let results = null;
  const docsObject = await getDoc(doc(db, currentLocation));
  if (docsObject.exists()) results = docsObject.data();

  setLoading(false);
  return results;
}

//level 3 -> similar to level 1
