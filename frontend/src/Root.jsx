import { useEffect, useMemo, useRef, useState } from "react";

export default function () {
	const m = translate(lexems());
	const viewportRef = useRef(null);
	const wrapperRef = useRef(null);
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
			viewport
				.querySelectorAll("section")
				.forEach((s) => s.classList.add("visible"));
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

		viewport.querySelectorAll("section").forEach((section) => {
			if (!section.classList.contains("visible")) {
				observer.observe(section);
			}
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	let styles = {};
	let fonts = {};
	let layout = {};
	let height = window.innerHeight;

	styles.grid = {};

	layout.width = window.innerWidth > 1024 ? 1024 : window.innerWidth - 40;
	layout.height = window.innerHeight;
	layout.left = window.innerWidth / 2 - layout.width / 2;
	layout.right = layout.left + layout.width;

	let desktop = layout.width >= 1024;
	let mobile = !desktop;

	if (desktop) fonts = { text: 17, secondary: 15, header: 22 };
	if (mobile) fonts = { text: 15, secondary: 15, header: 18 };

	styles.root = {
		position: "relative",
		height: "100%",
		color: colors.text.medium,
		background: `radial-gradient(circle 2000px, hsla(210 100% 50% / 6%) 0%, rgba(0, 0, 0, 1) 100%)`,
		fontSize: desktop ? "18px" : "16px",
	};

	styles.heading = {
		position: "relative",
		height: desktop ? 60 : 50,
		fontWeight: 500,
		color: "white",
		display: "flex",
		justifyContent: "center",
		borderBottom: `1px solid ${colors.border.medium}`,
	};

	styles.heading.content = {
		left: layout.left,
		width: layout.width,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 10,
		paddingRight: 10,
	};

	styles.content = {
		position: "relative",
		left: layout.left,
		width: layout.width,
		paddingBottom: 100,
	};

	styles.topper = {
		height: 60,
		fontSize: fonts.header,
		color: colors.text.strong,
		fontWeight: 500,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderBottom: `1px solid ${colors.border.weak}`,
	};

	styles.section = {
		borderTop: `1px solid ${colors.border.strong}`,
		borderRight: `1px solid ${colors.border.strong}`,
		borderBottom: `1px solid ${colors.border.strong}`,
		borderLeft: `1px solid ${colors.border.strong}`,
		borderRadius: 10,
		marginTop: desktop ? 40 : 20,
		marginBottom: desktop ? 40 : 20,
		lineHeight: "21px",
		background: colors.section,
	};

  styles.section.content = {
    padding: desktop ? 20 : 10
  };

	styles.viewport = {
		overflow: "auto",
		height: height - styles.heading.height,
		width: window.width,
		position: "relative",
	};

	styles.grid.left = {
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		width: layout.left,
		pointerEvents: "none",
		overflow: "hidden",
		WebkitMaskImage:
			"linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		maskImage: "linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
		backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
	};

	styles.grid.right = {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		width: layout.left,
		pointerEvents: "none",
		overflow: "hidden",
		WebkitMaskImage:
			"linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		maskImage: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
		backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
	};

	styles.electrons = {};

	styles.electrons.container = {
		position: "absolute",
		inset: 0,
		overflow: "hidden",
		pointerEvents: "none",
	};

	styles.electrons.base = {
		position: "absolute",
		opacity: 0,
		borderRadius: 1,
		willChange: "transform, opacity",
		animationTimingFunction: "linear",
		animationIterationCount: "infinite",
	};

	styles.electrons.vertical = {
		width: 2,
		height: 12,
		marginLeft: -1,
		background:
			"linear-gradient(to bottom, transparent, hsl(210 100% 72% / 0.55) 45%, hsl(210 100% 72% / 0.55) 55%, transparent)",
		boxShadow: "0 0 10px hsl(210 100% 55% / 0.22)",
		animationName: "electron-v",
	};

	styles.electrons.horizontal = {
		width: 12,
		height: 2,
		marginTop: -1,
		background: 'linear-gradient(to right, transparent, hsl(210 100% 72% / 0.45) 45%, hsl(210 100% 72% / 0.45) 55%, transparent)',
		boxShadow: "0 0 10px hsl(210 100% 55% / 0.18)",
		animationName: "electron-h",
	};

	styles.electrons.horizontalReverse = {
		animationName: "electron-h-reverse",
	};

	styles.wrapper = {
		position: "relative",
		minHeight: "100%",
		paddingTop: desktop ? 40 : 20,
	};

  styles.clickable = {
    display: 'inline',
    borderBottom: `1px dotted ${colors.text.weak}`,
    position: 'relative',
    textDecoration: 'none',
    paddingBottom: 1
  };

	let grid_height = contentHeight || height - styles.heading.height;

  let content = {padding: desktop ? 20 : 10 };

  return (
		<root style={styles.root}>
			<border-top
				style={{
					position: "absolute",
					top: desktop ? 59 : 49,
					width: window.width,
					height: 1,
					background: colors.border.medium,
				}}
			/>

			<heading style={styles.heading}>
				<content style={styles.heading.content}>
					<name style={{ fontSize: fonts.header }}>Egor Koshelko</name>
				</content>
			</heading>

			<viewport ref={viewportRef} style={styles.viewport}>
				<wrapper ref={wrapperRef} style={styles.wrapper}>
					{desktop ? (
						<grid-left style={styles.grid.left}>
							<GridElectrons
								styles={styles.electrons}
								width={layout.left}
								height={grid_height}
							/>
						</grid-left>
					) : null}
					{desktop ? (
						<grid-right style={styles.grid.right}>
							<GridElectrons
								styles={styles.electrons}
								width={layout.left}
								height={grid_height}
							/>
						</grid-right>
					) : null}

					<content style={styles.content}>
						<section style={{ ...styles.section, marginTop: 0 }}>
							<topper style={styles.topper}>Введение</topper>

							<content style={styles.section.content}>
								<p>
                  В детстве я как и все играл в компьютерные игры, и за собой заметил, что мне даже больше нравилось не сам процесс игры, а настройка настраивать чем собственно играть.
								</p>

								<p>
									Так же хотелось бы что это превратилось в волну, где люди публикуют свои сетапы (а то задолбали эти новости про ИИ чесслово).
                  Что бы я смог подчерпнуть каких-либо фишек.
								</p>

                <p>
                  Этот сетап заточен именно под программирование.
                  Он скорее всего не подойдет если ваша цель это игры, видео-монтаж или дизайн.
                </p>

                <p>
                  Полностью этот сетап с нуля вряд-ли кто-то будет повторять, скорее всего каждый прочитавший заинтегрирует только определенные кусочки в него.
                </p>

								<p>
									Этот текст написан полностью человеком.
                  ИИ использовался только для обучения и проверки на ошибки.
                  Хотите что бы я отредактировал это сообщение в более дружелюбном стиле или оставить как есть?
								</p>
							</content>
						</section>

            <section style={styles.section}>
							<topper style={styles.topper}>Стол</topper>

							<content style={styles.section.content}>
								<p>
                  Самое главное - это <b>угловой</b> рабочий стол.
                  И у этого есть два главных преимущества:

                  <ul>
                    <li>
                      <b style={{marginRight: 5}}>Очень удобная позиция для логтей.</b>
                      Логти не висят вообще никогда, нужно прямо ооочень постараться что бы сесть так что бы логти висели.
                    </li>
                    <li>
                      <b style={{marginRight: 5}}>Больше пространства для 5 мониторов.</b>
                      Я считаю количество мониторов <b>самым</b> главным железом под мои задачи.
                      Не видеокарту, не процессор, не даже жесткий диск.
                    </li>
                  </ul>
								</p>

								<p>
                  Нормальных угловых столов по приемлимой цене я не нашел, поэтому купил два стола из IKEA (запрещенная в РФ органзиация) и соединил их снизу пластинами.
								</p>
                <p>
                  Снизу что бы столы были строго на одном уровне и не разъезжались я скрепил их <clickable style={styles.clickable}>пластинами</clickable>.
                </p>
                <p>
                  Самый главный недостаток в том что снизу постоянно мешает <clickable style={styles.clickable}>ножка стола</clickable>, но я к ней уже привык.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Мониторы</topper>

              <content style={styles.section.content}>
                <p>
                  Для меня важно что бы у меня было много пространства для приложений.
                  Поэтому я использую 5 мониторов, один основной (горизонтальный, 222 дюйма) и 4 дополнительных (вертикальных, 222 дюйма).
                  Сейчас найти маленькие мониторы проблематично, все гонятся за большими.
                  Но по факту даже на вертикальных мониторах ширина составляет 1368 пикселей, а это самое популярная ширина на ноутбуках.
                  Так что ширины более чем хватает для большинства приложений (игры и специфичный софт не учитываем).
                </p>

                <p>
                  Мониторы скреплены <clickable style={styles.clickable}>супер-клеем с дверными петялми</clickable>, что бы не было зазоров.
                  Все мониторы на кронштейнах.
                </p>

                <p>
                  Каждое приложение у меня закрепляется за своим собственным монитором.

                  <ul>
                    <li>Слева-слева: терминал.</li>
                    <li>Слева: браузер (для разработки) с открытым Chrome Dev Tools.</li>
                    <li>Центр: Основной монитор IDE (или любое другое временное приложение).</li>
                    <li>Справа: ИИ.</li>
                    <li>Справа-справа: все мессенджеры (почта, тг, вотсап...).</li>
                  </ul>
                </p>

                <p>
                  Больше 5 монторов это уже не практично.
                  Если их ставить по бокам, то они будут слишком далеко а ставить мониторы в два ряда это крайне плохая затея (смотреть вверх крайне не удобно физиологически).
                </p>
              </content>
            </section>

            <section onClick={() => setModal("test")} style={styles.section}>
              <topper style={styles.topper}>Клавиатура</topper>

              <content style={styles.section.content}>
                <p>
                  Клавиатура - <a>Advantage Kinesis 2</a>.
                  Именно этом модель, а не последняя, потому что функциональные клавиши нажимаются без модификатора).
                  То насколько я обожаю эту клавиатуру словами не описать, намного удобнее чем обычные клавиатуры. Логти раздвинуты и удобно нажимать горячие клавиши.
                </p>

                <p>
                  <b>Удобное расположение модификаторов.</b>
                  Большими пальцами я могу нажать 12 клавишь (по 6 на каждый большой палец).
                  И что самое важное это самые часто используемые клавиши: <code>PAGE_UP</code> <code>PAGE_DOWN</code> <code>BACKSPACE</code> <code>DELETE</code> <code>HOME</code> <code>END</code> <code>SPACE</code> <code>ENTER</code> <code>ALT</code> <code>CTRL</code> <code>ALT+SHIFT</code> <code>ALT+CTRL</code> <code>ALT+SHIFT+CTRL</code>.
                  Последние три я через AHK скрипт сделал так, что нужно нажимать только одну клавишу.
                  На обычных клавиатурах большим пальцем можно нажимать только на пробел, модификаторы нажимаются мизицем
                </p>

                <p>
                  <b>Удобное расположение стрелочек.</b>
                  Так же стрелочки нажимаются указательным и средним пальцем без переноса руки.
                  Для навигации на обычных клавиатурах нужно двигать кисть.
                </p>

                <p>
                  <b>Удобная позиция для логтей.</b>
                  Логти разведены дальше, в совокупности с угловым столом это очень удобная позиция.
                </p>

                <p>
                  <b>Vim не нужен.</b>
                  Стрелочки нажимаются без смещения, модификаторы нажимаются большим пальцем, переносить при печати кисть вообще никуда не нужно.
                </p>

                <p>
                  <b>Стоимость.</b>
                  Безусловно клавиатура стоит дорого (455), но уровню важности она у меня на втором месте после мониторов.
                  Я пользуюсь этой клавиатурой уже 10 лет, и ни разу она у меня не ломалась.
                </p>

                <p>
                  Почему-то эта клавиатура позиционируется в основном как защита от тунельного синдрома.
                  Как по мне она должна позиционироваться как клавиатура для гиков.
                </p>

                <p>
                  К этой клавиатуре необходимо привыкнуть, у меня это заняло примерно пару месяцев.
                  Первое время было очень не удобно, но оно того стоило.
                  Для игр необходимо переопределять WASD на ESDF.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Мышка</topper>

              <content style={styles.section.content}>
                <p>
                  Мышка обязательно симметричная и с хватом. Я вообще не понимаю как можно пользоваться мышкой, на которой ладонь лежит полностью.
                  В этом случае точность наведения страдает очень сильно, суть в том что можно ладонью упереться и пальцами, довести до нужно элемента, а когда вся ладонь на мышке, то доводить нужно кистью, которая намного менее точная.
                  Пробовал мышку *** с большим количеством кнопок, но к сожелению она намного менее удобна для хвата.
                  Колесико на мышке так же можно двинуть влево и право (копирование вставка). По сути я большего количества действий не придумал.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Стул</topper>

              <content style={styles.section.content}>
                <p>
                  Пробовал распиаренный <a href="google.ru">Heller Miller</a> который стоит как самолет, но у него минимальная высота 50см, а мне нужно именно 40 см.
                  При этом если убрать ножки то можно сидеть в позе наездника, что на Heller Miller очень неудобно.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Очки</topper>

              <content style={styles.section.content}>
                <p>
                  У меня со зрением все хорошо, читаю вывески на улице нормально, но в очках <b>заметно удобнее</b>.
                  Я конечно не врач, но если вы хотите прокачать свое рабочее место, то уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.
                  Я то же на зрение не жалуюсь совсем, но не смотря на это очки добавляют четкости.
                  Даже если вы думаете что у вас зрение хорошее, просто пойдите и провертесь.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Железо</topper>

              <content style={styles.section.content}>
                <p>
                  Я намеренно указываю железо в самом конце секции, потому что очень редко железо это бутылочное горлышко.
                </p>

                <p>
                  Но тем не менее железо у меня топовое.
                  Но вот честно любой из пунктов выше дает мне реального удобства выше чем топовая видеокарта или процессор.
                  Возможно если вы локально запускаете игры, локальные нейросети, или занимаетесь видо-монтажем, то для вас железо важно, но в программировании более чем достаточно брать все железо из предпоследнего поколения, этого будет более чем достаточно и даже с огромным запасом.
                </p>
              </content>
            </section>

            <separator>
              ------------------------------------------------------------------------------------------------
            </separator>

						<section style={styles.section}>
							<topper style={styles.topper}>Операционная система</topper>

							<content style={styles.section.content}>
								<p>Тут у нас на выбор есть <code>Windows</code>, <code>MacOS</code>, <code>Ubuntu</code> и <code>FreeBSD</code>.</p>

								<p>
									Вы бы могли подумать, что раз я такой техно-гик, то у меня какой-нибудь линукс, но это совершенно не так.
                  Я абсолютный фанат винды на десктопе и считаю что ни MacOS ни Ubunu даже близко не сравняться с виндой по удобству.
								</p>
								<p>
									На маке во неудобная система управления окнами, неудобные горячие клавиши.
								</p>
                <p>
									Я очень активно на винде использую AutoHotkey, его аналогов нету ни на MacOS ни на Ubuntu.
                  Одного этого для меня уже достаточно, что бы не смотреть в их сторону.
								</p>
								<p>
									FreeBSD по моему мнению намного круче линукса, но я не настолько мазохист что бы ставить его себе на десктоп.
								</p>
								<p>
									Я считаю что самое в операционной это система управлениями окнами.
                  В винде это реализоно лучше всего.
								</p>

                <p>
                  Настройка винды у меня происходит в три этапа.
                  <ul>
                    <li>
                      <clickable style={styles.clickable}>Удаление бойлерплейта</clickable>
                      {/*<ul>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Teams</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.WindowsFeedbackHub</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Copilot</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.MicrosoftEdge.Stable</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.XboxSpeechToTextOverlay</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.WebMediaExtensions</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.BingNews</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.BingSearch</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.MicrosoftSolitaireCollection</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.MicrosoftStickyNotes</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.OutlookForWindows</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.StartExperiencesApp</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Windows.Photos</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Xbox.TCUI</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.XboxGamingOverlay</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.GamingApp</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.XboxIdentityProvider</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.GetHelp</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Todos</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.PowerAutomateDesktop</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.Windows.DevHome</li>*/}
                      {/*  <li>winget uninstall -e --id MicrosoftCorporationII.MicrosoftFamily</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.YourPhone</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.ZuneMusic</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.BingWeather</li>*/}
                      {/*  <li>winget uninstall -e --id Clipchamp.Clipchamp</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.WindowsAlarms</li>*/}
                      {/*  <li>winget uninstall -e --id Microsoft.WidgetsPlatformRuntime</li>*/}
                      {/*  <li>winget uninstall -e --id MicrosoftWindows.Client.WebExperience</li>*/}
                      {/*  <li>winget uninstall -e --id MicrosoftWindows.CrossDevice</li>*/}
                      {/*</ul>*/}
                    </li>

                    <li>
                      <clickable style={styles.clickable}>Отключение компонентов</clickable>
                      {/*<ul>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName WorkFolders-Client -NoRestart': 'отключить синхронизацию файлов',</li>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName WCF-Services45 -NoRestart': 'отключить старый .NET',</li>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName WCF-TCP-PortSharing45 -NoRestart': 'отключить функционал для порт-шейринга',</li>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName MediaPlayback -NoRestart': 'отключить медиа компоненты',</li>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName WindowsMediaPlayer -NoRestart': 'отключить старый медиа-плеер',</li>*/}
                      {/*  <li>'Disable-WindowsOptionalFeature -Online -FeatureName Printing-Foundation-InternetPrinting-Client -NoRestart': 'отключить функционал удаленные принтеров'</li>*/}
                      {/*</ul>*/}
                    </li>

                    <li>
                      <clickable style={styles.clickable}>Обычные настройки</clickable>
                      {/*<ul>*/}
                      {/*  <li>powercfg /change monitor-timeout-ac 0',</li>*/}
                      {/*  <li>powercfg /change monitor-timeout-dc 0',</li>*/}
                      {/*  <li>powercfg /change standby-timeout-ac 0',</li>*/}
                      {/*  <li>powercfg /change standby-timeout-dc 0'</li>*/}
                      {/*</ul>*/}
                    </li>
                  </ul>
                </p>

                <p>
                  На винде (как собственно и на всех операционных системах) абсолютный кавардак с установкой приложений.

                  У меня алгоритм по выбору приложения следующий.
                  Все приложения я стараюсь ставить либо через winget, либо (если это часто используемое браузерное приложение) - создаю PWA (либо ярлык, если вебсайт не поддерживает PWA).
                  WindowsStore стараюсь не использовать вообще.
                  Редко используемые вебсайт открываю через браузер.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Autohotkey</topper>
							<content style={styles.section.content}>
								<p>
                  Вообще <a href="https://autohotkey.com">AutoHotkey</a> - супер клевый инструмент, для того что "пропатчить" ось.
                  Как по мне весь функционал, который выполняет AutoHotkey должен быть встроен в ось, но по какой-то причине эту работу нужно делать самому.
									Тут я перечисляю тот функционал который по факту должен быть встроен в ось, но его всякими обходными путям и хаками нужно встраивать.
								</p>

								<p>
                  <b style={{marginRight: 5}}>Модификаторы.</b>

                  Клавиши сначала клавиатурой ремаплю на F13, F14, F15.
                  И того у меня есть шесть модификаторов:
                  <code>Alt</code>
                  <code>Ctrl</code>
                  <code>Alt-Shift</code>
                  <code>Ctrl-Shift</code>
                  <code>Alt-Ctrl</code>
                  <code>Alt-Shift-Ctrl</code>.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Клавиатурные жесты.</b>
                  Сейчас если вы долго зажимаете клавишу, то печатается много букв, что совершенно бесполезно.
                  Я в скрипте сделал так, что долгое зажатие запускает определенную программу.
                  Это своего рода как дополнительный модификатор.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Язык.</b>
                  При работе с языками, мне не зашли ни Punto Switcher, ни Caramba Switcher.
                  То что я сделал - при смене фокуса язык приложения проставляется на значение по умолчанию.
                  Смена языка - по правому шифту.
                  Автоматические свитчеры языка не позволяют развить мышечную память, то есть они работают 90% случаев, но эти 10% все портят.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Колесико.</b>
                  Действия колесико влево - копирование, колесико вправо - вставка, нажатие на колисико - Enter.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Унификация.</b>
                  Бесит то что на русском и на английском спец-символы по разному печатются.
                </p>

								<p>
                  <b style={{marginRight: 5}}>Лаунчер.</b>
                  Это удобнее потому что мне не нужно помнить запущено приложение или нет, я просто выбираю то, какое приложение сфокусировать.
                </p>

								<p>
                  <b style={{marginRight: 5}}>Хаки.</b>
                  В нем нету нормального способа отредачить горячки, поэтому целая секция для этого предназначена.
								</p>

                <p>
                  <b style={{marginRight: 5}}>Утилиты.</b>
                  Как ни странно все из них из инструмента ShareX, очень клевая утилитка.

                  <ul>
                    <li>F9 - скриншот</li>
                    <li>F10 - сделать скриншот и распознать текст</li>
                    <li>F11 - заснять гифку</li>
                    <li>F12 - пипетка</li>
                    <li>Print Screen  - линейка</li>
                    <li>Scroll Look - скришот со скроллингом</li>
                    <li>Метаданные - скришот со скроллингом</li>
                  </ul>
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Браузер</topper>

              <content style={styles.section.content}>
                <p>
                  Тут был выбор между Chrome / Firefox
                  Тут я по большому счету аналогов Chrome я не вижу.
                  У Firefox - мне не нравится дизайн.
                  Opera - все те функции, которые у них есть добавлены, я ими не пользуюсь.
                  Я бы на их месте концентрировался на том что бы дать сделать удобные жесты и горячие клавиши.
                </p>

                <p>
                  По большому счету я стараюсь пользоваться только десктопными приложениями.
                </p>

                <p>
                  Список плагинов:
                  <ul>
                    <li>1Password</li>
                  </ul>
                </p>

                <p>
                  Сразу идут лесом браузеры ориентированные на приватность.
                  Чесслово мне абсолютно похуй на то что обо мне собирают телеметрию (в разумных пределах).

                  Внимание в телеметрию не входит сбор email, телефонов, паролей, это чувствительные данные.
                  А телеметрия это просто то, какими приложениями вы выпользуетесь.
                  Даже больше того, пускай собирают, благодаря этому они фиксят баги и делают продукт круче.
                </p>

                <p>Хром - для браузинга.</p>
                <p>Вот куча плагинов для работы в хроме.</p>
                <p>Хромиум - для разработки. В нем нет плагинов.</p>

                <p>
                  Мне не нравится сама концепция браузера, то что это в каком-то смысле вложенная платформа.
                  Ось это уже платформа для приложений, а браузер это вложенная платформа.
                  Ну исторически так сложилось.
                  Поэтому я из вебсайтов, которыми часто пользуюсь создаю десктопные приложения.
                  В этом случае не отображается урл бар и вкладки, и так же любой вебсайт может запускаться через селектор.
                </p>

                <p>
                  Вот список сайтов, из которых созданы десктопные приложения (некоторым из них назначены клавиатурные жесты):
                  <ul>
                    <li>ip.ru</li>
                  </ul>
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>ИИ</topper>
              <content style={styles.section.content}>
                <p>Я смотрел на то насколько близко модель реализует это демо-приложение.</p>
                <p>Лучшей опцией оказался Сlaude, так же у Claude есть особый фокус на программирование.</p>
                <p>Cursor - это надмозг, по сути он выбирает модель за тебя, мне такой подход не нравится.</p>
                <p>
                  Так же я время от времени запускаю локально модели через LM Studio и Ollama.
                  Но все же основная модель это Claude.
                </p>
                <p>
                  Вот список MCP серверов, которые я подключаю.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Файловый менеджер</topper>

              <content style={styles.section.content}>
                <p>Тут есть Far, Files, Yazi, TotalCommande.</p>

                <p>
                  Far - слишком устаревший, явно по функционалу проигрывает Total Commander.
                  Yazi - не двухпанельный, а 80% операций это скопировать файлы из одной локации в другую, мне понравилась идея что бы сделать в Vim режиме, но двухпанельность для меня важнее.
                  Files - так же далеко не такой же функциональный как TotalCommander.
                </p>

                <p>
                  Хоть TotalCommander и имеет определенные недостатки, но все равно он лучший среди конкурентов.
                </p>

                <p>
                  Кстати это идея для ребят из JetBrains - запилите файловый менеджер как IDE.
                  Рынок для этой софтины шире как по мне, потому что продукт нацелен не только на разработчиков, но и на обычных юзеров.
                  Сейчас явно в этой нише можно сделать продукт, который на голову лучше чем TotalCommander.
                </p>
              </content>
            </section>

						<section style={styles.section}>
							<topper style={styles.topper}>Менеджер паролей</topper>

							<content style={styles.section.content}>
								<p>
                  Входить везде через google.
                </p>
								<p>Тут ван пассворд вне конкуренции</p>
								<p>Можно хранить коды для двухфакторной аутентификации (чего нету в google).</p>
								<p>Можно хранить коды для двухфакторной аутентификации (чего нету в google).</p>
							</content>
						</section>

            <section style={styles.section}>
							<topper style={styles.topper}>Скриншоты</topper>

							<content style={styles.section.content}>
								<p>
                  Тут безоговорочный лидер это ShareX.
                </p>
								<p>
                  Дополнительно в ahk добавлены горячие клавиши.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Терминал</topper>

              <content style={styles.section.content}>
                <p>Либо стандартный виндовый, warp, WezTerm, kitty</p>

                <p>
                  По большому счету мое взаимодействие на 80% состоит из двух действий:

                  <ul>
                    <li>Поиск по истории</li>
                    <li>Копирование аутпута</li>
                  </ul>

                  Оба этих действия в Warp работают значительно удобнее.
                  Вот сравните как выглядит типичный аутпут в обычном терминале и в варпе.
                </p>

                <p>
                  При этом на кой-то черт в него запили ИИ (сейчас его пилят куда не поподя), дерево проектов.
                  Если бы весь этот функционал убрать, и сделать варп более минималистичным, было бы лучше.
                  Я вообще фанат минималистичность, но все же функциональность важнее.
                </p>
              </content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Локальный поисковик</topper>
              <content style={styles.section.content}>
                <p>Тут либо <a href="voidtools.com">Everything</a>, либо <a href="omnisearch.ai">Omnisearch</a></p>

                <p>
                  Omni хоть и выглядит посовременнее, обычно тот софт который появился позже тот лучше.
                  Но после ввода в поиск не работают стрелочки (стрелочки карл!) это же настолько очевидный функционал.
                  Сразу после установки удалил это гавно.
                </p>
              </content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Текстовый редактор</topper>

							<content style={styles.section.content}>
								Тут я выбирал между <a href="">Cursor</a>, <a href="">WebStorm</a>, <a href="">Zed</a> - тут явный фаворит это WebStorm.

                <p>
                  В вебшторме <b>очень</b> много того функционала которым я пользуюсь на ежедневной основе:
                  <ul>
                    <li>Очень хорошая поддержка гита</li>
                    <li>Последние открытые файлы (я даже вкладки отключил)</li>
                    <li>Локальная история</li>
                    <li>Предпросмотр файла в дереве</li>
                    <li>Скоупы (я помечаю разными цветами Frontend и Backend файлы)</li>
                    <li>Вкладки при поиске</li>
                    <li>Quicklists: LocalHistory, Git, Github</li>
                    <li>И еще  <b>очень много</b> других мелочей.</li>
                  </ul>
                </p>

                <p>
                  В cursor мне очень не нравится то, что он построен на web технологиях.
                  Я понимаю какой-то легкий вебсайт писать в браузере, но полноценную IDE писать JavaScript.
                </p>

                <p>
                  Пытался перейти на Zed, очень понравилось то, насколько мало памяти он жрет (в 20 раз меньше).
                  Но как оказалось функциональность важнее чем минималистичность, вернулся на WebStorm.
                </p>

                <p>
                  Вы будете смеяться, но вкладки я отключил.
                  Вместо вкладок я использую функционал Recent Files.
                </p>

								<ul>
									<li>
										Самый большой минус в том что WebStorm жрет просто гиганское количество оперативки в сравнении с Zed.
                    Разница в 20 раз.
                    Но оперативка и скорость запуска это не бутылочное горлышко, приятно конечно когда ИДЕ запускается за секунду, а не за 10 секунд, но не критично.
                    При этом поддержка нейросетей ничуть не хуже чем хайповом Cursor.
									</li>
								</ul>

                <p>
                  При этом мне в вебшторме очень не хватает функционала.
                </p>

                <p>
                  Вот мой конфиг, можете заимпортировать
                </p>

                <p>
                  Вот мои настройки <clickable>WebStorm</clickable>.
                </p>

                <p>
                  Список плагинов: Kursor для подсветки.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>ИИ модель</topper>

							<content style={styles.section.content}>
                <p>
                  Можно запускать ИИ модели локально через LM Studio, или Ollama.
                  Необходима мощная видеокарта с большим количеством памяти, а у меня видеокарта заточена под большое количество мониторов.
                </p>
                <p>
                  Я проанализировал все ИИ модели следующим образом - я сначала написал небольшой тестовый проект полностью сам.
                  И потом попросил все возможные ИИ в максимальной конфигурации написать точно такой же проект.
                  После этого я выбрал ту, код которой мне понравился больше всех.
                  При использовании ИИ модели ее можно использовать либо через официальный гуи либо через курсор либо через WebStorm плагин.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Скриншоты</topper>

              <content style={styles.section.content}>
                <p>
                  Это не просто утилитка для скриншотов я ее так же использую как пипетку, линейку, запись видео.
                </p>
              </content>
            </section>

						<section style={styles.section}>
							<topper style={styles.topper}>Менеджер паролей</topper>

							<content style={styles.section.content}>
                <p>
								  Аутентификация это опять же тот функционал который должен быть встроен в само ядро операционной системы.
                  Но по историческим причинам этого не произошло, и сейчас можно войти через email, google, менеджер паролей.
                  Необходимо определится с одним единственным методом входа, и дальше использовать только его. 
                </p>
                <p>
								  1Password - сто процентный фаворит.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Почта</topper>

							<content style={styles.section.content}>
								Тут только Thunderbird является возможным выбором. Киллер фичей
								почты является для меня наличие функционала вкладок. Ни один
								другой клиент не раполагает вкладками.

                <p>
                  В качестве почтового сервера использую самый дешевый.
                </p>

                <p>
                  Все что требуется от почтового сервера, это получить письмо и перенаправить его мне его.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Остальные приложнения</topper>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Железо:
                  <ul>
                    <li>
                      <a href="google.ru">cpu-z</a>
                      - простая и поэтому лучшая утилита для просмотра характеристик железа
                    </li>
                    <li>
                      <a href="google.ru">Ookla</a>
                      - замер скорости интернета
                    </li>
                    <li>
                      <a href="google.ru">MsRedirect</a>
                      -  что бы винда открывала Chrome вместо Edge
                    </li>
                    <li>
                      <a href="google.ru">VLC</a>
                      - старый, но но лучший видеоплеер.
                    </li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Компиляторы, ставим все, авось пригодятся.
                  <ul>
                    <li>PowerShell 7 - последняя версия повершел (по умолчанию ставится старая)</li>
                    <li>Node</li>
                    <li>Deno - более продвинутый форк ноды</li>
                    <li>Rust - самый лучший язык на текущий момент на рынке (на мой взгляд)</li>
                    <li>Go - лучший язык для вайбкодинга сервера</li>
                    <li>OpenJDK - ставить прозапас не рекомендую если не используете (заебет обновлениями)</li>
                    <li>Python</li>
                    <li>Cpp - для некоторых утилит требуется</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Банковские приложения
                  <ul>
                    <li>sberbank.ru - пользуюсь сбером, самый крупный банк, учитывая текущую экономическую ситуацию, кто знает что может произойти с другими банками. Про Lehmon Brothers так же говорили что он не потопляем, а сейчас ситуация в РФ намного тяжелее чем в США в 2008.</li>
                    <li>alphabank.ru</li>
                    <li>tbank.ru</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Магазины
                  <ul>
                    <li>aliexpress.com - чаще всего пользуюсь им</li>
                    <li>wildberries.ru - время от времени</li>
                    <li>ozon.ru - для заказа продуктов</li>
                    <li>amazon.com - если требуется что-то очень специфичное</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Тут комментировать нечего, все и так понятно.
                  <ul>
                    <li>Telegram - основной</li>
                    <li>WhatsApp - для родственников</li>
                    <li>Discord - игровой</li>
                    <li>Zoom - видео связь</li>
                    <li>Slack - рабочий</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Развлечения:
                  <ul>
                    <li>Youtube - больше всего сижу тут</li>
                    <li>Reddit - основной развлекательный</li>
                    <li>Instagram - иногда захожу</li>
                    <li>Facebook - не захожу но пусть будет</li>
                    <li>Tiktok - не захожу но пусть будет</li>
                    <li>Threads - как по мне круче твиттера</li>
                    <li>Twitter - в сша это главная платформа, в рф не прижился почему-то.</li>
                    <li>Bash - цитатник</li>
                    <li>Habr - техно статьи</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Форумы, по сути их сейчас заменили нейросети, но иногда все же приходится заходить.
                  <ul>
                    <li>stackoverflow.com - вопросы по программированию</li>
                    <li>superuser.com - вопросы продвинутых пользователей</li>
                    <li>serverfault.com - вопросы по администрированию</li>
                    <li>security.stackexchange.com - вопросы по безопасности</li>
                    <li>math.stackexchange.com - вопросы по математике</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Инструмент для программирования
                  <ul>
                    <li>Git</li>
                    <li>Github</li>
                    <li>VirtualBox</li>
                    <li>Claudflare</li>
                    <li>Docker</li>
                    <li>mkcert - утилита для управления сертификатами</li>
                    <li>caddy - более современный аналог nginx</li>
                    <li>PostgreSQL - топовая SQL БД</li>
                    <li>MongoDB - топовая NoSQL БД</li>
                    <li>Wireshark - мониторинг сетевых пакетов</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Шрифты
                  <ul>
                    <li>Hack - лучший шрифт для программирования</li>
                    <li>Nerds - иконки для терминала</li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Куча
                <ul>
                  <li>MediaCreationTool - создание установочных флешек</li>
                  <li>VeraCrypt - лучшее решение для шифрование диска</li>
                  <li>qBittorrent - скачивание торрентов</li>
                  <li>GPG - шифрование</li>
                  <li>2GIS - лучшие карты</li>
                  <li>gosuslugi.ru - приложение от хайпового стартапа</li>
                  <li>TradingView - мониторинг акций</li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
							<topper style={styles.topper}>Что сюда не попало</topper>

							<content style={styles.section.content}>
                Список популярных инструментов, но которым я не нашел практического применения.
                Возможно кому-то они могут оказаться полезными.
                <p>
                  PowerToys - вроде расхайпленный проект 100 000 звезд на гитхабе, но по сути ни одну утилитку из него я не придумал как заинтегрировать.
                </p>
                <p>
                  SideBar - сомнительная необходимость, показывает нагрузку на железо, но по сути .
                </p>
                <p>
                  Pake - позволяет создавать бинарники из вебсайтов, непонятно зачем это нужно, если можно создавать ярлыки.
                </p>
              </content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Заключение</topper>

              <content style={styles.section.content}>
                <p>
                  Многие концентрируются на процессоре, видеокарте, но в действительности на них можно легко сэкономить.
                  Честно говоря обновляя процессор это даже близко не добавляет мне столько же удобства, стол, стул, мышка или очки, не говоря уже о мониторах.
                </p>

                <p>
                  Особо не злитесь, если я вдруг выбрал не ту технологию, которая нравится вам, это мой вкус, я его ни кому не навязываю.
                  Даже более того, если я где-то несправедливо засрал какую-то технологию, которая вам нравится, то я открыт к переубеждению.
                </p>
              </content>
            </section>
					</content>
				</wrapper>
			</viewport>

			{typeof modal == "string" ? (
				<Modal onClose={() => setModal(null)}>{images.photo}</Modal>
			) : null}
		</root>
	);
}

const VERTICAL_ELECTRONS = 100;
const HORIZONTAL_ELECTRONS = 100;

function buildRandomTracks(count, span, cell, duration, random) {
	const cells = Math.max(1, Math.floor(span / cell));

	return Array.from({ length: count }, () => ({
		pos: Math.floor(Math.random() * cells) * cell,
		delay: -Math.random() * duration,
		duration,
		reverse: random ? Math.random() > 0.5 : false,
	}));
}

function GridElectrons({ styles, width, height }) {
	const cell = 40;
	const electronSpeed = 52;
	const vDuration = (height + 32) / electronSpeed;
	const hDuration = (width + 32) / electronSpeed;

	const verticalTracks = useMemo(
		() => buildRandomTracks(VERTICAL_ELECTRONS, width, cell, vDuration, false),
		[width, height, vDuration],
	);

	const horizontalTracks = useMemo(
		() =>
			buildRandomTracks(HORIZONTAL_ELECTRONS, height, cell, hDuration, true),
		[width, height, hDuration],
	);

	return (
		<grid-electrons
			style={{
				...styles.container,
				"--electron-travel": `${width}px`,
				"--electron-v-travel": `${height}px`,
			}}
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

function lexems() {
	return {
		test: ["test", "second"],
	};
}


// chrome://settings/content/federatedIdentityApi