import Modal from "./Modal.jsx";

const items = [
	"powercfg /change monitor-timeout-ac 0",
	"powercfg /change monitor-timeout-dc 0",
	"powercfg /change standby-timeout-ac 0",
	"powercfg /change standby-timeout-dc 0",
];

export default function (props) {
	const width = Math.min(720, window.innerWidth - 40);

	return (
		<Modal onClose={props.onClose}>
			<modal-body style={{ width, maxHeight: "80vh", overflow: "auto", padding: 24 }}>
				<ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, color: colors.text.medium }}>
					{items.map((item) => (
						<li key={item} style={{ fontFamily: "monospace", fontSize: 14 }}>
							{item}
						</li>
					))}
				</ul>
			</modal-body>
		</Modal>
	);
}
