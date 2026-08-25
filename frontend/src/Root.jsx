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
				.querySelectorAll("category")
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

		viewport.querySelectorAll("category").forEach((category) => {
			if (!category.classList.contains("visible")) {
				observer.observe(category);
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

	styles.category = {
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

  styles.category.content = {
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

  styles.term = {
    display: 'inline',
    fontFamily: 'Play',
    borderRadius: 5,
    padding: '0px 4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    letterSpacing: 1
  };

  styles.b = {
    marginRight: 5
  };

  styles.p = {
    margin: 20
  };

  styles.ul = {
    margin: 0
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
						<category style={{ ...styles.category, marginTop: 0 }}>
							<topper style={styles.topper}>Введение</topper>

              <p style={styles.p}>
                В детстве я, как и все, играл в компьютерные игры и заметил: мне больше нравилось не сам процесс игры, а её настраивать.
              </p>

              <p style={styles.p}>
                Также хотелось бы, чтобы это превратилось в волну, где люди публикуют свои сетапы (а то, честное слово, задолбали новости про ИИ) - чтобы можно было почерпнуть чужие фишки.
              </p>

              <p style={styles.p}>
                Этот сетап заточен под программирование.
                Скорее всего он не подойдёт, если ваша цель это игры, видеомонтаж или дизайн.
              </p>

              <p style={styles.p}>
                Полностью этот сетап с нуля вряд ли кто-то будет повторять: скорее всего каждый возьмёт только отдельные куски.
              </p>

              <p style={styles.p}>
                Этот текст написан человеком.
                ИИ использовался только для обучения и проверки на ошибки.
                Хотите, чтобы я переписал это в более дружелюбном стиле, или оставить как есть?
              </p>
						</category>

            <category style={styles.category}>
							<topper style={styles.topper}>Рабочий стол</topper>

              <p style={styles.p}>
                Стол у меня не обычный, а <clickable style={styles.clickable}>угловой</clickable>.
                У этого два главных преимущества:

                <ul style={styles.ul}>
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

              <p style={styles.p}>
                Нормальных угловых столов на рынке я не нашёл, поэтому купил два стола из <term style={styles.term}>IKEA</term> (запрещённая в РФ организация) и соединил их снизу <clickable style={styles.clickable}>пластинами</clickable>.
              </p>
              <p style={styles.p}>
                Главный недостаток: снизу постоянно мешает <clickable style={styles.clickable}>ножка стола</clickable>, но я к ней уже привык.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Мониторы</topper>

              <p style={styles.p}>
                Для меня важно, чтобы было много пространства для приложений.
                Я использую <clickable style={styles.clickable}>5 мониторов</clickable>: один основной (горизонтальный, 222 дюйма) и 4 дополнительных (вертикальных, 222 дюйма).
              </p>

              <p style={styles.p}>
                Сейчас найти маленькие мониторы проблематично, все гонятся за большими.
                Но по факту даже у вертикальных мониторов ширина составляет 1368 пикселей, а это самая популярная ширина на ноутбуках.
                Так что горизонтального пространства хватает для большинства приложений.
              </p>

              <p style={styles.p}>
                Все мониторы на кронштейнах и скреплены <clickable style={styles.clickable}>суперклеем с дверными петлями</clickable>, чтобы не было зазоров.
              </p>

              <p style={styles.p}>
                Каждое приложение я ментально закрепляю за своим монитором:

                <ul style={styles.ul}>
                  <li>Слева-слева: <a href="https://www.warp.dev">Warp</a>.</li>
                  <li>Слева: браузер для разработки с открытым дебаггером.</li>
                  <li>Центр: основной монитор — <a href="TODO">WebStorm</a> / <a href="TODO">Chrome</a> / любое временное приложение.</li>
                  <li>Справа: <a href="claude">Claude</a>.</li>
                  <li>Справа-справа: все мессенджеры — <a href="TODO">Thunderbird</a>, <a href="TODO">Telegram</a>, <a href="TODO">Slack</a>.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Больше пяти мониторов уже непрактично.
                Если ставить по бокам - они будут слишком далеко, а два ряда - плохая идея: смотреть неудобно физиологически.
              </p>
            </category>

            <category onClick={() => setModal("test")} style={styles.category}>
              <topper style={styles.topper}>Клавиатура</topper>

              <p style={styles.p}>
                Клавиатура у меня не обычная, а <a href="https://kinesis-ergo.com/shop/advantage2">Kinesis Advantage 2</a>.
                Словами не описать, насколько я её обожаю.
                Она <b>намного</b> удобнее обычных клавиатур.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение модификаторов.</b>
                Большими пальцами я могу нажать 12 клавиш (по 6 на каждый большой палец): <term>PAGE_UP</term> <term>PAGE_DOWN</term> <term>BACKSPACE</term> <term>DELETE</term> <term>HOME</term> <term>END</term> <term>SPACE</term> <term>ENTER</term> <term>ALT</term> <term>CTRL</term> <term>ALT+SHIFT</term> <term>ALT+CTRL</term> <term>ALT+SHIFT+CTRL</term>.
                Последние три через <a href="https://www.autohotkey.com">AutoHotkey</a> сделаны так, что физически жмёшь одну клавишу, а программно это воспринимается как комбинация.
                На обычных клавиатурах большим пальцем жмёшь только пробел, а модификаторы — мизинцем.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение стрелок.</b>
                Стрелки нажимаются указательным и средним пальцем без переноса руки.
                На обычных клавиатурах для навигации приходится двигать кисть.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобная позиция для локтей.</b>
                Локти разведены дальше; вместе с угловым столом это очень удобная позиция.
              </p>

              <p style={styles.p}>
                К этой клавиатуре нужно привыкнуть — у меня ушло примерно пару месяцев.
                Первое время было очень неудобно, но оно того стоило.
                Для игр приходится переопределять WASD на ESDF.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Мышка</topper>

              <p style={styles.p}>
                Есть три типа хвата:
                <ul style={styles.ul}>
                  <li><term>Palm</term> — ладонь полностью на мышке.</li>
                  <li><term>Fingertip</term> — мышку держат пальцами.</li>
                  <li><term>Claw</term> — часть ладони на мышке, часть на коврике (среднее между <code>Palm</code> и <code>Fingertip</code>).</li>
                </ul>

              </p>
              <p style={styles.p}>
                Для меня <b>крайне</b> важно, чтобы хват был именно <term>claw</term>: при нём можно доводить курсор пальцами, упираясь основанием ладони в коврик.
                При <b>palm</b>-хвате вся ладонь лежит на мышке, упереться в коврик не получается — из‑за этого заметно падает точность.
              </p>

              <p style={styles.p}>
                Я вообще не понимаю, как можно пользоваться мышкой, на которой ладонь лежит полностью.
                Хотя, может, это дело привычки.
              </p>

              <p style={styles.p}>
                Для меня важно, чтобы были сразу два механизма скролла:
                <ul style={styles.ul}>
                  <li>Тактильный скролл - классика с четкими щелчками.</li>
                  <li>Свободный скролл - колесико крутится без сопротивления и щелчков.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Мышка должна быть беспроводной (чем меньше проводов - тем лучше).
              </p>

              <p style={styles.p}>
                Нужны кнопки влево‑вправо на колесике (я программирую их на копирование и вставку через <a href="https://www.autohotkey.com">AutoHotkey</a>).
              </p>

              <p style={styles.p}>
                Под мои критерии подходило несколько мышек: 1, 2, 3 - я остановился на 3.
              </p>

              <p style={styles.p}>
                Также пробовал *** с 16 (!) кнопками, но она заметно менее удобна для хвата.
              </p>

              <p style={styles.p}>
                Вариант с десктопным тачпадом не рассматривал: он уместен на ноутбуках, за компом должна быть мышь. Точка.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Стул</topper>

              <p style={styles.p}>
                Пробовал распиаренный <a href="https://www.hermanmiller.com">Herman Miller</a>, который стоит как самолёт, но у него минимальная высота 50 см, а мне нужно именно 40 см.
                Если убрать ножки, можно сидеть в позе наездника - на <a href="https://www.hermanmiller.com">Herman Miller</a> это очень неудобно.
              </p>

              <p style={styles.p}>
                В итоге остановился на обычном <clickable style={styles.clickable}>стуле</clickable> из <term>IKEA</term> за 100 руб.
                Если открутить подлокотники (они не нужны: локтями упираемся в стол), он идеально помещается под мои столы.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Очки</topper>

              <p style={styles.p}>
                Я, конечно, не врач, но если хотите прокачать рабочее место - уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.
                Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, но в очках <b>заметно удобнее</b> читать текст на экране.
                Возможно, у вас будет так же.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Железо</topper>

              <p style={styles.p}>
                Железо я намеренно оставляю в самом конце: очень редко именно оно - бутылочное горлышко.
              </p>

              <p style={styles.p}>
                Тем не менее железо у меня топовое.
                Вот конкретные модели:

                <ul style={styles.ul}>
                  <li>Видеокарта 4422 - 1234 поинта.</li>
                  <li>Процессор 4422 - 1234 поинта.</li>
                  <li>Диск Samsung 4422 - 1234 поинта.</li>
                  <li>64 гигабайта оперативки - 1234 поинта.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Но честно: любой из пунктов выше даёт мне больше реального удобства, чем топовая видеокарта или процессор.
                Если локально гоняете игры, нейросети или видеомонтаж - железо важно. Для программирования более чем достаточно предпоследнего поколения, и то с огромным запасом.
              </p>
            </category>

            <separator>
              ------------------------------------------------------------------------------------------------
            </separator>

						<category style={styles.category}>
							<topper style={styles.topper}>Операционная система</topper>

              <p style={styles.p}>
                На выбор:
                <a href="https://www.microsoft.com/windows">Windows</a>,
                <a href="https://www.apple.com/macos">macOS</a>,
                <a href="https://ubuntu.com">Ubuntu</a> и
                <a href="https://www.freebsd.org">FreeBSD</a>.
              </p>

              <p style={styles.p}>
                Можно подумать, что раз я такой техногик, то у меня какой‑нибудь <a href="https://kernel.org">Linux</a> - но нет.
                Я абсолютный фанат <a href="https://www.microsoft.com/windows">Windows</a> на десктопе и считаю, что ни <a href="https://www.apple.com/macos"><code>macOS</code></a>, ни <a href="https://ubuntu.com"><code>Ubuntu</code></a> даже близко не сравнятся с ней по удобству.
              </p>
              <p style={styles.p}>
                На Mac совершенно неудобная система управления окнами.
                А это по сути главная функция операционной системы.
                Создаются какие‑то воркспейсы, неудобные переключения.
              </p>
              <p style={styles.p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> я очень активно использую <a href="https://www.autohotkey.com"><code>AutoHotkey</code></a> - аналогов нет ни на <a href="https://www.apple.com/macos"><code>macOS</code></a>, ни на <a href="https://ubuntu.com"><code>Ubuntu</code></a>.
                Одного этого мне достаточно, чтобы не смотреть в их сторону.
              </p>
              <p style={styles.p}>
                <a href="https://www.freebsd.org">FreeBSD</a>, на мой взгляд, намного круче <a href="https://ubuntu.com">Ubuntu</a>, но только для сервера.
                Я не настолько мазохист, чтобы ставить его на рабочий компьютер.
              </p>

              <p style={styles.p}>
                Настройка <a href="https://www.microsoft.com/windows">Windows</a> у меня в три этапа:
                <ul style={styles.ul}>
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

              <p style={styles.p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений.

                Алгоритм выбора у меня такой.
                Всё стараюсь ставить через <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a>, либо - если это часто используемое браузерное приложение - создаю <term>PWA</term>.
                <a href="https://apps.microsoft.com">Microsoft Store</a> стараюсь не использовать вообще.
                Редко используемые сайты открываю в браузере.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>AutoHotkey</topper>

              <p style={styles.p}>
                <a href="https://www.autohotkey.com">AutoHotkey</a> - суперклевый инструмент, чтобы «пропатчить» ОС.
                По‑моему, весь этот функционал должен быть встроен в систему, но по какой‑то причине работу приходится делать самому.
                Ниже - то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Модификаторы.</b>

                Клавиши сначала ремаплю клавиатурой на F13, F14, F15.
                Итого шесть модификаторов:
                <term>Alt</term>
                <term>Ctrl</term>
                <term>Alt-Shift</term>
                <term>Ctrl-Shift</term>
                <term>Alt-Ctrl</term>
                <term>Alt-Shift-Ctrl</term>.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Клавиатурные жесты.</b>
                Сейчас при долгом зажатии клавиши печатается куча букв - это совершенно бесполезно.
                В скрипте долгое зажатие запускает определённую программу.
                По сути это ещё один модификатор.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Язык.</b>
                Ни <a href="https://yandex.ru/soft/punto/">Punto Switcher</a>, ни <a href="https://caramba-switcher.com"><code>Caramba Switcher</code></a> мне не зашли.
                Что сделал я: при смене фокуса язык приложения сбрасывается на значение по умолчанию.
                Смена языка - правым Shift.
                Автоматические свитчеры не дают развить мышечную память: работают в 90% случаев, а эти 10% всё портят.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Колесико.</b>
                Влево - копирование, вправо - вставка, нажатие - Enter.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Унификация.</b>
                Бесит, что на русской и английской раскладках спецсимволы печатаются по‑разному.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Лаунчер.</b>
                Удобнее потому, что не нужно помнить, запущено приложение или нет: просто выбираю, какое сфокусировать.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Хаки.</b>
                Нормального способа отредактировать горячие клавиши в нём нет, поэтому под это целая секция.
              </p>

              <p style={styles.p}>
                <b style={{marginRight: 5}}>Утилиты.</b>
                Как ни странно, почти все из <a href="https://getsharex.com">ShareX</a> - очень клёвая утилита.

                <ul style={styles.ul}>
                  <li>F9 - скриншот</li>
                  <li>F10 - скриншот и распознать текст</li>
                  <li>F11 - записать гифку</li>
                  <li>F12 - пипетка</li>
                  <li>Print Screen - линейка</li>
                  <li>Scroll Lock - скриншот со скроллом</li>
                  <li>Метаданные - скриншот со скроллом</li>
                </ul>
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Браузер</topper>

              <p style={styles.p}>
                Выбор был между <a href="https://www.google.com/chrome/">Chrome</a> и <a href="https://www.mozilla.org/firefox/"><code>Firefox</code></a>.
                По большому счёту аналогов <a href="https://www.google.com/chrome/">Chrome</a> я не вижу.
                У <a href="https://www.mozilla.org/firefox/">Firefox</a> не нравится дизайн.
                <a href="https://www.opera.com">Opera</a> - все их фичи мне не нужны.
                На их месте я бы концентрировался на удобных жестах и горячих клавишах.
              </p>

              <p style={styles.p}>
                В целом стараюсь пользоваться только десктопными приложениями.
              </p>

              <p style={styles.p}>
                Список плагинов:
                <ul style={styles.ul}>
                  <li><a href="https://1password.com">1Password</a> - в браузере работает идеально.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Браузеры «ради приватности» сразу идут лесом.
                Честное слово, мне абсолютно похуй на телеметрию (в разумных пределах).

                Важно: в телеметрию не входит сбор email, телефонов, паролей - это чувствительные данные.
                Телеметрия - это просто то, какими приложениями вы пользуетесь.
                Пускай собирают: благодаря этому фиксят баги и делают продукт круче.
              </p>

              <p style={styles.p}><a href="https://www.google.com/chrome/">Chrome</a> - для браузинга.</p>
              <p style={styles.p}>Вот куча плагинов для работы в <a href="https://www.google.com/chrome/">Chrome</a>.</p>
              <p style={styles.p}><a href="https://www.chromium.org">Chromium</a> - для разработки. В нём нет плагинов.</p>

              <p style={styles.p}>
                Мне не нравится сама концепция браузера: это вложенная платформа.
                ОС уже платформа для приложений, а браузер - ещё одна внутри.
                Исторически так сложилось.
                Поэтому из сайтов, которыми часто пользуюсь, делаю десктопные приложения.
                Тогда не видны URL‑бар и вкладки, и любой такой сайт можно запускать через селектор.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>ИИ</topper>

              <p style={styles.p}>
                Смотрел, насколько близко модель реализует демо‑приложение.
                Все модели сравнивал так: сначала сам написал небольшой тестовый проект,
                потом попросил каждую ИИ в максимальной конфигурации написать такой же.
                Выбрал ту, чей код понравился больше всех.
              </p>
              <p style={styles.p}>Лучшей опцией оказался <a href="https://claude.ai">Claude</a> - у него ещё и особый фокус на программирование.</p>
              <p style={styles.p}><a href="https://cursor.com">Cursor</a> - это надмозг: по сути выбирает модель за тебя. Мне такой подход не нравится.</p>
              <p style={styles.p}>
                Время от времени запускаю модели локально через <a href="https://lmstudio.ai">LM Studio</a> и <a href="https://ollama.com"><code>Ollama</code></a>.
                Нужна мощная видеокарта с большим объёмом памяти, а моя заточена под много мониторов.
                Но основная всё равно <a href="https://claude.ai">Claude</a>.
              </p>
              <p style={styles.p}>
                Модель можно использовать через официальный GUI, через <a href="https://cursor.com">Cursor</a> или через плагин <a href="https://www.jetbrains.com/webstorm/"><code>WebStorm</code></a>.
              </p>
              <p style={styles.p}>
                Вот список MCP‑серверов, которые подключаю.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Файловый менеджер</topper>

              <p style={styles.p}>Главные игроки: <a href="https://www.farmanager.com">Far Manager</a> (2 000), <a href="https://files.community"><code>Files</code></a>, <a href="https://yazi-rs.github.io"><code>Yazi</code></a> (32 000), <a href="https://www.ghisler.com"><code>Total Commander</code></a>.</p>

              <p style={styles.p}>
                Раз 80% операций - скопировать файлы из одной папки в другую, <a href="https://yazi-rs.github.io">Yazi</a> отпадает сразу.
              </p>
              <p style={styles.p}>
                <a href="https://www.farmanager.com">Far Manager</a> - двухпанельный, но по функционалу явно проигрывает <a href="https://www.ghisler.com"><code>Total Commander</code></a>.
              </p>
              <p style={styles.p}>
                <a href="https://files.community">Files</a> - красивый UI, но слишком казуальный, далеко не такой функциональный, как <a href="https://www.ghisler.com"><code>Total Commander</code></a>.
              </p>
              <p style={styles.p}>
                У <a href="https://www.ghisler.com">Total Commander</a> есть недостатки (UI мог бы быть минималистичнее и красивее), но под мои потребности он подходит лучше всего.
              </p>
              <p style={styles.p}>
                В <a href="https://www.ghisler.com">Total Commander</a> переделал все горячие клавиши под себя, включил тёмную тему, убрал лишний UI, поставил шрифт <a href="https://sourcefoundry.org/hack/"><code>Hack</code></a>.
                Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                Вот ссылка на <a href="google.ru">конфиг</a>.
              </p>
            </category>

						<category style={styles.category}>
							<topper style={styles.topper}>Скриншоты</topper>

              <p style={styles.p}>
                Безоговорочный лидер - <a href="https://getsharex.com">ShareX</a>.
                Это не просто утилита для скриншотов: использую её ещё как пипетку, линейку и для записи видео.
              </p>
              <p style={styles.p}>
                Дополнительно в <a href="https://www.autohotkey.com">AutoHotkey</a> добавлены горячие клавиши.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Терминал</topper>

              <p style={styles.p}>Варианты: стандартный виндовый, <a href="https://www.warp.dev">Warp</a>, <a href="https://wezfurlong.org/wezterm/"><code>WezTerm</code></a>, <a href="https://sw.kovidgoyal.net/kitty/"><code>kitty</code></a>.</p>

              <p style={styles.p}>
                По большому счёту 80% взаимодействия - два действия:

                <ul style={styles.ul}>
                  <li>Поиск по истории</li>
                  <li>Копирование вывода</li>
                </ul>

                Оба в <a href="https://www.warp.dev">Warp</a> заметно удобнее.
                Сравните типичный вывод в обычном терминале и в <a href="https://www.warp.dev">Warp</a>.
              </p>

              <p style={styles.p}>
                При этом на кой чёрт в него запилили ИИ (сейчас его пилят куда ни попадя) и дерево проектов.
                Убрать бы весь этот функционал и сделать <a href="https://www.warp.dev">Warp</a> минималистичнее - было бы лучше.
                Я фанат минимализма, но функциональность всё же важнее.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Локальный поисковик</topper>

              <p style={styles.p}>Либо <a href="https://www.voidtools.com">Everything</a>, либо <a href="https://omnisearch.ai"><code>Omnisearch</code></a>.</p>

              <p style={styles.p}>
                <a href="https://omnisearch.ai">Omni</a> выглядит посовременнее - обычно софт, который появился позже, лучше.
                Но после ввода в поиск не работают стрелки (стрелки, Карл!) - настолько очевидный функционал.
                Сразу после установки удалил это говно.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Текстовый редактор</topper>

              Выбирал между <a href="https://cursor.com">Cursor</a>, <a href="https://www.jetbrains.com/webstorm/"><code>WebStorm</code></a>, <a href="https://zed.dev"><code>Zed</code></a> - явный фаворит <a href="https://www.jetbrains.com/webstorm/"><code>WebStorm</code></a>.

              <p style={styles.p}>
                В <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> <b>очень</b> много функционала, которым пользуюсь каждый день:
                <ul style={styles.ul}>
                  <li>Очень хорошая поддержка <a href="https://git-scm.com">Git</a></li>
                  <li>Последние открытые файлы (вкладки даже отключил)</li>
                  <li>Локальная история</li>
                  <li>Отдельные окна</li>
                  <li>Интенты</li>
                  <li>Предпросмотр файла в дереве</li>
                  <li>Скоупы (Frontend и Backend помечаю разными цветами)</li>
                  <li>Вкладки при поиске</li>
                  <li>Quicklists: LocalHistory, <a href="https://git-scm.com">Git</a>, <a href="https://github.com"><code>GitHub</code></a></li>
                  <li>И ещё <b>очень много</b> других мелочей.</li>
                </ul>
              </p>

              <p style={styles.p}>
                В <a href="https://cursor.com">Cursor</a> не нравится, что он построен на веб‑технологиях.
                Понимаю: лёгкий сайт писать в браузере - ок. Но полноценную IDE на JavaScript?
              </p>

              <p style={styles.p}>
                Пытался перейти на <a href="https://zed.dev">Zed</a> - очень понравилось, насколько мало памяти он жрёт (в 20 раз меньше).
                Но функциональность важнее минимализма, вернулся на <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
              </p>

              <p style={styles.p}>
                Вы будете смеяться, но вкладки я отключил.
                Вместо них - Recent Files.
              </p>

              <ul style={styles.ul}>
                <li>
                  Самый большой минус: <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> жрёт гигантское количество оперативки по сравнению с <a href="https://zed.dev"><code>Zed</code></a>.
                  Разница в 20 раз.
                  Но оперативка и скорость запуска - не бутылочное горлышко: приятно, когда IDE стартует за секунду, а не за 10, но не критично.
                  При этом поддержка нейросетей ничуть не хуже, чем в хайповом <a href="https://cursor.com">Cursor</a>.
                </li>
              </ul>

              <p style={styles.p}>
                При этом в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> мне всё равно очень не хватает функционала.
              </p>

              <p style={styles.p}>
                Вот мой конфиг - можете импортировать.
              </p>

              <p style={styles.p}>
                Вот мои настройки <clickable style={styles.clickable}>WebStorm</clickable>.
              </p>

              <p style={styles.p}>
                Список плагинов: <a href="TODO">Kursor</a> для подсветки.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Менеджер паролей</topper>

              <p style={styles.p}>
                Аутентификация - снова тот функционал, который должен быть в ядре ОС.
                По историческим причинам этого нет, и сейчас можно войти через email, <a href="https://accounts.google.com">Google</a> или менеджер паролей.
                Нужно определиться с одним способом входа и дальше использовать только его.
              </p>
              <p style={styles.p}>
                <a href="https://1password.com">1Password</a> - стопроцентный фаворит.
                Можно хранить коды двухфакторной аутентификации (чего нет в <a href="https://accounts.google.com">Google</a>).
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Почта</topper>

              <p style={styles.p}>
                Для меня самое важное в почтовом клиенте - вкладки.
                Письма читать умеют все.
                Хочу, чтобы вкладки были внутри приложения, а не через несколько вкладок браузера.
                Поэтому смотрел на <a href="TODO">Thunderbird</a>.
              </p>

              <p style={styles.p}>
                Публичный домен как‑то несолидно, нужен сервер с кастомными доменами.
                Выбор пал на <a href="TODO">PurelyMail</a> - самый дешёвый почтовый сервер (10$ в год).
              </p>

              <p style={styles.p}>
                От почтового сервера нужно только одно: получить письмо и перенаправить его мне.
              </p>

              <p style={styles.p}>
                При этом все телефонные SMS и пуш‑уведомления у меня идут через почту.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Остальные приложения</topper>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Железо:
                  <ul style={styles.ul}>
                    <li>
                      <a href="https://www.cpuid.com/softwares/cpu-z.html">CPU-Z</a>
                      - простая и поэтому лучшая утилита для просмотра характеристик железа
                    </li>
                    <li>
                      <a href="https://www.speedtest.net">Ookla</a>
                      - замер скорости интернета
                    </li>
                    <li>
                      <a href="https://github.com/rcmaehl/MSEdgeRedirect">MSEdgeRedirect</a>
                      - чтобы <a href="https://www.microsoft.com/windows">Windows</a> открывала <a href="https://www.google.com/chrome/"><code>Chrome</code></a> вместо <a href="https://www.microsoft.com/edge"><code>Edge</code></a>
                    </li>
                    <li>
                      <a href="https://www.videolan.org">VLC</a>
                      - старый, но лучший видеоплеер
                    </li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Компиляторы и рантаймы - ставлю всё, авось пригодится.
                <ul style={styles.ul}>
                  <li><a href="https://github.com/PowerShell/PowerShell">PowerShell 7</a> - последняя версия (по умолчанию ставится старая)</li>
                  <li><a href="https://nodejs.org">Node</a></li>
                  <li><a href="https://deno.com">Deno</a> - более продвинутый форк <a href="https://nodejs.org"><code>Node</code></a></li>
                  <li><a href="https://www.rust-lang.org">Rust</a> - на мой взгляд лучший язык программирования сейчас</li>
                  <li><a href="https://go.dev">Go</a> - лучший язык для вайбкодинга сервера</li>
                  <li><a href="https://www.python.org">Python</a> - нужен для некоторых скриптов</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Банковские приложения
                <ul style={styles.ul}>
                  <li><a href="https://www.sberbank.ru">sberbank.ru</a> - пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.</li>
                  <li><a href="https://alfabank.ru">alfabank.ru</a></li>
                  <li><a href="https://www.tbank.ru">tbank.ru</a></li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Магазины
                <ul style={styles.ul}>
                  <li><a href="https://www.aliexpress.com">aliexpress.com</a> - чаще всего</li>
                  <li><a href="https://www.wildberries.ru">wildberries.ru</a> - время от времени</li>
                  <li><a href="https://www.ozon.ru">ozon.ru</a> - для продуктов</li>
                  <li><a href="https://www.ebay.com">ebay.com</a> - если нужно что‑то очень специфичное</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Мессенджеры
                <ul style={styles.ul}>
                  <li><a href="https://telegram.org">Telegram</a> - основной</li>
                  <li><a href="https://www.whatsapp.com">WhatsApp</a> - для родственников</li>
                  <li><a href="https://discord.com">Discord</a> - игровой</li>
                  <li><a href="https://zoom.us">Zoom</a> - видеосвязь</li>
                  <li><a href="https://slack.com">Slack</a> - рабочий</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Развлечения:
                <ul style={styles.ul}>
                  <li><a href="https://www.youtube.com">YouTube</a> - больше всего сижу тут</li>
                  <li><a href="https://www.reddit.com">Reddit</a> - основной развлекательный</li>
                  <li><a href="https://www.instagram.com">Instagram</a> - иногда захожу</li>
                  <li><a href="https://www.facebook.com">Facebook</a> - не захожу, но пусть будет</li>
                  <li><a href="https://www.tiktok.com">TikTok</a> - не захожу, но пусть будет</li>
                  <li><a href="https://www.threads.net">Threads</a> - на мой взгляд круче <a href="https://x.com"><code>Twitter</code></a></li>
                  <li><a href="https://x.com">Twitter</a> - в США главная платформа, в РФ почему‑то не прижился</li>
                  <li><a href="https://bash.im">Bash</a> - цитатник</li>
                  <li><a href="https://habr.com">Habr</a> - техностатьи</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Форумы: по сути их сейчас заменили нейросети, но иногда всё же приходится заходить.
                <ul style={styles.ul}>
                  <li><a href="https://stackoverflow.com">stackoverflow.com</a> - вопросы по программированию</li>
                  <li><a href="https://superuser.com">superuser.com</a> - вопросы продвинутых пользователей</li>
                  <li><a href="https://serverfault.com">serverfault.com</a> - вопросы по администрированию</li>
                  <li><a href="https://security.stackexchange.com">security.stackexchange.com</a> - вопросы по безопасности</li>
                  <li><a href="https://math.stackexchange.com">math.stackexchange.com</a> - вопросы по математике</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Инструменты для программирования
                <ul style={styles.ul}>
                  <li><a href="https://git-scm.com">Git</a></li>
                  <li><a href="https://github.com">GitHub</a></li>
                  <li><a href="https://www.virtualbox.org">VirtualBox</a></li>
                  <li><a href="https://www.cloudflare.com">Cloudflare</a></li>
                  <li><a href="https://www.docker.com">Docker</a></li>
                  <li><a href="https://github.com/FiloSottile/mkcert">mkcert</a> - утилита для управления сертификатами</li>
                  <li><a href="https://caddyserver.com">Caddy</a> - более современный аналог <a href="https://nginx.org"><code>nginx</code></a></li>
                  <li><a href="https://www.postgresql.org">PostgreSQL</a> - топовая SQL‑БД</li>
                  <li><a href="https://www.mongodb.com">MongoDB</a> - топовая NoSQL‑БД</li>
                  <li><a href="https://www.wireshark.org">Wireshark</a> - мониторинг сетевых пакетов</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.
                <ul style={styles.ul}>
                  <li><a href="https://sourcefoundry.org/hack/">Hack</a> - лучший шрифт для программирования (терминал и редактор)</li>
                  <li><a href="https://fonts.google.com/specimen/Montserrat">Montserrat</a> - самый нейтральный шрифт</li>
                  <li><a href="https://fonts.google.com/specimen/Play">Play</a> - красивые цифры</li>
                  <li><a href="https://www.nerdfonts.com">Nerd Fonts</a> - иконки для терминала</li>
                </ul>
              </section>

              <section style={{...styles.category.content, borderBottom: styles.topper.borderBottom}}>
                Разное
                <ul style={styles.ul}>
                  <li><a href="https://www.microsoft.com/software-download/windows11">MediaCreationTool</a> - создание установочных флешек</li>
                  <li><a href="https://veracrypt.fr">VeraCrypt</a> - лучшее решение для шифрования диска</li>
                  <li><a href="https://www.qbittorrent.org">qBittorrent</a> - торренты</li>
                  <li><a href="https://2gis.ru">2GIS</a> - лучшие карты</li>
                  <li><a href="https://www.gosuslugi.ru">gosuslugi.ru</a> - приложение от хайпового стартапа</li>
                  <li><a href="https://www.tradingview.com">TradingView</a> - мониторинг акций</li>
                </ul>
              </section>
            </category>

            <category style={styles.category}>
							<topper style={styles.topper}>Что сюда не попало</topper>

              Популярные инструменты, которым я не нашёл практического применения.
              Возможно, кому‑то они будут полезны.
              <p style={styles.p}>
                <a href="https://github.com/microsoft/PowerToys">PowerToys</a> - расхайпленный проект на 100 000 звёзд на <a href="https://github.com"><code>GitHub</code></a>, но ни одну утилиту из него я так и не встроил в свой сетап.
              </p>
              <p style={styles.p}>
                <a href="TODO">SideBar</a> - сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.
              </p>
              <p style={styles.p}>
                <a href="https://github.com/tw93/Pake">Pake</a> - позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Заключение</topper>

              <p style={styles.p}>
                Многие концентрируются на процессоре и видеокарте, но на них легко сэкономить.
                Честно говоря, обновление процессора даже близко не даёт столько же удобства, сколько стол, стул, мышка или очки - не говоря уже о мониторах.
              </p>

              <p style={styles.p}>
                Не злитесь, если я выбрал не ту технологию, которая нравится вам: это мой вкус, я его никому не навязываю.
                Более того, если где‑то несправедливо засрал технологию, которая вам близка - открыт к переубеждению.
              </p>
            </category>
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