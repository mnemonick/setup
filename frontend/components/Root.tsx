import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import Modal from "~/components/Modal.tsx";
import BoilerplateModal from "~/components/BoilerplateModal.tsx";
import ComponentsModal from "~/components/ComponentsModal.tsx";
import SettingsModal from "~/components/SettingsModal.tsx";
import colors from "~/globals/colors.ts";
import translate from "~/globals/translate.ts";

export default function () {
	const viewportRef = useRef<HTMLElement>(null);
	const wrapperRef = useRef<HTMLElement>(null);
	const [contentHeight, setContentHeight] = useState(0);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		const update = () => setContentHeight(wrapper.offsetHeight);
		update();

		const resizeObserver = new ResizeObserver(update);
		resizeObserver.observe(wrapper);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;

		if (typeof IntersectionObserver === "undefined") {
			viewport.querySelectorAll("category").forEach((s) => s.classList.add("visible"));
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.05,
				rootMargin: "0px 0px -40px 0px",
			},
		);

		viewport.querySelectorAll("category").forEach((category) => {
			if (!category.classList.contains("visible")) {
				observer.observe(category);
			}
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	const height = window.innerHeight;
	const width = window.innerWidth > 1024 ? 1024 : window.innerWidth - 40;
	const left = window.innerWidth / 2 - width / 2;

	const layout = {
		width,
		height,
		left,
		right: left + width,
	};

	const desktop = layout.width >= 1024;

	const fonts = desktop ? { text: 17, secondary: 15, header: 22 } : { text: 15, secondary: 15, header: 18 };

	const headingHeight = desktop ? 60 : 50;

	const [modal, setModal] = useState<"test" | "boilerplate" | "components" | "settings" | null>(null);

	const $root: CSSProperties = {
		position: "relative",
		height: "100%",
		color: colors.text.medium,
		background: `radial-gradient(circle 2000px, hsla(210 100% 50% / 6%) 0%, rgba(0, 0, 0, 1) 100%)`,
		fontSize: desktop ? "18px" : "16px",
	};

	const $heading: CSSProperties = {
		position: "relative",
		height: headingHeight,
		fontWeight: 500,
		color: "white",
		display: "flex",
		justifyContent: "center",
		borderBottom: `1px solid ${colors.border.medium}`,
	};

	const $headingContent: CSSProperties = {
		left: layout.left,
		width: layout.width,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 10,
		paddingRight: 10,
	};

	const $content: CSSProperties = {
		position: "relative",
		left: layout.left,
		width: layout.width,
		paddingBottom: 100,
	};

	const $topper: CSSProperties = {
		height: 60,
		fontSize: fonts.header,
		color: colors.text.strong,
		fontWeight: 500,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderBottom: `1px solid ${colors.border.weak}`,
	};

	const $category: CSSProperties = {
		borderTop: `1px solid ${colors.border.strong}`,
		borderRight: `1px solid ${colors.border.strong}`,
		borderBottom: `1px solid ${colors.border.strong}`,
		borderLeft: `1px solid ${colors.border.strong}`,
		borderRadius: 10,
		marginTop: desktop ? 40 : 20,
		marginBottom: desktop ? 40 : 20,
		lineHeight: "21px",
		background: colors.category,
	};

	const $categorySection: CSSProperties = {
		borderBottom: `1px dashed ${colors.border.medium}`,
	};

	const $viewport: CSSProperties = {
		overflow: "auto",
		height: height - headingHeight,
		position: "relative",
	};

	const $gridLeft: CSSProperties = {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		width: layout.left,
		pointerEvents: "none",
		overflow: "hidden",
		WebkitMaskImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		maskImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
		backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
	};

	const $gridRight: CSSProperties = {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		width: layout.left,
		pointerEvents: "none",
		overflow: "hidden",
		WebkitMaskImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		maskImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
	};

	const $electronsContainer: CSSProperties = {
		position: "absolute",
		inset: 0,
		overflow: "hidden",
		pointerEvents: "none",
	};

	const $electronsBase: CSSProperties = {
		position: "absolute",
		opacity: 0,
		borderRadius: 1,
		willChange: "transform, opacity",
		animationTimingFunction: "linear",
		animationIterationCount: "infinite",
	};

	const $electronsVertical: CSSProperties = {
		width: 2,
		height: 12,
		marginLeft: -1,
		background:
			"linear-gradient(to bottom, transparent, hsl(210 100% 72% / 0.55) 45%, hsl(210 100% 72% / 0.55) 55%, transparent)",
		boxShadow: "0 0 10px hsl(210 100% 55% / 0.22)",
		animationName: "electron-v",
	};

	const $electronsHorizontal: CSSProperties = {
		width: 12,
		height: 2,
		marginTop: -1,
		background: "linear-gradient(to right, transparent, hsl(210 100% 72% / 0.45) 45%, hsl(210 100% 72% / 0.45) 55%, transparent)",
		boxShadow: "0 0 10px hsl(210 100% 55% / 0.18)",
		animationName: "electron-h",
	};

	const $electronsHorizontalReverse: CSSProperties = {
		animationName: "electron-h-reverse",
	};

	const $electrons: ElectronStyles = {
		container: $electronsContainer,
		base: $electronsBase,
		vertical: $electronsVertical,
		horizontal: $electronsHorizontal,
		horizontalReverse: $electronsHorizontalReverse,
	};

	const $wrapper: CSSProperties = {
		position: "relative",
		minHeight: "100%",
		paddingTop: desktop ? 40 : 20,
	};

	const $clickable: CSSProperties = {
		display: "inline",
		borderBottom: `1px dashed ${colors.text.weak}`,
		position: "relative",
		textDecoration: "none",
	};

	const $border: CSSProperties = {
		position: "absolute",
		top: desktop ? 59 : 49,
		height: 1,
		background: colors.border.medium,
	};

	const $p: CSSProperties = {
		margin: 20,
	};

	const $ul: CSSProperties = {
		marginBottom: 0,
		marginTop: 5,
	};

	const $separator: CSSProperties = {
		position: "relative",
		left: -layout.left,
		display: "flex",
		alignItems: "center",
		gap: 16,
		width: desktop ? window.innerWidth - 20 : window.innerWidth,
		marginTop: desktop ? 20 : 10,
		marginBottom: desktop ? 20 : 10,
		color: colors.border.strong,
	};

	const $separatorLine: CSSProperties = {
		flex: 1,
		height: 1,
		borderBottom: `2px dashed ${colors.border.strong}`,
	};

	const $separatorCaption: CSSProperties = {
		flexShrink: 0,
		padding: "10px 20px",
		border: `1px solid ${colors.border.strong}`,
		background: colors.category,
		borderRadius: 10,
		color: colors.text.strong,
		fontSize: fonts.header,
		fontWeight: 500,
		lineHeight: 1,
	};

	const grid_height = contentHeight || height - headingHeight;

	return (
		<root style={$root}>
			<border-top style={$border} />

			<heading style={$heading}>
				<content style={$headingContent}>
					<name style={{ fontSize: fonts.header }}>Egor Koshelko</name>
				</content>
			</heading>

			<viewport ref={viewportRef} style={$viewport}>
				<wrapper ref={wrapperRef} style={$wrapper}>
					{desktop ? (
						<grid-left style={$gridLeft}>
							<GridElectrons styles={$electrons} width={layout.left} height={grid_height} />
						</grid-left>
					) : null}
					{desktop ? (
						<grid-right style={$gridRight}>
							<GridElectrons styles={$electrons} width={layout.left} height={grid_height} />
						</grid-right>
					) : null}

					<content style={$content}>
						<category style={{ ...$category, marginTop: 0 }}>
							<topper style={$topper}>{m.tIntro}</topper>

							<p style={$p}>{m.intro1}</p>
							<p style={$p}>{m.intro2}</p>
							<p style={$p}>{m.intro3}</p>
						</category>

						<separator style={$separator}>
							<line style={$separatorLine} />
							<caption style={$separatorCaption}>{m.sepWork}</caption>
							<line style={$separatorLine} />
						</separator>

						<category style={$category}>
							<topper style={$topper}>{m.tDesk}</topper>

							<p style={$p}>
								{m.desk1a}
								<clickable onClick={() => alert("TODO")} style={$clickable}>
									{m.deskCorner}
								</clickable>
								{m.desk1b}
								<ul style={$ul}>
									<li>{m.deskLi1}</li>
									<li>{m.deskLi2}</li>
								</ul>
							</p>

							<p style={$p}>
								{m.desk2a}
								<clickable onClick={() => alert("TODO")} style={$clickable}>
									{m.deskPlates}
								</clickable>
								{m.desk2b}
							</p>

							<p style={$p}>
								{m.desk3a}
								<clickable onClick={() => alert("TODO")} style={$clickable}>
									{m.deskLeg}
								</clickable>
								{m.desk3b}
							</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tChair}</topper>

							<p style={$p}>{m.chair1}</p>
							<p style={$p}>{m.chair2}</p>
							<p style={$p}>
								{m.chair3a}
								<clickable onClick={() => alert("TODO")} style={$clickable}>
									{m.chairRider}
								</clickable>
								{m.chair3b}
							</p>
							<p style={$p}>{m.chair4}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tGlasses}</topper>

							<p style={$p}>{m.glasses1}</p>
							<p style={$p}>{m.glasses2}</p>
							<p style={$p}>{m.glasses3}</p>
						</category>

						<separator style={$separator}>
							<line style={$separatorLine} />
							<caption style={$separatorCaption}>{m.sepHardware}</caption>
							<line style={$separatorLine} />
						</separator>

						<category style={$category}>
							<topper style={$topper}>{m.tMonitors}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.mon1}</p>
								<p style={$p}>{m.mon2}</p>

								<p style={$p}>{m.monReq}</p>
								<ul style={$ul}>
									<li>{m.monLi1}</li>
									<li>
										{m.monLi2a}
										<clickable onClick={() => alert("TODO")} style={$clickable}>
											{m.monLiLink}
										</clickable>
										{m.monLi2b}
									</li>
									<li>{m.monLi3}</li>
									<li>{m.monLi4}</li>
								</ul>

								<p style={$p}>{m.monPicks}</p>
								<ul style={$ul}>
									<li>{m.monMain}</li>
									<li>{m.monSide}</li>
								</ul>

								<p style={$p}>
									{m.mon3a}
									<clickable onClick={() => alert("TODO")} style={$clickable}>
										{m.monGlue}
									</clickable>
									{m.mon3b}
								</p>

								<p style={$p}>{m.mon4}</p>
								<p style={$p}>{m.mon5}</p>
							</section>

							<section style={{ ...$categorySection, borderBottom: undefined }}>
								<p style={$p}>{m.monAppsIntro}</p>
								<ul style={$ul}>
									<li>{m.monApp1}</li>
									<li>{m.monApp2}</li>
									<li>{m.monApp3}</li>
									<li>{m.monApp4}</li>
									<li>{m.monApp5}</li>
								</ul>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tKbd}</topper>

							<p style={$p}>{m.kbd1}</p>
							<p style={$p}>{m.kbd2}</p>
							<p style={$p}>{m.kbd3}</p>
							<p style={$p}>
								{m.kbd4a}
								<clickable onClick={() => alert("TODO")} style={$clickable}>
									{m.kbdNoHand}
								</clickable>
								{m.kbd4b}
							</p>
							<p style={$p}>{m.kbd5}</p>
							<p style={$p}>{m.kbd6}</p>
							<p style={$p}>{m.kbd7}</p>
							<p style={$p}>{m.kbd8}</p>
							<ul style={$ul}>
								<li>{m.kbdLi1}</li>
								<li>{m.kbdLi2}</li>
								<li>{m.kbdLi3}</li>
							</ul>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tMouse}</topper>

							<p style={$p}>{m.mouse1}</p>
							<ul style={$ul}>
								<li>{m.mouseLi1}</li>
								<li>{m.mouseLi2}</li>
								<li>{m.mouseLi3}</li>
								<li>{m.mouseLi4}</li>
							</ul>
							<p style={$p}>{m.mouse2}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tGpu}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.gpu1}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>
									{m.gpu2a}
									<a href="TODO">{m.gpu2Link}</a>
									{m.gpu2b}
								</p>

								<p style={$p}>{m.gpu3}</p>
								<ul style={$ul}>
									<li>{m.gpuLi1}</li>
									<li>{m.gpuLi2}</li>
								</ul>

								<p style={$p}>{m.gpu4}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tCpu}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.cpu1}</p>
								<p style={$p}>
									{m.cpu2a}
									<a href="TODO">{m.cpu2Link}</a>
									{m.cpu2b}
								</p>

								<p style={$p}>{m.cpu3}</p>
								<ul style={$ul}>
									<li>{m.cpuLi1}</li>
									<li>{m.cpuLi2}</li>
								</ul>

								<p style={$p}>{m.cpu4}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tSsd}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.ssd1}</p>

								<p style={$p}>{m.ssd2}</p>
								<ul style={$ul}>
									<li>{m.ssdLi1}</li>
									<li>{m.ssdLi2}</li>
									<li>{m.ssdLi3}</li>
								</ul>

								<p style={$p}>{m.ssd3}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tRam}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.ram1}</p>

								<p style={$p}>{m.ram2}</p>
								<ul style={$ul}>
									<li>{m.ramLi1}</li>
									<li>{m.ramLi2}</li>
									<li>{m.ramLi3}</li>
									<li>{m.ramLi4}</li>
								</ul>

								<p style={$p}>{m.ram3}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tMobo}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.mobo1}</p>

								<p style={$p}>{m.mobo2}</p>
								<ul style={$ul}>
									<li>{m.moboLi1}</li>
									<li>{m.moboLi2}</li>
									<li>{m.moboLi3}</li>
									<li>{m.moboLi4}</li>
									<li>{m.moboLi5}</li>
									<li>{m.moboLi6}</li>
									<li>{m.moboLi7}</li>
								</ul>

								<p style={$p}>{m.mobo3}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tHeadphones}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.hp1}</p>

								<p style={$p}>{m.hp2}</p>
							</section>
						</category>

						<separator style={$separator}>
							<line style={$separatorLine} />
							<caption style={$separatorCaption}>{m.sepSoftware}</caption>
							<line style={$separatorLine} />
						</separator>

						<category style={$category}>
							<topper style={$topper}>{m.tOs}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.os1}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.os2a}</p>
								<ul style={$ul}>
									<li>
										<clickable onClick={() => setModal("boilerplate")} style={$clickable}>
											{m.osStep1}
										</clickable>
									</li>
									<li>
										<clickable onClick={() => setModal("components")} style={$clickable}>
											{m.osStep2}
										</clickable>
									</li>
									<li>
										<clickable onClick={() => setModal("settings")} style={$clickable}>
											{m.osStep3}
										</clickable>
									</li>
								</ul>
							</section>

							<div style={$p}>
								{m.os3a}
								<ul style={$ul}>
									<li>{m.os3Li1}</li>
									<li>{m.os3Li2}</li>
									<li>{m.os3Li3}</li>
									<li>{m.os3Li4}</li>
									<li>
										{m.os3Li5a}
										<clickable style={$clickable}>{m.osLinkShortcut}</clickable>
										{m.os3Li5b}
										<clickable style={$clickable}>{m.osLinkPwa}</clickable>
										{m.os3Li5c}
										<clickable style={$clickable}>{m.osLinkInstall}</clickable>
										{m.os3Li5d}
									</li>
								</ul>
							</div>

							<div style={$p}>
								{m.os4}
								<ul style={$ul}>
									<li>{m.os4Li1}</li>
									<li>
										{m.os4Li2a}
										<ul>
											<li>
												{m.os4Li2b1}
												<clickable style={$clickable}>{m.osLinkDesktop}</clickable>
												{m.os4Li2b2}
											</li>
											<li>{m.os4Li2c}</li>
										</ul>
									</li>
								</ul>
							</div>

							<p style={$p}>{m.os5}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>AutoHotkey</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.ahkIntro}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>
									{m.ahkMacros}
									<clickable style={$clickable}>{m.ahkPicture}</clickable>
									{m.ahkMacrosAfter}
								</p>

								<ul>
									<li>{m.ahkMap1}</li>
									<li>{m.ahkMap2}</li>
									<li>{m.ahkMap3}</li>
									<li>{m.ahkMap4}</li>
									<li>{m.ahkMap5}</li>
									<li>{m.ahkMap6}</li>
									<li>{m.ahkMap7}</li>
									<li>{m.ahkMap8}</li>
								</ul>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ahkUnify}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>
									{m.ahkGest1}
									<clickable style={$clickable}>{m.ahkList}</clickable>
									{m.ahkGest2}
								</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ahkSwitch}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ahkSel1}</p>

								<p style={$p}>
									{m.ahkSel2a}
									<clickable onClick={() => alert("TODO")} style={{ ...$clickable, marginLeft: 5 }}>
										{m.ahkHow}
									</clickable>
									{m.ahkSel2b}
								</p>

								<p style={$p}>{m.ahkSel3}</p>
							</section>

							<section style={{ ...$categorySection, borderBottom: undefined }}>
								<p style={$p}>{m.ahkLang1}</p>
								<p style={$p}>{m.ahkLang2}</p>
								<p style={$p}>{m.ahkLang3}</p>
								<p style={$p}>{m.ahkLang4}</p>
							</section>

							<section style={{ ...$categorySection, borderBottom: undefined }}>
								<p style={$p}>{m.ahkMouse}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tBrowser}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.br1}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.br2}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.br3a}</p>
								<p style={$p}>{m.br3b}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.brPlugins}</p>
								<ul style={$ul}>
									<li>{m.brPlugin1}</li>
									<li>{m.brPlugin2}</li>
									<li>{m.brPlugin3}</li>
									<li>{m.brPlugin4}</li>
									<li>{m.brPlugin5}</li>
									<li>{m.brPlugin6}</li>
									<li>{m.brPlugin7}</li>
									<li>{m.brPlugin8}</li>
									<li>{m.brPlugin9}</li>
									<li>{m.brPlugin10}</li>
									<li>{m.brPlugin11}</li>
									<li>{m.brPlugin12}</li>
									<li>{m.brPlugin13}</li>
									<li>{m.brPlugin14}</li>
									<li>{m.brPlugin15}</li>
								</ul>
							</section>

							<section style={$categorySection}>
								<p style={$p}>
									{m.brHotkeys1}
									<clickable style={$clickable}>{m.brList}</clickable>
									{m.brHotkeys2}
								</p>
							</section>

							<section style={{ ...$categorySection, borderBottom: undefined }}>
								<p style={$p}>{m.brLast}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tEditor}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.edCursor1}</p>
								<p style={$p}>{m.edCursor2}</p>
								<p style={$p}>{m.edCursor3}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.edZed}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.edWs1}</p>

								<p style={$p}>{m.edWs2}</p>
								<ul style={$ul}>
									<li>{m.edWsLi1}</li>
									<li>{m.edWsLi2}</li>
									<li>{m.edWsLi3}</li>
									<li>{m.edWsLi4}</li>
									<li>{m.edWsLi5}</li>
									<li>{m.edWsLi6}</li>
									<li>{m.edWsLi7}</li>
									<li>{m.edWsLi8}</li>
									<li>{m.edWsLi9}</li>
									<li>{m.edWsLi10}</li>
								</ul>

								<p style={$p}>{m.edWs3}</p>

								<p style={$p}>
									{m.edCfg1}
								</p>

								<p style={$p}>
									{m.edCfg2a}
									<clickable onClick={() => alert("TODO")} style={$clickable}>
										{m.edCfgLink}
									</clickable>
									{m.edCfg2b}
								</p>

								<p style={$p}>{m.edPlugins}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tAi}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.ai1}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ai2}</p>
								<p style={$p}>{m.ai3}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ai4}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.ai5}</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tFiles}</topper>

							<section style={$categorySection}>
								<p style={$p}>{m.files1}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.files2}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.files3}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>{m.files4}</p>
							</section>

							<section style={$categorySection}>
								<p style={$p}>
									{m.files5a}
									<clickable style={$clickable}>{m.filesLinkLook}</clickable>
									{m.files5b}
									<clickable style={$clickable}>{m.filesLinkConfig}</clickable>
									{m.files5c}
								</p>
							</section>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tTerminal}</topper>

							<p style={$p}>{m.term1}</p>

							<div style={$p}>
								{m.term2a}
								<ul style={$ul}>
									<li>{m.termLi1}</li>
									<li>{m.termLi2}</li>
								</ul>
								{m.term2b}
							</div>

							<p style={$p}>{m.term3}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tMail}</topper>

							<p style={$p}>{m.mail1}</p>
							<p style={$p}>{m.mail2}</p>
							<p style={$p}>{m.mail3}</p>
							<p style={$p}>{m.mail4}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tPass}</topper>

							<p style={$p}>{m.pass1}</p>
							<p style={$p}>{m.pass2}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tShots}</topper>

							<p style={$p}>{m.shots1}</p>

							<div style={$p}>
								{m.shots2a}
								<ul style={$ul}>
									<li>{m.shotsLi1}</li>
									<li>{m.shotsLi2}</li>
									<li>{m.shotsLi3}</li>
									<li>{m.shotsLi4}</li>
									<li>{m.shotsLi5}</li>
									<li>{m.shotsLi6}</li>
									<li>{m.shotsLi7}</li>
								</ul>
							</div>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tApps}</topper>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsHwTitle}</p>
								<ul style={$ul}>
									<li>{m.appsHw1}</li>
									<li>{m.appsHw2}</li>
									<li>{m.appsHw3}</li>
									<li>{m.appsHw4}</li>
									<li>{m.appsHw5}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsMoneyTitle}</p>
								<ul style={$ul}>
									<li>{m.appsMoney1}</li>
									<li>{m.appsMoney2}</li>
									<li>{m.appsMoney3}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsShopsTitle}</p>
								<ul style={$ul}>
									<li>{m.appsShops1}</li>
									<li>{m.appsShops2}</li>
									<li>{m.appsShops3}</li>
									<li>{m.appsShops4}</li>
									<li>{m.appsShops5}</li>
									<li>{m.appsShops6}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsComp1}</p>
								<ul style={$ul}>
									<li>{m.appsComp2}</li>
									<li>{m.appsComp3}</li>
									<li>{m.appsComp4}</li>
									<li>{m.appsComp5}</li>
									<li>{m.appsComp6}</li>
									<li>{m.appsComp7}</li>
									<li>{m.appsComp8}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsMsgTitle}</p>
								<ul style={$ul}>
									<li>{m.appsMsg1}</li>
									<li>{m.appsMsg2}</li>
									<li>{m.appsMsg3}</li>
									<li>{m.appsMsg4}</li>
									<li>{m.appsMsg5}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsFunTitle}</p>
								<ul style={$ul}>
									<li>{m.appsFun1}</li>
									<li>{m.appsFun2}</li>
									<li>{m.appsFun3}</li>
									<li>{m.appsFun4}</li>
									<li>{m.appsFun5}</li>
									<li>{m.appsFun6}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsForumTitle}</p>
								<ul style={$ul}>
									<li>{m.appsForum1}</li>
									<li>{m.appsForum2}</li>
									<li>{m.appsForum3}</li>
									<li>{m.appsForum4}</li>
									<li>{m.appsForum5}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsDevTitle}</p>
								<ul style={$ul}>
									<li>{m.appsDev1}</li>
									<li>{m.appsDev2}</li>
									<li>{m.appsDev3}</li>
									<li>{m.appsDev4}</li>
									<li>{m.appsDev5}</li>
									<li>{m.appsDev6}</li>
									<li>{m.appsDev7}</li>
									<li>{m.appsDev8}</li>
									<li>{m.appsDev9}</li>
									<li>{m.appsDev10}</li>
									<li>{m.appsDev11}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsFontTitle}</p>
								<ul style={$ul}>
									<li>{m.appsFont1}</li>
									<li>{m.appsFont2}</li>
									<li>{m.appsFont3}</li>
									<li>{m.appsFont4}</li>
								</ul>
							</section>

							<section style={{ ...$categorySection, borderBottom: $topper.borderBottom }}>
								<p style={$p}>{m.appsMiscTitle}</p>
								<ul style={$ul}>
									<li>{m.appsMisc1}</li>
									<li>{m.appsMisc2}</li>
									<li>{m.appsMisc3}</li>
									<li>{m.appsMisc4}</li>
									<li>{m.appsMisc5}</li>
									<li>{m.appsMisc6}</li>
									<li>{m.appsMisc7}</li>
									<li>{m.appsMisc8}</li>
								</ul>
							</section>
						</category>

						<separator style={$separator}>
							<line style={$separatorLine} />
							<caption style={$separatorCaption}>{m.sepConclusion}</caption>
							<line style={$separatorLine} />
						</separator>

						<category style={$category}>
							<topper style={$topper}>{m.tNotIncl}</topper>

							<p style={$p}>{m.nin1}</p>
							<p style={$p}>{m.nin2}</p>
							<p style={$p}>{m.nin3}</p>
							<p style={$p}>{m.nin4}</p>
							<p style={$p}>{m.nin5}</p>
						</category>

						<category style={$category}>
							<topper style={$topper}>{m.tConclusion}</topper>

							<p style={$p}>{m.concl1}</p>
							<p style={$p}>{m.concl2}</p>
						</category>
					</content>
				</wrapper>
			</viewport>

			{modal == "test" ? <Modal onClose={() => setModal(null)} /> : null}
			{modal == "boilerplate" ? <BoilerplateModal onClose={() => setModal(null)} /> : null}
			{modal == "components" ? <ComponentsModal onClose={() => setModal(null)} /> : null}
			{modal == "settings" ? <SettingsModal onClose={() => setModal(null)} /> : null}
		</root>
	);
}

