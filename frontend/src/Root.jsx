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

  let [modal, setModal] = React.useState(null);

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

  styles.category.section = {
    borderBottom: `1px dashed ${colors.border.medium}`
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
    borderBottom: `1px dashed ${colors.text.weak}`,
    position: 'relative',
    textDecoration: 'none'
  };

  styles.border = {
    position: "absolute",
    top: desktop ? 59 : 49,
    width: window.width,
    height: 1,
    background: colors.border.medium
  }

  styles.term = {
    display: 'inline',
    fontFamily: 'Play',
    borderRadius: 5,
    padding: '0px 4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    letterSpacing: 1
  };

  styles.b = {
    marginRight: 5,
    fontWeight: 600
  };

  styles.p = {
    margin: 20
  };

  styles.ul = {
    marginBottom: 0,
    marginTop: 5
  };

  styles.separator = {
    position: "relative",
    left: -layout.left,
    display: "flex",
    alignItems: 'center',
    gap: 16,
    width: desktop ? window.innerWidth - 20 : window.innerWidth,
    marginTop: desktop ? 20 : 10,
    marginBottom: desktop ? 20 : 10,
    color: colors.border.strong
  };

  styles.separator.line = {
    flex: 1,
    height: 1,
    borderBottom: `2px dashed ${colors.border.strong}`,
  };

  styles.separator.caption = {
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

	let grid_height = contentHeight || height - styles.heading.height;

  return (
		<root style={styles.root}>
			<border-top style={styles.border} />

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
                В детстве я, как и все, играл в компьютерные игры и заметил: мне больше нравилось не сам процесс игры, а ковырять в ее настройках.
              </p>

              <p style={styles.p}>
                Также хотелось бы, чтобы это превратилось в волну, где люди публикуют свои сетапы (а то, честное слово, задолбали новости про ИИ) - чтобы можно было почерпнуть чужие фишки.
              </p>

              <p style={styles.p}>
                Этот сетап заточен именно под <b style={styles.b}>программирование</b>.
                Скорее всего он не подойдет, если ваша цель это игры, видеомонтаж или дизайн.
              </p>

              <p style={styles.p}>
                Полностью этот сетап с нуля вряд ли кто-то будет повторять: скорее всего каждый возьмет только отдельные куски.
              </p>

              <p style={styles.p}>
                Этот текст написан человеком.
                ИИ использовался только для обучения и проверки на ошибки.
                Хотите, чтобы я переписал это в более дружелюбном стиле, или оставить как есть?
              </p>
						</category>

            <separator style={styles.separator}>
              <line style={styles.separator.line} />
              <caption style={styles.separator.caption}>Железо</caption>
              <line style={styles.separator.line} />
            </separator>

            <category style={styles.category}>
							<topper style={styles.topper}>Рабочий стол</topper>

              <p style={styles.p}>
                Стол у меня не обычный, а <clickable onClick={() => alert('TODO')} style={styles.clickable}>угловой</clickable>.
                У этого два главных преимущества:

                <ul style={styles.ul}>
                  <li>
                    <b style={styles.b}>Удобная позиция для локтей.</b>
                    Локтями очень удобно упираться в стол - они не висят никогда.
                  </li>
                  <li>
                    <b style={styles.b}>Больше пространства для мониторов.</b>
                    В работе я использую 5 мониторов; за обычным столом расположить их так же удобно не получилось бы.
                  </li>
                </ul>
              </p>

              <p style={styles.p}>
                Нормальных угловых столов на рынке я не нашел, поэтому купил два стола из <term style={styles.term}>IKEA</term> (запрещенная в РФ организация) и соединил их снизу <clickable onClick={() => alert('TODO')} style={styles.clickable}>пластинами</clickable>.
              </p>
              <p style={styles.p}>
                Главный недостаток: снизу постоянно мешает <clickable onClick={() => alert('TODO')} style={styles.clickable}>ножка стола</clickable>, но я к ней уже привык.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Мониторы</topper>

              <p style={styles.p}>
                Для меня важно, чтобы было много пространства для приложений.
                Я использую <clickable onClick={() => alert('TODO')} style={styles.clickable}>5 мониторов</clickable>: один основной (горизонтальный, 222 дюйма) и 4 дополнительных (вертикальных, 222 дюйма).
              </p>

              <p style={styles.p}>
                Сейчас найти маленькие мониторы проблематично, все гонятся за большими.
                Но по факту даже у вертикальных мониторов ширина составляет 1368 пикселей, а это самая популярная ширина на ноутбуках.
                Так что горизонтального пространства хватает для большинства приложений.
              </p>

              <p style={styles.p}>
                Все мониторы на кронштейнах и скреплены <clickable onClick={() => alert('TODO')} style={styles.clickable}>суперклеем с дверными петлями</clickable>, чтобы не было зазоров.
              </p>

              <p style={styles.p}>
                Каждое приложение я ментально закрепляю за своим монитором:

                <ul style={styles.ul}>
                  <li>Слева-слева: <a href="https://www.warp.dev">Warp</a>.</li>
                  <li>Слева: <a href="https://www.chromium.org">Chromium</a> с открытым дебаггером.</li>
                  <li>Центр: <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> | <a href="https://www.google.com/chrome/">Chrome</a> | любое другое временное приложение.</li>
                  <li>Справа: <a href="https://claude.ai">Claude</a>.</li>
                  <li>Справа-справа: <a href="https://www.thunderbird.net">Thunderbird</a> | <a href="https://telegram.org">Telegram</a> | <a href="https://slack.com">Slack</a>.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Больше пяти мониторов уже непрактично.
                Если ставить по бокам - они будут слишком далеко, а два ряда - плохая идея: смотреть неудобно физиологически.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Клавиатура</topper>

              <p style={styles.p}>
                Клавиатура у меня не обычная, а <a href="https://kinesis-ergo.com/shop/advantage2">Kinesis Advantage 2</a>.
                Словами не описать, насколько я ее обожаю.
                Она <b style={styles.b}>намного</b> удобнее обычных клавиатур.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение модификаторов.</b>
                На обычных клавиатурах большим пальцем жмешь только пробел, а модификаторы - мизинцем.
                На моей клавиатуре пальцами я могу нажать 12 клавиш, по 6 на каждый большой палец: <term style={styles.term}>PageUp</term> <term style={styles.term}>PageDown</term> <term style={styles.term}>Backspace</term> <term style={styles.term}>Delete</term> <term style={styles.term}>Home</term> <term style={styles.term}>End</term> <term style={styles.term}>Space</term> <term style={styles.term}>Enter</term> <term style={styles.term}>Alt</term> <term style={styles.term}>Ctrl</term> <term style={styles.term}>Alt+Shift</term> <term style={styles.term}>Alt+Ctrl</term> <term style={styles.term}>Alt+Ctrl+Shift</term>.
                Последние 3 настроены через макрос, зажимается одна клавиша и равносильно нажатию сразу нескольких модификаторов.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение стрелок.</b>
                Стрелки нажимаются указательным и средним пальцем <clickable style={styles.clickable}>без переноса руки</clickable>.
                На обычных клавиатурах для навигации приходится двигать кисть.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобная позиция для локтей.</b>
                Локти разведены дальше, вместе с угловым столом это очень удобная позиция.
              </p>

              <p style={styles.p}>
                Благодаря углублениям на клавиатуре ладонь лежит удобнее с физиологической точки зрения.
              </p>

              <p style={styles.p}>
                Но к этой клавиатуре нужно привыкнуть - у меня ушло примерно пару месяцев.
                Первое время было очень неудобно, но оно того стоило.
                Для игр приходится переопределять <term style={styles.term}>WASD</term> на <term style={styles.term}>ESDF</term>.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Мышка</topper>

              <p style={styles.p}>
                Первое требование к мышке это форма.
                Форма должна быть симметричная (так удобнее перетаскивать ее).
                Размер должен быть такой, что бы можно было упереться ладонью в ковер и доводить курсор до нужно точки пальцами.
              </p>

              <p style={styles.p}>
                Категорически не подходят мышки, где вся ладонь должна лежать на мышке.
                В этом случае доводить курсор доводить пальцами не получается и из‑за этого заметно падает точность.
              </p>

              <p style={styles.p}>
                Второе требование - это что бы мышка беспроводной (вообще чем меньше проводов - тем лучше).
              </p>

              <p style={styles.p}>
                Третье требование  - наличие боковых кнопок (я программирую их на копирование и вставку через <a href="https://www.autohotkey.com">AutoHotkey</a>).
              </p>

              <p style={styles.p}>
                Под эти требования подходит много мышек, я выбрал <a href="https://www.logitechg.com/en-us/shop/p/pro-x2-superlight-wireless-mouse">Logitech G Pro X Superlight 2</a>.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Стул</topper>

              <p style={styles.p}>
                Казалось бы стул это мелочь, но я провожу сидя за компьютером в день по 8 часов.
                И удобство стула для меня намного важнее, чем количество ядер у процессора.
              </p>

              <p style={styles.p}>
                Первое требование к стулу - что бы не было подлокотников (или их можно было убрать).
                Логти у меня всегда на столе.
              </p>

              <p style={styles.p}>
                Второе это что бы можно было сидеть в позе <clickable onClick={() => alert('TODO')} style={styles.clickable}>наездника</clickable>.
                Мне удобно время от времени менять позы.
                По этой причине я отказался от хайпового <a href="https://www.hermanmiller.com">Herman Miller Aeron</a>.
              </p>

              <p style={styles.p}>
                Остановился на одном из самых популярных оффисных стульев в мире - <a href="https://ikeamega.ru/officechairs/tproduct/951877794252-markus-markus-ofisnoe-kreslo-vissle-svet" style={styles.term}>IKEA Marcus</a>.
                Подлокотники убираются, низкая посадка, можно сидеть в позе наездника.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Очки</topper>

              <p style={styles.p}>
                Весьма странно, упоминать этот пункт в разделе про железо, но мой сетап заточен под программирование.
                Так что если вы хотите прокачать рабочее место - уделите внимание очкам <b style={styles.b}>даже если</b> на зрение не жалуетесь.
              </p>

              <p style={styles.p}>
                Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, но в очках читать текст на экране <b style={styles.b}>заметно удобнее</b>.
                Возможно, у вас будет так же.
              </p>

              <p style={styles.p}>
                Многие концентрируются на характеристиках видеокарты и мониторах, но забывают про то, что очки могут улучшить изображение намного сильнее.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Железо</topper>

              <p style={styles.p}>
                Железо я намеренно оставляю в самом конце: в программировании редко когда оно является бутылочным горлышком.
                Любой из пунктов выше дает мне больше реального удобства, чем топовая видеокарта или процессор.
                Тем не менее железо у меня самое последнее, просто потому что хочется что бы все было идеально.
              </p>

              <p style={styles.p}>
                Вот конкретные модели:

                <ul style={styles.ul}>
                  <li>Видеокарта: <a href="TODO">GeForce RTX 5090</a>. В плане видео-карт <term style={styles.term}>AMD</term> даже близко не стоит с <term style={styles.term}>Nvidia</term>. Использую для запуска локальных нейросетей.</li>
                  <li>Процессор: <a href="TODO">Core Ultra 9 285k</a>. А вот процессоры у <term style={styles.term}>AMD</term> лучше чем у <term style={styles.term}>Intel</term>. Влияет на скорость работы приложений и локальных нейросетей (если в памяти видеокарты вся нейросеть не помещается).</li>
                  <li>Жесткий диск: <a href="TODO">Samsung SSD 9100 Pro</a>. Samsung безоговорочный лидер в плане жестких дисков.</li>
                  <li>Оперативка: <a href="TODO">G.Skill Trident Z5 CK</a> x2. </li>
                  <li>Материнская плата: <a href="https://www.asus.com/motherboards-components/motherboards/prime/prime-b850m-k/">Asus Prime B850M-K</a>. Самое главное, что бы материнская плата поддерживала все выбранное железо. </li>
                  <li>Наушники: <a href="https://us.sennheiser-hearing.com/products/momentum-5-wireless?variant=62714248495475">Sennhizer Momentum 4 Wireless</a>. Самый главный критерий - что бы были беспроводными и долго держали заряд.</li>
                  <li>Колонка: <a href="https://www.harmankardon.com/HK+GO+PLAY.html">Harman Kardon</a>. Использую исключительно для белого шума во время работы. Для фильмов, музыки и созвонов я использую наушники.</li>
                  <li>Корпус: <a href="https://www.asus.com/motherboards-components/cases/prime/asus-prime-ap303-mesh-panel">The ASUS Prime AP303</a>. Корпус, как корпус, тут нет комментариев.</li>
                </ul>
              </p>


            </category>

            <separator style={styles.separator}>
              <line style={styles.separator.line} />
              <caption style={styles.separator.caption}>Софт</caption>
              <line style={styles.separator.line} />
            </separator>

						<category style={styles.category}>
							<topper style={styles.topper}>Операционная система</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Тут есть 4 варианта:
                  <a href="https://www.microsoft.com/windows">Windows</a>,
                  <a style={{marginLeft: 5}} href="https://www.apple.com/macos">MacOS</a>,
                  <a style={{marginLeft: 5}} href="https://ubuntu.com">Ubuntu</a>.
                </p>

                <p style={styles.p}>
                  Вы можете подумать, что раз я такой техногик, то у меня какой-нибудь <term style={styles.term}>Linux</term> - но нет.
                  Я абсолютный фанат <a href="https://www.microsoft.com/windows">Windows</a> на десктопе и считаю, что ни <a href="https://www.apple.com/macos">MacOS</a>, ни <a href="https://ubuntu.com">Ubuntu</a> даже близко не сравнятся с ней по удобству.
                </p>
                <p style={styles.p}>
                  На <a href="https://www.microsoft.com/windows">Windows</a> я очень активно использую <a href="https://www.autohotkey.com">AutoHotkey</a> - аналогов нет ни на <a href="https://www.apple.com/macos">MacOS</a>, ни на <a href="https://ubuntu.com">Ubuntu</a>.
                  Одного этого мне достаточно, чтобы не смотреть в их сторону.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Настройка <a href="https://www.microsoft.com/windows">Windows</a> у меня в три этапа:
                  <ul style={styles.ul}>
                    <li><clickable onClick={() => setModal("boilerplate")} style={styles.clickable}>Удаление бойлерплейта</clickable></li>
                    <li><clickable onClick={() => setModal("components")} style={styles.clickable}>Отключение компонентов</clickable></li>
                    <li><clickable onClick={() => setModal("settings")} style={styles.clickable}>Обычные настройки</clickable></li>
                  </ul>
                </p>
              </section>

              <p style={styles.p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений.

                <ul style={styles.ul}>
                  <li>Winget</li>
                  <li>Windows Store</li>
                  <li>PWA приложения. Это браузерные приложения, которые можно устанавливать как десктопные.</li>
                  <li>Предустановленны приложения.</li>
                  <li>Приложения которые скачиваются с веб-сайтов.</li>
                  <li>Браузер (что по сути то же платформа для приложений)</li>
                </ul>
              </p>

              <p style={styles.p}>
                Что бы все это как-то унифицировать, я придерживаюсь определенного алгоритма по установке приложений.

                <ul style={styles.ul}>
                  <li>Сначала пытаюсь поставить приложение через <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a>.</li>
                  <li>Если в <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a> приложения нет и это вебсайт то создаю ярлык на рабочем столе через свой скрипт install-webapp.</li>
                  <li>Если в <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a> приложения нет и это не выбсайт то гружу приложения с официального сайта.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Магазин приложений не использую вообще.
                Не все веб-приложения можно установить как <term style={styles.term}>PWA</term> приложение, но создать ярлык можно для любого веб-приложения, поэтому я пользуюсь только функционалом создания ярлыков.
                Ярлыки создаю только для часто используемых веб-приложений, если я использую веб-приложение раз в месяц, то я просто открываю его в браузере.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>AutoHotkey</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://www.autohotkey.com">AutoHotkey</a> - язык программирования специально заточенный под создание своих горячих клавиш на <a href="TODO">Windows</a>.
                  Ниже - то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Макросы.</b>
                  Вот вам <clickable style={styles.clickable}>картинка</clickable> для наглядности где какие клавиши расположены.

                  <ul>
                    <li>Caps Lock = CTRL</li>
                    <li>Win = CTRL-SHIFT</li>
                    <li>Right Ctrl = ALT-SHIFT</li>
                    <li>Left ctrl = ALT-CTRL-SHIFT</li>
                    <li>/ = свитчинг (о нем дальше)</li>
                    <li>Insert = Shift-Tab</li>
                  </ul>
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Унификация.</b>
                  Зафиксированы те символы которые печатаются по <term style={styles.term}>Shift-[0-9]</term>.
                  Сделал так, что бы печатался один и тот же символ вне зависимости от раскладки.
                  Так же часто используемые символы перенесены на <term style={styles.term}>Ctrl-[0-9]</term> (это слэши и все виды скобочек).
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Клавиатурные жесты.</b>
                  Сейчас по умолчанию долгом зажатии клавиши символ печатается много раз одна и та же буква - это поведение совершенно бесполезно.
                  Я сделал так, что при долгом зажатии запускается определенное приложение.
                  Это поведение раз в 100 полезнее, чем печать большого количества одного и того же символа.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Свитчинг.</b>
                  При нажатии на обратный слэш, происходит переключение фокуса между текущим и предыдущим приложением.
                  Это супер-удобная клавиша для нажатия, но на которую печатается символ, который требуется один раз в неделю.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Селектор</b>
                  Стандартный альтаб меня не устраивал.
                  На нем можно переключаться только между запущенными приложениями, но нельзя запускать новые приложения.
                  Так же в нем нельзя фокусировать приложение вводя его имя.
                </p>

                <p style={styles.p}>
                  Для каждого установленного приложения (как веб так и нативного) я создаю ярлык на рабочем столе.
                  При долгом нажатии на клавишу <term style={styles.term}>a</term> запускается селектор в котором все ярлыки сортируются с помощью <a href="">fzf</a>.
                </p>

                <p style={styles.p}>
                  Так же добавлена проверка, если приложение не запущено, то оно запускается, если запущено, то фокусируется.
                  То есть фокусировка и запуск приложения происходит через один и тот же интерфейс.

                  <clickable onClick={() => alert('TODO')} style={{...styles.clickable, marginLeft: 5}}>Вот как это работает</clickable>.
                </p>

                <p style={styles.p}>
                  В итоге если приложению назначен клавиатурный жест - я запускаю его через него.
                  Если нет - то использую свой селектор.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Смена раскладки.</b>
                  Раскладку нужно менять по 100 раз на дню.
                  Ни <a href="https://yandex.ru/soft/punto/">Punto Switcher</a>, ни <a href="https://caramba-switcher.com">Caramba Switcher</a> мне не зашли (работают в 90% случаев, но отавшиеся 10% все портят).
                </p>oo

                <p style={styles.p}>
                  Я заметил, что проблемы с раскладкой возникают только в момент начала печати.
                  В моем скрипте написана логика, что при смене фокуса язык приложения сбрасывается на значение по умолчанию (у каждого приложения оно свое).
                </p>

                <p style={styles.p}>
                  Таким образом легко нарабатывается навык при котором запоминается начальная раскладка каждого приложения.
                  Когда текст уже печатается то раскладка удерживается в голове, и переключать ее не вызывает проблем.
                  Во время печати, я управляю раскладкой вручную через одиночное нажатие на правый <term style={styles.term}>Shift</term> без модификаторов.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Мышинные кнопки.</b>
                  Одна мышинная кнопка на копирование, вторая на вставку, нажатие на колесико - Enter.
                </p>
              </section>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Браузер</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Браузеры с фокусом на приватность сразу идут лесом (<a href="https://duckduckgo.com/app">Duckduckgo</a>, <a href="https://brave.com">Brave</a>, <a href="https://mullvad.net/en/browser">Mullvad</a>).
                  Как показывает практика, браузеры в своих попытках обеспечить приватность зачастую ломают функционал веб приложения.
                  Честное слово, мне абсолютно пофиг на то что веб-приложения мониторят мою активность и собирают аналитику.
                  Но мне не пофиг на то, когда веб-приложения ломаются.
                  Пускай собирают свою телеметрию, благодаря этому разработчики фиксят баги и делают продукт лучше.
                </p>

                <p style={styles.p}>
                  От <a href="https://www.mozilla.org/firefox/">Firefox</a> я отказался потому что мне не нравится его интерфейс.
                  В <a href="https://www.opera.com">Opera</a> много разного встроенного функционала, но который можно в <a href="https://www.google.com/chrome/">Chrome</a> реализовать через плагины.
                  Поэтому я остановился на <a href="https://www.google.com/chrome/">Chrome</a> для браузинга и <a href="https://www.chromium.org">Chromium</a> для разработки (им назначены разные горячие клавиши и они открываются на разных мониторах).
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Список плагинов:
                  <ul style={styles.ul}>
                    <li><a href="https://1password.com">1Password</a> - в браузере работает идеально.</li>
                    <li><a href="https://ublockorigin.com/">uBlock Origin</a> - заметно лучше <a href="https://adblockplus.org">AdBlock Plus</a> и <a href="https://getadblock.com">AdBlock</a>.</li>
                    <li><a href="https://claude.ai/">Claude</a> - можно общаться с Claude о содержимом на странице (требуется подписка).</li>
                    <li><a href="https://crxmouse.com/">CxMouse</a> - плагин для жестов. У меня настроено только четыре жеста. Влево / вправо - фокус левой / правой вкладки. Вниз - закрыть вкладку. Вверх - создать новую вкладку.</li>
                    <li><a href="https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn">Dont Close The Window with Last Tab</a> - блокирует закрытие окна при закрытии последней вкладки.</li>
                    <li><a href="https://www.i-dont-care-about-cookies.eu/">I dont care about cookies</a> - автоматически принимает все куки.</li>
                    <li><a href="https://phantom.com/">Phantom</a> - крипто-кошелек (использую только для стейблкойнов).</li>
                    <li><a href="https://returnyoutubedislike.com">Return Youtube Dislike</a> - возвращает количество дизлайков.</li>
                    <li><a href="https://chromewebstore.google.com/detail/no-new-tabs/gneobebnilffgkejpfhlgkmpkipgbcno?hl=en">No New Tabs</a> - запрещает браузеру создавать новые вкладки. Бесит когда веб-приложение сам создает новые вкладки, если я захочу открыть новую вкладку я сам это сделаю.</li>
                    <li><a href="https://tampermonkey.net">Tamper Monkey</a> - позволяет добавлять свой JS на страницу (добавляю фиксированные заголовки веб-сайтам, что бы фокусировать их через <a href="">AutoHotkey</a>).</li>
                  </ul>
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Вообще, мне не особо нравится сама концепция браузера - это платформа для запуска приложений.
                  Но операционная система это уже платформа для запуска приложений, а браузер еще одна внутри платформа внутри платформы.
                  Поэтому из сайтов, которыми часто пользуюсь я создаю десктопные ярлыки, которые запускают определенное веб-приложение, но без URL-бара и вкладок.
                </p>

                <p style={styles.p}>
                  Мой <a href="https://www.autohotkey.com">AutoHotkey</a> скрипт настроен так, что показывает позволяет запускать такие вебсайты так же как и обычные приложения.
                  По этому я впринципе не пользуюсь функционалом закладок в браузере.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Нейросеть</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Нейросети - совершили революцию, это глупо отрицать.
                  А в программировании он совершил революцию больше чем где-то бы то ни было еще.
                  И очень важно грамтно заинтегрировать нейросети в свой ежедневный рабочий процесс.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Первое что нужно, это выбрать правильную нейросить.
                  Я написал простенькое приложение, менеджер контактов, полностью своими руками без ИИ.
                  И потом я просил написать ИИ точно такое же приложение по бизнесс-логику, по тому описанию, которое я ей давал.
                  Для меня это намного более релевантный показатель, чем различные бенчмарки.
                </p>

                <p style={styles.p}>
                  Лучшей опцией оказался <a
                  href="https://claude.ai"
                >Claude</a> - у него особый фокус на программировании.
                  Очень хорошая интеграция с WebStorm и качественные плагин под <a
                  href=""
                >Chrome</a>.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Второе - это нужно настроить MCP-сервера.
                  Для тех кто не в курсе, MCP это протокол по которому в нейросети можно добавлять дополнительные данные, которыми она может пользоваться.
                  Вот список MCP‑серверов, которые подключаю.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Время от времени запускаю модели локально через <a href="https://lmstudio.ai">LM Studio</a> и <a href="https://ollama.com">Ollama</a>.
                  Как ни странно локальные модели показывают почти такие же результаты, как и облачные.
                  Возможно когда-нибудь полностью перейду на локальную модель.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Файловый менеджер</topper>

              <p style={styles.p}>Главные игроки: <a href="https://www.farmanager.com">Far Manager</a> (2 000), <a href="https://files.community">Files</a>, <a href="https://yazi-rs.github.io">Yazi</a> (32 000), <a href="https://www.ghisler.com">Total Commander</a>.</p>

              <p style={styles.p}>
                 Хайповый <a href="https://yazi-rs.github.io">Yazi</a> не двухпанельный, поэтому отпадает сразу.
              </p>
              <p style={styles.p}>
                <a href="https://www.farmanager.com">Far Manager</a> - двухпанельный, но по функционалу явно проигрывает <a href="https://www.ghisler.com">Total Commander</a>.
              </p>
              <p style={styles.p}>
                <a href="https://files.community">Files</a> - красивый интерфейс, но слишком казуальный и далеко не такой функциональный, как <a href="https://www.ghisler.com">Total Commander</a>.
              </p>
              <p style={styles.p}>
                У <a href="https://www.ghisler.com">Total Commander</a> интерфейс мог бы быть по лучше, но он двух-панельный, функциональный и позволяет гибко настраивать горячие клавиши.
              </p>
              <p style={styles.p}>
                В <a href="https://www.ghisler.com">Total Commander</a> включил темную тему, убрал лишний UI, поставил шрифт <a href="https://sourcefoundry.org/hack/">Hack</a>.
                Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                Вот как выглядит <clickable style={styles.clickable}>внешний вид</clickable> и вот мой <clickable style={styles.clickable}>конфиг</clickable>.
              </p>
            </category>

						<category style={styles.category}>
							<topper style={styles.topper}>Скриншоты</topper>

              <p style={styles.p}>
                Безоговорочный лидер - <a href="https://getsharex.com">ShareX</a>.
                Это не просто утилита для скриншотов: использую ее еще как пипетку, линейку и для записи видео.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Утилиты.</b>
                Глобальные функциональные клавиши назначены на стандартные инструменты.

                <ul style={styles.ul}>
                  <li><term style={styles.term}>F9</term> - скриншот</li>
                  <li><term style={styles.term}>F10</term> - скриншот и распознать текст</li>
                  <li><term style={styles.term}>F11</term> - записать гифку</li>
                  <li><term style={styles.term}>F12</term> - пипетка</li>
                  <li><term style={styles.term}>Print Screen</term> - линейка</li>
                  <li><term style={styles.term}>Scroll Lock</term> - скриншот со скроллом</li>
                  <li><term style={styles.term}>Pause Break</term> - мета-данные о файле</li>
                </ul>
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Терминал</topper>

              <p style={styles.p}>Варианты: стандартный виндовый, <a href="https://www.warp.dev">Warp</a>, <a href="https://wezfurlong.org/wezterm/">WezTerm</a>, <a href="https://sw.kovidgoyal.net/kitty/">kitty</a>.</p>

              <p style={styles.p}>
                По большому счету 80% взаимодействия - два действия:

                <ul style={styles.ul}>
                  <li>Поиск по истории</li>
                  <li>Копирование вывода</li>
                </ul>

                Оба в <a href="https://www.warp.dev">Warp</a> заметно удобнее.
                Сравните типичный вывод в обычном терминале и в <a href="https://www.warp.dev">Warp</a>.
              </p>

              <p style={styles.p}>
                При этом на кой черт в него запилили ИИ (сейчас его пилят куда ни попадя) и дерево проектов.
                Убрать бы весь этот функционал и сделать <a href="https://www.warp.dev">Warp</a> минималистичнее - было бы лучше.
                Я фанат минимализма, но функциональность все же важнее.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Локальный поисковик</topper>

              <p style={styles.p}>Либо <a href="https://www.voidtools.com">Everything</a>, либо <a href="https://omnisearch.ai">Omnisearch</a>.</p>

              <p style={styles.p}>
                <a href="https://omnisearch.ai">Omni</a> выглядит посовременнее - обычно софт, который появился позже, лучше.
                Но после ввода в поиск не работают стрелки (стрелки, Карл!) - настолько очевидный функционал.
                Сразу после установки удалил это говно.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>Текстовый редактор</topper>

              <p style={styles.p}>
                Выбирал между <a href="https://cursor.com">Cursor</a>, <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>, <a href="https://zed.dev">Zed</a> - явный фаворит <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
              </p>

              <p style={styles.p}>
                В <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> <b style={styles.b}>очень</b> много функционала, которым пользуюсь каждый день:
                <ul style={styles.ul}>
                  <li>Очень хорошая поддержка <a href="https://git-scm.com">Git</a></li>
                  <li>Последние открытые файлы (вкладки даже отключил)</li>
                  <li>Локальная история</li>
                  <li>Отдельные окна</li>
                  <li>Интенты</li>
                  <li>Предпросмотр файла в дереве</li>
                  <li>Скоупы (Frontend и Backend помечаю разными цветами)</li>
                  <li>Вкладки при поиске</li>
                  <li>Quicklists: LocalHistory, <a href="https://git-scm.com">Git</a>, <a href="https://github.com">GitHub</a></li>
                  <li>И еще <b style={styles.b}>очень много</b> других мелочей.</li>
                </ul>
              </p>

              <p style={styles.p}>
                В <a href="https://cursor.com">Cursor</a> не нравится, что он построен на веб‑технологиях.
                Понимаю: легкий сайт писать в браузере - ок. Но полноценную IDE на JavaScript?
              </p>

              <p style={styles.p}>
                Пытался перейти на <a href="https://zed.dev">Zed</a> - очень понравилось, насколько мало памяти он жрет (в 20 раз меньше).
                Но функциональность важнее минимализма, вернулся на <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
              </p>

              <p style={styles.p}>
                Вы будете смеяться, но вкладки я отключил.
                Вместо них - Recent Files.
              </p>

              <ul style={styles.ul}>
                <li>
                  Самый большой минус: <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> жрет гигантское количество оперативки по сравнению с <a href="https://zed.dev">Zed</a>.
                  Разница в 20 раз.
                  Но оперативка и скорость запуска - не бутылочное горлышко: приятно, когда IDE стартует за секунду, а не за 10, но не критично.
                  При этом поддержка нейросетей ничуть не хуже, чем в хайповом <a href="https://cursor.com">Cursor</a>.
                </li>
              </ul>

              <p style={styles.p}>
                При этом в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> мне все равно очень не хватает функционала.
              </p>

              <p style={styles.p}>
                Вот мой конфиг - можете импортировать.
              </p>

              <p style={styles.p}>
                Вот мои настройки <clickable onClick={() => alert('TODO')} style={styles.clickable}>WebStorm</clickable>.
              </p>

              <p style={styles.p}>
                Список плагинов: <a href="https://plugins.jetbrains.com/plugin/22072-kursor">Kursor</a> для подсветки.
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
                Поэтому смотрел на <a href="https://www.thunderbird.net">Thunderbird</a>.
              </p>

              <p style={styles.p}>
                Публичный домен как‑то несолидно, нужен сервер с кастомными доменами.
                Выбор пал на <a href="https://purelymail.com">PurelyMail</a> - самый дешевый почтовый сервер (10$ в год).
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

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
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
                    <a href="https://www.speedtest.net">e-katalog.ua</a>
                    - замер скорости интернета
                  </li>
                  <li>
                    <a href="https://github.com/rcmaehl/MSEdgeRedirect">MSEdgeRedirect</a>
                    - чтобы <a href="https://www.microsoft.com/windows">Windows</a> открывала <a href="https://www.google.com/chrome/">Chrome</a> вместо <a href="https://www.microsoft.com/edge">Edge</a>
                  </li>

                  <li>
                    <a href="https://github.com/rcmaehl/MSEdgeRedirect">e-katalog.us</a>
                    - лучший вебсайт по выбору железу, намного лучше <a href="TODO">dns-shop.ru</a> / <a href="pcpartpicker.com">PCPartPicker</a> / <a href="newegg.com">newegg.com</a>.
                  </li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Компиляторы и рантаймы - ставлю все, авось пригодится.
                <ul style={styles.ul}>
                  <li><a href="https://github.com/PowerShell/PowerShell">PowerShell 7</a> - последняя версия (по умолчанию ставится старая)</li>
                  <li><a href="https://nodejs.org">Node</a> - далеко не самый лучший язык, но его главное преимущество в том, что позволяет писать <term style={styles.term}>Frontend</term> и <term style={styles.term}>Backend</term> на одном и том же языке.</li>
                  <li><a href="https://deno.com">Deno</a> - более продвинутый форк <a href="https://nodejs.org">Node</a>.</li>
                  <li><a href="https://www.rust-lang.org">Rust</a> - лучший язык программирования на текущий момент по моему мнению.</li>
                  <li><a href="https://go.dev">Go</a> - из-за своей простоты лучше всего подходит для вайбкодинга.</li>
                  <li><a href="https://www.python.org">Python</a> - не особо часто использую, но требуется для некоторых инструментов..</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Банковские приложения
                <ul style={styles.ul}>
                  <li><a href="https://alfabank.ru">alfabank.ru</a> - так же крупный банк и маловероятно что с ним что-то случится, но кто знает.</li>
                  <li><a href="https://www.sberbank.ru">sberbank.ru</a> - пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Магазины
                <ul style={styles.ul}>
                  <li><a href="https://aliexpress.com">aliexpress.com</a> - совершенно ужасный интерфейс, но там можно купить вообще все и дешевле чем на других маркетпелйсах, долгая доставка.</li>
                  <li><a href="https://wildberries.ru">wildberries.ru</a> - использую как замену aliexpress, если нужно что-то купить и нет времени ждать доставку из китая.</li>
                  <li><a href="https://ozon.ru">ozon.ru</a> - использую для доставки продуктов.</li>
                  <li><a href="https://ebay.com">ebay.com</a> / <a href="https://avito.com">avito.com</a>  - использую если нужно купить что‑то с рук.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Мессенджеры
                <ul style={styles.ul}>
                  <li><a href="https://telegram.org">Telegram</a> - основной мессенджер.</li>
                  <li><a href="https://whatsapp.com">WhatsApp</a> - для общения с родственниками.</li>
                  <li><a href="https://discord.com">Discord</a> - игровой мессенджер.</li>
                  <li><a href="https://slack.com">Slack</a> - рабочий мессенджер.</li>
                  <li><a href="https://zoom.us">Zoom</a> - видеосвязь.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Развлечения:
                <ul style={styles.ul}>
                  <li><a href="https://youtube.com">YouTube</a> - больше всего сижу тут.</li>
                  <li><a href="https://reddit.com">Reddit</a> - основной развлекательный форум.</li>
                  <li><a href="https://x.com">Twitter</a> - самая главная новостная соц сеть для новостей (нужно только подписаться на правильных людей).</li>
                  <li><a href="https://threads.net">Threads</a> - на мой взгляд круче чем <a href="https://x.com">Twitter</a> по интерфейсу.</li>
                  <li><a href="https://bash.im">Bash</a> - старый добрый цитатник.</li>
                  <li><a href="https://habr.com">Habr</a> - техностатьи.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Форумы: по сути их сейчас заменили нейросети, но иногда все же приходится заходить.
                <ul style={styles.ul}>
                  <li><a href="https://stackoverflow.com">stackoverflow.com</a> - вопросы по программированию.</li>
                  <li><a href="https://superuser.com">superuser.com</a> - вопросы продвинутых пользователей.</li>
                  <li><a href="https://serverfault.com">serverfault.com</a> - вопросы по администрированию.</li>
                  <li><a href="https://security.stackexchange.com">security.stackexchange.com</a> - вопросы по безопасности.</li>
                  <li><a href="https://math.stackexchange.com">math.stackexchange.com</a> - вопросы по математике.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Инструменты для программирования
                <ul style={styles.ul}>
                  <li><a href="https://git-scm.com">Git</a> - как по мне <a style={styles.term}>Mercurial</a> лучше, но гит это стандарт де-факто.</li>
                  <li><a href="https://github.com">GitHub</a> - использую что бы мониторить самые последние и свежие инструменты.</li>
                  <li><a href="https://www.virtualbox.org">VirtualBox</a> - в основном использую что бы запускать софт которому не доверяю.</li>
                  <li><a href="https://www.cloudflare.com">Cloudflare</a> - DNS-хостинг, анти-DDoS и публичный кэш.</li>
                  <li><a href="https://github.com/FiloSottile/mkcert">mkcert</a> - утилита для управления сертификатами.</li>
                  <li><a href="https://caddyserver.com">Caddy</a> - более современный аналог <a href="https://nginx.org">nginx</a>.</li>
                  <li><a href="https://www.postgresql.org">PostgreSQL</a> - топовая SQL-БД.</li>
                  <li><a href="https://www.mongodb.com">MongoDB</a> - топовая NoSQL-БД.</li>
                  <li><a href="https://www.wireshark.org">Wireshark</a> - мониторинг сетевых пакетов, редко требуется, но пусть будет.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.
                <ul style={styles.ul}>
                  <li><a href="https://sourcefoundry.org/hack/">Hack</a> - лучший шрифт для программирования (терминал и редактор).</li>
                  <li><a href="https://fonts.google.com/specimen/Montserrat">Montserrat</a> - самый нейтральный шрифт.</li>
                  <li><a href="https://fonts.google.com/specimen/Play">Play</a> - красивые цифры.</li>
                  <li><a href="https://www.nerdfonts.com">Nerd Fonts</a> - иконки для терминала.</li>
                </ul>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                Остальное
                <ul style={styles.ul}>
                  <li><a href="https://www.microsoft.com/software-download/windows11">MediaCreationTool</a> - создание установочных флешек.</li>
                  <li><a href="https://veracrypt.fr">VeraCrypt</a> - лучшее решение для шифрования диска.</li>
                  <li><a href="https://www.qbittorrent.org">qBittorrent</a> - торренты.</li>
                  <li><a href="https://2gis.ru">2GIS</a> - лучшие карты.</li>
                  <li><a href="https://www.gosuslugi.ru">gosuslugi.ru</a> - приложение от хайпового стартапа.</li>
                  <li><a href="https://www.tradingview.com">TradingView</a> - мониторинг акций.</li>
                  <li><a href="https://www.videolan.org">VLC</a> - старый, но лучший видеоплеер.</li>
                </ul>
              </section>
            </category>

            <separator style={styles.separator}>
              <line style={styles.separator.line} />
              <caption style={styles.separator.caption}>Заключение</caption>
              <line style={styles.separator.line} />
            </separator>

            <category style={styles.category}>
							<topper style={styles.topper}>Что сюда не попало</topper>

              <p style={styles.p}>
                Популярные инструменты, которым я не нашел практического применения.
                Возможно, кому‑то они будут полезны.
              </p>

              <p style={styles.p}>
                <a href="https://github.com/microsoft/PowerToys">PowerToys</a> - расхайпленный проект на 100 000 звезд на <a href="https://github.com">GitHub</a>, но ни одну утилиту из него я так и не встроил в свой сетап.
              </p>
              <p style={styles.p}>
                <a href="https://github.com/ArcadeRenegade/SidebarDiagnostics">SideBar</a> - сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.
              </p>
              <p style={styles.p}>
                <a href="https://github.com/tw93/Pake">Pake</a> - позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Заключение</topper>

              <p style={styles.p}>
                Многие концентрируются на процессоре и видеокарте, но на них легко сэкономить.
                Честно говоря, обновление процессора даже близко не дает столько же удобства, сколько стол, стул, мышка или очки - не говоря уже о мониторах.
              </p>

              <p style={styles.p}>
                Не злитесь, если я выбрал не ту технологию, которая нравится вам: это мой вкус, я его никому не навязываю.
                Более того, если где‑то несправедливо засрал технологию, которая вам близка - открыт к переубеждению.
              </p>
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