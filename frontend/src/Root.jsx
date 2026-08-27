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
    border: `1px solid ${colors.border.strong}`,
    letterSpacing: 1
  };

  styles.b = {
    marginRight: 5,
    color: colors.text.strong,
    fontWeight: 500
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
              <caption style={styles.separator.caption}>Рабочее место</caption>
              <line style={styles.separator.line} />
            </separator>

            <category style={styles.category}>
							<topper style={styles.topper}>Стол</topper>

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
              <topper style={styles.topper}>Стул</topper>

              <p style={styles.p}>
                Казалось бы стул это мелочь, но я провожу сидя за компьютером в день по 8 часов.
                И удобство стула для меня намного важнее, чем количество ядер у процессора.
              </p>

              <p style={styles.p}>
                Первое требование к стулу - что бы не было подлокотников (или их можно было убрать).
                Логти у меня всегда на столе, подлокотники только мешают.
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
                Если вы хотите прокачать рабочее место - уделите внимание очкам <b style={styles.b}>даже если</b> на зрение не жалуетесь.
              </p>

              <p style={styles.p}>
                Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, номера автобусов вижу издалека.
                Но несмотря на это в очках читать текст на экране <b style={styles.b}>заметно удобнее</b>.
                Возможно, у вас будет так же.
              </p>

              <p style={styles.p}>
                Многие концентрируются на характеристиках железа, но не знают про то, что очки могут улучшить изображение <b style={styles.b}>сильнее</b> чем дорогой монитор или видеокарта.
                Плюс к тому глаза будут меньше уставать, что позволит сохранить вас зрение.
              </p>
            </category>

            <separator style={styles.separator}>
              <line style={styles.separator.line} />
              <caption style={styles.separator.caption}>Железо</caption>
              <line style={styles.separator.line} />
            </separator>

            <category style={styles.category}>
              <topper style={styles.topper}>Мониторы</topper>

              <p style={styles.p}>
                Количество мониторов для меня намного важнее, чем мощная видеокарта или процессор.
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
                Что самое интересное под задачи дополнительных мониторов, вертикальные 22 дюймовые подходят <b>намного лучше</b>, чем горизонтальные 29 дюймововые.
                Нейросети, терминал, браузер с дебаггером (сверху веб-приложение, снизу дебаггер), thunderbird (сверху письма, снизу текст), все мессенджеры, Instagram, Twitter - всем этим пользоваться <b>удобнее</b> на вертикальном мониторе.
                Горизонтальный монитор удобнее для редактора (открыто два файла одновременно + дерево проектов), просмотр видео и фотографий.
                Вертикально ставить 29 дюймовый монитор не советую, очень высоко будет верхняя граница, не удобно.
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
                <b style={styles.b}>Расположение модификаторов.</b>
                На обычных клавиатурах большим пальцем жмешь только пробел, а модификаторы - мизинцем.
                На моей клавиатуре пальцами я могу нажать 12 клавиш, по 6 на каждый большой палец: <term style={styles.term}>PageUp</term> <term style={styles.term}>PageDown</term> <term style={styles.term}>Backspace</term> <term style={styles.term}>Delete</term> <term style={styles.term}>Home</term> <term style={styles.term}>End</term> <term style={styles.term}>Space</term> <term style={styles.term}>Enter</term> <term style={styles.term}>Alt</term> <term style={styles.term}>Ctrl</term> <term style={styles.term}>Alt+Shift</term> <term style={styles.term}>Alt+Ctrl</term> <term style={styles.term}>Alt+Ctrl+Shift</term>.
                Последние 3 настроены через макрос, зажимается одна клавиша и равносильно нажатию сразу нескольких модификаторов.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Расположение стрелок.</b>
                Стрелки нажимаются указательным и средним пальцем <clickable style={styles.clickable}>без переноса руки</clickable>.
                На обычных клавиатурах для навигации приходится двигать кисть.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Позиция для локтей.</b>
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
              <topper style={styles.topper}>Видеокарта</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Мощная видео-карта влияет на скорость работы локальных нейросетей и на FPS в играх.
                  Если вы не пользуетесь ни тем ни тем, то мощная видеокарта вам не нужна.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Видео-карту (да и вообще любое другое железо) лучше выбирать по бенчмаркам, а не по техническим характеристикам.
                  Для замера производительности в играх и производительности нейросетей используются разные бенчмарки.
                  Технические характеристики - это просто информация о том, как достигается тот или иной показатель в бенчмарке.

                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Для замера скорости работы нейросетей запускается локально <a href="TODO">Llama 3 8B at Q4_K_M</a> и смотрят сколько токенов в секунду генерирует нейросеть.
                  <ul style={styles.ul}>
                    <li><a href="TODO">Nvidia RTX 5090</a> - 220 tokens/s</li>
                    <li><a href="TODO">AMD RX 9070 XT</a> - 95 tokens/s</li>
                  </ul>
                </p>

                <p style={styles.p}>
                  Разница огромная, но <a href="TODO">Nvidia RTX 5090</a> стоит около $4.000, а <a href="TODO">AMD RX 9070 XT</a> около 800$.
                  Каждый решает сам, готов ли он переплачивать или нет.
                </p>

                <p style={styles.p}>
                  Просто для сравнения <term style={styles.term}>GPT-5.6 Luna</term> (модель по умолчанию <term style={styles.term}>ChatGPT</term> в бесплатном тарифе) выдает примерно 200 tokens/s.
                  Иногда я выбираю очень тяжелые модели и даже 40 tokens/s мне более чем достаточно.
                </p>

                <p style={styles.p}>
                  Так что если для вас цена это важный фактор то можете смело брать <a href="TODO">AMD RX 9070 XT</a>.
                  По соотношению цена / качество она даже <b>лучше</b> чем <a href="TODO">AMD RX 9070 XT</a>.
                </p>

                <p style={styles.p}>
                  Я перфекционист, у меня стоит <a href="TODO">Nvidia RTX 5090</a>.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Процессор</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  При выборе процессора я смотрю на показатели <a href="TODO">GeekBench</a> бенчмарка.
                </p>

                <p>
                  <ul>
                    <li><a href="TODO">Amd Ryzen 5090</a></li>
                  </ul>
                </p>

                <p style={styles.p}>
                  А вот процессоры у <term style={styles.term}>AMD</term> лучше чем у <term style={styles.term}>Intel</term>. Влияет на скорость работы приложений и тех локальных нейросетей, которые не помещаются в памяти видеокарты. <a href="TODO">Core Ultra 9 285k</a>.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Накопитель</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Хороший SSD влияет на общую производительность практически всех операций скорее всего даже больше, чем мощный процессор.
                  <a href="TODO">Samsung SSD 9100 Pro</a>
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Оперативка</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="TODO">G.Skill Trident Z5 CK</a> две штуки.
                  Всего 64 гб.
                  1234 в бенчмарке Performance Test.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Материнска плата</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://www.asus.com/motherboards-components/motherboards/prime/prime-b850m-k/">Asus Prime B850M-K</a>.
                  Самое главное, что бы материнская плата поддерживала все выбранное железо.
                  Если ваша цель - это запуск локальных нейросетей обратите внимание на параметр, он увеличивает скорость до 30%.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://us.sennheiser-hearing.com/products/momentum-5-wireless?variant=62714248495475">Sennhizer Momentum 4 Wireless</a>. Самый главный критерий - что бы были беспроводными и долго держали заряд.
                </p>
              </section>
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

            <separator style={styles.separator}>
              <line style={styles.separator.line} />
              <caption style={styles.separator.caption}>Софт</caption>
              <line style={styles.separator.line} />
            </separator>

						<category style={styles.category}>
							<topper style={styles.topper}>Операционная система</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Вы можете подумать, что раз я такой техногик, то у меня какой-нибудь <term style={styles.term}>Linux</term> типа <a href="TODO">Ubuntu</a>.
                  Но это совершенно не так.
                  Самым главным минусом убунты для меня является то, что ней не работает <a href="https://www.autohotkey.com">AutoHotkey</a> (и отсутствуют полноценных альтернативы).
                  По этой же причине я не смотретю в сторону <a href="https://www.apple.com/macos">MacOS</a>.
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
                На <a href="https://www.microsoft.com/windows">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений по историческим причинам.

                <ul style={styles.ul}>
                  <li>Приложение можно поставить через <a href="TODO">winget</a>.</li>
                  <li>Приложение можно скачать через <a href="TODO">Windows Store</a>.</li>
                  <li>Приложение можно открыть в браузере.</li>
                  <li>Приложение можно скачать из веб-приложения.</li>
                  <li>Из вебсайта можно создать <clickable style={styles.clickable}>ярлык</clickable>, <clickable style={styles.clickable}>PWA</clickable>, <clickable style={styles.clickable}>установить как приложение</clickable>.</li>
                </ul>
              </p>

              <p style={styles.p}>
                Что бы все это как-то унифицировать, я придерживаюсь определенного алгоритма по установке приложений.

                <ul style={styles.ul}>
                  <li>Сначала пытаюсь поставить приложение через <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a>.</li>
                  <li>
                    Если в <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a> приложения нет:
                    <ul>
                      <li>Если это веб-приложение то создаю <clickable style={styles.clickable}>десктопное приложение</clickable>.</li>
                      <li>Если это нативное приложение то гружу приложения с официального сайта.</li>
                    </ul>
                  </li>
                </ul>
              </p>

              <p style={styles.p}>
                Из моей практики это покрывает все пограничные случаи, почти не приходится пользоваться <a>Windows Store</a> (это скорее исключение).
                Ну а игры гружу через <a href="TODO">Steam</a>.
                Редко используемые веб-приложения открываю в браузере.
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
                  Не смотря на то что я очень люблю свою клавиатуру, определенные клавиши имеют удобное расположение, но то действие которое они выполняют используется крайне редко.
                  Это поправимо макросами.
                  Вот вам <clickable style={styles.clickable}>картинка</clickable> для наглядности где какие клавиши расположены.

                  <ul>
                    <li><term style={styles.term}>Caps Lock</term> = <term style={styles.term}>Ctrl</term>.</li>
                    <li><term style={styles.term}>Win</term> = <term style={styles.term}>Ctrl-Shift</term>.</li>
                    <li><term style={styles.term}>Right Ctrl</term> = <term style={styles.term}>Alt-Shift</term></li>
                    <li><term style={styles.term}>Left-Ctrl</term> = <term style={styles.term}>Alt-Ctrl-Shift</term></li>
                    <li><term style={styles.term}>/</term> = <term style={styles.term}>Alt-Tab</term>.</li>
                    <li><term style={styles.term}>Insert</term> = <term style={styles.term}>Shift-Tab</term>.</li>
                    <li><term style={styles.term}>~</term> = <term style={styles.term}>Esc</term>.</li>
                    <li><term style={styles.term}>ESC</term> = <term style={styles.term}>Win</term>.</li>
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
                  Сейчас по умолчанию долгом зажатии клавиши символ печатается много раз одна и та же буква - это поведение полезно при навигации, но абсолютно бесполезно на буквах.
                  Я сделал так, что при долгом зажатии буквы (или цифры) запускается определенное приложение.
                  Это поведение раз в миллион полезнее, чем печать большого количества одного и того же символа.
                  Вот <clickable style={styles.clickable}>список</clickable> моих биндов.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Свитчинг.</b>
                  При нажатии на обратный слэш, происходит переключение фокуса между текущим и предыдущим приложением (эмулируется нажатие <term style={styles.term}>Alt-Tab</term>).
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
                  При долгом нажатии на клавишу <term style={styles.term}>a</term> запускается селектор в котором все ярлыки сортируются с помощью <a href="TODO">fzf</a>.
                  Так же добавлена проверка, если приложение запущено, то оно фокусируется, если нет то запускается.
                  То есть фокусировка и запуск приложения происходит через один и тот же интерфейс.
                  <clickable onClick={() => alert('TODO')} style={{...styles.clickable, marginLeft: 5}}>Вот как это работает</clickable>.
                </p>

                <p style={styles.p}>
                  В итоге если приложению назначен клавиатурный жест - я запускаю его через долгое нажатие.
                  Если нет - то использую свой селектор.
                  При этом запуск и фокус веб-приложений так же происходит через этот селектор (при установке веб-приложения автоматически создается ярлык на десктопе).
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <b style={styles.b}>Смена раскладки.</b>
                  Раскладку нужно менять по 100 раз на дню.
                  Ни <a href="https://yandex.ru/soft/punto/">Punto Switcher</a>, ни <a href="https://caramba-switcher.com">Caramba Switcher</a> мне не зашли (работают в 90% случаев, но отавшиеся 10% все портят).
                </p>

                <p style={styles.p}>
                  Я заметил, что проблемы с раскладкой возникают только в момент начала печати.
                  В моем скрипте написана логика, что при смене фокуса язык приложения сбрасывается на значение по умолчанию (язык указывается в названии ярлыка на десктопе, например <term style={styles.term}>warp.en.lnk</term>).
                </p>

                <p style={styles.p}>
                  Таким образом легко нарабатывается навык при котором запоминается начальная раскладка каждого приложения.
                  А когда текст уже печатается то раскладка удерживается в голове, и переключать ее не вызывает проблем.
                </p>

                <p style={styles.p}>
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
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  В <a href="https://www.opera.com">Opera</a> много разного различного встроенного функционала, но его можно легко реализовать через плагины в <a href="https://www.google.com/chrome/">Chrome</a>.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  От <a href="https://www.mozilla.org/firefox/">Firefox</a> я отказался потому что мне не нравится его интерфейс.
                  Устанавливаю его исключительно для кросс-браузерной разработки.
                </p>

                <p style={styles.p}>
                  Я остановился на <a href="https://www.google.com/chrome/">Chrome</a> для браузинга и <a href="https://www.chromium.org">Chromium</a> для разработки (им назначены разные горячие клавиши и они открываются на разных мониторах).
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Вот список моих маст хэв плагинов (ставятся в <a href="https://www.google.com/chrome/">Chrome</a>, не <a href="https://www.chromium.org">Chromium</a>):
                  <ul style={styles.ul}>
                    <li><a href="https://claude.ai/">Claude</a> - можно общаться с <a href="TODO">Claude</a> о содержимом на странице (требуется подписка).</li>
                    <li><a href="https://1password.com">1Password</a> - менеджер паролей.</li>
                    <li><a href="https://ublockorigin.com/">uBlock Origin</a> - по бенчмаркам лучше <a href="https://adblockplus.org">AdBlock Plus</a>, <a href="https://getadblock.com">AdBlock</a> и <a href="TODO">AdGuard</a>.</li>
                    <li><a href="https://crxmouse.com/">CxMouse</a> - плагин для жестов. У меня настроено только четыре жеста. Влево / вправо - фокус левой / правой вкладки. Вниз - закрыть вкладку. Вверх - создать новую вкладку.</li>
                    <li><a href="https://chromewebstore.google.com/detail/dont-close-window-with-la/dlnpfhfhmkiebpnlllpehlmklgdggbhn">Dont Close The Window with Last Tab</a> - блокирует закрытие окна при закрытии последней вкладки.</li>
                    <li><a href="https://www.i-dont-care-about-cookies.eu/">I dont care about cookies</a> - автоматически принимает все куки.</li>
                    <li><a href="https://phantom.com/">Phantom</a> - крипто-кошелек (использую только для стейблкойнов).</li>
                    <li><a href="https://returnyoutubedislike.com">Return Youtube Dislike</a> - возвращает количество дизлайков на youtube.</li>
                    <li><a href="https://chromewebstore.google.com/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle">Enhancer For Youtube</a> - полезные утилитки для youtube.</li>
                    <li><a href="https://chromewebstore.google.com/detail/no-new-tabs/gneobebnilffgkejpfhlgkmpkipgbcno?hl=en">No New Tabs</a> - запрещает браузеру создавать новые вкладки. Бесит когда веб-приложение сам создает новые вкладки, если я захочу открыть новую вкладку я сам это сделаю.</li>
                    <li><a href="https://tampermonkey.net">Tamper Monkey</a> - позволяет добавлять свой JS на страницу (добавляю фиксированные заголовки веб-сайтам, что бы фокусировать их через <a href="TODO">AutoHotkey</a>).</li>
                    <li><a href="https://chromewebstore.google.com/detail/search-navigator-%E2%80%93-keyboa/fpinaaaiplppifhmkjdfkimodkkdnoha">Search Navigator</a> - добавляет горячие клавиши к результатам поиска гугла (почему гугл нативно это не реализовал - не понятно).</li>
                    <li><a href="https://chromewebstore.google.com/detail/currency-converter-pro/amlcmfdiddkikfmljhdhhookgjmnpedc">CurrencyConverter</a> - конвертация валют (особенно полезно на <a href="TODO">ek.ua</a>).</li>
                    <li><a href="https://chromewebstore.google.com/detail/copy-url-%E2%80%94-one-click-url/ndpdhbnlllblljkmbcdolnjpbcfolnme">Copy URL</a> - создает горячую клавишу для копирования урла.</li>
                    <li><a href="https://chromewebstore.google.com/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=en">Google Translate</a> - перевод слова при выделении.</li>
                  </ul>
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  В хроме нельзя редактировать горячие клавиши, но на помощ к нам приходит <a href="TODO">AutoHotkey</a>.
                  Вот <clickable style={styles.clickable}>список</clickable> моих горячих клавиш для хрома.
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: null}}>
                <p style={styles.p}>
                  Я искал, но не нашел плагина для инкрементального fuzzy поиска на странице.
                  Если кто-то ищет идею для своего небольшого open source проекта то вот она.
                </p>
              </section>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Редактор кода</topper>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://cursor.com">Cursor</a> - позиционируется как редактор с самой продвинутой поддержкой нейросетей, но честно-говоря в поддержки ии я особо разрницы не заметил с <a href="">WebStorm</a> с установленным <a href="TODO">Claude</a> плагином.
                </p>

                <p style={styles.p}>
                  Но при этом покупая подписку на <a href="TODO">Claude</a> вы можете его использовать: в браузере, на телефоне, как TUI на сервере и так же получаете API ключ, который вы можете вставлять куда хотите.
                  <a href="https://cursor.com">Cursor</a> ничего из этого не поддерживает.
                </p>

                <p style={styles.p}>
                  Многие говорят, что плюсом курсора является то, что можно менять нейросети на лету, это прикольно, но честно говоря не думаю это такая прям киллер фича.
                </p>
              </section>


              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://zed.dev">Zed</a> - очень понравилось то насколько мало памяти он жрет (в 20 раз меньше).
                  Пытался на него перейти, но по функциональности он намного слабже <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> - самый функциональный редактор для разработки веб-приложений на текущий момент.
                  Если используете не для коммерческой разработки, то он бесплатен.
                </p>

                <p>
                  Вот список того функционала, которым пользуюсь каждый день и который в <a href="TODO">Zed</a> так и <a href="TODO">Cursor</a> либо полностью отсутствует либо реализован хуже:
                  <ul style={styles.ul}>
                    <li>Поддержка <a href="https://git-scm.com">Git</a></li>
                    <li>История последних открытых файлов (вкладки даже отключил)</li>
                    <li>Локальная история</li>
                    <li>Открытие панелей в отдельных окнах</li>
                    <li>Интенты</li>
                    <li>Предпросмотр файла в дереве</li>
                    <li>Скоупы (Frontend и Backend помечаю разными цветами)</li>
                    <li>Вкладки при поиске</li>
                    <li>Quicklists: LocalHistory, <a href="https://git-scm.com">Git</a>, <a href="https://github.com">GitHub</a></li>
                    <li>И еще <b style={styles.b}>очень много</b> других мелочей.</li>
                  </ul>
                </p>

                <p style={styles.p}>
                  Вы будете смеяться, но вкладки я отключил.
                  Вместо них - Recent Files.
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
                  Я написал простенькое приложение, менеджер контактов, полностью своими руками без нейросетей.
                  И потом я просил разные ИИ написать точно такое же приложение по функционал, но только по тому описанию, которое я ей давал.
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

              <section style={styles.category.section}>
                <p style={styles.p}>
                  Вообще не должно быть такого, что бы требовался файловый менеджер, этот функционал должен нативно поддерживаться операционной системой, без необходимости ставить сторонние приложения.
                  Но имеет то, что имеем.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://yazi-rs.github.io">Yazi</a>
                  (42k звезд на <a href="https://github.com/sxyazi/yazi">Github</a>).
                  Самая главная фишка в том, что работает в терминале и управляется как Vim.
                  Он бы был идеальным если бы он был двухпанельным, поэтому отпадает сразу.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://www.farmanager.com">Far Manager</a> -
                  Старый двухпанельный файловый менеджер.
                  По функционалу и интерфейсу явно проигрывает <a href="https://www.ghisler.com">Total Commander</a>.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://files.community">Files</a> -
                  Неплохой дизайн, но слишком казуальный и по функционалу так же проигрывает <a href="https://www.ghisler.com">Total Commander</a>.
                </p>
              </section>

              <section style={styles.category.section}>
                <p style={styles.p}>
                  <a href="https://www.ghisler.com">Total Commander</a>.
                  Интерфейс мог бы быть по лучше, но он двух-панельный, функциональный и позволяет гибко настраивать горячие клавиши.
                  В <a href="https://www.ghisler.com">Total Commander</a> включил темную тему, убрал лишний UI, поставил шрифт <a href="https://sourcefoundry.org/hack/">Hack</a>.
                  Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                  Вот как выглядит <clickable style={styles.clickable}>внешний вид</clickable> и вот мой <clickable style={styles.clickable}>конфиг</clickable>.
                </p>
              </section>
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
              <topper style={styles.topper}>Скриншоты</topper>

              <p style={styles.p}>
                Безоговорочный лидер - <a href="https://getsharex.com">ShareX</a> (39k звезд на <a href="https://github.com/ShareX/ShareX">Github</a>).
                Он может делать не только для скриншоты, он так же содержит и много других инструментов, которые я использую :пипетку, линейка, для записи видео.
              </p>

              <p style={styles.p}>
                <b style={styles.b}>Утилиты.</b>
                Глобальные функциональные клавиши назначены на стандартные инструменты.

                <ul style={styles.ul}>
                  <li><term style={styles.term}>F9</term> - сделать скриншот.</li>
                  <li><term style={styles.term}>F10</term> - распознать текст (полезно что бы отправить его нейросети, обычные картинки жрут очень много токенов).</li>
                  <li><term style={styles.term}>F11</term> - записать гифку.</li>
                  <li><term style={styles.term}>F12</term> - запустить пипетка.</li>
                  <li><term style={styles.term}>Print Screen</term> - экранная линейка.</li>
                  <li><term style={styles.term}>Scroll Lock</term> - скриншот со скроллом.</li>
                  <li><term style={styles.term}>Pause Break</term> - просмотреть мета-данные о файле.</li>
                </ul>
              </p>
            </category>

            <category style={styles.category}>
              <topper style={styles.topper}>Остальные приложения</topper>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
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
                      (6k звезд на <a href="https://github.com/rcmaehl/MSEdgeRedirect">Github</a>)
                      - чтобы <a href="https://www.microsoft.com/windows">Windows</a> открывала <a href="https://www.google.com/chrome/">Chrome</a> вместо <a href="https://www.microsoft.com/edge">Edge</a>
                    </li>
                    <li>
                      <a href="TODO">GeekBench</a>
                      - замер скорости CPU, GPU. По интерфейсу мне нравится больше чем <a href="TODO">Performance Test</a> и <a href="TODO">Cinebench</a>.
                    </li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Деньги
                  <ul style={styles.ul}>
                    <li><a href="https://alfabank.ru">alfabank.ru</a> - так же крупный банк и маловероятно что с ним что-то случится, но кто знает.</li>
                    <li><a href="https://www.sberbank.ru">sberbank.ru</a> - пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.</li>
                    <li><a href="https://www.tradingview.com">TradingView</a> - мониторинг акций.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Магазины
                  <ul style={styles.ul}>
                    <li><a href="https://aliexpress.com">aliexpress.com</a> - совершенно ужасный интерфейс, долгая доставка, но там можно купить все и дешевле чем на других маркетплейсах.</li>
                    <li><a href="https://wildberries.ru">wildberries.ru</a> - если нужно что-то купить и не хочется ждать доставку с китая.</li>
                    <li><a href="https://ozon.ru">ozon.ru</a> - доставка продуктов.</li>
                    <li><a href="https://ebay.com">ebay.com</a>  - если нужно купить что‑то с рук в РФ.</li>
                    <li><a href="https://avito.com">avito.com</a>  - если нужно купить что‑то с рук за пределами РФ. Альтернатив по большому счету нет.</li>
                    <li><a href="https://github.com/rcmaehl/MSEdgeRedirect">ek.ua</a> - лучший вебсайт по выбору железу, намного лучше <a href="TODO">dns-shop.ru</a> / <a href="pcpartpicker.com">pcpartpicker.com</a> / <a href="newegg.com">newegg.com</a>.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Компиляторы и рантаймы - ставлю все, авось пригодится.
                  <ul style={styles.ul}>
                    <li><a href="https://github.com/PowerShell/PowerShell">PowerShell 7</a> (55k звезд на <a href="https://github.com/PowerShell/PowerShell">Github</a>) - последняя версия (по умолчанию ставится старая)</li>
                    <li><a href="https://nodejs.org">Node</a> - далеко не самый лучший язык, но его главное преимущество в том, что позволяет писать <term style={styles.term}>Frontend</term> и <term style={styles.term}>Backend</term> на одном и том же языке.</li>
                    <li><a href="https://deno.com">Deno</a> - более продвинутый форк <a href="https://nodejs.org">Node</a>.</li>
                    <li><a href="https://www.rust-lang.org">Rust</a> - лучший язык программирования на текущий момент по моему мнению.</li>
                    <li><a href="https://go.dev">Go</a> - из-за своей простоты лучше всего подходит для вайбкодинга.</li>
                    <li><a href="https://www.python.org">Python</a> - не особо часто использую, но требуется для некоторых инструментов.</li>
                    <li><a href="https://www.whatsmydns.net/">whatsmydns.net</a></li> - проверить как ведут себя днс.
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Мессенджеры
                  <ul style={styles.ul}>
                    <li><a href="https://telegram.org">Telegram</a> - основной мессенджер.</li>
                    <li><a href="https://whatsapp.com">WhatsApp</a> - для общения с родственниками.</li>
                    <li><a href="https://discord.com">Discord</a> - игровой мессенджер.</li>
                    <li><a href="https://slack.com">Slack</a> - рабочий мессенджер.</li>
                    <li><a href="https://zoom.us">Zoom</a> - видеосвязь.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Развлечения:
                  <ul style={styles.ul}>
                    <li><a href="https://youtube.com">YouTube</a> - основное развлекательное приложение.</li>
                    <li><a href="https://reddit.com">Reddit</a> - самый популярных форум в мире.</li>
                    <li><a href="https://x.com">Twitter</a> - основная соц сеть для чтение мировых новостей (нужно только подписаться на правильных людей).</li>
                    <li><a href="https://threads.net">Threads</a> - на мой взгляд круче чем <a href="https://x.com">Twitter</a> по интерфейсу, но к сожалению появился намного позже и поэтому менее популярен.</li>
                    <li><a href="https://bash.im">Bash</a> - старый добрый цитатник.</li>
                    <li><a href="https://habr.com">Habr</a> - техностатьи, раз в неделю захожу и читаю лучшее за неделю.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Форумы: по сути их сейчас заменили нейросети.
                  Захожу раз месяц и просматриваю топ самых популярных вопросов.
                  <ul style={styles.ul}>
                    <li><a href="https://stackoverflow.com">stackoverflow.com</a> - вопросы по программированию.</li>
                    <li><a href="https://superuser.com">superuser.com</a> - вопросы продвинутых пользователей.</li>
                    <li><a href="https://serverfault.com">serverfault.com</a> - вопросы по администрированию.</li>
                    <li><a href="https://security.stackexchange.com">security.stackexchange.com</a> - вопросы по безопасности.</li>
                    <li><a href="https://math.stackexchange.com">math.stackexchange.com</a> - вопросы по математике.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Инструменты для программирования
                  <ul style={styles.ul}>
                    <li><a href="https://git-scm.com">Git</a> - как по мне лучше, но гит это стандарт де-факто.</li>
                    <li><a href="https://git-scm.com">Jujutsu</a> - более современный аналог гита.</li>
                    <li><a href="https://github.com">GitHub</a> - использую что бы мониторить самые последние и свежие инструменты.</li>
                    <li><a href="https://www.virtualbox.org">VirtualBox</a> - в основном использую что бы запускать софт которому не доверяю.</li>
                    <li><a href="https://www.cloudflare.com">Cloudflare</a> - DNS-хостинг, анти-DDoS и публичный кэш.</li>
                    <li><a href="https://github.com/FiloSottile/mkcert">mkcert</a> (59k звезд на <a href="https://github.com/FiloSottile/mkcert">Github</a>) - утилита для управления сертификатами.</li>
                    <li><a href="https://caddyserver.com">Caddy</a> - более современный аналог <a href="https://nginx.org">nginx</a>.</li>
                    <li><a href="https://www.postgresql.org">PostgreSQL</a> - топовая SQL-БД.</li>
                    <li><a href="https://www.mongodb.com">MongoDB</a> - топовая NoSQL-БД.</li>
                    <li><a href="https://www.wireshark.org">Wireshark</a> - мониторинг сетевых пакетов, редко требуется, но пусть будет.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.
                  <ul style={styles.ul}>
                    <li><a href="https://sourcefoundry.org/hack/">Hack</a> - лучший шрифт для программирования (терминал и редактор).</li>
                    <li><a href="https://fonts.google.com/specimen/Montserrat">Montserrat</a> - самый нейтральный шрифт.</li>
                    <li><a href="https://fonts.google.com/specimen/Play">Play</a> - красивые цифры.</li>
                    <li><a href="https://www.nerdfonts.com">Nerd Fonts</a> - иконки для терминала.</li>
                  </ul>
                </p>
              </section>

              <section style={{...styles.category.section, borderBottom: styles.topper.borderBottom}}>
                <p style={styles.p}>
                  Остальное
                  <ul style={styles.ul}>
                    <li><a href="https://www.microsoft.com/software-download/windows11">MediaCreationTool</a> - создание установочных флешек.</li>
                    <li><a href="https://veracrypt.fr">VeraCrypt</a> - лучшее решение для шифрования диска.</li>
                    <li><a href="https://www.qbittorrent.org">qBittorrent</a> - торренты.</li>
                    <li><a href="https://2gis.ru">2GIS</a> - справочник организаций и карты. <a href="TODO">Яндекс картами</a> не пользуюсь потому что там много рекламы.</li>
                    <li><a href="https://www.gosuslugi.ru">gosuslugi.ru</a> - приложение от хайпового стартапа.</li>
                    <li><a href="https://www.videolan.org">VLC</a> - старый, но лучший видеоплеер.</li>
                    <li><a href="https://github.com/microsoft/PowerToys">PowerToys</a> (138k звезд на <a href="https://github.com/microsoft/PowerToys">Github</a>) - несмотря на популярность инструмент единственные функции, которые я в нем использую - это поверх всех окон и поиск процессов, которые держат файл.</li>
                  </ul>
                </p>
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
                <a href="https://github.com/ArcadeRenegade/SidebarDiagnostics">SideBar</a> (3k звезд на <a href="https://github.com/ArcadeRenegade/SidebarDiagnostics">Github</a>) - сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.
              </p>
              <p style={styles.p}>
                <a href="https://github.com/tw93/Pake">Pake</a> (61k звезд на <a href="https://github.com/tw93/Pake">Github</a>) - позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.
              </p>
              <p style={styles.p}>
                <li><a href="https://www.voidtools.com">Everything</a> - локальный поисковик файлов.</li>
                Локальный поисковик файлов, полностью заменил поиск в <a href="TODO">TotalCommander</a>.
              </p>
              <p style={styles.p}>
                <li><a href="TODO">Rufus</a> - продвинутый инструмент для создания загрузочных флешек.</li>
                Весь тот функционал, который там есть не особо требуется, по большому MediaCreationTool адресует все мои потребности.
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