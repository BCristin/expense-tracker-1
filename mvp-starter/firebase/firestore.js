/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { getDownloadURL } from "./storage";

// Name of receipt collection in Firestore
const RECEIPT_COLLECTION = "receipts";

/* 
 Adds receipt to Firestore with given receipt information:
 - address: address at which purchase was made
 - amount: amount of expense
 - date: date of purchase
 - imageBucket: bucket at which receipt image is stored in Firebase Storage
 - items: items purchased
 - locationName: name of location
 - uid: user ID who the expense is for
*/
export function addReceipt(uid, date, locationName, address, items, amount, imageBucket) {
	addDoc(collection(db, RECEIPT_COLLECTION), { uid, date, locationName, address, items, amount, imageBucket });
}
//#region   //!Storage
export async function getReceipts(uid) {
	const receipts = query(collection(db, RECEIPT_COLLECTION), where("uid", "==", uid), orderBy("date", "desc"));
	const querySnapshot = await getDocs(receipts);
	let allReceipts = [];
	for (const documentSnapshot of querySnapshot.docs) {
		const receipt = documentSnapshot.data();
		await allReceipts.push({
			...receipt,
			date: receipt["date"].toDate(),
			id: documentSnapshot.id,
			imageUrl: await getDownloadURL(receipt["imageBucket"]),
		});
	}
	return allReceipts;
}
//#endregion
