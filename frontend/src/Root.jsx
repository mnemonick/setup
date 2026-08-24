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

	styles.seading = {
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

	let grid_height = contentHeight || height - styles.heading.height;

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
							<seading style={styles.seading}>Введение</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
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
							<seading style={styles.seading}>Стол</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
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
                  Недостатком такого подхода я бы назвал то постоянно мешает ножка стола, но я к ней уже привык.
                </p>
							</content>
						</section>

            <section style={styles.section}>
              <seading style={styles.seading}>Мониторы</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>
                  При этом нету вообще необходимости в том, что бы запускать несколько приложений рядом друг с другом.
                  Это всегда один монитор - одно приложение.
                </p>
                <p>
                  Не менее важно 5 мониторов.
                  Все мониторы соединены липкой лентой, что бы не было зазоров.
                  Все мониторы на кроштейнах.
                  Все фокусируются на процессоре, памяти видеокарте, но по факту мощное железо нужно для игр, рендеринга и других специфичных задач.
                  Один монитор основной, и 4 дополнительных, все четыре монитора вертикальные. Диоганаль - 28 дюймов.
                </p>

                <p>
                  По факту сейчас вертикальное пространство важнее горизонтального.
                  Сами посудите, все социальные сети вертикальные, разработка в браузере сверху приложение, снизу дебаггер, терминалу так же вертикальное пространство нужнее.
                  Горизонтальное пространство нужно для кода, просмотр фильмов фото и игр.
                </p>

                <p>
                  Рекомендую зафиксировать определенную позицию за каждым приложением, так удобнее сразу знать куда смотреть.
                  <ul>
                    <li>Слева-слева терминал.</li>
                    <li>Слева браузер и Chrome Dev Tools.</li>
                    <li>Обычно у меня на основном открыта IDE .</li>
                    <li>Справа ИИ.</li>
                    <li>Справа-справа все мессенджеры (почта, тг, вотсап...).</li>
                  </ul>
                </p>

                <p>
                  Я по дурости сначала купил видеокарту на 8 мониторов, расположил их друг на другом, но в реальности смотреть вверх <b>крайне</b> не удобно.
                  В идеале верхняя граница монитора должна находится на уровне глаз.
                  Думал что чем больше, тем лучше, но все таки расклад с 5 мониторами - это самый максимум, которым удобно пользоваться.
                </p>
              </content>
            </section>

            <section onClick={() => setModal("test")} style={styles.section}>
              <seading style={styles.seading}>Клавиатура</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>
                  О клавиатуре я очень много могу сказать, поэтому я вынес ее в отдельный блок.
                </p>

                <p>
                  Клавиатура - Advantage Kinesis 2.
                  Именно этом модель, а не последняя, потому что функциональные клавиши нажимаются без модификатора).
                </p>

                <p>
                  То насколько я обожаю эту клавиатуру словами не описать, намного удобнее чем обычные клавиатуры. Логти раздвинуты и удобно нажимать горячие клавиши.
                </p>

                <p>
                  Обычные клавиатуры вообще не ориентированы на удобство.
                  Стрелочки, страница вверх вниз, модификаторы - вообще в жопа.
                  Так большой палец используется только для нажатия на пробел.
                  Большими пальцами я могу нажать 12 клавишь (по 6 на каждый большой палец).
                  И что самое важное это самые часто используемые клавиши - модификаторы, бэкспейс, делете и так далее.
                  Так же стрелочки находятся нажимаются указательными пальцами и нет необходимости переноса руки во время навигации.
                  Благодаря этой клавиатуре никакой Vim не нужен.
                </p>

                <p>
                  На обычных клавиатурах на суперудобной позиции расположен капслок. Просто без комментариев.
                </p>
                <p>
                  Раскладка Dvorak -
                </p>

                <p>
                  Безусловно клавиатура стоит дорого, но уровню важности она у меня на втором месте после мониторов.
                </p>

                <p>
                  На этой клавиатуре настроены определенные макросы.
                  Во первых это фиксинги.
                  Так же виндовая клавиша унесена куда подальше.
                  Раскладка - дворак (на привыкание нужен примерно месяц).
                  Первый месяц будет очень неудобно, я раньше даже не.
                  представлял насколько глубоко в мышцах находится печать.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Мышка</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  Мышка обязательно симметричная и с хватом. Я вообще не понимаю как можно пользоваться мышкой, на которой ладонь лежит полностью.
                  В этом случае точность наведения страдает очень сильно, суть в том что можно ладонью упереться и пальцами, довести до нужно элемента, а когда вся ладонь на мышке, то доводить нужно кистью, которая намного менее точная.
                  Пробовал мышку *** с большим количеством кнопок, но к сожелению она намного менее удобна для хвата.
                  Колесико на мышке так же можно двинуть влево и право (копирование вставка). По сути я большего количества действий не придумал.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Стул</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  Пробовал распиаренный Heller Miller который стоит как самолет, но у него минимальная высота 50см, а мне нужно именно 40 см.
                  При этом если убрать ножки то можно сидеть в позе наездника, что на Heller Miller очень неудобно.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Очки</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  У меня со зрением все хорошо, читаю вывески нормально,  но в очках <b>намного удобнее</b>.
                  Я конечно не врач, но если вы хотите прокачать свое рабочее место, но уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.
                  Я то же на зрение не жалуюсь совсем, но не смотря на это очки добавляют четкости.
                </p>
                <p>
                  Даже если вы думаете что у вас зрение хорошее, просто пойдите и провертесь.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Железо</seading>

              <content style={{padding: desktop ? 20 : 10}}>
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
							<seading style={styles.seading}>Операционная система</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>Тут у нас на выбор есть Windows, MacOS, Ubuntu и FreeBSD.</p>

								<p>
									Вы бы могли подумать, что раз я такой техно-гик, то у меня стоит Ubuntu.
                  Но не тут то было, я абсолютный фанат винды на десктопе и считаю что ни макось ни убунта даже близко не сравняться с виндой по удобству.
								</p>
								<p>
									На маке во неудобная система управления окнами, неудобные горячие клавиши.
								</p>
								<p>
									Я конечно считаю, что FreeBSD лучше линукса, но я не настолько мазохист что бы ставить его себе на десктоп.
								</p>
								<p>
									Самое главное преимущество винды в системе управлениями окнами.
								</p>
								<p>
									На винде так же я могу использовать рабочие пространства отдельные что бы открыть много браузеров.
                  Сейчас разрабатываю приложение, где много юзеров взаимодействуют друг с другом.
									Удобно весь этот сетап держать на отдельном рабочем пространстве.
								</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Autohotkey</seading>
							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>
                  Вообще AutoHotkey - супер клевый инструмент, для того что "пропатчить" ось.
                  Как по мне весь функционал, который выполняет AutoHotkey должен быть встроен в ось, но по какой-то причине эту работу нужно делать самому.
									Тут я перечисляю тот функционал который по факту должен быть встроен в ось, но его всякими обходными путям и хаками нужно встраивать.
								</p>

								<p>
                  <b style={{marginRight: 5}}>Модификаторы.</b>

                  Клавиши сначала клавиатурой ремаплю на F13, F14, F15.
                  И того у меня есть шесть модификаторов:

                  <ul>
                    <li>Alt</li>
                    <li>Ctrl</li>
                    <li>Alt-Shift</li>
                    <li>Ctrl-Shift</li>
                    <li>Alt-Ctrl</li>
                    <li>Alt-Shift-Ctrl</li>
                  </ul>
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
                  Действия колесико влево, колесико вправо - это копирование и вставка.
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
              <seading style={styles.seading}>Браузер</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>
                  Тут я рассматривал Chrome, Firefox, Microsoft Edge.</p>

                <p>
                  По большому счету я стараюсь пользоваться только десктопными приложениями.
                </p>

                <p>
                  Алгоритм такой: winget, PWA, ярлык, Store.
                  Я запускаю браузер, только для вебсайтов, которые нужно побыстрому запустить и закрыть, если я часто пользуюсь веб-сайтом, я делаю из него десктопное приложение.
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
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Редактор</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>Тут есть Zed, WebStrom, Cursor</p>

                <p>
                  В итогде я использую вебштом для ежедневной работы, а курсор
                  только как ИИ.
                </p>

                <p>Стандартные плагины не работают совершенно.</p>

                <p>
                  Тут я настроил абсолютно все действия под себя.
                  Полностью отключил те горячие клавиши которые не использую.
                </p>

                <p>
                  Можно было бы подумать, что я бы включил Vim плагин, но нет.
                  На практике переключение режимов имеет смысл когда нужно единожды режим переключить и потом 200-300 символов ты работаешь в одном режиме (как при печати текста).
                  Но в процессе написания кода необходимо переключаться между режимами каждые 20-30 символов, в итогде это больше раздражает чем помогает.
                  Плюс к этому у меня клавиатура на которой стрелочки и модификаторы очень удобно нажимать, так что от вима я отказался.
                </p>

                <p>
                  <b>Шрифт.</b>
                  Hack - вне конкуренции для программирования, при этом размер линий 1.
                  Благодаря этому на экране помещается на 30% больше линий кода.
                </p>

                <p>
                  Все горячие клавиши убраны и заменены на свои собственные.
                  Vim режим - не ставился.
                  Ненавижу вим.
                  При этом добавляется еще один режим.
                  Вот список в JSON формате.
                </p>
              </content>
            </section>

            <section>
              <seading>ИИ модель</seading>
              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>Я смотрел на то насколько близко модель реализует это демо-приложение.</p>
                <p>Лучшей опцией оказался Сlaude, так же у Claude есть особый фокус на программирование.</p>
                <p>Cursor - это надмозг, по сути он выбирает модель за тебя, мне такой подход не нравится.</p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Файловый менеджер</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
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
                  Сейчас явно в этой нише можно сделать продукт, который на голову лучше чем TotalCommander.
                </p>
              </content>
            </section>

						<section style={styles.section}>
							<seading>Менеджер паролей</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>Тут ван пассворд вне конкуренции</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading>Терминал</seading>

							<p>Либо стандартный виндовый, warp, WezTerm</p>

							<p>
                По большому счету мое взаимодействие на 80% состоит из двух действий:

                <ul>
                  <li>Поиск по истории</li>
                  <li>Копирование аутпута</li>
                </ul>

                Оба этих действия в Warp работают значительно удобнее.
                Вот сравните как выглядит типичный аутпут
							</p>

              <p>
                При этом на кой-то черт в него запили ИИ (сейчас его пилят куда не поподя), дерево проектов.
                Если бы весь этот функционал убрать, и сделать варп более минималистичным, было бы лучше.
                Я вообще фанат минималистичность, но все же функциональность важнее.
              </p>
						</section>

						<section style={styles.section}>
							<seading>Поиск файлов</seading>

							<p>Тут либо Everything, либо omnisearch</p>

							<p>
								Omni хоть и выглядит посовременнее, обычно тот софт который появился позже тот лучше.
                Но после ввода в поиск не работают стрелочки (стрелочки карл!) это же настолько очевидный функционал.
                Сразу после установки удалил это гавно.
							</p>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Текстовый редактор</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Тут я выбирал между Cursor, WebStorm, Zed - тут явный фаворит это WebStorm.

                <p>
                  В вебшторме <b>очень</b> много того функционала которым я пользуюсь на ежедневной основе:
                  <ul>
                    <li>Очень хорошая поддержка гита</li>
                    <li>Последние открытые файлы (я даже вкладки отключил)</li>
                    <li>Локальная история</li>
                    <li>Предпросмотр файла в дереве</li>
                    <li>Скоупы (я помечаю разными цветами Frontend и Backend файлы)</li>
                    <li>Вкладки при поиске</li>
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
                  При этом мне в вебшторме очень не хватает функционала
                </p>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>ИИ модель</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
                <p>

                </p>
								Я проанализировал все ИИ модели следующим образом - я сначала написал небольшой тестовый проект полностью сам.
                И потом попросил все возможные ИИ в максимальной конфигурации написать точно такой же проект.
                После этого я выбрал ту, код которой мне понравился больше всех.
								При использовании ИИ модели ее можно использовать либо через официальный гуи либо через курсор либо через WebStorm плагин.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Железо</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Я в деньгах не особо стеснен, поэтому железо просто топовое.
                Не то что бы я особо был игроманом, иногда конечно играю, но не ради этого я покупаю топовое железо.
							</content>
						</section>

            <section style={styles.section}>
              <seading style={styles.seading}>Скриншоты</seading>

              <content style={{ padding: desktop ? 20 : 10 }}>
                <p>
                  Это не просто утилитка для скриншотов я ее так же использую как пипетку, линейку, запись видео.
                </p>
              </content>
            </section>

						<section>
							<seading style={styles.seading}>Лэйаут</seading>

							<p>
								Рекомендую зафиксировать определенную позицию за каждым
								приложением, так удобнее сразу знать куда смотреть.
								<ul>
									<li>Слева-слева: терминал.</li>
									<li>Слева: браузер (для разработки) и Chrome Dev Tools.</li>
									<li>
										Центр: Основной монитор IDE или любое другое временное
										приложение.
									</li>
									<li>Справа: ИИ или любая другая документация.</li>
									<li>
										Справа-справа: все мессенджеры (почта, тг, вотсап...).
									</li>
								</ul>
							</p>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Менеджер паролей</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								1Password - сто процентный фаворит
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Почта</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
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
							<seading style={styles.seading}>Что сюда не попало</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
                <p>
                  PowerToys - вроде расхайпленный проект 100 000 звезд на гитхабе, но по сути ни одну утилитку из него я не придумал как заинтегрировать.
                </p>
                <p>
                  SideBar - сомнительная необходимость, показывает нагрузку на железо, но по сути .
                </p>
              </content>
						</section>

            <section style={styles.section}>
              <seading style={styles.seading}>Заключение</seading>

              <p>
                Многие концентрируются на процессоре, видеокарте, но в действительности на них можно легко сэкономить.
                Честно говоря обновляя процессор это даже близко не добавляет мне столько же удобства, стол, стул, мышка или очки, не говоря уже о мониторах.
              </p>

              <p>
                Особо не злитесь, если я вдруг выбрал не ту технологию, которая нравится вам, это мой вкус, я его ни кому не навязываю.
                Даже более того, если я где-то несправедливо засрал какую-то технологию, которая вам нравится, то я открыт к переубеждению.
              </p>
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