const VERTICAL_ELECTRONS = 100;
const HORIZONTAL_ELECTRONS = 100;

function buildRandomTracks(count: number, span: number, cell: number, duration: number, random: boolean) {
	const cells = Math.max(1, Math.floor(span / cell));

	return Array.from({ length: count }, () => ({
		pos: Math.floor(Math.random() * cells) * cell,
		delay: -Math.random() * duration,
		duration,
		reverse: random ? Math.random() > 0.5 : false,
	}));
}

type ElectronStyles = Record<"container" | "base" | "vertical" | "horizontal" | "horizontalReverse", CSSProperties>;

function GridElectrons({ styles, width, height }: { styles: ElectronStyles; width: number; height: number }) {
	const cell = 40;
	const electronSpeed = 52;
	const vDuration = (height + 32) / electronSpeed;
	const hDuration = (width + 32) / electronSpeed;

	const verticalTracks = useMemo(
		() => buildRandomTracks(VERTICAL_ELECTRONS, width, cell, vDuration, false),
		[width, height, vDuration],
	);

	const horizontalTracks = useMemo(
		() => buildRandomTracks(HORIZONTAL_ELECTRONS, height, cell, hDuration, true),
		[width, height, hDuration],
	);

	return (
		<grid-electrons
			style={
				{
					...styles.container,
					"--electron-travel": `${width}px`,
					"--electron-v-travel": `${height}px`,
				} as CSSProperties
			}
		>
			{verticalTracks.map((track, index) => (
				<grid-electron
					key={`v-${index}`}
					style={{
						...styles.base,
						...styles.vertical,
						left: track.pos,
						animationDuration: `${track.duration}s`,
						animationDelay: `${track.delay}s`,
					}}
				/>
			))}
			{horizontalTracks.map((track, index) => (
				<grid-electron
					key={`h-${index}`}
					style={{
						...styles.base,
						...styles.horizontal,
						...(track.reverse ? styles.horizontalReverse : null),
						top: track.pos,
						animationDuration: `${track.duration}s`,
						animationDelay: `${track.delay}s`,
					}}
				/>
			))}
		</grid-electrons>
	);
}

