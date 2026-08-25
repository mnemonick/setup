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
    borderBottom: `1px dotted ${colors.text.medium}`,
    position: 'relative',
    textDecoration: 'none',
    paddingBottom: 1
  };

  styles.b = {
    marginRight: 5
  }

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
                  В детстве я, как и все, играл в компьютерные игры и заметил: мне больше нравилось не сам процесс игры, а её настраивать.
								</p>

								<p>
									Также хотелось бы, чтобы это превратилось в волну, где люди публикуют свои сетапы (а то, честное слово, задолбали новости про ИИ) - чтобы можно было почерпнуть чужие фишки.
								</p>

                <p>
                  Этот сетап заточен под программирование.
                  Скорее всего он не подойдёт, если ваша цель — игры, видеомонтаж или дизайн.
                </p>

                <p>
                  Полностью этот сетап с нуля вряд ли кто-то будет повторять: скорее всего каждый возьмёт только отдельные куски.
                </p>

								<p>
									Этот текст написан человеком.
                  ИИ использовался только для обучения и проверки на ошибки.
                  Хотите, чтобы я переписал это в более дружелюбном стиле, или оставить как есть?
								</p>
							</content>
						</section>

            <section style={styles.section}>
							<topper style={styles.topper}>Рабочий стол</topper>

							<content style={styles.section.content}>
								<p>
                  Стол у меня не обычный, а <clickable style={styles.clickable}>угловой</clickable>.
                  У этого два главных преимущества:

                  <ul>
                    <li>
                      <b style={{marginRight: 5}}>Удобная позиция для локтей.</b>
                      Локтями очень удобно упираться в стол - они не висят никогда.
                    </li>
                    <li>
                      <b style={{marginRight: 5}}>Больше пространства для мониторов.</b>
                      В работе я использую 5 мониторов; за обычным столом расположить их так же удобно не получилось бы.
                    </li>
                  </ul>
								</p>

								<p>
                  Нормальных угловых столов на рынке я не нашёл, поэтому купил два стола из IKEA (запрещённая в РФ организация) и соединил их снизу <clickable style={styles.clickable}>пластинами</clickable>.
								</p>
                <p>
                  Главный недостаток: снизу постоянно мешает <clickable style={styles.clickable}>ножка стола</clickable>, но я к ней уже привык.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Мониторы</topper>

              <content style={styles.section.content}>
                <p>
                  Для меня важно, чтобы было много пространства для приложений.
                  Я использую <clickable style={styles.clickable}>5 мониторов</clickable>: один основной (горизонтальный, 222 дюйма) и 4 дополнительных (вертикальных, 222 дюйма).
                </p>

                <p>
                  Сейчас найти маленькие мониторы проблематично — все гонятся за большими.
                  Но по факту даже у вертикальных мониторов ширина составляет 1368 пикселей, а это самая популярная ширина на ноутбуках.
                  Так что горизонтального пространства хватает для большинства приложений.
                </p>

                <p>
                  Все мониторы на кронштейнах и скреплены <clickable style={styles.clickable}>суперклеем с дверными петлями</clickable>, чтобы не было зазоров.
                </p>

                <p>
                  Каждое приложение я ментально закрепляю за своим монитором:

                  <ul>
                    <li>Слева-слева: терминал.</li>
                    <li>Слева: <code>Chromium</code> (для разработки) с открытым дебаггером.</li>
                    <li>Центр: основной монитор — редактор / браузер / любое временное приложение.</li>
                    <li>Справа: нейросеть.</li>
                    <li>Справа-справа: все мессенджеры — <code>Thunderbird</code>, <code>Telegram</code>, <code>Slack</code>.</li>
                  </ul>
                </p>

                <p>
                  Больше пяти мониторов уже непрактично.
                  Если ставить по бокам — они будут слишком далеко, а два ряда — плохая идея: смотреть неудобно физиологически.
                </p>
              </content>
            </section>

            <section onClick={() => setModal("test")} style={styles.section}>
              <topper style={styles.topper}>Клавиатура</topper>

              <content style={styles.section.content}>
                <p>
                  Клавиатура у меня не обычная, а <a href="https://kinesis-ergo.com/shop/advantage2">Kinesis Advantage2</a>.
                  Словами не описать, насколько я её обожаю.
                  Она <b>намного</b> удобнее обычных клавиатур.
                </p>

                <p>
                  <b style={styles.b}>Удобное расположение модификаторов.</b>
                  Большими пальцами я могу нажать 12 клавиш (по 6 на каждый большой палец): <code>PAGE_UP</code> <code>PAGE_DOWN</code> <code>BACKSPACE</code> <code>DELETE</code> <code>HOME</code> <code>END</code> <code>SPACE</code> <code>ENTER</code> <code>ALT</code> <code>CTRL</code> <code>ALT+SHIFT</code> <code>ALT+CTRL</code> <code>ALT+SHIFT+CTRL</code>.
                  Последние три через AutoHotkey сделаны так, что физически жмёшь одну клавишу, а программно это воспринимается как комбинация.
                  На обычных клавиатурах большим пальцем жмёшь только пробел, а модификаторы — мизинцем.
                </p>

                <p>
                  <b style={styles.b}>Удобное расположение стрелок.</b>
                  Стрелки нажимаются указательным и средним пальцем без переноса руки.
                  На обычных клавиатурах для навигации приходится двигать кисть.
                </p>

                <p>
                  <b style={styles.b}>Удобная позиция для локтей.</b>
                  Локти разведены дальше; вместе с угловым столом это очень удобная позиция.
                </p>

                <p>
                  К этой клавиатуре нужно привыкнуть — у меня ушло примерно пару месяцев.
                  Первое время было очень неудобно, но оно того стоило.
                  Для игр приходится переопределять WASD на ESDF.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Мышка</topper>

              <content style={styles.section.content}>
                <p>
                  Есть три типа хвата:
                  <ul>
                    <li><code>Palm</code> — ладонь полностью на мышке.</li>
                    <li><code>Fingertip</code> — мышку держат пальцами.</li>
                    <li><code>Claw</code> — часть ладони на мышке, часть на коврике (среднее между <code>palm</code> и <code>fingertip</code>).</li>
                  </ul>

                  <p>
                    Для меня <b>крайне</b> важно, чтобы хват был именно <code>claw</code>: при нём можно доводить курсор пальцами, упираясь основанием ладони в коврик.
                    При <b>palm</b>-хвате вся ладонь лежит на мышке, упереться в коврик не получается — из‑за этого заметно падает точность.
                  </p>

                  <p>
                    Я вообще не понимаю, как можно пользоваться мышкой, на которой ладонь лежит полностью.
                    Хотя, может, это дело привычки.
                  </p>

                  <p>
                    Для меня важно, чтобы были сразу два механизма скролла:
                    <ul>
                      <li>Тактильный скролл</li> — классика с чёткими щелчками.
                      <li>Свободный скролл</li> — колесико крутится без сопротивления и щелчков.
                    </ul>
                  </p>

                  <p>
                    Мышка должна быть беспроводной (чем меньше проводов — тем лучше).
                  </p>

                  <p>
                    Нужны кнопки влево‑вправо на колесике (я программирую их на копирование и вставку через AutoHotkey).
                  </p>

                  <p>
                    Под мои критерии подходило несколько мышек: 1, 2, 3 — я остановился на 3.
                  </p>

                  <p>
                    Также пробовал *** с 16 (!) кнопками, но она заметно менее удобна для хвата.
                  </p>

                  <p>
                    Вариант с десктопным тачпадом не рассматривал: он уместен на ноутбуках, за компом должна быть мышь. Точка.
                  </p>
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Стул</topper>

              <content style={styles.section.content}>
                <p>
                  Пробовал распиаренный <a href="google.ru">Herman Miller</a>, который стоит как самолёт, но у него минимальная высота 50 см, а мне нужно именно 40 см.
                  Если убрать ножки, можно сидеть в позе наездника — на Herman Miller это очень неудобно.
                </p>

                <p>
                  В итоге остановился на обычном <clickable>стуле</clickable> из IKEA за 100 руб.
                  Если открутить подлокотники (они не нужны: локтями упираемся в стол), он идеально помещается под мои столы.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Очки</topper>

              <content style={styles.section.content}>
                <p>
                  Я, конечно, не врач, но если хотите прокачать рабочее место — уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.
                  Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, но в очках <b>заметно удобнее</b> читать текст на экране.
                  Возможно, у вас будет так же.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Железо</topper>

              <content style={styles.section.content}>
                <p>
                  Железо я намеренно оставляю в самом конце: очень редко именно оно — бутылочное горлышко.
                </p>

                <p>
                  Тем не менее железо у меня топовое.
                  Вот конкретные модели:

                  <ul>
                    <li>Видеокарта 4422 — 1234 поинта.</li>
                    <li>Процессор 4422 — 1234 поинта.</li>
                    <li>Диск Samsung 4422 — 1234 поинта.</li>
                    <li>64 гигабайта оперативки — 1234 поинта.</li>
                  </ul>
                </p>

                <p>
                  Но честно: любой из пунктов выше даёт мне больше реального удобства, чем топовая видеокарта или процессор.
                  Если локально гоняете игры, нейросети или видеомонтаж — железо важно. Для программирования более чем достаточно предпоследнего поколения, и то с огромным запасом.
                </p>
              </content>
            </section>

            <separator>
              ------------------------------------------------------------------------------------------------
            </separator>

						<section style={styles.section}>
							<topper style={styles.topper}>Операционная система</topper>

							<content style={styles.section.content}>
								<p>На выбор: <code>Windows</code>, <code>macOS</code>, <code>Ubuntu</code> и <code>FreeBSD</code>.</p>

								<p>
									Можно подумать, что раз я такой техногик, то у меня какой‑нибудь Linux — но нет.
                  Я абсолютный фанат Windows на десктопе и считаю, что ни macOS, ни Ubuntu даже близко не сравнятся с ней по удобству.
								</p>
								<p>
									На Mac совершенно неудобная система управления окнами.
                  А это по сути главная функция операционной системы.
                  Создаются какие‑то воркспейсы, неудобные переключения.
								</p>
                <p>
									На Windows я очень активно использую AutoHotkey — аналогов нет ни на macOS, ни на Ubuntu.
                  Одного этого мне достаточно, чтобы не смотреть в их сторону.
								</p>
								<p>
                  <code>FreeBSD</code>, на мой взгляд, намного круче <code>Ubuntu</code>, но только для сервера.
                  Я не настолько мазохист, чтобы ставить его на рабочий компьютер.
								</p>

                <p>
                  Настройка Windows у меня в три этапа:
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
                  На Windows (как и на всех ОС) полный кавардак с установкой приложений.

                  Алгоритм выбора у меня такой.
                  Всё стараюсь ставить через winget, либо — если это часто используемое браузерное приложение — создаю PWA (или ярлык, если сайт PWA не поддерживает).
                  Microsoft Store стараюсь не использовать вообще.
                  Редко используемые сайты открываю в браузере.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>AutoHotkey</topper>
							<content style={styles.section.content}>
								<p>
                  <a href="https://autohotkey.com">AutoHotkey</a> — суперклевый инструмент, чтобы «пропатчить» ОС.
                  По‑моему, весь этот функционал должен быть встроен в систему, но по какой‑то причине работу приходится делать самому.
									Ниже — то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.
								</p>

								<p>
                  <b style={{marginRight: 5}}>Модификаторы.</b>

                  Клавиши сначала ремаплю клавиатурой на F13, F14, F15.
                  Итого шесть модификаторов:
                  <code>Alt</code>
                  <code>Ctrl</code>
                  <code>Alt-Shift</code>
                  <code>Ctrl-Shift</code>
                  <code>Alt-Ctrl</code>
                  <code>Alt-Shift-Ctrl</code>.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Клавиатурные жесты.</b>
                  Сейчас при долгом зажатии клавиши печатается куча букв — это совершенно бесполезно.
                  В скрипте долгое зажатие запускает определённую программу.
                  По сути это ещё один модификатор.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Язык.</b>
                  Ни Punto Switcher, ни Caramba Switcher мне не зашли.
                  Что сделал я: при смене фокуса язык приложения сбрасывается на значение по умолчанию.
                  Смена языка — правым Shift.
                  Автоматические свитчеры не дают развить мышечную память: работают в 90% случаев, а эти 10% всё портят.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Колесико.</b>
                  Влево — копирование, вправо — вставка, нажатие — Enter.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Унификация.</b>
                  Бесит, что на русской и английской раскладках спецсимволы печатаются по‑разному.
                </p>

								<p>
                  <b style={{marginRight: 5}}>Лаунчер.</b>
                  Удобнее потому, что не нужно помнить, запущено приложение или нет: просто выбираю, какое сфокусировать.
                </p>

								<p>
                  <b style={{marginRight: 5}}>Хаки.</b>
                  Нормального способа отредактировать горячие клавиши в нём нет, поэтому под это целая секция.
								</p>

                <p>
                  <b style={{marginRight: 5}}>Утилиты.</b>
                  Как ни странно, почти все из ShareX — очень клёвая утилита.

                  <ul>
                    <li>F9 — скриншот</li>
                    <li>F10 — скриншот и распознать текст</li>
                    <li>F11 — записать гифку</li>
                    <li>F12 — пипетка</li>
                    <li>Print Screen — линейка</li>
                    <li>Scroll Lock — скриншот со скроллом</li>
                    <li>Метаданные — скриншот со скроллом</li>
                  </ul>
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Браузер</topper>

              <content style={styles.section.content}>
                <p>
                  Выбор был между Chrome и Firefox.
                  По большому счёту аналогов Chrome я не вижу.
                  У Firefox не нравится дизайн.
                  Opera — все их фичи мне не нужны.
                  На их месте я бы концентрировался на удобных жестах и горячих клавишах.
                </p>

                <p>
                  В целом стараюсь пользоваться только десктопными приложениями.
                </p>

                <p>
                  Список плагинов:
                  <ul>
                    <li>1Password</li> — в браузере работает идеально.
                  </ul>
                </p>

                <p>
                  Браузеры «ради приватности» сразу идут лесом.
                  Честное слово, мне абсолютно похуй на телеметрию (в разумных пределах).

                  Важно: в телеметрию не входит сбор email, телефонов, паролей — это чувствительные данные.
                  Телеметрия — это просто то, какими приложениями вы пользуетесь.
                  Пускай собирают: благодаря этому фиксят баги и делают продукт круче.
                </p>

                <p>Chrome — для браузинга.</p>
                <p>Вот куча плагинов для работы в Chrome.</p>
                <p>Chromium — для разработки. В нём нет плагинов.</p>

                <p>
                  Мне не нравится сама концепция браузера: это вложенная платформа.
                  ОС уже платформа для приложений, а браузер — ещё одна внутри.
                  Исторически так сложилось.
                  Поэтому из сайтов, которыми часто пользуюсь, делаю десктопные приложения.
                  Тогда не видны URL‑бар и вкладки, и любой такой сайт можно запускать через селектор.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>ИИ</topper>
              <content style={styles.section.content}>
                <p>
                  Смотрел, насколько близко модель реализует демо‑приложение.
                  Все модели сравнивал так: сначала сам написал небольшой тестовый проект,
                  потом попросил каждую ИИ в максимальной конфигурации написать такой же.
                  Выбрал ту, чей код понравился больше всех.
                </p>
                <p>Лучшей опцией оказался Claude — у него ещё и особый фокус на программирование.</p>
                <p>Cursor — это надмозг: по сути выбирает модель за тебя. Мне такой подход не нравится.</p>
                <p>
                  Время от времени запускаю модели локально через LM Studio и Ollama.
                  Нужна мощная видеокарта с большим объёмом памяти, а моя заточена под много мониторов.
                  Но основная всё равно Claude.
                </p>
                <p>
                  Модель можно использовать через официальный GUI, через Cursor или через плагин WebStorm.
                </p>
                <p>
                  Вот список MCP‑серверов, которые подключаю.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <topper style={styles.topper}>Файловый менеджер</topper>

              <content style={styles.section.content}>
                <p>Главные игроки: <a href="https://www.farmanager.com">Far Manager</a> (2 000), <a href="https://files.community/">Files</a>, <a href="https://yazi-rs.github.io/">Yazi</a> (32 000), <a href="https://www.ghisler.com/">Total Commander</a>.</p>

                <p>
                  Раз 80% операций — скопировать файлы из одной папки в другую, <code>Yazi</code> отпадает сразу.
                </p>
                <p>
                  <code>Far Manager</code> — двухпанельный, но по функционалу явно проигрывает <code>Total Commander</code>.
                </p>
                <p>
                  <code>Files</code> — красивый UI, но слишком казуальный, далеко не такой функциональный, как <code>Total Commander</code>.
                </p>
                <p>
                  У <code>Total Commander</code> есть недостатки (UI мог бы быть минималистичнее и красивее), но под мои потребности он подходит лучше всего.
                </p>
                <p>
                  В <code>Total Commander</code> переделал все горячие клавиши под себя, включил тёмную тему, убрал лишний UI, поставил шрифт Hack.
                  Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <code>WebStorm</code>.
                  Вот ссылка на <a href="google.ru">конфиг</a>.
                </p>
              </content>
            </section>

						<section style={styles.section}>
							<topper style={styles.topper}>Скриншоты</topper>

							<content style={styles.section.content}>
								<p>
                  Безоговорочный лидер — ShareX.
                  Это не просто утилита для скриншотов: использую её ещё как пипетку, линейку и для записи видео.
                </p>
								<p>
                  Дополнительно в AutoHotkey добавлены горячие клавиши.
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Терминал</topper>

              <content style={styles.section.content}>
                <p>Варианты: стандартный виндовый, Warp, WezTerm, kitty.</p>

                <p>
                  По большому счёту 80% взаимодействия — два действия:

                  <ul>
                    <li>Поиск по истории</li>
                    <li>Копирование вывода</li>
                  </ul>

                  Оба в Warp заметно удобнее.
                  Сравните типичный вывод в обычном терминале и в Warp.
                </p>

                <p>
                  При этом на кой чёрт в него запилили ИИ (сейчас его пилят куда ни попадя) и дерево проектов.
                  Убрать бы весь этот функционал и сделать Warp минималистичнее — было бы лучше.
                  Я фанат минимализма, но функциональность всё же важнее.
                </p>
              </content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Локальный поисковик</topper>
              <content style={styles.section.content}>
                <p>Либо <a href="voidtools.com">Everything</a>, либо <a href="omnisearch.ai">Omnisearch</a>.</p>

                <p>
                  Omni выглядит посовременнее — обычно софт, который появился позже, лучше.
                  Но после ввода в поиск не работают стрелки (стрелки, Карл!) — настолько очевидный функционал.
                  Сразу после установки удалил это говно.
                </p>
              </content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Текстовый редактор</topper>

							<content style={styles.section.content}>
								Выбирал между <a href="">Cursor</a>, <a href="">WebStorm</a>, <a href="">Zed</a> — явный фаворит WebStorm.

                <p>
                  В WebStorm <b>очень</b> много функционала, которым пользуюсь каждый день:
                  <ul>
                    <li>Очень хорошая поддержка Git</li>
                    <li>Последние открытые файлы (вкладки даже отключил)</li>
                    <li>Локальная история</li>
                    <li>Предпросмотр файла в дереве</li>
                    <li>Скоупы (Frontend и Backend помечаю разными цветами)</li>
                    <li>Вкладки при поиске</li>
                    <li>Quicklists: LocalHistory, Git, GitHub</li>
                    <li>И ещё <b>очень много</b> других мелочей.</li>
                  </ul>
                </p>

                <p>
                  В Cursor не нравится, что он построен на веб‑технологиях.
                  Понимаю: лёгкий сайт писать в браузере — ок. Но полноценную IDE на JavaScript?
                </p>

                <p>
                  Пытался перейти на Zed — очень понравилось, насколько мало памяти он жрёт (в 20 раз меньше).
                  Но функциональность важнее минимализма, вернулся на WebStorm.
                </p>

                <p>
                  Вы будете смеяться, но вкладки я отключил.
                  Вместо них — Recent Files.
                </p>

								<ul>
									<li>
										Самый большой минус: WebStorm жрёт гигантское количество оперативки по сравнению с Zed.
                    Разница в 20 раз.
                    Но оперативка и скорость запуска — не бутылочное горлышко: приятно, когда IDE стартует за секунду, а не за 10, но не критично.
                    При этом поддержка нейросетей ничуть не хуже, чем в хайповом Cursor.
									</li>
								</ul>

                <p>
                  При этом в WebStorm мне всё равно очень не хватает функционала.
                </p>

                <p>
                  Вот мой конфиг — можете импортировать.
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
							<topper style={styles.topper}>Менеджер паролей</topper>

							<content style={styles.section.content}>
                <p>
								  Аутентификация — снова тот функционал, который должен быть в ядре ОС.
                  По историческим причинам этого нет, и сейчас можно войти через email, Google или менеджер паролей.
                  Нужно определиться с одним способом входа и дальше использовать только его.
                </p>
                <p>
								  1Password — стопроцентный фаворит.
                  Можно хранить коды двухфакторной аутентификации (чего нет в Google).
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<topper style={styles.topper}>Почта</topper>

							<content style={styles.section.content}>
                <p>
                  Для меня самое важное в почтовом клиенте — вкладки.
                  Письма читать умеют все.
                  Хочу, чтобы вкладки были внутри приложения, а не через несколько вкладок браузера.
                  Поэтому смотрел на Thunderbird.
                </p>

                <p>
                  Публичный домен как‑то несолидно, нужен сервер с кастомными доменами.
                  Выбор пал на PurelyMail — самый дешёвый почтовый сервер (10$ в год).
                </p>

                <p>
                  От почтового сервера нужно только одно: получить письмо и перенаправить его мне.
                </p>

                <p>
                  При этом все телефонные SMS и пуш‑уведомления у меня идут через почту.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Остальные приложения</topper>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                <p>
                  Железо:
                  <ul>
                    <li>
                      <a href="google.ru">CPU-Z</a>
                      — простая и поэтому лучшая утилита для просмотра характеристик железа
                    </li>
                    <li>
                      <a href="google.ru">Ookla</a>
                      — замер скорости интернета
                    </li>
                    <li>
                      <a href="google.ru">MSEdgeRedirect</a>
                      — чтобы Windows открывала Chrome вместо Edge
                    </li>
                    <li>
                      <a href="google.ru">VLC</a>
                      — старый, но лучший видеоплеер
                    </li>
                  </ul>
                </p>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Компиляторы и рантаймы — ставлю всё, авось пригодится.
                <ul>
                  <li>PowerShell 7 — последняя версия (по умолчанию ставится старая)</li>
                  <li>Node</li>
                  <li>Deno — более продвинутый форк Node</li>
                  <li>Rust — на мой взгляд лучший язык программирования сейчас</li>
                  <li>Go — лучший язык для вайбкодинга сервера</li>
                  <li>Python — нужен для некоторых скриптов</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Банковские приложения
                <ul>
                  <li>sberbank.ru — пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.</li>
                  <li>alfabank.ru</li>
                  <li>tbank.ru</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Магазины
                <ul>
                  <li>aliexpress.com — чаще всего</li>
                  <li>wildberries.ru — время от времени</li>
                  <li>ozon.ru — для продуктов</li>
                  <li>ebay.com — если нужно что‑то очень специфичное</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Мессенджеры
                <ul>
                  <li>Telegram — основной</li>
                  <li>WhatsApp — для родственников</li>
                  <li>Discord — игровой</li>
                  <li>Zoom — видеосвязь</li>
                  <li>Slack — рабочий</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Развлечения:
                <ul>
                  <li>YouTube — больше всего сижу тут</li>
                  <li>Reddit — основной развлекательный</li>
                  <li>Instagram — иногда захожу</li>
                  <li>Facebook — не захожу, но пусть будет</li>
                  <li>TikTok — не захожу, но пусть будет</li>
                  <li>Threads — на мой взгляд круче Twitter</li>
                  <li>Twitter — в США главная платформа, в РФ почему‑то не прижился</li>
                  <li>Bash — цитатник</li>
                  <li>Habr — техностатьи</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Форумы: по сути их сейчас заменили нейросети, но иногда всё же приходится заходить.
                <ul>
                  <li>stackoverflow.com — вопросы по программированию</li>
                  <li>superuser.com — вопросы продвинутых пользователей</li>
                  <li>serverfault.com — вопросы по администрированию</li>
                  <li>security.stackexchange.com — вопросы по безопасности</li>
                  <li>math.stackexchange.com — вопросы по математике</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Инструменты для программирования
                <ul>
                  <li>Git</li>
                  <li>GitHub</li>
                  <li>VirtualBox</li>
                  <li>Cloudflare</li>
                  <li>Docker</li>
                  <li>mkcert — утилита для управления сертификатами</li>
                  <li>Caddy — более современный аналог nginx</li>
                  <li>PostgreSQL — топовая SQL‑БД</li>
                  <li>MongoDB — топовая NoSQL‑БД</li>
                  <li>Wireshark — мониторинг сетевых пакетов</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.
                <ul>
                  <li>Hack — лучший шрифт для программирования (терминал и редактор)</li>
                  <li>Montserrat — самый нейтральный шрифт</li>
                  <li>Play — красивые цифры</li>
                  <li>Nerd Fonts — иконки для терминала</li>
                </ul>
              </content>

              <content style={{...styles.section.content, borderBottom: styles.topper.borderBottom}}>
                Разное
                <ul>
                  <li>MediaCreationTool — создание установочных флешек</li>
                  <li>VeraCrypt — лучшее решение для шифрования диска</li>
                  <li>qBittorrent — торренты</li>
                  <li>GPG — шифрование</li>
                  <li>2GIS — лучшие карты</li>
                  <li>gosuslugi.ru — приложение от хайпового стартапа</li>
                  <li>TradingView — мониторинг акций</li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
							<topper style={styles.topper}>Что сюда не попало</topper>

							<content style={styles.section.content}>
                Популярные инструменты, которым я не нашёл практического применения.
                Возможно, кому‑то они будут полезны.
                <p>
                  PowerToys — расхайпленный проект на 100 000 звёзд на GitHub, но ни одну утилиту из него я так и не встроил в свой сетап.
                </p>
                <p>
                  SideBar — сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.
                </p>
                <p>
                  Pake — позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.
                </p>
              </content>
						</section>

            <section style={styles.section}>
              <topper style={styles.topper}>Заключение</topper>

              <content style={styles.section.content}>
                <p>
                  Многие концентрируются на процессоре и видеокарте, но на них легко сэкономить.
                  Честно говоря, обновление процессора даже близко не даёт столько же удобства, сколько стол, стул, мышка или очки — не говоря уже о мониторах.
                </p>

                <p>
                  Не злитесь, если я выбрал не ту технологию, которая нравится вам: это мой вкус, я его никому не навязываю.
                  Более того, если где‑то несправедливо засрал технологию, которая вам близка — открыт к переубеждению.
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