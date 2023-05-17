import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../firebase/auth";
import { addReceipt } from "../firebase/firestore";
import { uploadImage } from "../firebase/storage";
import { RECEIPTS_ENUM } from "../pages/dashboard";
import styles from "../styles/expenseDialog.module.scss";

const DEFAULT_FILE_NAME = "No file selected";

// Statul de formular implicit pentru dialog

const DEFAULT_FORM_STATE = {
	fileName: DEFAULT_FILE_NAME,
	file: null,
	date: null,
	locationName: "",
	address: "",
	items: "",
	amount: "",
};

/*
  Dialog pentru introducerea informațiilor de chitanță
 
  recuzită:
   - „editează” este chitanța de editat
   -  „showDialog” boolean pentru a afișa acest dialog
   - „onError” emite pentru a anunța a apărut o eroare
   - „onSuccess” emite pentru a notifica cu succes salvarea chitanței
   - „onCloseDialog” emite pentru a închide dialogul
  */
export default function ExpenseDialog(props) {
	const { authUser } = useAuth();
	const isEdit = Object.keys(props.edit).length > 0;
	const [formFields, setFormFields] = useState(isEdit ? props.edit : DEFAULT_FORM_STATE);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Dacă chitanța pentru a edita sau dacă închideți sau deschideți dialogul se schimbă vreodată, resetați câmpurile de formular
	useEffect(() => {
		if (props.showDialog) {
			setFormFields(isEdit ? props.edit : DEFAULT_FORM_STATE);
		}
	}, [props.edit, props.showDialog]);

	// Verificați dacă vreunul dintre câmpurile de formular nu sunt needitate
	const isDisabled = () =>
		formFields.fileName === DEFAULT_FILE_NAME ||
		!formFields.date ||
		formFields.locationName.length === 0 ||
		formFields.address.length === 0 ||
		formFields.items.length === 0 ||
		formFields.amount.length === 0;

	// Actualizați câmpul dat în formular
	const updateFormField = (event, field) => {
		setFormFields((prevState) => ({ ...prevState, [field]: event.target.value }));
	};

	// Setați câmpurile relevante pentru imaginea de primire
	const setFileData = (target) => {
		const file = target.files[0];
		setFormFields((prevState) => ({ ...prevState, fileName: file.name }));
		setFormFields((prevState) => ({ ...prevState, file }));
	};

	const closeDialog = () => {
		setIsSubmitting(false);
		props.onCloseDialog();
	};
	const handlerSubmit = async () => {
		setIsSubmitting(true);
		try {
			// Adding receipt
			// Store image into Storage
			const bucket = await uploadImage(formFields.file, authUser.uid);

			// Store data into Firestore
			await addReceipt(
				authUser.uid,
				formFields.date,
				formFields.locationName,
				formFields.address,
				formFields.items,
				formFields.amount,
				bucket
			);

			props.onSuccess(RECEIPTS_ENUM.add);
		} catch (error) {
			props.onError(RECEIPTS_ENUM.add);
		}
		closeDialog();
	};

	return (
		<Dialog
			classes={{ paper: styles.dialog }}
			onClose={() => closeDialog()}
			open={props.showDialog}
			component="form"
		>
			<Typography variant="h4" className={styles.title}>
				{isEdit ? "EDIT" : "ADD"} EXPENSE
			</Typography>
			<DialogContent className={styles.fields}>
				<Stack direction="row" spacing={2} className={styles.receiptImage}>
					{isEdit && !formFields.fileName && (
						<Avatar
							alt="receipt image"
							src={formFields.imageUrl}
							sx={{ marginRight: "1em" }}
						/>
					)}
					<Button variant="outlined" component="label" color="secondary">
						Upload Receipt
						<input
							type="file"
							hidden
							onInput={(event) => {
								console.dir(event.target);
								setFileData(event.target);
							}}
						/>
					</Button>
					<Typography>{formFields.fileName}</Typography>
				</Stack>
				<Stack>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label="Date"
							value={formFields.date}
							onChange={(newDate) => {
								setFormFields((prevState) => ({ ...prevState, date: newDate }));
							}}
							maxDate={new Date()}
							renderInput={(params) => <TextField color="tertiary" {...params} />}
						/>
					</LocalizationProvider>
				</Stack>
				<TextField
					color="tertiary"
					label="Location name"
					variant="standard"
					value={formFields.locationName}
					onChange={(event) => updateFormField(event, "locationName")}
				/>
				<TextField
					color="tertiary"
					label="Location address"
					variant="standard"
					value={formFields.address}
					onChange={(event) => updateFormField(event, "address")}
				/>
				<TextField
					color="tertiary"
					label="Items"
					variant="standard"
					value={formFields.items}
					onChange={(event) => updateFormField(event, "items")}
				/>
				<TextField
					color="tertiary"
					label="Amount"
					variant="standard"
					value={formFields.amount}
					onChange={(event) => updateFormField(event, "amount")}
				/>
			</DialogContent>
			<DialogActions>
				{isSubmitting ? (
					<Button color="secondary" variant="contained" disabled={true}>
						Submitting...
					</Button>
				) : (
					<Button
						color="secondary"
						variant="contained"
						disabled={isDisabled()}
						onClick={handlerSubmit}
					>
						Submit
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