const m = translate({
	tIntro: ["Introduction", "Введение"],
	intro1: [
		"As a kid I played a lot of computer games, and I liked tuning the game more than playing it. I even downloaded other players' configs, looked at their settings and tweaked my own config.",
		"В детстве я много играл в компьютерные игры и заметил, что мне больше нравилась не сама игра, а процесс ее настройки. Я даже специально скачивал конфиги про игроков, смотрел какие у них настройки и дорабатывал свой конфиг.",
	],
	intro2: [
		"Time passed and I stopped playing games, but my interest in tuning everything stayed. In this article I want to publish my \"config\" tuned for programming. Hardware, software and hotkeys are one stack for me: if I do an action by hand every day, it should become a hotkey or a script.",
		"Прошло время, в игры я играть перестал, но интерес к настройке всего и вся у меня остался. В этой статье я хочу опубликовать свой \"конфиг\" заточенный под программирование. Железо, софт и горячие клавиши для меня один стек: если действие делается руками каждый день, оно должно стать хоткеем или скриптом.",
	],
	intro3: [
		"This text was written by a human. AI was used only for learning and proofreading.",
		"Этот текст написан человеком. ИИ использовался только для обучения и проверки на ошибки.",
	],
	sepWork: ["Workspace", "Рабочее место"],
	tDesk: ["Desk", "Стол"],
	desk1a: [
		"There are plenty of super expensive desks on the market with all kinds of extras: outlets, USB ports, RGB lighting, but I don't need any of that. The main requirement for my desk is that it be ",
		"На рынке есть огромная куча супер дорогих столов со всякими наворотами: куча розеток, usb-портов, rgb-подсветка, но это все мне вообще не нужно. Самое главное требования у меня к столу - это то, что бы он был ",
	],
	deskCorner: ["corner", "угловой"],
	desk1b: [
		". It has two big advantages:",
		". У этого два больших преимущества:",
	],
	deskLi1: [
		"<b>A comfortable spot for the elbows.</b> It's very easy to rest your elbows on the desk - they never hang in the air.",
		"<b>Удобная позиция для локтей.</b> Локтями очень удобно упираться в стол - они не висят никогда.",
	],
	deskLi2: [
		"<b>More room for monitors.</b> I use 5 monitors, and I couldn't fit them this comfortably around a regular desk.",
		"<b>Больше пространства для мониторов.</b> В работе я использую 5 мониторов, за обычным столом расположить их так же удобно не получилось бы.",
	],
	desk2a: [
		"I couldn't find good corner desks on the market. The ones available either have too narrow a desktop or aren't long enough. I bought two regular desks from <term>IKEA</term> and joined them underneath with ",
		"Нормальных угловых столов на рынке я не нашел. У тех которые есть слишком узкая столешница, либо они не достаточно длинные. Я купил два самых обычных стола из <term>IKEA</term> и соединил их снизу ",
	],
	deskPlates: ["plates", "пластинами"],
	desk2b: [
		". It's much cheaper and more practical than all those smart RGB gaming desks with lots of outlets and USB ports.",
		". Это намного дешевле и удобнее чем все эти умные RGB, геймерские столы с кучей розеток и USB портов.",
	],
	desk3a: [
		"The only downside is that the ",
		"У этого есть небольшой недостаток - снизу постоянно мешает ",
	],
	deskLeg: ["table leg", "ножка стола"],
	desk3b: [
		" keeps getting in the way underneath, but I've gotten used to it.",
		", но к этому я уже привык.",
	],
	tChair: ["Chair", "Стул"],
	chair1: [
		"A chair may seem like a minor thing, but I sit at the computer 8 hours a day. The comfort of my chair matters to me far more than the number of CPU cores.",
		"Казалось бы стул это мелочь, но я провожу сидя за компьютером в день по 8 часов. И удобство стула для меня намного важнее, чем количество ядер у процессора.",
	],
	chair2: [
		"The first requirement for a chair is no armrests (or ones that can be removed). My elbows are always on the desk, and armrests only get in the way.",
		"Первое требование к стулу - что бы не было подлокотников (или их можно было убрать). Логти у меня всегда на столе, подлокотники только мешают.",
	],
	chair3a: [
		"The second is being able to sit in a ",
		"Второе это что бы можно было сидеть в позе ",
	],
	chairRider: ["reverse-saddle", "наездника"],
	chair3b: [
		" position. I like changing positions from time to time. That's why I passed on the hyped <a href=\"https://www.hermanmiller.com\">Herman Miller Aeron</a>.",
		". Мне удобно время от времени менять позы. По этой причине я отказался от хайпового <a href=\"https://www.hermanmiller.com\">Herman Miller Aeron</a>.",
	],
	chair4: [
		"I settled on one of the most popular office chairs in the world - the <a href=\"https://ikeamega.ru/officechairs/tproduct/951877794252-markus-markus-ofisnoe-kreslo-vissle-svet\">IKEA Marcus</a>. Armrests are removable, the seat is low, and you can sit in the reverse-saddle position. I don't need anything more.",
		"Остановился на одном из самых популярных оффисных стульев в мире - <a href=\"https://ikeamega.ru/officechairs/tproduct/951877794252-markus-markus-ofisnoe-kreslo-vissle-svet\">IKEA Marcus</a>. Подлокотники убираются, низкая посадка, можно сидеть в позе наездника. Мне более ничего и не нужно.",
	],
	tGlasses: ["Glasses", "Очки"],
	glasses1: [
		"If you want to upgrade your workspace, pay attention to glasses <b>even if</b> your eyesight is fine.",
		"Если вы хотите прокачать рабочее место - уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.",
	],
	glasses2: [
		"My eyesight is fine: I read street signs without trouble and spot bus numbers from far away. Even so, reading text on a screen in glasses is <b>noticeably more comfortable</b>. You might find the same.",
		"Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, номера автобусов вижу издалека. Но несмотря на это в очках читать текст на экране <b>заметно удобнее</b>. Возможно, у вас будет так же.",
	],
	glasses3: [
		"Many people focus on hardware specs but don't know that glasses can improve the image <b>more</b> than an expensive monitor or graphics card. On top of that, your eyes get tired less, which helps preserve your vision.",
		"Многие концентрируются на характеристиках железа, но не знают про то, что очки могут улучшить изображение <b>сильнее</b> чем дорогой монитор или видеокарта. Плюс к тому глаза будут меньше уставать, что позволит сохранить вас зрение.",
	],
	sepHardware: ["Hardware", "Железо"],
	tMonitors: ["Monitors", "Мониторы"],
	mon1: [
		"The number of monitors is the most important parameter for me. It matters far more than a powerful CPU or graphics card. I have 5 monitors: one main one in the center and four additional ones on the sides, in portrait orientation.",
		"Количество мониторов для меня это самый важный параметр. Намного важнее, чем мощный процессор или видео-карта. У меня стоит 5 мониторов: один основной по центру, и четыре дополнительных по бокам вертикально.",
	],
	mon2: [
		"More than five monitors is no longer practical. If you add more side monitors, they end up too far away. If you mount monitors higher, looking up becomes <b>extremely uncomfortable</b> (I learned this the hard way). Ideally, the top edge of a horizontal monitor should sit at eye level, not in the center, because looking down is more comfortable than looking up. Looking at the very top of the vertical monitors is a bit uncomfortable for me, but I rarely need to look up there.",
		"Использовать большее пяти мониторов - это уже не практично. Если ставить больше дополнительных, то они будут слишком далеко. Если ставить мониторы выше - то вверх смотреть <b>крайне не удобно</b> (был печальный опыт). В идеале верхняя граница горизонтального монитора должна быть на уровне глаз (не по центру, вниз смотреть удобнее, чем вверх). Смотреть в самый верх вертикальных мониторов мне уже немного дискомфортно, но благо туда приходится смотреть не часто.",
	],
	monReq: ["My requirements for monitors:", "Мои требования к мониторам:"],
	monLi1: [
		"<b>Diagonal:</b> 27 for the main one, 24 for the side ones. If the main monitor's diagonal is over 27 inches, the side monitors end up too far away. If you mount monitors over 24 inches vertically, they are too high and uncomfortable. Everyone chases big monitors, but programming doesn't need that. 27 inches for the main one and 24 for the side ones are the optimal diagonals.",
		"<b>Диогональ:</b> 27 для основного, 24 для дополнительных. Если диогональ основного монитора больше 27 дюймов, то дополнительные уезжают слишком далеко. Если вертикально ставить мониторы с диогональю больше 24 дюймов, то это будет уже слишком высоко и не удобно. Все обычно гонятся за большими мониторами, но в программировании в этом нет необходимости. 27 дюймов для основного и 24 для дополнительных - это самые оптимальные диогонали.",
	],
	monLi2a: [
		"<b>Resolution:</b> <term>3840x2160</term> for the main one, <term>2560x1440</term> for the side ones. The main monitor has to have enough room to fit ",
		"<b>Разрешение:</b> <term>3840x2160</term> для основного, <term>2560x1440</term> для дополнительных. На основном мониторе должно быть достаточно места что бы в IDE помещалось ",
	],
	monLiLink: ["2 IDE splits and a file tree", "2 сплита и дерево файлов"],
	monLi2b: [
		". A 27\" 4K is about <term>163 PPI</term>, a 24\" QHD is about <term>123 PPI</term>. Text on the main one is sharp, and the side ones don't look blurry if the Windows scaling is matched. The side monitors are <term>1440</term> pixels wide, the most common width on laptops, so almost every app displays fine even though the monitor stands vertically.",
		". 27\" 4K это около <term>163 PPI</term>, 24\" QHD около <term>123 PPI</term>. Текст на основном острый, боковые не мылят, если согласовать масштаб Windows. На дополнительных мониторах ширина составляет <term>1440</term> пикселей, а это самая популярная ширина на ноутбуках. Так что практически все приложения будут отображаться нормально, не смотря на то что монитор стоит вертикально.",
	],
	monLi3: [
		"<b>Panel:</b> ideally some <term>OLED</term> (<term>WOLED</term> or <term>QD-OLED</term>), but <term>IPS</term> is fine too. The panel affects image quality, which doesn't matter much for programming.",
		"<b>Матрица:</b> желательно какой-нибудь <term>OLED</term> (<term>WOLED</term> или <term>QD-OLED</term>), но и <term>IPS</term> подойдет. Матрица влияет на качество картинки, на которую в программировании по большому счету пофиг.",
	],
	monLi4: [
		"<b>Coating:</b> must be matte (not glossy). Glossy displays show colors better, but matte ones have fewer reflections. Freedom from glare matters more than a pretty picture.",
		"<b>Покрытие:</b> обязательно матовое (не глянцевое). Глянцевое лучше передает цвета, но на матовом меньше бликов. Отсутствие бликов важнее, чем красивая картинка.",
	],
	monPicks: [
		"Plenty of monitors meet these criteria. I picked:",
		"Под эти критерии подходит достаточно большое количество мониторов, я выбрал:",
	],
	monMain: [
		"Main one - <a href=\"TODO\">Samsung G80SH</a>.",
		"Основной - <a href=\"TODO\">Samsung G80SH</a>.",
	],
	monSide: [
		"Four side ones - <a href=\"https://www.philips.co.uk/c-p/24B2U3601_00/business-monitor-lcd-monitor-with-usb-c\">Philips 24B2U3601</a>.",
		"Четыре дополнительных - <a href=\"https://www.philips.co.uk/c-p/24B2U3601_00/business-monitor-lcd-monitor-with-usb-c\">Philips 24B2U3601</a>.",
	],
	mon3a: [
		"All the monitors are on brackets and glued together at the back with ",
		"Все мониторы стоят на кронштейнах и скреплены сзади ",
	],
	monGlue: ["super glue with door hinges", "суперклеем с дверными петлями"],
	mon3b: [", so there are no gaps.", ", чтобы не было зазоров."],
	mon4: [
		"Five monitors is also a port challenge. A flagship graphics card usually has 3–4 outputs, and I have five screens. That's why I chose the side <term>Philips</term> monitors partly for their <term>DisplayPort Out</term>: they can be daisy-chained with <term>MST / daisy chain</term>, instead of buying a dock or using up a graphics card slot.",
		"Пять мониторов это ещё и задачка по портам. У флагманской видеокарты обычно 3–4 выхода, а экранов у меня пять. Поэтому дополнительные <term>Philips</term> выбраны ещё и из‑за <term>DisplayPort Out</term>: их можно вешать цепочкой <term>MST / daisy chain</term>, а не покупать док и не резать слот видеокарты.",
	],
	mon5: [
		"I keep the Windows scaling on the 4K main monitor so that its logical width matches the side <term>1440</term>. Otherwise windows dragged from the center to a vertical monitor jump in size. I didn't go for an ultrawide 49\": in the IDE I need independent apps, not one giant surface.",
		"Масштаб Windows на основном 4K держу так, чтобы логическая ширина совпадала с боковыми <term>1440</term>. Иначе окна, которые перетаскиваешь с центра на вертикальный монитор, прыгают по размеру. Гнаться за ультрашироким 49\" я не стал: в IDE мне нужны независимые приложения, а не одна огромная поверхность.",
	],
	monAppsIntro: ["I put each app behind its own monitor:", "Каждое приложение я размещаю за своим монитором:"],
	monApp1: [
		"Far left: <a href=\"https://www.warp.dev\">Warp</a> (an advanced terminal).",
		"Слева-слева: <a href=\"https://www.warp.dev\">Warp</a> (это продвинутый терминал).",
	],
	monApp2: [
		"Left: <a href=\"https://www.chromium.org\">Chromium</a> with the debugger open.",
		"Слева: <a href=\"https://www.chromium.org\">Chromium</a> с открытым дебаггером.",
	],
	monApp3: [
		"Center: <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a> | <a href=\"https://www.google.com/chrome/\">Chrome</a> | any other temporary app.",
		"Центр: <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a> | <a href=\"https://www.google.com/chrome/\">Chrome</a> | любое другое временное приложение.",
	],
	monApp4: [
		"Right: <a href=\"https://claude.ai\">Claude</a> | any other AI model.",
		"Справа: <a href=\"https://claude.ai\">Claude</a> | любая другая нейросеть.",
	],
	monApp5: [
		"Far right: <a href=\"https://www.thunderbird.net\">Thunderbird</a> | <a href=\"https://telegram.org\">Telegram</a> | <a href=\"https://slack.com\">Slack</a> | any other messenger.",
		"Справа-справа: <a href=\"https://www.thunderbird.net\">Thunderbird</a> | <a href=\"https://telegram.org\">Telegram</a> | <a href=\"https://slack.com\">Slack</a> | любой другой мессенджер.",
	],
	tKbd: ["Keyboard", "Клавиатура"],
	kbd1: [
		"My keyboard isn't a regular one, it's a <a href=\"https://kinesis-ergo.com/shop/advantage2\">Kinesis Advantage 2</a>. I can't put into words how much I love it. It is <b>much</b> more comfortable than regular keyboards.",
		"Клавиатура у меня не обычная, а <a href=\"https://kinesis-ergo.com/shop/advantage2\">Kinesis Advantage 2</a>. Словами не описать, насколько я ее обожаю. Она <b>намного</b> удобнее обычных клавиатур.",
	],
	kbd2: [
		"<b>Keys for the thumbs.</b> On regular keyboards a thumb can only press the spacebar. On the <term>Kinesis Advantage 2</term> the thumbs can press 12 keys (6 for each thumb): <term>PageUp</term> <term>PageDown</term> <term>Backspace</term> <term>Delete</term> <term>Home</term> <term>End</term> <term>Space</term> <term>Enter</term> <term>Alt</term> <term>Ctrl</term> <term>Alt+Shift</term> <term>Alt+Ctrl</term> <term>Alt+Ctrl+Shift</term>. The last 3 are set up through a macro: you hold one key, which is equivalent to pressing several modifiers at once.",
		"<b>Клавиши под большие пальцы.</b> На обычных клавиатурах большим пальцем можно нажать только на пробел. На <term>Kinesis Advantage 2</term> большими пальцами можно нажать 12 клавиш (по 6 на каждый большой палец): <term>PageUp</term> <term>PageDown</term> <term>Backspace</term> <term>Delete</term> <term>Home</term> <term>End</term> <term>Space</term> <term>Enter</term> <term>Alt</term> <term>Ctrl</term> <term>Alt+Shift</term> <term>Alt+Ctrl</term> <term>Alt+Ctrl+Shift</term>. Последние 3 настроены через макрос, зажимается одна клавиша и равносильно нажатию сразу нескольких модификаторов.",
	],
	kbd3: [
		"The thumb is the most functional finger on the hand, and the keyboard is designed so that the most frequently used keys are pressed with it.",
		"Большой палец - это самый функциональный палец на руке, и клавиатура спроектирована так, что им нажимаются самые часто-используемые клавиши.",
	],
	kbd4a: [
		"<b>Arrow keys' position.</b> The arrows are pressed with the index and middle fingers ",
		"<b>Расположение стрелок.</b> Стрелки нажимаются указательным и средним пальцем ",
	],
	kbdNoHand: ["without moving the hand", "без переноса руки"],
	kbd4b: [
		". On regular keyboards navigation means moving your whole hand.",
		". На обычных клавиатурах для навигации приходится двигать кисть.",
	],
	kbd5: [
		"<b>Elbow position.</b> The elbows are spread wider, and together with a corner desk it's a very comfortable position.",
		"<b>Позиция для локтей.</b> Локти разведены дальше, вместе с угловым столом это очень удобная позиция.",
	],
	kbd6: [
		"<b>Recesses.</b> Thanks to the recesses in the keyboard, the palm rests more comfortably from a physiological point of view.",
		"<b>Углубления.</b> Благодаря углублениям на клавиатуре ладонь лежит удобнее с физиологической точки зрения.",
	],
	kbd7: [
		"I didn't switch to <term>Colemak</term> / <term>Dvorak</term> / <term>Workman</term>. In theory they're faster, but I live in the hotkeys of the IDE, the browser and <a href=\"https://www.autohotkey.com\">AutoHotkey</a>. Breaking <term>QWERTY</term> for theoretical WPM is pointless when <term>CTRL-S</term> and navigation sit in my muscles more deeply than the letters do.",
		"Раскладку не менял на <term>Colemak</term> / <term>Dvorak</term> / <term>Workman</term>. В вакууме они быстрее, но я живу в хоткеях IDE, браузера и <a href=\"https://www.autohotkey.com\">AutoHotkey</a>. Ломать <term>QWERTY</term> ради теоретических WPM — глупо, если <term>CTRL-S</term> и навигация сидят в мышцах глубже, чем буквы.",
	],
	kbd8: ["This keyboard has three downsides:", "У этой клавиатуры есть три минуса:"],
	kbdLi1: [
		"<b>Price:</b> $499 for the regular version, $600 for Bluetooth.",
		"<b>Цена:</b> $499 долларов за обычную версию $600 за bluetooth",
	],
	kbdLi2: [
		"<b>Learning curve:</b> It takes a lot of time to get used to a different key layout. You can't imagine how deeply the typing habit sits in your subconscious. The first month or two will be very hard.",
		"<b>Порог входа:</b> Требуется достаточно много времени на то, что бы привыкнуть к другому расположению клавишь. Вы даже не представляете насколько сложно глубоко в подсознании сидит навык печати. Первые месяц-два будет очень тяжело.",
	],
	kbdLi3: [
		"<b>Not for games:</b> The key layout is good for comfortable typing, but not for gaming.",
		"<b>Не для игр:</b> Расположение клавиш хорошо подходит для удобной печати, но не для игр.",
	],
	tMouse: ["Mouse", "Мышка"],
	mouse1: ["My requirements for a mouse:", "Мои требования к мышке:"],
	mouseLi1: [
		"<b>Grip - <term>Claw</term>.</b> I don't understand how people use mice where the whole hand has to lie on the mouse.",
		"<b>Хват - <term>Claw</term>.</b> Я вообще не понимаю как люди пользуются мышками где рука должна полностью лежать на мышке.",
	],
	mouseLi2: [
		"<b>Symmetrical shape.</b> All those attempts to fit a mouse to the shape of the hand don't add comfort (at least for me).",
		"<b>Симметричная форма.</b> Все эти попытки подстроить мышку под форму руки - не добавляют удобства (по крайней мере для меня).",
	],
	mouseLi3: [
		"<b>Wireless.</b> Generally, the fewer cables the better.",
		"<b>Беспроводные.</b> Вообще чем меньше проводов тем лучше.",
	],
	mouseLi4: [
		"<b>Buttons.</b> I program the side buttons for copy and paste via <a href=\"https://www.autohotkey.com\">AutoHotkey</a>.",
		"<b>Кнопки.</b> Я программирую боковые кнопки на копирование и вставку через <a href=\"https://www.autohotkey.com\">AutoHotkey</a>.",
	],
	mouse2: [
		"Then it's just a matter of picking a mouse that meets all these requirements and holds a charge the longest. A lot of mice fit these requirements. I chose the <a href=\"https://www.logitechg.com/en-us/shop/p/pro-x2-superlight-wireless-mouse\">Logitech G Pro X Superlight 2</a>.",
		"Дальше просто выбираем мышку, которая удовлетворяет всем этим требованиям и держит заряд больше всего. Под эти требования подходит очень много мышек, я выбрал <a href=\"https://www.logitechg.com/en-us/shop/p/pro-x2-superlight-wireless-mouse\">Logitech G Pro X Superlight 2</a>.",
	],
	tGpu: ["Graphics card", "Видеокарта"],
	gpu1: [
		"I'll say right away that I'm not interested in FPS in games at all. A graphics card strongly affects the speed of local neural networks, which I run from time to time. Without local neural networks, practically any graphics card would suit me. So my only requirement for the graphics card is that local neural networks run as fast as possible.",
		"Сразу скажу, что FPS в играх меня не интересует вообще. Видеокарта очень сильно влияет на скорость работы локальных нейросетей, которые я время от времени использую. Если бы не локальные нейросети, то мне бы подошла практическая любая видеокарта. Поэтому к видеокарте у меня одно единственное требование - локальные нейросети должны работать как можно быстрее.",
	],
	gpu2a: [
		"To measure neural network speed, I run locally ",
		"Для замера скорости работы нейросетей запускается локально ",
	],
	gpu2Link: ["Llama 3 8B at Q4_K_M", "Llama 3 8B at Q4_K_M"],
	gpu2b: [
		" and count how many tokens per second the network generates.",
		" и смотрят сколько токенов в секунду генерирует нейросеть.",
	],
	gpu3: [
		"Here are the numbers for flagship graphics cards from <term>Nvidia</term> and <term>AMD</term>:",
		"Вот показатели флагманских видеокарт от <term>Nvidia</term> и <term>AMD</term>:",
	],
	gpuLi1: [
		"<a href=\"TODO\">Nvidia RTX 5090</a> - 220 tokens/s",
		"<a href=\"TODO\">Nvidia RTX 5090</a> - 220 tokens/s",
	],
	gpuLi2: [
		"<a href=\"TODO\">AMD 9070 XT</a> - 95 tokens/s",
		"<a href=\"TODO\">AMD 9070 XT</a> - 95 tokens/s",
	],
	gpu4: [
		"The difference is huge, but the <a href=\"TODO\">Nvidia RTX 5090</a> costs around $4,000, and the <a href=\"TODO\">AMD RX 9070 XT</a> around $800. Everyone decides for themselves whether they're willing to overpay. I use local neural networks a lot, so I chose the <a href=\"TODO\">Nvidia RTX 5090</a>. I don't need a 4K 240 Hz picture, I need <term>VRAM</term> capacity and matrix multiplication speed. I keep the slot at <term>PCIe 5.0 x16</term>: when a model doesn't fit on the card, chunks get pulled from RAM, and a cut-down x8 already slows things down.",
		"Разница огромная, но <a href=\"TODO\">Nvidia RTX 5090</a> стоит около $4.000, а <a href=\"TODO\">AMD RX 9070 XT</a> около 800$. Каждый решает сам, готов ли он переплачивать или нет. Я очень активно использую локальные нейросети, поэтому я выбрал <a href=\"TODO\">Nvidia RTX 5090</a>. Мне нужна не картинка в 4K 240 Гц, а объём <term>VRAM</term> и скорость матричных умножений. Слот держу в <term>PCIe 5.0 x16</term>: когда модель не влезает в видеокарту, куски едут из оперативки, и обрезанный x8 уже тормозит.",
	],
	tCpu: ["Processor", "Процессор"],
	cpu1: [
		"A powerful CPU isn't really needed for programming. But it strongly affects the speed of local neural networks when they don't fully fit in the graphics card.",
		"Мощный процессор в программировании не особо-то и нужен. Но он сильно влияет на скорость работы локальных нейростей, если те не полностью помещаются в видеокарту.",
	],
	cpu2a: [
		"Like any other hardware, I choose a CPU not by technical specs but by benchmarks. There are a huge number of benchmarks, and my favorite is ",
		"Процессор, как собственно и любой другое железо, я выбираю не по техническим характеристикам, а по бенчмаркам. Есть огромное количество различных бенчмарков, я предпочитаю больше всего ",
	],
	cpu2Link: ["GeekBench", "GeekBench"],
	cpu2b: [".", "."],
	cpu3: [
		"Only <term>AMD</term> and <term>Intel</term> make CPUs now, so let's compare their flagship models:",
		"Процессоры сейчас делают только <term>AMD</term> и <term>Intel</term>, поэтому сравним их флагманские модели:",
	],
	cpuLi1: [
		"<a href=\"TODO\">AMD Ryzen 9950X</a> - 999 points",
		"<a href=\"TODO\">AMD Ryzen 9950X</a> - 999 очков",
	],
	cpuLi2: [
		"<a href=\"TODO\">Intel Core Ultra 9 285k</a> - 999 points",
		"<a href=\"TODO\">Intel Core Ultra 9 285k</a> - 999 очков",
	],
	cpu4: [
		"Also, on <term>AMD</term> CPUs you can raise the clock of the <term>Infinity Fabric</term>. My sweet spot is <term>DDR5-6000</term> memory and <term>FCLK 2000</term> in 1:1 mode, without the lottery of 7200 MT/s. That's why I choose the <a href=\"TODO\">AMD Ryzen 9950X</a>.",
		"К тому же на <term>AMD</term> процессорах можно увеличить тактовую частоту <term>Infinity Fabric</term>. Сладкая точка для меня: память <term>DDR5-6000</term> и <term>FCLK 2000</term> в режиме 1:1, без лотереи на 7200 МТ/с. Поэтому я выбираю <a href=\"TODO\">AMD Ryzen 9950X</a>.",
	],
	tSsd: ["SSD", "SSD"],
	ssd1: [
		"A fast SSD affects program speed much more than a powerful CPU. The most important parameter to look at is <term>IOPS</term> (Input Output Per Second). Marketing talks about sequential GB/s, but the IDE, git status and repository search live on random access. 4 TB is enough for me with a big margin.",
		"Быстрый SSD влияет на скорость работы программ намного больше чем мощный процессор. Cамое главный параметр на который нужно смотреть - это <term>IOPS</term> (Input Output Per Second). Маркетинг пишет последовательные ГБ/с, а IDE, git status и поиск по репозиторию живут на случайном доступе. Мне хватает 4TB с большим запасом.",
	],
	ssd2: [
		"IOPS for the flagship models of the three main competitors:",
		"Количество <term>IOPS</term> у флагманских моделей трех основных конкурентов:",
	],
	ssdLi1: [
		"<a href=\"TODO\">Crucial T710</a> - 2300 IOPS",
		"<a href=\"TODO\">Crucial T710</a> - 2300 IOPS",
	],
	ssdLi2: [
		"<a href=\"TODO\">MSI SPATIUM M571</a> - 2600 IOPS.",
		"<a href=\"TODO\">MSI SPATIUM M571</a> - 2600 IOPS.",
	],
	ssdLi3: [
		"<a href=\"TODO\">Samsung SSD 9100 Pro</a> - 2600 IOPS.",
		"<a href=\"TODO\">Samsung SSD 9100 Pro</a> - 2600 IOPS.",
	],
	ssd3: [
		"<term>Samsung</term> has the same <term>IOPS</term> as <term>MSI</term>, but I prefer <term>Samsung</term> because they make their own controller (other manufacturers buy controllers from subcontractors).",
		"У <term>Samsung</term> столько же <term>IOPS</term> столько же сколько и у <term>MSI</term>, но я предпочитаю <term>Samsung</term> потому что они сами делаю свой контроллер (другие производители закупают контроллеры у подрядчиков).",
	],
	tRam: ["RAM", "Оперативная память"],
	ram1: [
		"For programming, even 32 GB of RAM is generally enough, but I also run local neural networks. If a network doesn't fully fit into the graphics card, part of it moves to RAM. 64 GB is enough for ordinary networks, but I want to run the most powerful networks with 70B+ parameters without quantization, so I need 128 GB.",
		"Для программирования по большому счету достаточно даже 32 GB оперативки, но я ведь еще запускаю локальные нейросети. Если нейросеть полностью не помещается в видеокарту, то определенная ее часть переносится в оперативку. Для обычных нейросетей будет достаточно 64 GB, но мне хочется запускать самые крутые нейросети с 70B+ параметрами без квантизации, поэтому нужно 128 GB.",
	],
	ram2: ["My criteria for choosing RAM:", "Мои критерии при выборе оперативки:"],
	ramLi1: [
		"<b>Type - DDR5.</b> Modern CPUs and motherboards simply don't work with <term>DDR4</term>",
		"<b>Тип - DDR5.</b> Современные процессоры и материнские платы попросту не работают с <term>DDR4</term>",
	],
	ramLi2: [
		"<b>Capacity - 128 GB as a 2×64 kit.</b> Two sticks are better than four 32 GB ones: the memory controller doesn't choke the frequency or <term>FCLK</term>.",
		"<b>Объем - 128 GB комплектом 2×64.</b> Две планки лучше, чем четыре по 32 GB: контроллер памяти не душит частоту и <term>FCLK</term>.",
	],
	ramLi3: [
		"<b>EXPO support.</b> With this feature you just switch one parameter in the BIOS and get optimal settings, without fiddling with low-level parameters.",
		"<b>Поддержка EXPO.</b> С помощью этой функции можно просто переключить один параметр в BIOS и получить оптимальные параметры, без ковыряния низкоуровневых параметров.",
	],
	ramLi4: [
		"<b>Not gaming-branded.</b> A lot of hardware is marketed as gaming, and for me that is always a huge minus.",
		"<b>Не геймерская.</b> Очень много какого железа позиционируется как геймерское, для меня это всегда огромный минус.",
	],
	ram3: [
		"Very few models meet these criteria. I chose the <a href=\"TODO\">Kingston Fury Beast DDR5</a>.",
		"Очень мало моделей подходят под эти критерии, я выбрал <a href=\"TODO\">Kingston Fury Beast DDR5</a>.",
	],
	tMobo: ["Motherboard", "Материнска плата"],
	mobo1: [
		"The most important thing is that the motherboard supports all the chosen hardware.",
		"Самое главное, что бы материнская плата поддерживала все выбранное железо.",
	],
	mobo2: ["My requirements for the motherboard:", "Мои требования к материнской плате:"],
	moboLi1: [
		"<b>Support for <term>AM5</term>.</b> An <term>AMD</term> CPU needs an <term>AM5</term> socket on the motherboard.",
		"<b>Поддержка <term>AM5</term>.</b> Под <term>AMD</term> процессор нужен <term>AM5</term> сокет на материнской плате.",
	],
	moboLi2: [
		"<b>Support for <term>FCLK</term>.</b> This feature raises the clock of the <term>Infinity Fabric</term>. Benchmarks show +10–20% speed for neural networks that don't fit in the graphics card and spill into <term>RAM</term>.",
		"<b>Поддержка <term>FCLK</term>.</b> Этой функцией можно увеличить тактовую частоту <term>Inifinity Fabric</term>. По бенчмаркам это дает +10-20% скорости к нейросетям, которые не помещаются в видеокарте и скидываются в <term>RAM</term>.",
	],
	moboLi3: [
		"<b>Support for <term>EXPO</term>.</b> Instead of tuning all the RAM parameters by hand, it's easier to flip a single switch.",
		"<b>Поддержка <term>EXPO</term>.</b> Вместо ковыряния всех параметров оперативки вручную удобнее просто переключить один тумблер.",
	],
	moboLi4: [
		"<b>Support for 4 <term>DDR5</term> slots.</b> Right now I only use 2 slots, but let it be 4 in case I want more.",
		"<b>Поддержка 4 слотов <term>DDR5</term>.</b> Сейчас я использую только 2 слота, но пусть будет 4 на случай если захочется больше.",
	],
	moboLi5: [
		"<b>Support for <term>WiFi</term> and <term>Bluetooth</term>.</b> Handy if they're built into the board.",
		"<b>Поддержка <term>WiFi</term> и <term>Bluetooth</term>.</b> Удобно, если они сразу есть на материнке.",
	],
	moboLi6: [
		"<b>Support for <term>PCIe 5.0</term>.</b> The CPU talks to the disk and the graphics card over <term>PCIe</term>, and the faster it is, the faster that communication.",
		"<b>Поддержка <term>PCIe 5.0</term>.</b> Процессор общается с диском и видео-картой по <term>PCIe</term>, чем он быстрее, тем быстрее это общение.",
	],
	moboLi7: [
		"<b><term>Resizable BAR</term>.</b> The CPU must see the graphics card's whole memory at once, not in 256 MB chunks. For offloading a model from <term>RAM</term> to the GPU this is not marketing, it's the bus.",
		"<b><term>Resizable BAR</term>.</b> Процессор должен видеть всю память видеокарты целиком, а не кусками по 256 МБ. Для оффлоада модели из <term>RAM</term> в GPU это не маркетинг, а шина.",
	],
	mobo3: [
		"Several boards fit these criteria. I chose the <a href=\"TODO\">MSI MAG X870E Tomahawk</a>.",
		"Под эти критерии подходит несколько материнок, выбрал <a href=\"TODO\">MSI MAG X870E Tomahawk</a>.",
	],
	tHeadphones: ["Headphones", "Наушники"],
	hp1: [
		"You need full-size <term>over-ear</term> headphones: a cup around the ear, not on-ear pads. On-ear pads press on the cartilage, and after an hour you can't work. Gaming headsets with a boom mic and RGB are out: a desk mic is better.",
		"Нужны полноразмерные <term>over-ear</term> - чаша вокруг уха, не накладные таблетки. Накладные давят на хрящ, через час уже не работается. Геймерские гарнитуры с микрофоном на палке и RGB сразу нет - микрофон на столе лучше.",
	],
	hp2: [
		"I chose the <a href=\"https://us.sennheiser-hearing.com/products/momentum-5-wireless?variant=62714248495475\">Sennheiser Momentum 5 Wireless</a>. Wireless, noise cancelling, up to 57 hours with ANC, and the battery can be replaced with a screwdriver. For calls and flights that matters more than a 'studio' cable without a mic.",
		"Выбрал <a href=\"https://us.sennheiser-hearing.com/products/momentum-5-wireless?variant=62714248495475\">Sennheiser Momentum 5 Wireless</a>. Беспроводные, шумодав, до 57 часов с ANC, батарею можно заменить отвёрткой. Для звонков и самолёта важнее, чем «студийный» провод без микрофона.",
	],
	sepSoftware: ["Software", "Софт"],
	tOs: ["Operating system", "Операционная система"],
	os1: [
		"You might think that since I'm such a tech geek, I run something like <a href=\"TODO\">Ubuntu</a>. But that's not the case at all. The biggest drawback of Ubuntu for me is that <a href=\"https://www.autohotkey.com\">AutoHotkey</a> (which I use <b>a lot</b>) doesn't work on it. For the same reason I don't look at <a href=\"https://www.apple.com/macos\">macOS</a>. Windows also has the most convenient window management.",
		"Вы можете подумать, что раз я такой техногик, то у меня что-то типа <a href=\"TODO\">Ubuntu</a>. Но это совершенно не так. Самым главным минусом убунты для меня является то, что ней не работает <a href=\"https://www.autohotkey.com\">AutoHotkey</a> (который я использую <b>очень</b> активно). По этой же причине я не смотрю в сторону <a href=\"https://www.apple.com/macos\">MacOS</a>. Так же на винде самая удобная система управления окнами.",
	],
	os2a: [
		"Setting up <a href=\"https://www.microsoft.com/windows\">Windows</a> takes me three steps:",
		"Настройка <a href=\"https://www.microsoft.com/windows\">Windows</a> у меня происходит в три этапа:",
	],
	osStep1: ["Removing boilerplate", "Удаление бойлерплейта"],
	osStep2: ["Disabling components", "Отключение компонентов"],
	osStep3: ["Regular settings", "Обычные настройки"],
	os3a: [
		"On <a href=\"https://www.microsoft.com/windows\">Windows</a> (as on every OS) installing apps is a total mess for historical reasons.",
		"На <a href=\"https://www.microsoft.com/windows\">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений по историческим причинам.",
	],
	os3Li1: [
		"An app can be installed via <a href=\"TODO\">winget</a>.",
		"Приложение можно поставить через <a href=\"TODO\">winget</a>.",
	],
	os3Li2: [
		"An app can be downloaded from the <a href=\"TODO\">Windows Store</a>.",
		"Приложение можно скачать через <a href=\"TODO\">Windows Store</a>.",
	],
	os3Li3: ["An app can be opened in the browser.", "Приложение можно открыть в браузере."],
	os3Li4: ["An app can be downloaded from a web app.", "Приложение можно скачать из веб-приложения."],
	os3Li5a: ["From a website you can create a ", "Из вебсайта можно создать "],
	osLinkShortcut: ["shortcut", "ярлык"],
	os3Li5b: [", a ", ", "],
	osLinkPwa: ["PWA", "PWA"],
	os3Li5c: [", or ", ", "],
	osLinkInstall: ["install it as an app", "установить как приложение"],
	os3Li5d: [".", "."],
	os4: [
		"To unify all of this, I follow a set algorithm for installing apps.",
		"Что бы все это как-то унифицировать, я придерживаюсь определенного алгоритма по установке приложений.",
	],
	os4Li1: [
		"First I try to install the app via <a href=\"https://learn.microsoft.com/windows/package-manager/winget/\">winget</a>.",
		"Сначала пытаюсь поставить приложение через <a href=\"https://learn.microsoft.com/windows/package-manager/winget/\">winget</a>.",
	],
	os4Li2a: [
		"If the app isn't in <a href=\"https://learn.microsoft.com/windows/package-manager/winget/\">winget</a>:",
		"Если в <a href=\"https://learn.microsoft.com/windows/package-manager/winget/\">winget</a> приложения нет:",
	],
	os4Li2b1: ["If it's a web app, I create a ", "Если это веб-приложение то создаю "],
	osLinkDesktop: ["desktop app", "десктопное приложение"],
	os4Li2b2: [".", "."],
	os4Li2c: [
		"If it's a native app, I download it from the official website.",
		"Если это нативное приложение то гружу приложения с официального сайта.",
	],
	os5: [
		"In my experience this covers all the edge cases, and I almost never need the <a>Windows Store</a> (it's more of an exception).",
		"Из моей практики это покрывает все пограничные случаи, почти не приходится пользоваться <a>Windows Store</a> (это скорее исключение).",
	],
	ahkIntro: [
		"<a href=\"https://www.autohotkey.com\">AutoHotkey</a> is a programming language made specifically for creating your own hotkeys on <a href=\"TODO\">Windows</a>. Below is what should really be built into the OS but is implemented through workarounds and hacks.",
		"<a href=\"https://www.autohotkey.com\">AutoHotkey</a> - язык программирования специально заточенный под создание своих горячих клавиш на <a href=\"TODO\">Windows</a>. Ниже - то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.",
	],
	ahkMacros: [
		"<b>Macros.</b> Although I love my keyboard, some keys sit in convenient positions while the actions they perform are rarely used. That can be fixed with macros. Here's a ",
		"<b>Макросы.</b> Не смотря на то что я очень люблю свою клавиатуру, определенные клавиши имеют удобное расположение, но то действие которое они выполняют используется крайне редко. Это поправимо макросами. Вот вам ",
	],
	ahkPicture: ["picture", "картинка"],
	ahkMacrosAfter: [
		" showing where the keys are.",
		" для наглядности где какие клавиши расположены.",
	],
	ahkMap1: ["<term>Caps Lock</term> = <term>Ctrl</term>.", "<term>Caps Lock</term> = <term>Ctrl</term>."],
	ahkMap2: ["<term>Win</term> = <term>Ctrl-Shift</term>.", "<term>Win</term> = <term>Ctrl-Shift</term>."],
	ahkMap3: ["<term>Right Ctrl</term> = <term>Alt-Shift</term>", "<term>Right Ctrl</term> = <term>Alt-Shift</term>"],
	ahkMap4: ["<term>Left-Ctrl</term> = <term>Alt-Ctrl-Shift</term>", "<term>Left-Ctrl</term> = <term>Alt-Ctrl-Shift</term>"],
	ahkMap5: ["<term>/</term> = <term>Alt-Tab</term>.", "<term>/</term> = <term>Alt-Tab</term>."],
	ahkMap6: ["<term>Insert</term> = <term>Shift-Tab</term>.", "<term>Insert</term> = <term>Shift-Tab</term>."],
	ahkMap7: ["<term>~</term> = <term>Esc</term>.", "<term>~</term> = <term>Esc</term>."],
	ahkMap8: ["<term>ESC</term> = <term>Win</term>.", "<term>ESC</term> = <term>Win</term>."],
	ahkUnify: [
		"<b>Unification.</b> The symbols typed with <term>Shift-[0-9]</term> are fixed, so the same symbol is typed regardless of layout. Frequently used symbols were also moved to <term>Ctrl-[0-9]</term> (these are slashes and all kinds of brackets).",
		"<b>Унификация.</b> Зафиксированы те символы которые печатаются по <term>Shift-[0-9]</term>. Сделал так, что бы печатался один и тот же символ вне зависимости от раскладки. Так же часто используемые символы перенесены на <term>Ctrl-[0-9]</term> (это слэши и все виды скобочек).",
	],
	ahkGest1: [
		"<b>Keyboard gestures.</b> By default, holding a key repeats the same character. That's useful for navigation but completely useless on letters. I made it so that holding a letter (or digit) launches a specific app. This is a million times more useful than typing a long run of the same character. Here's the ",
		"<b>Клавиатурные жесты.</b> Сейчас по умолчанию долгом зажатии клавиши символ печатается много раз одна и та же буква - это поведение полезно при навигации, но абсолютно бесполезно на буквах. Я сделал так, что при долгом зажатии буквы (или цифры) запускается определенное приложение. Это поведение раз в миллион полезнее, чем печать большого количества одного и того же символа. Вот ",
	],
	ahkList: ["list", "список"],
	ahkGest2: [" of my bindings.", " моих биндов."],
	ahkSwitch: [
		"<b>Switching.</b> Pressing the backslash switches focus between the current and the previous app (it emulates <term>Alt-Tab</term>). It's a super convenient key, but the character printed on it is one I need once a week.",
		"<b>Свитчинг.</b> При нажатии на обратный слэш, происходит переключение фокуса между текущим и предыдущим приложением (эмулируется нажатие <term>Alt-Tab</term>). Это супер-удобная клавиша для нажатия, но на которую печатается символ, который требуется один раз в неделю.",
	],
	ahkSel1: [
		"<b>Selector</b> The standard Alt-Tab didn't suit me. It only switches between running apps, and you can't launch new ones. You also can't focus an app by typing its name.",
		"<b>Селектор</b> Стандартный альтаб меня не устраивал. На нем можно переключаться только между запущенными приложениями, но нельзя запускать новые приложения. Так же в нем нельзя фокусировать приложение вводя его имя.",
	],
	ahkSel2a: [
		"Holding the <term>a</term> key launches a selector where all shortcuts are sorted with <a href=\"TODO\">fzf</a>. There's also a check: if the app is running it gets focused, and if not it launches. So focusing and launching an app go through the same interface. ",
		"При долгом нажатии на клавишу <term>a</term> запускается селектор в котором все ярлыки сортируются с помощью <a href=\"TODO\">fzf</a>. Так же добавлена проверка, если приложение запущено, то оно фокусируется, если нет то запускается. То есть фокусировка и запуск приложения происходит через один и тот же интерфейс. ",
	],
	ahkHow: ["Here's how it works", "Вот как это работает"],
	ahkSel2b: [".", "."],
	ahkSel3: [
		"So if an app has a keyboard gesture, I launch it with a long press. If it doesn't, I use my selector. Launching and focusing web apps also goes through this selector (installing a web app automatically creates a desktop shortcut).",
		"В итоге если приложению назначен клавиатурный жест - я запускаю его через долгое нажатие. Если нет - то использую свой селектор. При этом запуск и фокус веб-приложений так же происходит через этот селектор (при установке веб-приложения автоматически создается ярлык на десктопе).",
	],
	ahkLang1: [
		"<b>Layout switching.</b> I have to switch the layout about 100 times a day. Neither <a href=\"https://yandex.ru/soft/punto/\">Punto Switcher</a> nor <a href=\"https://caramba-switcher.com\">Caramba Switcher</a> worked for me (they work in 90% of cases, but the other 10% ruins everything).",
		"<b>Смена раскладки.</b> Раскладку нужно менять по 100 раз на дню. Ни <a href=\"https://yandex.ru/soft/punto/\">Punto Switcher</a>, ни <a href=\"https://caramba-switcher.com\">Caramba Switcher</a> мне не зашли (работают в 90% случаев, но отавшиеся 10% все портят).",
	],
	ahkLang2: [
		"I noticed that layout problems only happen at the moment you start typing. My script resets the app's language to the default whenever focus changes (the language is set in the desktop shortcut name, for example <term>warp.en.lnk</term>).",
		"Я заметил, что проблемы с раскладкой возникают только в момент начала печати. В моем скрипте написана логика, что при смене фокуса язык приложения сбрасывается на значение по умолчанию (язык указывается в названии ярлыка на десктопе, например <term>warp.en.lnk</term>).",
	],
	ahkLang3: [
		"This way you naturally build the habit of remembering each app's starting layout. And once text is being typed, the layout stays in your head, so switching it causes no problems.",
		"Таким образом легко нарабатывается навык при котором запоминается начальная раскладка каждого приложения. А когда текст уже печатается то раскладка удерживается в голове, и переключать ее не вызывает проблем.",
	],
	ahkLang4: [
		"While typing, I switch the layout manually with a single press of the right <term>Shift</term> without modifiers.",
		"Во время печати, я управляю раскладкой вручную через одиночное нажатие на правый <term>Shift</term> без модификаторов.",
	],
	ahkMouse: [
		"<b>Mouse buttons.</b> One mouse button for copy, the second for paste, and pressing the scroll wheel is Enter.",
		"<b>Мышинные кнопки.</b> Одна мышинная кнопка на копирование, вторая на вставку, нажатие на колесико - Enter.",
	],
	tBrowser: ["Browser", "Браузер"],
	br1: [
		"Privacy-focused browsers are out right away (<a href=\"https://duckduckgo.com/app\">Duckduckgo</a>, <a href=\"https://brave.com\">Brave</a>, <a href=\"https://mullvad.net/en/browser\">Mullvad</a>). In practice, browsers that try to ensure privacy often break functionality. Honestly, I don't care that some app monitors my activity and collects analytics. But I do care when web apps break. Let them collect their telemetry: that's how developers fix bugs and make the product better.",
		"Браузеры с фокусом на приватность сразу идут лесом (<a href=\"https://duckduckgo.com/app\">Duckduckgo</a>, <a href=\"https://brave.com\">Brave</a>, <a href=\"https://mullvad.net/en/browser\">Mullvad</a>). Как показывает практика, браузеры в своих попытках обеспечить приватность зачастую ломают функционал. Честное слово, мне абсолютно пофиг на то что какое-то приложение мониторит мою активность и собирают аналитику. Но мне не пофиг на то, когда веб-приложения ломаются. Пускай собирают свою телеметрию, благодаря этому разработчики исправляют ошибки и делают продукт лучше.",
	],
	br2: [
		"<a href=\"https://www.opera.com\">Opera</a> has lots of built-in features, but they can easily be implemented through plugins in <a href=\"https://www.google.com/chrome/\">Chrome</a>.",
		"В <a href=\"https://www.opera.com\">Opera</a> много разного различного встроенного функционала, но его можно легко реализовать через плагины в <a href=\"https://www.google.com/chrome/\">Chrome</a>.",
	],
	br3a: [
		"I dropped <a href=\"https://www.mozilla.org/firefox/\">Firefox</a> because I don't like its interface. I install it solely for cross-browser development.",
		"От <a href=\"https://www.mozilla.org/firefox/\">Firefox</a> я отказался потому что мне не нравится его интерфейс. Устанавливаю его исключительно для кросс-браузерной разработки.",
	],
	br3b: [
		"I settled on <a href=\"https://www.google.com/chrome/\">Chrome</a> for browsing and <a href=\"https://www.chromium.org\">Chromium</a> for development (they have different hotkeys and open on different monitors).",
		"Я остановился на <a href=\"https://www.google.com/chrome/\">Chrome</a> для браузинга и <a href=\"https://www.chromium.org\">Chromium</a> для разработки (им назначены разные горячие клавиши и они открываются на разных мониторах).",
	],
	brPlugins: [
		"Here's my list of must-have plugins (installed in <a href=\"https://www.google.com/chrome/\">Chrome</a>, not <a href=\"https://www.chromium.org\">Chromium</a>):",
		"Вот список моих маст хэв плагинов (ставятся в <a href=\"https://www.google.com/chrome/\">Chrome</a>, не <a href=\"https://www.chromium.org\">Chromium</a>):",
	],
	brPlugin1: [
		"<a href=\"https://claude.ai/\">Claude</a> - lets you chat with <a href=\"TODO\">Claude</a> about the content of a page (requires a subscription).",
		"<a href=\"https://claude.ai/\">Claude</a> - можно общаться с <a href=\"TODO\">Claude</a> о содержимом на странице (требуется подписка).",
	],
	brPlugin2: [
		"<a href=\"https://1password.com\">1Password</a> - password manager.",
		"<a href=\"https://1password.com\">1Password</a> - менеджер паролей.",
	],
	brPlugin3: [
		"<a href=\"https://ublockorigin.com/\">uBlock Origin</a> - by benchmarks it beats <a href=\"https://adblockplus.org\">AdBlock Plus</a>, <a href=\"https://getadblock.com\">AdBlock</a> and <a href=\"TODO\">AdGuard</a>.",
		"<a href=\"https://ublockorigin.com/\">uBlock Origin</a> - по бенчмаркам лучше <a href=\"https://adblockplus.org\">AdBlock Plus</a>, <a href=\"https://getadblock.com\">AdBlock</a> и <a href=\"TODO\">AdGuard</a>.",
	],
	brPlugin4: [
		"<a href=\"https://crxmouse.com/\">CxMouse</a> - a gesture plugin. I have only four gestures set up. Left / right - focus the left / right tab. Down - close the tab. Up - open a new tab.",
		"<a href=\"https://crxmouse.com/\">CxMouse</a> - плагин для жестов. У меня настроено только четыре жеста. Влево / вправо - фокус левой / правой вкладки. Вниз - закрыть вкладку. Вверх - создать новую вкладку.",
	],
	brPlugin5: [
		"<a href=\"https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn\">Dont Close The Window with Last Tab</a> - blocks closing the window when the last tab is closed.",
		"<a href=\"https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn\">Dont Close The Window with Last Tab</a> - блокирует закрытие окна при закрытии последней вкладки.",
	],
	brPlugin6: [
		"<a href=\"https://www.i-dont-care-about-cookies.eu/\">I dont care about cookies</a> - automatically accepts all cookies.",
		"<a href=\"https://www.i-dont-care-about-cookies.eu/\">I dont care about cookies</a> - автоматически принимает все куки.",
	],
	brPlugin7: [
		"<a href=\"https://phantom.com/\">Phantom</a> - crypto wallet (I only use it for stablecoins).",
		"<a href=\"https://phantom.com/\">Phantom</a> - крипто-кошелек (использую только для стейблкойнов).",
	],
	brPlugin8: [
		"<a href=\"https://returnyoutubedislike.com\">Return Youtube Dislike</a> - shows the dislike count on YouTube.",
		"<a href=\"https://returnyoutubedislike.com\">Return Youtube Dislike</a> - возвращает количество дизлайков на youtube.",
	],
	brPlugin9: [
		"<a href=\"https://chromewebstore.google.com/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle\">Enhancer For Youtube</a> - useful extras for YouTube.",
		"<a href=\"https://chromewebstore.google.com/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle\">Enhancer For Youtube</a> - полезные утилитки для youtube.",
	],
	brPlugin10: [
		"<a href=\"https://chromewebstore.google.com/detail/no-new-tabs/gneobebnilffgkejpfhlgkmpkipgbcno?hl=en\">No New Tabs</a> - stops the browser from creating new tabs. It's annoying when a web app opens tabs on its own. If I want a new tab, I'll open it myself.",
		"<a href=\"https://chromewebstore.google.com/detail/no-new-tabs/gneobebnilffgkejpfhlgkmpkipgbcno?hl=en\">No New Tabs</a> - запрещает браузеру создавать новые вкладки. Бесит когда веб-приложение сам создает новые вкладки, если я захочу открыть новую вкладку я сам это сделаю.",
	],
	brPlugin11: [
		"<a href=\"https://tampermonkey.net\">Tamper Monkey</a> - lets you add your own JS to pages (I add fixed titles to websites so I can focus them via <a href=\"TODO\">AutoHotkey</a>).",
		"<a href=\"https://tampermonkey.net\">Tamper Monkey</a> - позволяет добавлять свой JS на страницу (добавляю фиксированные заголовки веб-сайтам, что бы фокусировать их через <a href=\"TODO\">AutoHotkey</a>).",
	],
	brPlugin12: [
		"<a href=\"https://chromewebstore.google.com/detail/search-navigator-%E2%80%93-keyboa/fpinaaaiplppifhmkjdfkimodkkdnoha\">Search Navigator</a> - adds hotkeys to Google search results (it's unclear why Google never built this natively).",
		"<a href=\"https://chromewebstore.google.com/detail/search-navigator-%E2%80%93-keyboa/fpinaaaiplppifhmkjdfkimodkkdnoha\">Search Navigator</a> - добавляет горячие клавиши к результатам поиска гугла (почему гугл нативно это не реализовал - не понятно).",
	],
	brPlugin13: [
		"<a href=\"https://chromewebstore.google.com/detail/currency-converter-pro/amlcmfdiddkikfmljhdhhookgjmnpedc\">CurrencyConverter</a> - currency conversion (especially useful on <a href=\"TODO\">ek.ua</a>).",
		"<a href=\"https://chromewebstore.google.com/detail/currency-converter-pro/amlcmfdiddkikfmljhdhhookgjmnpedc\">CurrencyConverter</a> - конвертация валют (особенно полезно на <a href=\"TODO\">ek.ua</a>).",
	],
	brPlugin14: [
		"<a href=\"https://chromewebstore.google.com/detail/copy-url-%E2%80%94-one-click-url/ndpdhbnlllblljkmbcdolnjpbcfolnme\">Copy URL</a> - creates a hotkey for copying a URL.",
		"<a href=\"https://chromewebstore.google.com/detail/copy-url-%E2%80%94-one-click-url/ndpdhbnlllblljkmbcdolnjpbcfolnme\">Copy URL</a> - создает горячую клавишу для копирования урла.",
	],
	brPlugin15: [
		"<a href=\"https://chromewebstore.google.com/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=en\">Google Translate</a> - translates a word when you select it.",
		"<a href=\"https://chromewebstore.google.com/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=en\">Google Translate</a> - перевод слова при выделении.",
	],
	brHotkeys1: [
		"Chrome doesn't let you edit hotkeys, but <a href=\"TODO\">AutoHotkey</a> comes to the rescue. Here's a ",
		"В хроме нельзя редактировать горячие клавиши, но на помощ к нам приходит <a href=\"TODO\">AutoHotkey</a>. Вот ",
	],
	brList: ["list", "список"],
	brHotkeys2: [" of my Chrome hotkeys.", " моих горячих клавиш для хрома."],
	brLast: [
		"I searched but didn't find a plugin for incremental fuzzy search on a page. If anyone is looking for an idea for a small open source project, here it is.",
		"Я искал, но не нашел плагина для инкрементального fuzzy поиска на странице. Если кто-то ищет идею для своего небольшого open source проекта то вот она.",
	],
	tEditor: ["Code editor", "Редактор кода"],
	edCursor1: [
		"<a href=\"https://cursor.com\">Cursor</a> is positioned as the editor with the most advanced AI support, but honestly I didn't notice much difference in AI support compared to <a href=\"\">WebStorm</a> with the <a href=\"TODO\">Claude</a> plugin installed.",
		"<a href=\"https://cursor.com\">Cursor</a> - позиционируется как редактор с самой продвинутой поддержкой нейросетей, но честно-говоря в поддержки ии я особо разрницы не заметил с <a href=\"\">WebStorm</a> с установленным <a href=\"TODO\">Claude</a> плагином.",
	],
	edCursor2: [
		"But when you buy a <a href=\"TODO\">Claude</a> subscription, you can use it in the browser, on your phone, as a TUI on a server, and you also get an API key you can plug in wherever you like. <a href=\"https://cursor.com\">Cursor</a> supports none of that.",
		"Но при этом покупая подписку на <a href=\"TODO\">Claude</a> вы можете его использовать: в браузере, на телефоне, как TUI на сервере и так же получаете API ключ, который вы можете вставлять куда хотите. <a href=\"https://cursor.com\">Cursor</a> ничего из этого не поддерживает.",
	],
	edCursor3: [
		"Many people say a plus of Cursor is that you can switch models on the fly. That's cool, but honestly I don't think it's a real killer feature.",
		"Многие говорят, что плюсом курсора является то, что можно менять нейросети на лету, это прикольно, но честно говоря не думаю это такая прям киллер фича.",
	],
	edZed: [
		"<a href=\"https://zed.dev\">Zed</a> - I liked how little memory it uses (20 times less). I tried switching to it, but functionally it is much weaker than <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a>.",
		"<a href=\"https://zed.dev\">Zed</a> - очень понравилось то насколько мало памяти он жрет (в 20 раз меньше). Пытался на него перейти, но по функциональности он намного слабже <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a>.",
	],
	edWs1: [
		"<a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a> - the most functional editor for web development at the moment. If you use it for non-commercial work, it's free.",
		"<a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a> - самый функциональный редактор для разработки веб-приложений на текущий момент. Если используете не для коммерческой разработки, то он бесплатен.",
	],
	edWs2: [
		"Here's the list of features I use every day that are either completely missing or worse in <a href=\"TODO\">Zed</a> and <a href=\"TODO\">Cursor</a>:",
		"Вот список того функционала, которым пользуюсь каждый день и который в <a href=\"TODO\">Zed</a> так и <a href=\"TODO\">Cursor</a> либо полностью отсутствует либо реализован хуже:",
	],
	edWsLi1: [
		"<a href=\"https://git-scm.com\">Git</a> support",
		"Поддержка <a href=\"https://git-scm.com\">Git</a>",
	],
	edWsLi2: [
		"Recently opened files history (I even turned tabs off)",
		"История последних открытых файлов (вкладки даже отключил)",
	],
	edWsLi3: ["Local history", "Локальная история"],
	edWsLi4: ["Opening panels in separate windows", "Открытие панелей в отдельных окнах"],
	edWsLi5: ["Intents", "Интенты"],
	edWsLi6: ["File preview in the tree", "Предпросмотр файла в дереве"],
	edWsLi7: [
		"Scopes (Frontend and Backend marked with different colors)",
		"Скоупы (Frontend и Backend помечаю разными цветами)",
	],
	edWsLi8: ["Tabs when searching", "Вкладки при поиске"],
	edWsLi9: [
		"Quicklists: LocalHistory, <a href=\"https://git-scm.com\">Git</a>, <a href=\"https://github.com\">GitHub</a>",
		"Quicklists: LocalHistory, <a href=\"https://git-scm.com\">Git</a>, <a href=\"https://github.com\">GitHub</a>",
	],
	edWsLi10: [
		"And <b>a lot</b> of other little things.",
		"И еще <b>очень много</b> других мелочей.",
	],
	edWs3: [
		"You'll laugh, but I turned tabs off. I use Recent Files instead.",
		"Вы будете смеяться, но вкладки я отключил. Вместо них - Recent Files.",
	],
	edCfg1: [
		"Here's my config - you can import it.",
		"Вот мой конфиг - можете импортировать.",
	],
	edCfg2a: ["Here are my ", "Вот мои настройки "],
	edCfgLink: ["WebStorm", "WebStorm"],
	edCfg2b: [" settings.", "."],
	edPlugins: [
		"Plugin list: <a href=\"https://plugins.jetbrains.com/plugin/22072-kursor\">Kursor</a> for syntax highlighting.",
		"Список плагинов: <a href=\"https://plugins.jetbrains.com/plugin/22072-kursor\">Kursor</a> для подсветки.",
	],
	tAi: ["AI", "Нейросеть"],
	ai1: [
		"Neural networks have been revolutionary, and it's pointless to deny it. And in programming they've made more of a revolution than anywhere else. It's very important to integrate them well into your daily workflow.",
		"Нейросети - совершили революцию, это глупо отрицать. А в программировании они совершил революцию больше чем где-то бы то ни было еще. И очень важно грамтно заинтегрировать нейросети в свой ежедневный рабочий процесс.",
	],
	ai2: [
		"The first thing is choosing the right model. I wrote a simple app, a contacts manager, entirely by hand without neural networks. Then I asked various AIs to write exactly the same app with the same features, but only from the description I gave them. For me this is a much more relevant measure than various benchmarks.",
		"Первое что нужно, это выбрать правильную нейросить. Я написал простенькое приложение, менеджер контактов, полностью своими руками без нейросетей. И потом я просил разные ИИ написать точно такое же приложение по функционал, но только по тому описанию, которое я ей давал. Для меня это намного более релевантный показатель, чем различные бенчмарки.",
	],
	ai3: [
		"The best option turned out to be <a href=\"https://claude.ai\">Claude</a> - it has a special focus on programming. Very good integration with WebStorm, and quality plugins for <a href=\"\">Chrome</a>.",
		"Лучшей опцией оказался <a href=\"https://claude.ai\">Claude</a> - у него особый фокус на программировании. Очень хорошая интеграция с WebStorm и качественные плагин под <a href=\"\">Chrome</a>.",
	],
	ai4: [
		"The second thing is setting up MCP servers. For those who aren't familiar, MCP is a protocol that lets you add extra data a neural network can use. Here's the list of MCP servers I connect.",
		"Второе - это нужно настроить MCP-сервера. Для тех кто не в курсе, MCP это протокол по которому в нейросети можно добавлять дополнительные данные, которыми она может пользоваться. Вот список MCP‑серверов, которые подключаю.",
	],
	ai5: [
		"From time to time I run models locally through <a href=\"https://lmstudio.ai\">LM Studio</a> and <a href=\"https://ollama.com\">Ollama</a>. Oddly enough, local models give almost the same results as cloud ones. Maybe someday I'll switch to a local model entirely.",
		"Время от времени запускаю модели локально через <a href=\"https://lmstudio.ai\">LM Studio</a> и <a href=\"https://ollama.com\">Ollama</a>. Как ни странно локальные модели показывают почти такие же результаты, как и облачные. Возможно когда-нибудь полностью перейду на локальную модель.",
	],
	tFiles: ["File manager", "Файловый менеджер"],
	files1: [
		"There shouldn't be a need for a file manager at all: this functionality should be supported natively by the OS, without installing third-party apps. But we have what we have.",
		"Вообще не должно быть такого, что бы требовался файловый менеджер, этот функционал должен нативно поддерживаться операционной системой, без необходимости ставить сторонние приложения. Но имеет то, что имеем.",
	],
	files2: [
		"<a href=\"https://yazi-rs.github.io\">Yazi</a> (42k stars on <a href=\"https://github.com/sxyazi/yazi\">Github</a>). Its main feature is that it works in the terminal and is controlled like Vim. It would be ideal if it were dual-pane, so it's out right away.",
		"<a href=\"https://yazi-rs.github.io\">Yazi</a> (42k звезд на <a href=\"https://github.com/sxyazi/yazi\">Github</a>). Самая главная фишка в том, что работает в терминале и управляется как Vim. Он бы был идеальным если бы он был двухпанельным, поэтому отпадает сразу.",
	],
	files3: [
		"<a href=\"https://www.farmanager.com\">Far Manager</a> - an old dual-pane file manager. In features and interface it clearly loses to <a href=\"https://www.ghisler.com\">Total Commander</a>.",
		"<a href=\"https://www.farmanager.com\">Far Manager</a> - Старый двухпанельный файловый менеджер. По функционалу и интерфейсу явно проигрывает <a href=\"https://www.ghisler.com\">Total Commander</a>.",
	],
	files4: [
		"<a href=\"https://files.community\">Files</a> - a decent design, but too casual, and it also loses to <a href=\"https://www.ghisler.com\">Total Commander</a> on features.",
		"<a href=\"https://files.community\">Files</a> - Неплохой дизайн, но слишком казуальный и по функционалу так же проигрывает <a href=\"https://www.ghisler.com\">Total Commander</a>.",
	],
	files5a: [
		"<a href=\"https://www.ghisler.com\">Total Commander</a> - the interface isn't the best, but it's dual-pane, functional, and lets you configure hotkeys flexibly. I turned on dark theme in <a href=\"https://www.ghisler.com\">Total Commander</a>, removed extra UI, and set the <a href=\"https://sourcefoundry.org/hack/\">Hack</a> font. The hotkeys are tuned to my keyboard and mirror those in <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a>. Here's how the ",
		"<a href=\"https://www.ghisler.com\">Total Commander</a> - интерфейс не самый лучший, но он двух-панельный, функциональный и позволяет гибко настраивать горячие клавиши. В <a href=\"https://www.ghisler.com\">Total Commander</a> включил темную тему, убрал лишний UI, поставил шрифт <a href=\"https://sourcefoundry.org/hack/\">Hack</a>. Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <a href=\"https://www.jetbrains.com/webstorm/\">WebStorm</a>. Вот как выглядит ",
	],
	filesLinkLook: ["look", "внешний вид"],
	files5b: [" and here's my ", " и вот мой "],
	filesLinkConfig: ["config", "конфиг"],
	files5c: [".", "."],
	tTerminal: ["Terminal", "Терминал"],
	term1: [
		"Options: the standard Windows one, <a href=\"https://www.warp.dev\">Warp</a>, <a href=\"https://wezfurlong.org/wezterm/\">WezTerm</a>, <a href=\"https://sw.kovidgoyal.net/kitty/\">kitty</a>.",
		"Варианты: стандартный виндовый, <a href=\"https://www.warp.dev\">Warp</a>, <a href=\"https://wezfurlong.org/wezterm/\">WezTerm</a>, <a href=\"https://sw.kovidgoyal.net/kitty/\">kitty</a>.",
	],
	term2a: [
		"Roughly 80% of the interaction comes down to two actions:",
		"По большому счету 80% взаимодействия - два действия:",
	],
	termLi1: ["Searching history", "Поиск по истории"],
	termLi2: ["Copying output", "Копирование вывода"],
	term2b: [
		"Both are much more convenient in <a href=\"https://www.warp.dev\">Warp</a>. Compare the typical output in a regular terminal with the output in <a href=\"https://www.warp.dev\">Warp</a>.",
		"Оба в <a href=\"https://www.warp.dev\">Warp</a> заметно удобнее. Сравните типичный вывод в обычном терминале и в <a href=\"https://www.warp.dev\">Warp</a>.",
	],
	term3: [
		"On top of that, why on earth did they add AI to it (they're shoving it in everywhere now) and a project tree? It would be better to strip all that out and make <a href=\"https://www.warp.dev\">Warp</a> more minimal. I'm a minimalism fan, but functionality still matters more.",
		"При этом на кой черт в него запилили ИИ (сейчас его пилят куда ни попадя) и дерево проектов. Убрать бы весь этот функционал и сделать <a href=\"https://www.warp.dev\">Warp</a> минималистичнее - было бы лучше. Я фанат минимализма, но функциональность все же важнее.",
	],
	tMail: ["Mail", "Почта"],
	mail1: [
		"For me the most important thing in a mail client is tabs. Everyone can read emails. I want the tabs inside the app, not spread across several browser tabs. That's why I looked at <a href=\"https://www.thunderbird.net\">Thunderbird</a>.",
		"Для меня самое важное в почтовом клиенте - вкладки. Письма читать умеют все. Хочу, чтобы вкладки были внутри приложения, а не через несколько вкладок браузера. Поэтому смотрел на <a href=\"https://www.thunderbird.net\">Thunderbird</a>.",
	],
	mail2: [
		"A public domain looks unprofessional, so I need a server with custom domains. I chose <a href=\"https://purelymail.com\">PurelyMail</a> - the cheapest mail server ($10 a year).",
		"Публичный домен как‑то несолидно, нужен сервер с кастомными доменами. Выбор пал на <a href=\"https://purelymail.com\">PurelyMail</a> - самый дешевый почтовый сервер (10$ в год).",
	],
	mail3: [
		"From a mail server I only need one thing: to receive a letter and forward it to me.",
		"От почтового сервера нужно только одно: получить письмо и перенаправить его мне.",
	],
	mail4: [
		"On top of that, all my phone SMS and push notifications come through email.",
		"При этом все телефонные SMS и пуш‑уведомления у меня идут через почту.",
	],
	tPass: ["Password manager", "Менеджер паролей"],
	pass1: [
		"Authentication is again the kind of functionality that should be in the core of the OS. For historical reasons it isn't, and now you can sign in with email, <a href=\"https://accounts.google.com\">Google</a>, or a password manager. You need to pick one sign-in method and use only that from then on.",
		"Аутентификация - снова тот функционал, который должен быть в ядре ОС. По историческим причинам этого нет, и сейчас можно войти через email, <a href=\"https://accounts.google.com\">Google</a> или менеджер паролей. Нужно определиться с одним способом входа и дальше использовать только его.",
	],
	pass2: [
		"<a href=\"https://1password.com\">1Password</a> - a hundred percent favorite. It can store two-factor authentication codes (which <a href=\"https://accounts.google.com\">Google</a> can't do).",
		"<a href=\"https://1password.com\">1Password</a> - стопроцентный фаворит. Можно хранить коды двухфакторной аутентификации (чего нет в <a href=\"https://accounts.google.com\">Google</a>).",
	],
	tShots: ["Screenshots", "Скриншоты"],
	shots1: [
		"The unconditional leader is <a href=\"https://getsharex.com\">ShareX</a> (39k stars on <a href=\"https://github.com/ShareX/ShareX\">Github</a>). It does more than screenshots: it also has many other tools I use, like the color picker, a ruler, and screen recording.",
		"Безоговорочный лидер - <a href=\"https://getsharex.com\">ShareX</a> (39k звезд на <a href=\"https://github.com/ShareX/ShareX\">Github</a>). Он может делать не только для скриншоты, он так же содержит и много других инструментов, которые я использую :пипетку, линейка, для записи видео.",
	],
	shots2a: [
		"<b>Utilities.</b> Global function keys are assigned to standard tools.",
		"<b>Утилиты.</b> Глобальные функциональные клавиши назначены на стандартные инструменты.",
	],
	shotsLi1: ["<term>F9</term> - take a screenshot.", "<term>F9</term> - сделать скриншот."],
	shotsLi2: [
		"<term>F10</term> - recognize text (useful for sending it to a neural network, since regular images eat a lot of tokens).",
		"<term>F10</term> - распознать текст (полезно что бы отправить его нейросети, обычные картинки жрут очень много токенов).",
	],
	shotsLi3: ["<term>F11</term> - record a GIF.", "<term>F11</term> - записать гифку."],
	shotsLi4: ["<term>F12</term> - launch the color picker.", "<term>F12</term> - запустить пипетка."],
	shotsLi5: ["<term>Print Screen</term> - screen ruler.", "<term>Print Screen</term> - экранная линейка."],
	shotsLi6: [
		"<term>Scroll Lock</term> - scrolling screenshot.",
		"<term>Scroll Lock</term> - скриншот со скроллом.",
	],
	shotsLi7: [
		"<term>Pause Break</term> - view file metadata.",
		"<term>Pause Break</term> - просмотреть мета-данные о файле.",
	],
	sepConclusion: ["Conclusion", "Заключение"],
	tApps: ["Other apps", "Остальные приложения"],
	appsHwTitle: ["Hardware:", "Железо:"],
	appsHw1: [
		"<a href=\"https://www.cpuid.com/softwares/cpu-z.html\">CPU-Z</a> - simple, and therefore the best utility for viewing hardware specs",
		"<a href=\"https://www.cpuid.com/softwares/cpu-z.html\">CPU-Z</a> - простая и поэтому лучшая утилита для просмотра характеристик железа",
	],
	appsHw2: [
		"<a href=\"https://www.hwinfo.com\">HWiNFO</a> - when you need not \"what hardware\" but temperatures, power limits and what exactly is throttling.",
		"<a href=\"https://www.hwinfo.com\">HWiNFO</a> - когда нужно не \"какое железо\", а температуры, лимиты питания и что именно троттлит.",
	],
	appsHw3: [
		"<a href=\"https://www.speedtest.net\">Ookla</a> - internet speed test",
		"<a href=\"https://www.speedtest.net\">Ookla</a> - замер скорости интернета",
	],
	appsHw4: [
		"<a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">MSEdgeRedirect</a> (6k stars on <a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">Github</a>) - makes <a href=\"https://www.microsoft.com/windows\">Windows</a> open <a href=\"https://www.google.com/chrome/\">Chrome</a> instead of <a href=\"https://www.microsoft.com/edge\">Edge</a>",
		"<a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">MSEdgeRedirect</a> (6k звезд на <a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">Github</a>) - чтобы <a href=\"https://www.microsoft.com/windows\">Windows</a> открывала <a href=\"https://www.google.com/chrome/\">Chrome</a> вместо <a href=\"https://www.microsoft.com/edge\">Edge</a>",
	],
	appsHw5: [
		"<a href=\"TODO\">GeekBench</a> - CPU and GPU speed test. I like its interface more than <a href=\"TODO\">Performance Test</a> and <a href=\"TODO\">Cinebench</a>.",
		"<a href=\"TODO\">GeekBench</a> - замер скорости CPU, GPU. По интерфейсу мне нравится больше чем <a href=\"TODO\">Performance Test</a> и <a href=\"TODO\">Cinebench</a>.",
	],
	appsMoneyTitle: ["Money", "Деньги"],
	appsMoney1: [
		"<a href=\"https://alfabank.ru\">alfabank.ru</a> - also a large bank, and it's unlikely anything happens to it, but who knows.",
		"<a href=\"https://alfabank.ru\">alfabank.ru</a> - так же крупный банк и маловероятно что с ним что-то случится, но кто знает.",
	],
	appsMoney2: [
		"<a href=\"https://www.sberbank.ru\">sberbank.ru</a> - I use Sber, the largest bank; given the current economic situation, who knows what will happen to the others. People also said Lehman Brothers was unsinkable, and the situation in Russia is harder now than the US was in 2008.",
		"<a href=\"https://www.sberbank.ru\">sberbank.ru</a> - пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.",
	],
	appsMoney3: [
		"<a href=\"https://www.tradingview.com\">TradingView</a> - stock monitoring.",
		"<a href=\"https://www.tradingview.com\">TradingView</a> - мониторинг акций.",
	],
	appsShopsTitle: ["Shops", "Магазины"],
	appsShops1: [
		"<a href=\"https://aliexpress.com\">aliexpress.com</a> - a terrible interface and slow delivery, but you can buy anything there, often cheaper than on other marketplaces.",
		"<a href=\"https://aliexpress.com\">aliexpress.com</a> - совершенно ужасный интерфейс, долгая доставка, но там можно купить все и дешевле чем на других маркетплейсах.",
	],
	appsShops2: [
		"<a href=\"https://wildberries.ru\">wildberries.ru</a> - when I need to buy something and don't want to wait for delivery from China.",
		"<a href=\"https://wildberries.ru\">wildberries.ru</a> - если нужно что-то купить и не хочется ждать доставку с китая.",
	],
	appsShops3: [
		"<a href=\"https://ozon.ru\">ozon.ru</a> - grocery delivery.",
		"<a href=\"https://ozon.ru\">ozon.ru</a> - доставка продуктов.",
	],
	appsShops4: [
		"<a href=\"https://ebay.com\">ebay.com</a> - when I need to buy something secondhand in Russia.",
		"<a href=\"https://ebay.com\">ebay.com</a>  - если нужно купить что‑то с рук в РФ.",
	],
	appsShops5: [
		"<a href=\"https://avito.com\">avito.com</a> - when I need to buy something secondhand outside Russia. There are no real alternatives.",
		"<a href=\"https://avito.com\">avito.com</a>  - если нужно купить что‑то с рук за пределами РФ. Альтернатив по большому счету нет.",
	],
	appsShops6: [
		"<a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">ek.ua</a> - the best website for choosing hardware, much better than <a href=\"TODO\">dns-shop.ru</a> / <a href=\"pcpartpicker.com\">pcpartpicker.com</a> / <a href=\"newegg.com\">newegg.com</a>.",
		"<a href=\"https://github.com/rcmaehl/MSEdgeRedirect\">ek.ua</a> - лучший вебсайт по выбору железу, намного лучше <a href=\"TODO\">dns-shop.ru</a> / <a href=\"pcpartpicker.com\">pcpartpicker.com</a> / <a href=\"newegg.com\">newegg.com</a>.",
	],
	appsComp1: [
		"Compilers and runtimes - I install everything, in case it comes in handy.",
		"Компиляторы и рантаймы - ставлю все, авось пригодится.",
	],
	appsComp2: [
		"<a href=\"https://github.com/PowerShell/PowerShell\">PowerShell 7</a> (55k stars on <a href=\"https://github.com/PowerShell/PowerShell\">Github</a>) - the latest version (the old one is installed by default)",
		"<a href=\"https://github.com/PowerShell/PowerShell\">PowerShell 7</a> (55k звезд на <a href=\"https://github.com/PowerShell/PowerShell\">Github</a>) - последняя версия (по умолчанию ставится старая)",
	],
	appsComp3: [
		"<a href=\"https://nodejs.org\">Node</a> - far from the best language, but its main advantage is that it lets you write the <term>Frontend</term> and the <term>Backend</term> in the same language.",
		"<a href=\"https://nodejs.org\">Node</a> - далеко не самый лучший язык, но его главное преимущество в том, что позволяет писать <term>Frontend</term> и <term>Backend</term> на одном и том же языке.",
	],
	appsComp4: [
		"<a href=\"https://deno.com\">Deno</a> - a more advanced fork of <a href=\"https://nodejs.org\">Node</a>.",
		"<a href=\"https://deno.com\">Deno</a> - более продвинутый форк <a href=\"https://nodejs.org\">Node</a>.",
	],
	appsComp5: [
		"<a href=\"https://www.rust-lang.org\">Rust</a> - in my opinion the best programming language at the moment.",
		"<a href=\"https://www.rust-lang.org\">Rust</a> - лучший язык программирования на текущий момент по моему мнению.",
	],
	appsComp6: [
		"<a href=\"https://go.dev\">Go</a> - its simplicity makes it the best fit for vibe coding.",
		"<a href=\"https://go.dev\">Go</a> - из-за своей простоты лучше всего подходит для вайбкодинга.",
	],
	appsComp7: [
		"<a href=\"https://www.python.org\">Python</a> - I don't use it often, but some tools require it.",
		"<a href=\"https://www.python.org\">Python</a> - не особо часто использую, но требуется для некоторых инструментов.",
	],
	appsComp8: [
		"<a href=\"https://www.whatsmydns.net/\">whatsmydns.net</a> - checking how DNS behaves.",
		"<a href=\"https://www.whatsmydns.net/\">whatsmydns.net</a> - проверить как ведут себя днс.",
	],
	appsMsgTitle: ["Messengers", "Мессенджеры"],
	appsMsg1: [
		"<a href=\"https://telegram.org\">Telegram</a> - my main messenger.",
		"<a href=\"https://telegram.org\">Telegram</a> - основной мессенджер.",
	],
	appsMsg2: [
		"<a href=\"https://whatsapp.com\">WhatsApp</a> - for talking to relatives.",
		"<a href=\"https://whatsapp.com\">WhatsApp</a> - для общения с родственниками.",
	],
	appsMsg3: [
		"<a href=\"https://discord.com\">Discord</a> - gaming messenger.",
		"<a href=\"https://discord.com\">Discord</a> - игровой мессенджер.",
	],
	appsMsg4: [
		"<a href=\"https://slack.com\">Slack</a> - work messenger.",
		"<a href=\"https://slack.com\">Slack</a> - рабочий мессенджер.",
	],
	appsMsg5: [
		"<a href=\"https://zoom.us\">Zoom</a> - video calls.",
		"<a href=\"https://zoom.us\">Zoom</a> - видеосвязь.",
	],
	appsFunTitle: ["Entertainment:", "Развлечения:"],
	appsFun1: [
		"<a href=\"https://youtube.com\">YouTube</a> - my main entertainment app.",
		"<a href=\"https://youtube.com\">YouTube</a> - основное развлекательное приложение.",
	],
	appsFun2: [
		"<a href=\"https://reddit.com\">Reddit</a> - the most popular forum in the world.",
		"<a href=\"https://reddit.com\">Reddit</a> - самый популярных форум в мире.",
	],
	appsFun3: [
		"<a href=\"https://x.com\">Twitter</a> - the main social network for reading world news (you just have to follow the right people).",
		"<a href=\"https://x.com\">Twitter</a> - основная соц сеть для чтение мировых новостей (нужно только подписаться на правильных людей).",
	],
	appsFun4: [
		"<a href=\"https://threads.net\">Threads</a> - in my view, better than <a href=\"https://x.com\">Twitter</a> in interface, but unfortunately it came out much later and is less popular.",
		"<a href=\"https://threads.net\">Threads</a> - на мой взгляд круче чем <a href=\"https://x.com\">Twitter</a> по интерфейсу, но к сожалению появился намного позже и поэтому менее популярен.",
	],
	appsFun5: [
		"<a href=\"https://bash.im\">Bash</a> - the good old quote collection.",
		"<a href=\"https://bash.im\">Bash</a> - старый добрый цитатник.",
	],
	appsFun6: [
		"<a href=\"https://habr.com\">Habr</a> - tech articles; I check it once a week and read the best of the week.",
		"<a href=\"https://habr.com\">Habr</a> - техностатьи, раз в неделю захожу и читаю лучшее за неделю.",
	],
	appsForumTitle: [
		"Forums: they've basically been replaced by neural networks now. I check them about once a month and skim the top most popular questions.",
		"Форумы: по сути их сейчас заменили нейросети. Захожу раз месяц и просматриваю топ самых популярных вопросов.",
	],
	appsForum1: [
		"<a href=\"https://stackoverflow.com\">stackoverflow.com</a> - programming questions.",
		"<a href=\"https://stackoverflow.com\">stackoverflow.com</a> - вопросы по программированию.",
	],
	appsForum2: [
		"<a href=\"https://superuser.com\">superuser.com</a> - questions from advanced users.",
		"<a href=\"https://superuser.com\">superuser.com</a> - вопросы продвинутых пользователей.",
	],
	appsForum3: [
		"<a href=\"https://serverfault.com\">serverfault.com</a> - system administration questions.",
		"<a href=\"https://serverfault.com\">serverfault.com</a> - вопросы по администрированию.",
	],
	appsForum4: [
		"<a href=\"https://security.stackexchange.com\">security.stackexchange.com</a> - security questions.",
		"<a href=\"https://security.stackexchange.com\">security.stackexchange.com</a> - вопросы по безопасности.",
	],
	appsForum5: [
		"<a href=\"https://math.stackexchange.com\">math.stackexchange.com</a> - math questions.",
		"<a href=\"https://math.stackexchange.com\">math.stackexchange.com</a> - вопросы по математике.",
	],
	appsDevTitle: ["Programming tools", "Инструменты для программирования"],
	appsDev1: [
		"<a href=\"https://git-scm.com\">Git</a> - I like it better, but git is the de facto standard. I sign my commits, and the config with aliases lives next to the rest of the setup.",
		"<a href=\"https://git-scm.com\">Git</a> - как по мне лучше, но гит это стандарт де-факто. Коммиты подписываю, конфиг с алиасами лежит рядом с остальным сетапом.",
	],
	appsDev2: [
		"<a href=\"https://github.com/jj-vcs/jj\">Jujutsu</a> - a more modern alternative to git.",
		"<a href=\"https://github.com/jj-vcs/jj\">Jujutsu</a> - более современный аналог гита.",
	],
	appsDev3: [
		"<a href=\"https://github.com\">GitHub</a> - I use it to keep an eye on the latest and freshest tools.",
		"<a href=\"https://github.com\">GitHub</a> - использую что бы мониторить самые последние и свежие инструменты.",
	],
	appsDev4: [
		"<a href=\"https://learn.microsoft.com/sysinternals/downloads/process-explorer\">Process Explorer</a> - a task manager for people who need to see handles and DLLs, not just CPU percentage.",
		"<a href=\"https://learn.microsoft.com/sysinternals/downloads/process-explorer\">Process Explorer</a> - диспетчер задач для людей, которым нужно увидеть хендлы и DLL, а не просто процент CPU.",
	],
	appsDev5: [
		"<a href=\"https://www.virtualbox.org\">VirtualBox</a> - mostly I use it to run software I don't trust.",
		"<a href=\"https://www.virtualbox.org\">VirtualBox</a> - в основном использую что бы запускать софт которому не доверяю.",
	],
	appsDev6: [
		"<a href=\"https://www.cloudflare.com\">Cloudflare</a> - DNS hosting, anti-DDoS and public cache.",
		"<a href=\"https://www.cloudflare.com\">Cloudflare</a> - DNS-хостинг, анти-DDoS и публичный кэш.",
	],
	appsDev7: [
		"<a href=\"https://github.com/FiloSottile/mkcert\">mkcert</a> (59k stars on <a href=\"https://github.com/FiloSottile/mkcert\">Github</a>) - a utility for managing certificates.",
		"<a href=\"https://github.com/FiloSottile/mkcert\">mkcert</a> (59k звезд на <a href=\"https://github.com/FiloSottile/mkcert\">Github</a>) - утилита для управления сертификатами.",
	],
	appsDev8: [
		"<a href=\"https://caddyserver.com\">Caddy</a> - a more modern alternative to <a href=\"https://nginx.org\">nginx</a>.",
		"<a href=\"https://caddyserver.com\">Caddy</a> - более современный аналог <a href=\"https://nginx.org\">nginx</a>.",
	],
	appsDev9: [
		"<a href=\"https://www.postgresql.org\">PostgreSQL</a> - a top SQL database.",
		"<a href=\"https://www.postgresql.org\">PostgreSQL</a> - топовая SQL-БД.",
	],
	appsDev10: [
		"<a href=\"https://www.mongodb.com\">MongoDB</a> - a top NoSQL database.",
		"<a href=\"https://www.mongodb.com\">MongoDB</a> - топовая NoSQL-БД.",
	],
	appsDev11: [
		"<a href=\"https://www.wireshark.org\">Wireshark</a> - network packet monitoring; rarely needed, but let it be.",
		"<a href=\"https://www.wireshark.org\">Wireshark</a> - мониторинг сетевых пакетов, редко требуется, но пусть будет.",
	],
	appsFontTitle: [
		"On the web fonts download automatically, but some desktop apps need them installed explicitly.",
		"В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.",
	],
	appsFont1: [
		"<a href=\"https://sourcefoundry.org/hack/\">Hack</a> - the best programming font (terminal and editor).",
		"<a href=\"https://sourcefoundry.org/hack/\">Hack</a> - лучший шрифт для программирования (терминал и редактор).",
	],
	appsFont2: [
		"<a href=\"https://fonts.google.com/specimen/Montserrat\">Montserrat</a> - the most neutral font.",
		"<a href=\"https://fonts.google.com/specimen/Montserrat\">Montserrat</a> - самый нейтральный шрифт.",
	],
	appsFont3: [
		"<a href=\"https://fonts.google.com/specimen/Play\">Play</a> - beautiful digits.",
		"<a href=\"https://fonts.google.com/specimen/Play\">Play</a> - красивые цифры.",
	],
	appsFont4: [
		"<a href=\"https://www.nerdfonts.com\">Nerd Fonts</a> - icons for the terminal.",
		"<a href=\"https://www.nerdfonts.com\">Nerd Fonts</a> - иконки для терминала.",
	],
	appsMiscTitle: ["Miscellaneous", "Остальное"],
	appsMisc1: [
		"<a href=\"https://www.microsoft.com/software-download/windows11\">MediaCreationTool</a> - creating bootable USB drives.",
		"<a href=\"https://www.microsoft.com/software-download/windows11\">MediaCreationTool</a> - создание установочных флешек.",
	],
	appsMisc2: [
		"<a href=\"https://www.voidtools.com\">Everything</a> - a local file search tool.",
		"<a href=\"https://www.voidtools.com\">Everything</a> - локальный поисковик файлов.",
	],
	appsMisc3: [
		"<a href=\"https://veracrypt.fr\">VeraCrypt</a> - the best solution for full-disk encryption.",
		"<a href=\"https://veracrypt.fr\">VeraCrypt</a> - лучшее решение для шифрования диска.",
	],
	appsMisc4: [
		"<a href=\"https://www.qbittorrent.org\">qBittorrent</a> - torrents.",
		"<a href=\"https://www.qbittorrent.org\">qBittorrent</a> - торренты.",
	],
	appsMisc5: [
		"<a href=\"https://2gis.ru\">2GIS</a> - a business directory and maps. I don't use <a href=\"TODO\">Yandex Maps</a> because there's too much advertising.",
		"<a href=\"https://2gis.ru\">2GIS</a> - справочник организаций и карты. <a href=\"TODO\">Яндекс картами</a> не пользуюсь потому что там много рекламы.",
	],
	appsMisc6: [
		"<a href=\"https://www.gosuslugi.ru\">gosuslugi.ru</a> - an app from a hyped startup.",
		"<a href=\"https://www.gosuslugi.ru\">gosuslugi.ru</a> - приложение от хайпового стартапа.",
	],
	appsMisc7: [
		"<a href=\"https://www.videolan.org\">VLC</a> - an old but the best video player.",
		"<a href=\"https://www.videolan.org\">VLC</a> - старый, но лучший видеоплеер.",
	],
	appsMisc8: [
		"<a href=\"https://github.com/microsoft/PowerToys\">PowerToys</a> (138k stars on <a href=\"https://github.com/microsoft/PowerToys\">Github</a>) - despite its popularity, the only features I use are always-on-top windows and finding the processes that hold a file.",
		"<a href=\"https://github.com/microsoft/PowerToys\">PowerToys</a> (138k звезд на <a href=\"https://github.com/microsoft/PowerToys\">Github</a>) - несмотря на популярность инструмент единственные функции, которые я в нем использую - это поверх всех окон и поиск процессов, которые держат файл.",
	],
	tNotIncl: ["Not included here", "Что сюда не попало"],
	nin1: [
		"Popular tools that I found no practical use for. Maybe they'll be useful to someone.",
		"Популярные инструменты, которым я не нашел практического применения. Возможно, кому‑то они будут полезны.",
	],
	nin2: [
		"<a href=\"https://github.com/ArcadeRenegade/SidebarDiagnostics\">SideBar</a> (3k stars on <a href=\"https://github.com/ArcadeRenegade/SidebarDiagnostics\">Github</a>) - doubtful necessity: it shows hardware load, but that's rarely needed.",
		"<a href=\"https://github.com/ArcadeRenegade/SidebarDiagnostics\">SideBar</a> (3k звезд на <a href=\"https://github.com/ArcadeRenegade/SidebarDiagnostics\">Github</a>) - сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.",
	],
	nin3: [
		"<a href=\"https://github.com/tw93/Pake\">Pake</a> (61k stars on <a href=\"https://github.com/tw93/Pake\">Github</a>) - builds binaries from websites; not clear why, when you can just create a shortcut.",
		"<a href=\"https://github.com/tw93/Pake\">Pake</a> (61k звезд на <a href=\"https://github.com/tw93/Pake\">Github</a>) - позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.",
	],
	nin4: [
		"A local file search tool that completely replaced the search in <a href=\"TODO\">TotalCommander</a>.",
		"Локальный поисковик файлов, полностью заменил поиск в <a href=\"TODO\">TotalCommander</a>.",
	],
	nin5: [
		"<a href=\"TODO\">Rufus</a> - an advanced tool for creating bootable USB drives. All of its features are rarely needed; MediaCreationTool covers all my needs.",
		"<a href=\"TODO\">Rufus</a> - продвинутый инструмент для создания загрузочных флешек. Весь тот функционал, который там есть не особо требуется, по большому MediaCreationTool адресует все мои потребности.",
	],
	tConclusion: ["Conclusion", "Заключение"],
	concl1: [
		"Many people focus on the CPU and graphics card, but you can easily save money there. Honestly, a CPU upgrade doesn't come close to giving as much comfort as the desk, chair, mouse or glasses, not to mention the monitors.",
		"Многие концентрируются на процессоре и видеокарте, но на них легко сэкономить. Честно говоря, обновление процессора даже близко не дает столько же удобства, сколько стол, стул, мышка или очки - не говоря уже о мониторах.",
	],
	concl2: [
		"Don't be angry if I picked a technology you don't like: that's my taste, and I don't impose it on anyone. And if I unfairly trashed a technology you're fond of, I'm open to being convinced otherwise.",
		"Не злитесь, если я выбрал не ту технологию, которая нравится вам: это мой вкус, я его никому не навязываю. Более того, если где‑то несправедливо засрал технологию, которая вам близка - открыт к переубеждению.",
	],
});

// chrome://settings/content/federatedIdentityApi
