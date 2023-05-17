/**
 * @licență
 * Copyright 2022 Google LLC
 *
 * Licențiat sub licența Apache, versiunea 2.0 („licența”);
 * Este posibil să nu utilizați acest fișier decât în conformitate cu licența.
 * Puteți obține o copie a licenței la
 *
 * http://www.apache.org/licenses/license-2.0
 *
 * Cu excepția cazului în care este necesar de legea aplicabilă sau de acord în scris, software
 * distribuit sub licență este distribuit pe o bază „așa cum este”,
 * Fără garanții sau condiții de orice fel, fie expres, fie implicit.
 * Consultați licența pentru limbajul specific care reglementează permisiunile și
 * Limitări sub licență.
 */

import { Button, CircularProgress, Container, Dialog, Typography } from "@mui/material";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useAuth } from "../firebase/auth";
import { auth } from "../firebase/firebase";
import styles from "../styles/landing.module.scss";

const REDIRECT_PAGE = "/dashboard";

// Configure FirebaseUI.
const uiConfig = {
	signInFlow: "popup", // Fluxul de semne pop -up mai degrabă decât redirecționarea fluxului
	signInSuccessUrl: REDIRECT_PAGE,
	signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
};

export default function Home() {
	const { authUser, isLoading } = useAuth();
	const router = useRouter();
	const [login, setLogin] = useState(false);

	// Redirecționare dacă se încarcă și există un utilizator existent (utilizatorul este conectat)
	useEffect(() => {
		if (!isLoading && authUser) {
			router.push(REDIRECT_PAGE);
		}
	}, [authUser, isLoading]);

	return isLoading || (!isLoading && !!authUser) ? (
		<CircularProgress color="inherit" sx={{ marginLeft: "50%", marginTop: "25%" }} />
	) : (
		<div>
			<Head>
				<title>Expense Tracker</title>
			</Head>

			<main>
				<Container className={styles.container}>
					<Typography variant="h1">Welcome to Expense Tracker!</Typography>
					<Typography variant="h2">Add, view, edit, and delete expenses</Typography>
					<div className={styles.buttons}>
						<Button variant="contained" color="secondary" onClick={() => setLogin(true)}>
							Login / Register
						</Button>
					</div>
					<Dialog onClose={() => setLogin(false)} open={login}>
						<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
					</Dialog>
				</Container>
			</main>
		</div>
	);
}
