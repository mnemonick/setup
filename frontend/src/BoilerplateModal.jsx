import Modal from "./Modal.jsx";

const items = [
	"winget uninstall -e --id Microsoft.Teams",
	"winget uninstall -e --id Microsoft.WindowsFeedbackHub",
	"winget uninstall -e --id Microsoft.Copilot",
	"winget uninstall -e --id Microsoft.MicrosoftEdge.Stable",
	"winget uninstall -e --id Microsoft.XboxSpeechToTextOverlay",
	"winget uninstall -e --id Microsoft.WebMediaExtensions",
	"winget uninstall -e --id Microsoft.BingNews",
	"winget uninstall -e --id Microsoft.BingSearch",
	"winget uninstall -e --id Microsoft.MicrosoftSolitaireCollection",
	"winget uninstall -e --id Microsoft.MicrosoftStickyNotes",
	"winget uninstall -e --id Microsoft.OutlookForWindows",
	"winget uninstall -e --id Microsoft.StartExperiencesApp",
	"winget uninstall -e --id Microsoft.Windows.Photos",
	"winget uninstall -e --id Microsoft.Xbox.TCUI",
	"winget uninstall -e --id Microsoft.XboxGamingOverlay",
	"winget uninstall -e --id Microsoft.GamingApp",
	"winget uninstall -e --id Microsoft.XboxIdentityProvider",
	"winget uninstall -e --id Microsoft.GetHelp",
	"winget uninstall -e --id Microsoft.Todos",
	"winget uninstall -e --id Microsoft.PowerAutomateDesktop",
	"winget uninstall -e --id Microsoft.Windows.DevHome",
	"winget uninstall -e --id MicrosoftCorporationII.MicrosoftFamily",
	"winget uninstall -e --id Microsoft.YourPhone",
	"winget uninstall -e --id Microsoft.ZuneMusic",
	"winget uninstall -e --id Microsoft.BingWeather",
	"winget uninstall -e --id Clipchamp.Clipchamp",
	"winget uninstall -e --id Microsoft.WindowsAlarms",
	"winget uninstall -e --id Microsoft.WidgetsPlatformRuntime",
	"winget uninstall -e --id MicrosoftWindows.Client.WebExperience",
	"winget uninstall -e --id MicrosoftWindows.CrossDevice",
];

export default function (props) {
	const width = Math.min(720, window.innerWidth - 40);

	return (
		<Modal onClose={props.onClose}>
			<modal-body style={{ width, maxHeight: "80vh", overflow: "auto", padding: 24 }}>
				<ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, color: colors.text.medium }}>
					{items.map((item) => (
						<li key={item} style={{ fontFamily: "Hack", fontSize: 14 }}>
							{item}
						</li>
					))}
				</ul>
			</modal-body>
		</Modal>
	);
}
