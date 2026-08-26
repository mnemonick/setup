import {useState, useEffect} from "react";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import colors from "@/utils/colors";
import type {Styles} from "@/utils/styles";
import connection from "@/utils/connection";
import translate from "@/utils/translate";
import useLayoutSize from "@/hooks/useLayoutSize";
import {useCurrentUser} from "@/stores/currentUserStore";
import Button from "@/components/Button";

interface ContactModalProps {
	contact?: number;
	onClose: () => void;
}

export default function (props: ContactModalProps) {
	const styles: Styles = {};
	const m = translate({
		heading: ['Create Contact', 'Создание контакта'],
		name: ['Name', 'Имя'],
		email: ['Email', 'Электронная почта'],
		comment: ['Comment', 'Комментарий'],
		create: ['Create Contact', 'Создать контакт'],
		update: ['Update Contact', 'Обновить'],
		delete: ['Delete', 'Удалить'],
		nameError: ['Name must be at least 3 characters long', 'Имя должно содержать не менее 3 символов'],
		emailError: ['Incorrect email', 'Некорректный email']
	});

	const emailRegexp = /^\S+@\S+\.\S+$/;
	const user = useCurrentUser(store => store.currentUser)!;
	const addContact = useCurrentUser(store => store.addContact);
	const removeContact = useCurrentUser(store => store.removeContact);
	const updateContact = useCurrentUser(store => store.updateContact);

	const contact = props.contact ? user.contacts.find(contact => contact.id === props.contact)! : undefined;

	const [name, setName] = useState(contact ? contact.name : '');
	const [nameDirty, setNameDirty] = useState(false);

	const [email, setEmail] = useState(contact ? contact.email : '');
	const [emailDirty, setEmailDirty] = useState(false);

	const [comment, setComment] = useState(contact ? contact.comment : '');

	const layout = useLayoutSize();

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		connection.on('createContact', onCreateContact);
		connection.on('updateContact', onUpdateContact);
		connection.on('removeContact', onRemoveContact);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			connection.remove('createContact', onCreateContact);
			connection.remove('updateContact', onUpdateContact);
			connection.remove('removeContact', onRemoveContact);
		};
	}, [name, email, comment]);

	styles.heading = {
		borderBottom: `1px solid ${colors.border.medium}`,
		fontFamily: 'Montserrat, sans-serif',
		fontWeight: 500,
		fontSize: 20,
		textAlign: 'center',
		height: 60,
		lineHeight: '60px',
		width: '100%'
	};

	styles.submit = {
		height: 60,
		display: 'flex',
		cursor: 'pointer',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'Montserrat',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20
	};

	styles.input = {
		borderBottom: `1px solid ${colors.border.weak}`,
		width: '100%',
		height: 60,
		fontFamily: 'Montserrat',
		fontSize: '24px'
	};

	styles.buttons = {
		display: 'flex',
		height: 60
	};

	styles.button = {
		width: '50%',
		height: '100%',
		fontFamily: 'Montserrat',
		borderRight: `1px solid ${colors.border.medium}`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: 'pointer'
	};

	styles.error = {
		height: 60,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: colors.text.error,
		fontFamily: 'Montserrat',
		fontSize: '16px',
		textAlign: 'center',
		padding: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20
	};

	let footer;

	if (props.contact) {
		if (nameDirty && name.length < 3) footer = <error style={styles.error}>{m.nameError}</error>;
		else if (emailDirty && !emailRegexp.test(email)) footer = <error style={styles.error}>{m.emailError}</error>;
		else {
			footer = (
				<buttons style={styles.buttons}>
					<Button
						onClick={update}
						style={{...styles.button, borderBottomLeftRadius: 20}}
					>
						{m.update}
					</Button>
					<Button
						onClick={remove}
						style={{...styles.button, borderBottomRightRadius: 20}}
					>
						{m.delete}
					</Button>
				</buttons>
			)
		}
	} else {
		if (nameDirty && name.length < 3) footer = <error style={styles.error}>{m.nameError}</error>;
		else if (emailDirty && !emailRegexp.test(email)) footer = <error style={styles.error}>{m.emailError}</error>;
		else {
			footer = (
				<Button style={styles.submit} onClick={create}>
					{m.create}
				</Button>
			);
		}
	}

	return (
		<Modal onClose={props.onClose}>
			<contact-modal style={{width: layout.desktop ? 400 : '100%'}}>
				<heading style={styles.heading}>{m.heading}</heading>
				<inputs>
					<Input
						value={name}
						icon="person"
						autoFocus={true}
						style={styles.input}
						placeholder={m.name}
						onDirty={() => setNameDirty(true)}
						onChange={value => setName(value)}
						invalid={nameDirty && name.length < 3}
					/>
					<Input
						value={email}
						icon="email"
						style={styles.input}
						placeholder={m.email}
						onDirty={() => setEmailDirty(true)}
						onChange={value => setEmail(value)}
						invalid={emailDirty && !emailRegexp.test(email)}
					/>
					<Input
						value={comment}
						icon="comment"
						placeholder={m.comment}
						onChange={value => setComment(value)}
						style={{...styles.input, borderBottom: `1px solid ${colors.border.medium}`}}
					/>
				</inputs>
				{footer}
			</contact-modal>
		</Modal>
	);

	function create() {
		setNameDirty(true);
		setEmailDirty(true);

		if (name.length >= 3 && emailRegexp.test(email)) {
			connection.send({type: 'createContact', email, name, comment});
		}
	}

	function update() {
		setNameDirty(true);
		setEmailDirty(true);

		if (name.length >= 3 && emailRegexp.test(email)) {
			connection.send({type: 'updateContact', id: props.contact!, email, name, comment});
		}
	}

	function remove() {
		connection.send({type: 'removeContact', id: props.contact});
	}

	function onCreateContact(event: any) {
		addContact(event.contact);
		props.onClose();
	}

	function onUpdateContact() {
		updateContact({id: props.contact!, name, email, comment});
		props.onClose();
	}

	function onRemoveContact() {
		removeContact(props.contact!);
		props.onClose();
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (typeof props.contact === 'number') update();
			if (typeof props.contact === 'undefined') create();
		}
	}
}