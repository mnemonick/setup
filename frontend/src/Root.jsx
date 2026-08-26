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
                  <li>Слева: <a href="https://www.chromium.org">Chromium</a> для разработки с открытым дебаггером.</li>
                  <li>Центр: <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> | <a href="https://www.google.com/chrome/">Chrome</a> | любое другое временное приложение.</li>
                  <li>Справа: <a href="https://claude.ai">Claude</a>.</li>
                  <li>Справа-справа: мессенджеры - <a href="https://www.thunderbird.net">Thunderbird</a>, <a href="https://telegram.org">Telegram</a>, <a href="https://slack.com">Slack</a>.</li>
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
                Словами не описать, насколько я ее обожаю.
                Она <b style={styles.b}>намного</b> удобнее обычных клавиатур.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение модификаторов.</b>
                На обычных клавиатурах большим пальцем жмешь только пробел, а модификаторы - мизинцем.
                На моей клавиатуре пальцами я могу нажать 12 клавиш, по 6 на каждый большой палец:
                <ul style={styles.ul}>
                  <li><term style={styles.term}>PAGE_UP</term></li>
                  <li><term style={styles.term}>PAGE_DOWN</term></li>
                  <li><term style={styles.term}>BACKSPACE</term></li>
                  <li><term style={styles.term}>DELETE</term></li>
                  <li><term style={styles.term}>HOME</term></li>
                  <li><term style={styles.term}>END</term></li>
                  <li><term style={styles.term}>SPACE</term></li>
                  <li><term style={styles.term}>ENTER</term></li>
                  <li><term style={styles.term}>ALT</term></li>
                  <li><term style={styles.term}>CTRL</term></li>
                  <li><term style={styles.term}>ALT+SHIFT</term> (через макрос)</li>
                  <li><term style={styles.term}>ALT+CTRL</term> (через макрос)</li>
                  <li><term style={styles.term}>ALT+CTRL+SHIFT</term> (через макрос)</li>
                </ul>
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобное расположение стрелок.</b>
                Стрелки нажимаются указательным и средним пальцем без переноса руки.
                На обычных клавиатурах для навигации приходится двигать кисть.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Удобная позиция для локтей.</b>
                Локти разведены дальше, вместе с угловым столом это очень удобная позиция.
              </p>

              <p style={styles.p}>
                Благодаря углублениям ладонь на клавиатуре лежит удобнее с физиологической точки зрения.
              </p>

              <p style={styles.p}>
                К этой клавиатуре нужно привыкнуть - у меня ушло примерно пару месяцев.
                Первое время было очень неудобно, но оно того стоило.
                Для игр приходится переопределять <term style={styles.term}>WASD</term> на <term style={styles.term}>ESDF</term>.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Мышка</topper>

              <p style={styles.p}>
                Есть три типа хвата:
                <ul style={styles.ul}>
                  <li><term style={styles.term}>Palm</term> - ладонь полностью на мышке.</li>
                  <li><term style={styles.term}>Fingertip</term> - мышку держат пальцами.</li>
                  <li><term style={styles.term}>Claw</term> - часть ладони на мышке, часть на коврике (среднее между <term style={styles.term}>Palm</term> и <term style={styles.term}>Fingertip</term>).</li>
                </ul>

              </p>
              <p style={styles.p}>
                Для меня <b>очень</b> важно, чтобы хват был именно <term style={styles.term}>Claw</term>, при нем можно доводить курсор пальцами, упираясь основанием ладони в коврик.
                При <term style={styles.term}>Palm</term> - хвате вся ладонь лежит на мышке, упереться в коврик не получается - из‑за этого заметно падает точность.
              </p>

              <p style={styles.p}>
                Я вообще не понимаю, как можно пользоваться мышкой с <term style={styles.term}>Palm</term> хватом, хотя, может, это дело привычки.
              </p>

              <p style={styles.p}>
                Для меня важно, чтобы были сразу два механизма скролла:
                <ul style={styles.ul}>
                  <li><term style={styles.term}>Тактильный скролл</term> - классика с четкими щелчками.</li>
                  <li><term style={styles.term}>Свободный скролл</term> - колесико крутится без сопротивления и щелчков.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Мышка обязательно должна быть беспроводной (чем меньше проводов - тем лучше).
              </p>

              <p style={styles.p}>
                Нужны кнопки влево‑вправо на колесике (я программирую их на копирование и вставку через <a href="https://www.autohotkey.com">AutoHotkey</a>).
              </p>

              <p style={styles.p}>
                Что еще пробовал:
                <ul style={styles.ul}>
                  <li>*** с 16 (!) - 16 кнопок, но по факту мне нужно только 3, копирование, вставка, Enter.</li>
                  <li>Десктопный тачпад - значительно менее удобен чем мышка.</li>
                  <li>Планшет для рисования - думал, что будет удобнее, так как ручка очень физиологична, но на практике мышка удобнее.</li>
                </ul>
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Стул</topper>

              <p style={styles.p}>
                Пробовал распиаренный <a href="https://www.hermanmiller.com">Herman Miller</a>, который стоит как самолет, но у него минимальная высота 50 см, а мне нужно именно 40 см.

                На <a href="https://www.hermanmiller.com">Herman Miller</a> это очень неудобно.
              </p>

              <p style={styles.p}>
                В итоге остановился на обычном <clickable onClick={() => alert('TODO')} style={styles.clickable}>стуле</clickable> из <term style={styles.term}>IKEA</term> за 100 руб.
                Если открутить подлокотники (они не нужны: локтями упираемся в стол), он идеально помещается под мои столы.
                Так же на нем можно сидеть в позе <clickable onClick={() => alert('TODO')} style={styles.clickable}>наездника</clickable>.
                Врачи говорят что это полезно, но а просто удобно время от времени менять позу.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Очки</topper>

              <p style={styles.p}>
                Я, конечно, не врач, но если хотите прокачать рабочее место - уделите внимание очкам <b style={styles.b}>даже если</b> на зрение не жалуетесь.
                Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, но в очках читать текст на экране <b style={styles.b}>заметно удобнее</b>.
                Возможно, у вас будет так же.
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Железо</topper>

              <p style={styles.p}>
                Железо я намеренно оставляю в самом конце: в программировании редко когда именно оно - бутылочное горлышко.
                Любой из пунктов выше дает мне больше реального удобства, чем топовая видеокарта или процессор.
                Тем не менее железо у меня топовое, иногда играю в игры, иногда локально запускаю нейросети.
              </p>

              <p style={styles.p}>
                Вот конкретные модели:

                <ul style={styles.ul}>
                  <li>Видеокарта: <a href="TODO">GeForce RTX 5090</a>. В плане видео-карт AMD даже близко не стоит с <term style={styles.term}>Nvidia</term>.</li>
                  <li>Процессор: <a href="TODO">Core Ultra 9 285k</a>. А вот процессоры у AMD получше чем у <term style={styles.term}>Intel</term>.</li>
                  <li>Жесткий диск: <a href="TODO">Samsung SSD 9100 Pro</a>. Самсунги безоговорочный лидер в плане жестких дисков.</li>
                  <li>Оперативка: <a href="TODO">G.Skill Trident Z5 CK</a> x2.</li>
                  <li>Материнка: TODO.</li>
                  <li>Колонка: TODO.</li>
                  <li>Корпус: TODO.</li>
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

              <p style={styles.p}>
                Тут есть 4 варианта:
                <a href="https://www.microsoft.com/windows">Windows</a>,
                <a style={{marginLeft: 5}} href="https://www.apple.com/macos">MacOS</a>,
                <a style={{marginLeft: 5}} href="https://ubuntu.com">Ubuntu</a> и
                <a style={{marginLeft: 5}} href="https://www.freebsd.org">FreeBSD</a>.
              </p>

              <p style={styles.p}>
                Вы можете подумать, что раз я такой техногик, то у меня какой‑нибудь <a href="https://ubuntu.com">Ubuntu</a> - но нет.
                Я абсолютный фанат <a href="https://www.microsoft.com/windows">Windows</a> на десктопе и считаю, что ни <a href="https://www.apple.com/macos">MacOS</a>, ни <a href="https://ubuntu.com">Ubuntu</a> даже близко не сравнятся с ней по удобству.
              </p>
              <p style={styles.p}>
                На <term style={styles.term}>MacOS</term> совершенно неудобная система управления окнами.
                А это по сути главная функция операционной системы.
                Создаются какие‑то воркспейсы, неудобные переключения.
              </p>
              <p style={styles.p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> я очень активно использую <a href="https://www.autohotkey.com">AutoHotkey</a> - аналогов нет ни на <a href="https://www.apple.com/macos">MacOS</a>, ни на <a href="https://ubuntu.com">Ubuntu</a>.
                Одного этого мне достаточно, чтобы не смотреть в их сторону.
              </p>
              <p style={styles.p}>
                <a href="https://www.freebsd.org">FreeBSD</a>, на мой взгляд, намного круче <a href="https://ubuntu.com">Ubuntu</a>, но только для сервера.
                Я не настолько мазохист, чтобы ставить его на рабочий компьютер.
              </p>

              <p style={styles.p}>
                Настройка <a href="https://www.microsoft.com/windows">Windows</a> у меня в три этапа:
                <ul style={styles.ui}>
                  <li><clickable onClick={() => setModal("boilerplate")} style={styles.clickable}>Удаление бойлерплейта</clickable></li>
                  <li><clickable onClick={() => setModal("components")} style={styles.clickable}>Отключение компонентов</clickable></li>
                  <li><clickable onClick={() => setModal("settings")} style={styles.clickable}>Обычные настройки</clickable></li>
                </ul>
              </p>

              <p style={styles.p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений.

                Алгоритм выбора у меня такой.
                Все стараюсь ставить через <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a>, либо - если это часто используемое браузерное приложение - на десктопе создаю <term style={styles.term}>ярлык</term>.
                Редко используемые сайты открываю в браузере.
                <a href="https://apps.microsoft.com">Microsoft Store</a> стараюсь не использовать вообще.
              </p>
						</category>

						<category style={styles.category}>
							<topper style={styles.topper}>AutoHotkey</topper>

              <p style={styles.p}>
                <a href="https://www.autohotkey.com">AutoHotkey</a> - язык программирования специально заточенный под создание своих горячих клавиш.
                Ниже - то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Смена фокуса.</b>
                Смену фокуса я полностью переделал.
                В стандартном альтабе мне не нравится то, что нельзя напечатать название приложение что бы его сфокусировать.
                Плюс так же я добавил проверку, если приложение не запущено, то оно запускается, если запущено, то фокусируется.
                <clickable onClick={() => alert('TODO')} style={{...styles.clickable, marginLeft: 5}}>Вот как это работает</clickable>
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Клавиатурные жесты.</b>
                Сейчас при долгом зажатии клавиши печатается много раз одна и та же буква - это поведение совершенно бесполезно.
                Я сделал так, что при долгом зажатии запускается ярлык определенное приложение.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Смена раскладки.</b>
                Мне нужно менять огромное количество раз на дню.
                Ни <a href="https://yandex.ru/soft/punto/">Punto Switcher</a>, ни <a href="https://caramba-switcher.com">Caramba Switcher</a> мне не зашли (работают в 80% случаев, но отавшиеся 20% все портят).
                Что сделал я: при смене фокуса язык приложения сбрасывается на значение по умолчанию, значение по умолчанию указывается на ярлыке приложения.
                Во время печати, языком я управляю вручную через правый <term style={styles.term}>Shift</term>.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Колесико.</b>
                Влево - копирование, вправо - вставка, нажатие - Enter.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Унификация.</b>
                Бесит, что на русской и английской раскладках спецсимволы печатаются по‑разному.
              </p>
						</category>

            <category style={styles.category}>
              <topper style={styles.topper}>Браузер</topper>

              <p style={styles.p}>
                Браузеры с фокусом на приватность сразу идут лесом (<a href="https://duckduckgo.com/app">Duckduckgo</a>, <a href="https://brave.com">Brave</a>, <a href="https://mullvad.net/en/browser">Mullvad</a>).
                Как показывает практика, браузеры в своих попытках обеспечить приватность зачастую ломают функционал веб приложения.
                Честное слово, мне абсолютно пофиг на то что они мониторят мою активность и собирают аналитику.
                Пускай собирают - благодаря этому разработчики фиксят баги и делают продукт круче.
              </p>

              <p style={styles.p}>
                От <a href="https://www.mozilla.org/firefox/">Firefox</a> я отказался потому что мне не нравится его интерфейс.
                В <a href="https://www.opera.com">Opera</a> много разного встроенного функционала, но который можно в <a href="https://www.google.com/chrome/">Chrome</a> реализовать через плагины.
                Поэтому я остановился на <a href="https://www.google.com/chrome/">Chrome</a> и отдельно <a href="https://www.chromium.org">Chromium</a> для разработки.
              </p>

              <p style={styles.p}>
                Список плагинов:
                <ul style={styles.ul}>
                  <li><a href="https://1password.com">1Password</a> - в браузере работает идеально.</li>
                  <li><a href="https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm">uBlock Origin</a> - заметно лучше <a href="https://adblockplus.org">AdBlock Plus</a> и <a href="https://getadblock.com">AdBlock</a>.</li>
                  <li><a href="https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn">Claude</a> - с его помощью можно задавать вопросы по контенту на странице.</li>
                  <li><a href="https://chromewebstore.google.com/detail/crxmouse-mouse-gestures/jlgkpaicikihijadgifklkbpdajbkhjo">CxMouse</a> - плагин для жестов.</li>
                  <li><a href="https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn">Dont Close The Window with Last Tab</a> - блокирует закрытие окна при закрытии последней вкладки.</li>
                  <li><a href="https://chromewebstore.google.com/detail/i-still-dont-care-about-c/edibdbjcniadpccecjdfdjjppcpchdlm">I dont care about cookies</a> - автоматически принимает все куки.</li>
                  <li><a href="https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa">Phantom</a> - крипто-кошелек.</li>
                  <li><a href="https://returnyoutubedislike.com">Return Youtube Dislike</a> - возвращает количество дизлайков.</li>
                  <li><a href="https://www.tampermonkey.net">Tamper Monkey</a> - позволяет добавлять свой JS на страницу.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Мне не нравится сама концепция браузера: это вложенная платформа.
                ОС уже платформа для приложений, а браузер - еще одна внутри.
                Поэтому из сайтов, которыми часто пользуюсь я создаю десктопные ярлыки, которые запускают определенное веб-приложение, но без URL-бара и вкладок.
              </p>

              <p style={styles.p}>
                Мой <a href="https://www.autohotkey.com">AutoHotkey</a> скрипт настроен так, что показывает позволяет запускать такие вебсайты так же как и обычные приложения.
                По этому я впринципе не пользуюсь функционалом закладок в браузере.
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
              <p style={styles.p}>Лучшей опцией оказался <a href="https://claude.ai">Claude</a> - у него еще и особый фокус на программирование.</p>
              <p style={styles.p}><a href="https://cursor.com">Cursor</a> - это надмозг: по сути выбирает модель за тебя. Мне такой подход не нравится.</p>
              <p style={styles.p}>
                Время от времени запускаю модели локально через <a href="https://lmstudio.ai">LM Studio</a> и <a href="https://ollama.com">Ollama</a>.
                Нужна мощная видеокарта с большим объемом памяти, а моя заточена под много мониторов.
                Но основная все равно <a href="https://claude.ai">Claude</a>.
              </p>
              <p style={styles.p}>
                Модель можно использовать через официальный GUI, через <a href="https://cursor.com">Cursor</a> или через плагин <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
              </p>
              <p style={styles.p}>
                Вот список MCP‑серверов, которые подключаю.
              </p>
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

              <p>
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