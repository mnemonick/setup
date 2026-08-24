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
		background:
			"linear-gradient(to right, transparent, hsl(210 100% 72% / 0.45) 45%, hsl(210 100% 72% / 0.45) 55%, transparent)",
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
									В дестве мне больше нравились конфиги настраивать чем
									собственно играть.
								</p>

								<p>
									Так же хотелось бы что это превратилось в волну, где люди
									публикуют свои сетапы (а то задолбали эти новости про ИИ
									чесслово).
								</p>

								<p>
									Полностью этот сетап с нуля вряд-ли кто-то будет повторять,
									скорее всего каждый прочитавший заинтегрирует только
									определенные кусочки в него.
								</p>

								<p>
									Так же хотелось бы что это превратилось в волну, где люди
									публикуют свои сетапы (а то задолбали эти новости про ИИ
									чесслово). В этом есть и корыстный интерес, я хочу улучшать
									свой сетап и лучший способ - это смотреть на сетапы других
									пользователей.
								</p>

								<p>
									Этот текст написан полностью человеком. ИИ использовался
									только для обучения и проверки на ошибки. Хотите что бы я
									отредактировал это сообщение в более дружелюбном стиле или
									оставить как есть?
								</p>
							</content>
						</section>

						<section style={{ ...styles.section, marginTop: 0 }}>
							<seading style={styles.seading}>Рабочее место</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>
                  <b style={{marginRight: 5}}>Стол.</b>

                  Самое главное - это <b>угловой</b> рабочий стол.
                  И у этого есть два главных преимущества:

                  <ul>
                    <li>
                      <b>Очень удобная позиция для логтей.</b>
                      Логти не висят вообще никогда, нужно прямо ооочень постараться что бы сесть так что бы логти висели.
                    </li>
                    <li>
                      <b>Больше пространства для 5 мониторов.</b>
                      Я считаю количество мониторов <b>самым</b> главным железом под мои задачи.
                      Не видеокарту, не процессор, не даже жесткий диск.
                    </li>
                  </ul>
								</p>

								<p>
                  Нормальных угловых столов по приемлимой цене я не нашел, поэтому купил два стола из IKEA (запрещенная в РФ органзиация) и соединил их снизу пластинами.
								</p>

								<p>
                  <b style={{marginRight: 5}}>Стул.</b>
                  Пробовал распиаренный Heller Miller который стоит как самолет, но у него минимальная высота 50см, а мне нужно именно 40 см.
                  При этом если убрать ножки то можно сидеть в позе наездника, что на Heller Miller очень неудобно.
								</p>

                <p>
                  <b style={{marginRight: 5}}>Мышка</b>
                  Мышка обязательно симметричная и с хватом. Я вообще не понимаю как можно пользоваться мышкой, на которой ладонь лежит полностью.
                  В этом случае точность наведения страдает очень сильно, суть в том что можно ладонью упереться и пальцами, довести до нужно элемента, а когда вся ладонь на мышке, то доводить нужно кистью, которая намного менее точная.
                  Пробовал мышку *** с большим количеством кнопок, но к сожелению она намного менее удобна для хвата.
                  Колесико на мышке так же можно двинуть влево и право (копирование вставка). По сути я большего количества действий не придумал.
                </p>

                <p>
                  <b style={{marginRight: 5}}>Очки</b>
                  Так же сюда добавлю очки.
                  У меня со зрением все хорошо, читаю вывески нормально,  но в очках <b>намного удобнее</b>.
                  Я конечно не врач, но если вы хотите прокачать свое рабочее место, но уделите внимание очкам <b>даже если</b> на зрение не жалуетесь.
                  Я то же на зрение не жалуюсь совсем, но не смотря на это очки добавляют четкости.
                </p>

                <p>
                  Многие концентрируются на процессоре, видеокарте, но в действительности на них можно легко сэкономить.
                  Честно говоря обновляя процессор это даже близко не добавляет мне столько же удобства, стол, стул, мышка или очки, не говоря уже о мониторах.
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
                  В перспективе планирую перейти на последнюю модель, именно этом модель, а не последняя потому что функциональные клавиши нажимаются без модификатора).
                  То насколько я обожаю эту клавиатуру словами не
									описать, намного удобнее чем обычные клавиатуры. Логти
									раздвинуты и удобно нажимать горячие клавиши.
								</p>

								<p>
									Обычные клавиатуры вообще не ориентированы на удобство.
									Стрелочки, страница вверх вниз, модификаторы - вообще в жопа.
									Так большой палец используется только для нажатия на пробел.
									Большими пальцами я могу нажать 12 клавишь (по 6 на каждый
									большой палец). И что самое важное это самые часто
									используемые клавиши - модификаторы, бэкспейс, делете и так
									далее. Так же стрелочки находятся нажимаются указательными
									пальцами и нет необходимости переноса руки во время навигации.
								</p>

								<p>
									На обычных клавиатурах на суперудобной позиции расположен
									капслок. Просто без комментариев.
								</p>

								<p>
									Безусловно клавиатура стоит дорого, но уровню важности она у
									меня на втором месте после мониторов.
								</p>

								<p>
									На этой клавиатуре настроены определенные макросы. Во первых
									это фиксинги. Так же виндовая клавиша унесена куда подальше.
									Раскладка - дворак (на привыкание нужен примерно месяц).
									Первый месяц будет очень неудобно, я раньше даже не.
									представлял насколько глубоко в мышцах находится печать.
								</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Мышка</seading>

						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Железо</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>
									Не менее важно 5 мониторов. Все мониторы соединены липкой
									лентой, что бы не было зазоров. все мониторы на кроштейнах.
									Все фокусируются на процессоре, памяти видеокарте, но по факту
									мощное железо нужно для игр, рендеринга и других специфичных
									задач. Один монитор основной, и 4 дополнительных, все четыре
									монитора вертикальные. Диоганаль - 28 дюймов.
								</p>

								<p>
									По факту сейчас вертикальное пространство важнее
									горизонтального. Сами посудите, все социальные сети
									вертикальные, разработка в браузере сверху приложение, снизу
									дебаггер, терминалу так же вертикальное пространство нужнее.
									Горизонтальное пространство нужно для кода, просмотр фильмов
									фото и игр.
								</p>

								<p>
									Железо не является бутылочным горлышком, но оно у меня самое
									последнее.
								</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Операционная система</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>Тут есть FreeBSD, Ubuntu, MacOS, Windows.</p>
								<p>
									Вы бы могли подумать, что раз я такой техно-гик, то у меня
									стоит линукс.
								</p>
								<p>
									На маке во неудобная система управления окнами, неудобные
									горячие клавиши.
								</p>
								<p>
									Я конечно считаю, что FreeBSD лучше линукса, но я не настолько
									мазохист что бы ставить его себе на десктоп.
								</p>
								<p>
									Самое главное преимущество винды в системе управлениями
									окнами.
								</p>
								<p>
									На винде так же я могу использовать рабочие пространства
									отдельные что бы открыть много браузеров. Сейчас разрабатываю
									приложение, где много юзеров взаимодействуют друг с другом.
									Удобно весь этот сетап держать на отдельном рабочем
									пространстве.
								</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading>Autohotkey</seading>
							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>
									Тут я перечисляю тот функционал который по факту должен быть
									встроен в ось, но его всякими обходными путям и хаками нужно
									встраивать.
								</p>

								<p>Унификация символов</p>

								<p>Горячие клавиши для каждого приложения</p>

								<p>
									Если я часто использую тот или иной вебсайт я устанавливаю его
									как десктопное приложение, после этого через ашку я могу его
									быстро сфокусировать.
								</p>

								<p></p>
							</content>
						</section>

						<section style={styles.section}>
							<seading>Менеджер паролей</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<p>Тут ван пассворд вне конкуренции</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading>Менеджер паролей</seading>

							<content>
								<p>Тут ван пассворд вне конкуренции</p>
							</content>
						</section>

						<section style={styles.section}>
							<seading>Файловый менеджер</seading>

							<p>Тут есть Far, TotalCommande, Files, Yazi</p>

							<p>
								Выбор пал на Yazi, несмотря на то что это туи приложение, оно
								намного менее заграждено всяким хламом.
							</p>
						</section>

						<section style={styles.section}>
							<seading>Терминал</seading>

							<p>Либо стандартный виндовый, warp, WezTerm</p>

							<p>
								Выбрал warp для команд. Самые основные действия - это поиск по
								истории и копирование ошибок. Оба этих действия через варп
								работают лучше.
							</p>
						</section>

						<section style={styles.section}>
							<seading>ИДЕ</seading>

							<p>Тут есть Zed, WebStrom, Cursor</p>

							<p>
								В итогде я использую вебштом для ежедневной работы, а курсор
								только как ИИ.
							</p>
							<p>Стандартные плагины не работают совершенно.</p>
						</section>

						<section style={styles.section}>
							<seading>Браузер</seading>

							<p>
								Сразу нахуй идут браузеры ориентированные на приватность.
								Чесслово мне абсолютно похуй на то что обо мне собирают
								телеметрию (в разумных пределах). Даже больше того, пускай
								собирают, благодаря этому они фиксят баги и делают продукт
								круче.
							</p>

							<p>Хром - для браузинга.</p>
							<p>Вот куча плагинов для работы в хроме.</p>
							<p>Хромиум - для разработки. В нем нет плагинов.</p>
						</section>

						<section style={styles.section}>
							<seading>Поисковик</seading>

							<p>Тут либо Everything, Либо omnisearch</p>

							<p>
								Omni хоть и выглядит посовременнее, обычно тот софт который
								появился позже тот лучше. Но после ввода в поиск не работают
								стрелочки (стрелочки карл!) это же настолько очевидный
								функционал. Сразу после установки удалил это гавно.
							</p>
						</section>

						<section style={styles.section}>
							<p>
								Рекомендую зафиксировать определенную позицию за каждым
								приложением, так удобнее сразу знать куда смотреть.
								<ul>
									<li>Слева-слева терминал.</li>
									<li>Слева браузер и Chrome Dev Tools.</li>
									<li>Обычно у меня на основном открыта IDE .</li>
									<li>Справа ИИ.</li>
									<li>Справа-справа все мессенджеры (почта, тг, вотсап...).</li>
								</ul>
							</p>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Файловый менеджер</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								<ul>
									<li></li>
								</ul>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Текстовый редактор</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Тут я выбирал между Cursor, WebStorm, Zed - тут явный фаворит
								это WebStorm.
								<ul>
									<li>
										Очень нравится Zed но с ним есть большая, он жрет
										значительно меньше памяти. Вот скриншот.
									</li>
								</ul>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>ИИ модель</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Я проанализировал все ИИ модели следующим образом - я сначала
								написал небольшой тестовый проект полностью сам. И потом
								попросил все возможные ИИ в максимальной конфигурации написать
								точно такой же проект. После этого я выбрал ту, код которой мне
								понравился больше всех.
								<ul>
									<li></li>
								</ul>
								При использовании ИИ модели ее можно использовать либо через
								официальный гуи либо через курсор либо через WebStorm плагин,
								вебшторм плагины просто ужасные для ИИ. Больше половины моделей
								у меня тупо не запускались.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>AHK</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Есть определенная часть функционала, которая я бы хотел что бы
								была представлена в операционной системе нативно. Я настроил
								долгое нажатие на горячую клавишу - когда она нажимается то
								фокусируется определенное приложение.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Железо</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Я в деньгах не особо стеснен, поэтому железо просто топовое. Не
								то что бы я особо был игроманом, иногда конечно играю, но не
								ради этого я покупаю топовое железо.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Мышка</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Тут есть однозначный виннер.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Стол</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Самый удобный сетап, логти находятся на столе. Это крайне
								удобно. Плюс к этому мониторы можно расположить по дуге. Четыре
								монитора другим образом отобразить у меня бы не получилось.
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
							<seading style={styles.seading}>ОС</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Тут три вариант - убунта, freebsd, макось, винда:
								<ul>
									<li>
										FreeBSD - мне нравится как сервер намного больше линукса
										(потому что фрибсд только одна, а дистрибутивов линукса
										хуева туча). Но для десктопа ее использовать это мазохизм.
									</li>
									<li>Убунта - отпадает.</li>
									<li>
										Макось - отпадает. Как минимум потому что не поддерживается
										AHK
									</li>
									<li>Винда - отпадает.</li>
									<li>
										Самое главное преимущество винды - это более удобная система
										по работе с окнам, чем на макоси. Ведь ось это по сути домик
										для окон.
									</li>
								</ul>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Терминал</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Тут три вариант - убунта, freebsd, макось, винда:
								<ul>
									<li>
										FreeBSD - мне нравится как сервер намного больше линукса
										(потому что фрибсд только одна, а дистрибутивов линукса
										хуева туча). Но для десктопа ее использовать это мазохизм.
									</li>
									<li>Убунта - отпадает.</li>
									<li>
										Макось - отпадает. Как минимум потому что не поддерживается
										AHK
									</li>
									<li>Винда - отпадает.</li>
									<li>
										Самое главное преимущество винды - это более удобная система
										по работе с окнам, чем на макоси. Ведь ось это по сути домик
										для окон.
									</li>
								</ul>
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Менеджер пароле</seading>

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
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Почта</seading>

							<content style={{ padding: desktop ? 20 : 10 }}>
								Для виртуальных карт и оплаты подписок я использую oplatym.ru.
							</content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Скриншоты</seading>

							<content style={{ padding: desktop ? 20 : 10 }}></content>
						</section>

						<section style={styles.section}>
							<seading style={styles.seading}>Остальное</seading>

							<content style={{ padding: desktop ? 20 : 10 }}></content>
						</section>

						{/*<section style={styles.section}>*/}
						{/*  <seading style={styles.seading}>ОС</seading>*/}

						{/*  <content style={{padding: desktop ? 20 : 10}}>*/}
						{/*    Тут три вариант - убунта, freebsd, макось, винда:*/}

						{/*    <ul>*/}
						{/*      <li>FreeBSD - мне нравится как сервер намного больше линукса (потому что фрибсд только одна, а дистрибутивов линукса хуева туча). Но для десктопа ее использовать это мазохизм.</li>*/}
						{/*      <li>Убунта - отпадает.</li>*/}
						{/*      <li>Макось - отпадает. Как минимум потому что не поддерживается AHK</li>*/}
						{/*      <li>Винда - отпадает.</li>*/}
						{/*      <li>Самое главное преимущество винды - это более удобная система по работе с окнам, чем на макоси. Ведь ось это по сути домик для окон.</li>*/}
						{/*    </ul>*/}
						{/*  </content>*/}
						{/*</section>*/}
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
