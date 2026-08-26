import Modal from "./Modal.jsx";

const items = [
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName WorkFolders-Client -NoRestart",
		note: "отключить синхронизацию файлов",
	},
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName WCF-Services45 -NoRestart",
		note: "отключить старый .NET",
	},
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName WCF-TCP-PortSharing45 -NoRestart",
		note: "отключить функционал для порт-шейринга",
	},
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName MediaPlayback -NoRestart",
		note: "отключить медиа компоненты",
	},
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName WindowsMediaPlayer -NoRestart",
		note: "отключить старый медиа-плеер",
	},
	{
		command: "Disable-WindowsOptionalFeature -Online -FeatureName Printing-Foundation-InternetPrinting-Client -NoRestart",
		note: "отключить функционал удаленные принтеров",
	},
];

export default function (props) {
	const width = Math.min(720, window.innerWidth - 40);

	return (
		<Modal onClose={props.onClose}>
			<modal-body style={{ width, maxHeight: "80vh", overflow: "auto", padding: 24 }}>
				<ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, color: colors.text.medium }}>
					{items.map((item) => (
						<li key={item.command} style={{ marginBottom: 12 }}>
							<code style={{ fontFamily: "monospace", fontSize: 13, color: colors.text.strong }}>
								{item.command}
							</code>
							<div style={{ marginTop: 4, fontSize: 14 }}>{item.note}</div>
						</li>
					))}
				</ul>
			</modal-body>
		</Modal>
	);
}
