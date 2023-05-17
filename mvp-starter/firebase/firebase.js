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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBxRgl7Ri4WkEldCpNPSoKvPsuSb95WYxI",
	authDomain: "expense-tracker2-34481.firebaseapp.com",
	projectId: "expense-tracker2-34481",
	storageBucket: "expense-tracker2-34481.appspot.com",
	messagingSenderId: "890132496858",
	appId: "1:890132496858:web:8addab3a496bcd2308c0e3",
	measurementId: "G-FH3209C642",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig, "expense");
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
