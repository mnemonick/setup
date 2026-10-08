import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import Modal from "~/components/Modal.tsx";
import BoilerplateModal from "~/components/BoilerplateModal.tsx";
import ComponentsModal from "~/components/ComponentsModal.tsx";
import SettingsModal from "~/components/SettingsModal.tsx";
import colors from "~/globals/colors.ts";
import translate from "~/globals/translate.ts";

export default function () {
	const m = translate(lexems());
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
    borderBottom: `1px dashed ${colors.border.medium}`
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
		background: 'linear-gradient(to right, transparent, hsl(210 100% 72% / 0.45) 45%, hsl(210 100% 72% / 0.45) 55%, transparent)',
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
    display: 'inline',
    borderBottom: `1px dashed ${colors.text.weak}`,
    position: 'relative',
    textDecoration: 'none'
  };

  const $border: CSSProperties = {
    position: "absolute",
    top: desktop ? 59 : 49,
    height: 1,
    background: colors.border.medium
  }

  const $term: CSSProperties = {
    display: 'inline',
    fontFamily: 'Play',
    borderRadius: 5,
    padding: '0px 4px',
    border: `1px solid ${colors.border.strong}`,
    letterSpacing: 1
  };

  const $b: CSSProperties = {
    marginRight: 5,
    color: colors.text.strong,
    fontWeight: 500
  };

  const $p: CSSProperties = {
    margin: 20
  };

  const $ul: CSSProperties = {
    marginBottom: 0,
    marginTop: 5
  };

  const $separator: CSSProperties = {
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
							<GridElectrons
								styles={$electrons}
								width={layout.left}
								height={grid_height}
							/>
						</grid-left>
					) : null}
					{desktop ? (
						<grid-right style={$gridRight}>
							<GridElectrons
								styles={$electrons}
								width={layout.left}
								height={grid_height}
							/>
						</grid-right>
					) : null}

					<content style={$content}>
						<category style={{ ...$category, marginTop: 0 }}>
							<topper style={$topper}>Введение</topper>

              <p style={$p}>
                В детстве я много играл в компьютерные игры и заметил, что мне больше нравилась не сама игра, а процесс ее настройки.
                Я даже специально скачивал конфиги про игроков, смотрел какие у них настройки и дорабатывал свой конфиг.
              </p>

              <p style={$p}>
                Прошло время, в игры я играть перестал, но интерес к настройке всего и вся у меня остался.
                В этой статье я хочу опубликовать свой "конфиг" заточенный под программирование.
                Железо, софт и горячие клавиши для меня один стек: если действие делается руками каждый день, оно должно стать хоткеем или скриптом.
              </p>

              <p style={$p}>
                Этот текст написан человеком.
                ИИ использовался только для обучения и проверки на ошибки.
              </p>
						</category>

            <separator style={$separator}>
              <line style={$separatorLine} />
              <caption style={$separatorCaption}>Рабочее место</caption>
              <line style={$separatorLine} />
            </separator>

            <category style={$category}>
							<topper style={$topper}>Стол</topper>

              <p style={$p}>
                На рынке есть огромная куча супер дорогих столов со всякими наворотами: куча розеток, usb-портов, rgb-подсветка, но это все мне вообще не нужно.
                Самое главное требования у меня к столу - это то, что бы он был <clickable onClick={() => alert('TODO')} style={$clickable}>угловой</clickable>.
                У этого два больших преимущества:

                <ul style={$ul}>
                  <li>
                    <b style={$b}>Удобная позиция для локтей.</b>
                    Локтями очень удобно упираться в стол - они не висят никогда.
                  </li>
                  <li>
                    <b style={$b}>Больше пространства для мониторов.</b>
                    В работе я использую 5 мониторов, за обычным столом расположить их так же удобно не получилось бы.
                  </li>
                </ul>
              </p>

              <p style={$p}>
                Нормальных угловых столов на рынке я не нашел.
                У тех которые есть слишком узкая столешница, либо они не достаточно длинные.
                Я купил два самых обычных стола из <term style={$term}>IKEA</term> и соединил их снизу <clickable onClick={() => alert('TODO')} style={$clickable}>пластинами</clickable>.
                Это намного дешевле и удобнее чем все эти умные RGB, геймерские столы с кучей розеток и USB портов.
              </p>

              <p style={$p}>
                У этого есть небольшой недостаток - снизу постоянно мешает <clickable onClick={() => alert('TODO')} style={$clickable}>ножка стола</clickable>, но к этому я уже привык.
              </p>
						</category>

            <category style={$category}>
              <topper style={$topper}>Стул</topper>

              <p style={$p}>
                Казалось бы стул это мелочь, но я провожу сидя за компьютером в день по 8 часов.
                И удобство стула для меня намного важнее, чем количество ядер у процессора.
              </p>

              <p style={$p}>
                Первое требование к стулу - что бы не было подлокотников (или их можно было убрать).
                Логти у меня всегда на столе, подлокотники только мешают.
              </p>

              <p style={$p}>
                Второе это что бы можно было сидеть в позе <clickable onClick={() => alert('TODO')} style={$clickable}>наездника</clickable>.
                Мне удобно время от времени менять позы.
                По этой причине я отказался от хайпового <a href="https://www.hermanmiller.com">Herman Miller Aeron</a>.
              </p>

              <p style={$p}>
                Остановился на одном из самых популярных оффисных стульев в мире - <a href="https://ikeamega.ru/officechairs/tproduct/951877794252-markus-markus-ofisnoe-kreslo-vissle-svet" style={$term}>IKEA Marcus</a>.
                Подлокотники убираются, низкая посадка, можно сидеть в позе наездника.
                Мне более ничего и не нужно.
              </p>
            </category>

            <category style={$category}>
              <topper style={$topper}>Очки</topper>

              <p style={$p}>
                Если вы хотите прокачать рабочее место - уделите внимание очкам <b style={$b}>даже если</b>на зрение не жалуетесь.
              </p>

              <p style={$p}>
                Я вот на зрение не жалуюсь совсем, вывески на улице читаю нормально, номера автобусов вижу издалека.
                Но несмотря на это в очках читать текст на экране <b style={$b}>заметно удобнее</b>.
                Возможно, у вас будет так же.
              </p>

              <p style={$p}>
                Многие концентрируются на характеристиках железа, но не знают про то, что очки могут улучшить изображение <b style={$b}>сильнее</b> чем дорогой монитор или видеокарта.
                Плюс к тому глаза будут меньше уставать, что позволит сохранить вас зрение.
              </p>
            </category>

            <separator style={$separator}>
              <line style={$separatorLine} />
              <caption style={$separatorCaption}>Железо</caption>
              <line style={$separatorLine} />
            </separator>

            <category style={$category}>
              <topper style={$topper}>Мониторы</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Количество мониторов для меня это самый важный параметр.
                  Намного важнее, чем мощный процессор или видео-карта.
                  У меня стоит 5 мониторов: один основной по центру, и четыре дополнительных по бокам вертикально.
                </p>

                <p style={$p}>
                  Использовать большее пяти мониторов - это уже не практично.
                  Если ставить больше дополнительных, то они будут слишком далеко.
                  Если ставить мониторы выше - то вверх смотреть <b style={$b}>крайне не удобно</b> (был печальный опыт).
                  В идеале верхняя граница горизонтального монитора должна быть на уровне глаз (не по центру, вниз смотреть удобнее, чем вверх).
                  Смотреть в самый верх вертикальных мониторов мне уже немного дискомфортно, но благо туда приходится смотреть не часто.
                </p>

                <p style={$p}>
                  Мои требования к мониторам:
                  <ul style={$ul}>
                    <li>
                      <b style={$b}>Диогональ:</b> 27 для основного, 24 для дополнительных.
                      Если диогональ основного монитора больше 27 дюймов, то дополнительные уезжают слишком далеко.
                      Если вертикально ставить мониторы с диогональю больше 24 дюймов, то это будет уже слишком высоко и не удобно.
                      Все обычно гонятся за большими мониторами, но в программировании в этом нет необходимости.
                      27 дюймов для основного и 24 для дополнительных - это самые оптимальные диогонали.
                    </li>
                    <li>
                      <b style={$b}>Разрешение:</b> <term style={$term}>3840x2160</term> для основного, <term style={$term}>2560x1440</term> для дополнительных.
                      На основном мониторе должно быть достаточно места что бы в IDE помещалось <clickable style={$clickable} onClick={() => alert('TODO')}>2 сплита и дерево файлов</clickable>.
                      27" 4K это около <term style={$term}>163 PPI</term>, 24" QHD около <term style={$term}>123 PPI</term>.
                      Текст на основном острый, боковые не мылят, если согласовать масштаб Windows.
                      На дополнительных мониторах ширина составляет <term style={$term}>1440</term> пикселей, а это самая популярная ширина на ноутбуках.
                      Так что практически все приложения будут отображаться нормально, не смотря на то что монитор стоит вертикально.
                    </li>
                    <li>
                      <b style={$b}>Матрица:</b> желательно какой-нибудь <term style={$term}>OLED</term> (<term style={$term}>WOLED</term> или <term style={$term}>QD-OLED</term>), но и <term style={$term}>IPS</term> подойдет.
                      Матрица влияет на качество картинки, на которую в программировании по большому счету пофиг.
                    </li>
                    <li>
                      <b style={$b}>Покрытие:</b> обязательно матовое (не глянцевое).
                      Глянцевое лучше передает цвета, но на матовом меньше бликов.
                      Отсутствие бликов важнее, чем красивая картинка.
                    </li>
                  </ul>
                </p>

                <p style={$p}>
                  Под эти критерии подходит достаточно большое количество мониторов, я выбрал:
                  <ul style={$ul}>
                    <li>Основной - <a href="TODO">Samsung G80SH</a>.</li>
                    <li>Четыре дополнительных - <a href="https://www.philips.co.uk/c-p/24B2U3601_00/business-monitor-lcd-monitor-with-usb-c">Philips 24B2U3601</a>.</li>
                  </ul>
                </p>
                <p style={$p}>
                  Все мониторы стоят на кронштейнах и скреплены сзади <clickable onClick={() => alert('TODO')} style={$clickable}>суперклеем с дверными петлями</clickable>, чтобы не было зазоров.
                </p>

                <p style={$p}>
                  Пять мониторов это ещё и задачка по портам.
                  У флагманской видеокарты обычно 3–4 выхода, а экранов у меня пять.
                  Поэтому дополнительные <term style={$term}>Philips</term> выбраны ещё и из‑за <term style={$term}>DisplayPort Out</term>: их можно вешать цепочкой <term style={$term}>MST / daisy chain</term>, а не покупать док и не резать слот видеокарты.
                </p>

                <p style={$p}>
                  Масштаб Windows на основном 4K держу так, чтобы логическая ширина совпадала с боковыми <term style={$term}>1440</term>.
                  Иначе окна, которые перетаскиваешь с центра на вертикальный монитор, прыгают по размеру.
                  Гнаться за ультрашироким 49" я не стал: в IDE мне нужны независимые приложения, а не одна огромная поверхность.
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: undefined}}>
                <p style={$p}>
                  Каждое приложение я размещаю за своим монитором:

                  <ul style={$ul}>
                    <li>Слева-слева: <a href="https://www.warp.dev">Warp</a> (это продвинутый терминал).</li>
                    <li>Слева: <a href="https://www.chromium.org">Chromium</a> с открытым дебаггером.</li>
                    <li>Центр: <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> | <a href="https://www.google.com/chrome/">Chrome</a> | любое другое временное приложение.</li>
                    <li>Справа: <a href="https://claude.ai">Claude</a> | любая другая нейросеть.</li>
                    <li>Справа-справа: <a href="https://www.thunderbird.net">Thunderbird</a> | <a href="https://telegram.org">Telegram</a> | <a href="https://slack.com">Slack</a> | любой другой мессенджер.</li>
                  </ul>
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Клавиатура</topper>

              <p style={$p}>
                Клавиатура у меня не обычная, а <a href="https://kinesis-ergo.com/shop/advantage2">Kinesis Advantage 2</a>.
                Словами не описать, насколько я ее обожаю.
                Она <b style={$b}>намного</b> удобнее обычных клавиатур.
              </p>

              <p style={$p}>
                <b style={$b}>Клавиши под большие пальцы.</b>
                На обычных клавиатурах большим пальцем можно нажать только на пробел.
                На <term style={$term}>Kinesis Advantage 2</term> большими пальцами можно нажать 12 клавиш (по 6 на каждый большой палец): <term style={$term}>PageUp</term> <term style={$term}>PageDown</term> <term style={$term}>Backspace</term> <term style={$term}>Delete</term> <term style={$term}>Home</term> <term style={$term}>End</term> <term style={$term}>Space</term> <term style={$term}>Enter</term> <term style={$term}>Alt</term> <term style={$term}>Ctrl</term> <term style={$term}>Alt+Shift</term> <term style={$term}>Alt+Ctrl</term> <term style={$term}>Alt+Ctrl+Shift</term>.
                Последние 3 настроены через макрос, зажимается одна клавиша и равносильно нажатию сразу нескольких модификаторов.
              </p>

              <p style={$p}>
                Большой палец - это самый функциональный палец на руке, и клавиатура спроектирована так, что им нажимаются самые часто-используемые клавиши.
              </p>

              <p style={$p}>
                <b style={$b}>Расположение стрелок.</b>
                Стрелки нажимаются указательным и средним пальцем <clickable style={$clickable}>без переноса руки</clickable>.
                На обычных клавиатурах для навигации приходится двигать кисть.
              </p>

              <p style={$p}>
                <b style={$b}>Позиция для локтей.</b>
                Локти разведены дальше, вместе с угловым столом это очень удобная позиция.
              </p>

              <p style={$p}>
                <b style={$b}>Углубления.</b>
                Благодаря углублениям на клавиатуре ладонь лежит удобнее с физиологической точки зрения.
              </p>

              <p style={$p}>
                Раскладку не менял на <term style={$term}>Colemak</term> / <term style={$term}>Dvorak</term> / <term style={$term}>Workman</term>.
                В вакууме они быстрее, но я живу в хоткеях IDE, браузера и <a href="https://www.autohotkey.com">AutoHotkey</a>.
                Ломать <term style={$term}>QWERTY</term> ради теоретических WPM — глупо, если <term style={$term}>CTRL-S</term> и навигация сидят в мышцах глубже, чем буквы.
              </p>

              <p style={$p}>
                У этой клавиатуры есть три минуса:

                <ul style={$ul}>
                  <li>
                    <b style={$b}>Цена:</b>
                    $499 долларов за обычную версию $600 за bluetooth
                  </li>
                  <li>
                    <b style={$b}>Порог входа:</b>
                    Требуется достаточно много времени на то, что бы привыкнуть к другому расположению клавишь.
                    Вы даже не представляете насколько сложно глубоко в подсознании сидит навык печати.
                    Первые месяц-два будет очень тяжело.
                  </li>
                  <li>
                    <b style={$b}>Не для игр:</b>
                    Расположение клавиш хорошо подходит для удобной печати, но не для игр.
                  </li>
                </ul>
              </p>
            </category>

            <category style={$category}>
              <topper style={$topper}>Мышка</topper>

              <p style={$p}>
                Мои требования к мышке:

                <ul style={$ul}>
                  <li>
                    <b style={$b}>Хват - <term style={$term}>Claw</term>.</b>
                    Я вообще не понимаю как люди пользуются мышками где рука должна полностью лежать на мышке.
                  </li>
                  <li>
                    <b style={$b}>Симметричная форма.</b>
                    Все эти попытки подстроить мышку под форму руки - не добавляют удобства (по крайней мере для меня).
                  </li>
                  <li>
                    <b style={$b}>Беспроводные.</b>
                    Вообще чем меньше проводов тем лучше.
                  </li>
                  <li>
                    <b style={$b}>Кнопки.</b>
                    Я программирую боковые кнопки на копирование и вставку через <a href="https://www.autohotkey.com">AutoHotkey</a>.
                  </li>
                </ul>
              </p>

              <p style={$p}>
                Дальше просто выбираем мышку, которая удовлетворяет всем этим требованиям и держит заряд больше всего.
                Под эти требования подходит очень много мышек, я выбрал <a href="https://www.logitechg.com/en-us/shop/p/pro-x2-superlight-wireless-mouse">Logitech G Pro X Superlight 2</a>.
              </p>
            </category>

            <category style={$category}>
              <topper style={$topper}>Видеокарта</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Сразу скажу, что FPS в играх меня не интересует вообще.
                  Видеокарта очень сильно влияет на скорость работы локальных нейросетей, которые я время от времени использую.
                  Если бы не локальные нейросети, то мне бы подошла практическая любая видеокарта.
                  Поэтому к видеокарте у меня одно единственное требование - локальные нейросети должны работать как можно быстрее.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Для замера скорости работы нейросетей запускается локально <a href="TODO">Llama 3 8B at Q4_K_M</a> и смотрят сколько токенов в секунду генерирует нейросеть.
                </p>

                <p style={$p}>
                  Вот показатели флагманских видеокарт от <term style={$term}>Nvidia</term> и <term style={$term}>AMD</term>:
                  <ul style={$ul}>
                    <li><a href="TODO">Nvidia RTX 5090</a> - 220 tokens/s</li>
                    <li><a href="TODO">AMD 9070 XT</a> - 95 tokens/s</li>
                  </ul>
                </p>

                <p style={$p}>
                  Разница огромная, но <a href="TODO">Nvidia RTX 5090</a> стоит около $4.000, а <a href="TODO">AMD RX 9070 XT</a> около 800$.
                  Каждый решает сам, готов ли он переплачивать или нет.
                  Я очень активно использую локальные нейросети, поэтому я выбрал <a href="TODO">Nvidia RTX 5090</a>.
                  Мне нужна не картинка в 4K 240 Гц, а объём <term style={$term}>VRAM</term> и скорость матричных умножений.
                  Слот держу в <term style={$term}>PCIe 5.0 x16</term>: когда модель не влезает в видеокарту, куски едут из оперативки, и обрезанный x8 уже тормозит.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Процессор</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Мощный процессор в программировании не особо-то и нужен.
                  Но он сильно влияет на скорость работы локальных нейростей, если те не полностью помещаются в видеокарту.
                </p>

                <p style={$p}>
                  Процессор, как собственно и любой другое железо, я выбираю не по техническим характеристикам, а по бенчмаркам.
                  Есть огромное количество различных бенчмарков, я предпочитаю больше всего <a href="TODO">GeekBench</a>.
                </p>

                <p style={$p}>
                  Процессоры сейчас делают только <term style={$term}>AMD</term> и <term style={$term}>Intel</term>, поэтому сравним их флагманские модели:

                  <ul style={$ul}>
                    <li><a href="TODO">AMD Ryzen 9950X</a> - 999 очков</li>
                    <li><a href="TODO">Intel Core Ultra 9 285k</a> - 999 очков</li>
                  </ul>
                </p>

                <p style={$p}>
                  К тому же на <term style={$term}>AMD</term> процессорах можно увеличить тактовую частоту <term style={$term}>Infinity Fabric</term>.
                  Сладкая точка для меня: память <term style={$term}>DDR5-6000</term> и <term style={$term}>FCLK 2000</term> в режиме 1:1, без лотереи на 7200 МТ/с.
                  Поэтому я выбираю <a href="TODO" style={$term}>AMD Ryzen 9950X</a>.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>SSD</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Быстрый SSD влияет на скорость работы программ намного больше чем мощный процессор.
                  Cамое главный параметр на который нужно смотреть - это <term style={$term}>IOPS</term> (Input Output Per Second).
                  Маркетинг пишет последовательные ГБ/с, а IDE, git status и поиск по репозиторию живут на случайном доступе.
                  Мне хватает 4TB с большим запасом.
                </p>

                <p style={$p}>
                  Количество <term style={$term}>IOPS</term> у флагманских моделей трех основных конкурентов:
                  <ul style={$ul}>
                    <li>
                      <a href="TODO">Crucial T710</a> - 2300 IOPS
                    </li>
                    <li>
                      <a href="TODO">MSI SPATIUM M571</a> - 2600 IOPS.
                    </li>
                    <li>
                      <a href="TODO">Samsung SSD 9100 Pro</a> - 2600 IOPS.
                    </li>
                  </ul>
                </p>

                <p style={$p}>
                  У <term style={$term}>Samsung</term> столько же <term style={$term}>IOPS</term> столько же сколько и у <term style={$term}>MSI</term>, но я предпочитаю <term style={$term}>Samsung</term> потому что они сами делаю свой контроллер (другие производители закупают контроллеры у подрядчиков).
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Оперативная память</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Для программирования по большому счету достаточно даже 32 GB оперативки, но я ведь еще запускаю локальные нейросети.
                  Если нейросеть полностью не помещается в видеокарту, то определенная ее часть переносится в оперативку.
                  Для обычных нейросетей будет достаточно 64 GB, но мне хочется запускать самые крутые нейросети с 70B+ параметрами без квантизации, поэтому нужно 128 GB.
                </p>

                <p style={$p}>
                  Мои критерии при выборе оперативки:
                  <ul style={$ul}>
                    <li><b style={$b}>Тип - DDR5.</b> Современные процессоры и материнские платы попросту не работают с <term style={$term}>DDR4</term> </li>
                    <li><b style={$b}>Объем - 128 GB комплектом 2×64.</b> Две планки лучше, чем четыре по 32 GB: контроллер памяти не душит частоту и <term style={$term}>FCLK</term>.</li>
                    <li><b style={$b}>Поддержка EXPO.</b> С помощью этой функции можно просто переключить один параметр в BIOS и получить оптимальные параметры, без ковыряния низкоуровневых параметров.</li>
                    <li><b style={$b}>Не геймерская.</b> Очень много какого железа позиционируется как геймерское, для меня это всегда огромный минус.</li>
                  </ul>
                </p>

                <p style={$p}>
                  Очень мало моделей подходят под эти критерии, я выбрал <a href="TODO">Kingston Fury Beast DDR5</a>.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Материнска плата</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Самое главное, что бы материнская плата поддерживала все выбранное железо.
                </p>

                <p style={$p}>
                  Мои требования к материнской плате:
                  <ul style={$ul}>
                    <li>
                      <b style={$b}>Поддержка <term style={$term}>AM5</term>.</b>
                      Под <term style={$term}>AMD</term> процессор нужен <term style={$term}>AM5</term> сокет на материнской плате.
                    </li>
                    <li>
                      <b style={$b}>Поддержка <term style={$term}>FCLK</term>.</b>
                      Этой функцией можно увеличить тактовую частоту <term style={$term}>Inifinity Fabric</term>.
                      По бенчмаркам это дает +10-20% скорости к нейросетям, которые не помещаются в видеокарте и скидываются в <term style={$term}>RAM</term>.
                    </li>
                    <li>
                      <b style={$b}>Поддержка <term style={$term}>EXPO</term>.</b>
                      Вместо ковыряния всех параметров оперативки вручную удобнее просто переключить один тумблер.
                    </li>
                    <li>
                      <b style={$b}>Поддержка 4 слотов <term style={$term}>DDR5</term>.</b>
                      Сейчас я использую только 2 слота, но пусть будет 4 на случай если захочется больше.
                    </li>
                    <li>
                      <b style={$b}>Поддержка <term style={$term}>WiFi</term> и <term style={$term}>Bluetooth</term>.</b>
                      Удобно, если они сразу есть на материнке.
                    </li>
                    <li>
                      <b style={$b}>Поддержка <term style={$term}>PCIe 5.0</term>.</b>
                      Процессор общается с диском и видео-картой по <term style={$term}>PCIe</term>, чем он быстрее, тем быстрее это общение.
                    </li>
                    <li>
                      <b style={$b}><term style={$term}>Resizable BAR</term>.</b>
                      Процессор должен видеть всю память видеокарты целиком, а не кусками по 256 МБ.
                      Для оффлоада модели из <term style={$term}>RAM</term> в GPU это не маркетинг, а шина.
                    </li>
                  </ul>
                </p>

                <p style={$p}>
                  Под эти критерии подходит несколько материнок, выбрал <a href="TODO">MSI MAG X870E Tomahawk</a>.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Наушники</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Нужны полноразмерные <term style={$term}>over-ear</term> - чаша вокруг уха, не накладные таблетки.
                  Накладные давят на хрящ, через час уже не работается.
                  Геймерские гарнитуры с микрофоном на палке и RGB сразу нет - микрофон на столе лучше.
                </p>

                <p style={$p}>
                  Выбрал <a href="https://us.sennheiser-hearing.com/products/momentum-5-wireless?variant=62714248495475">Sennheiser Momentum 5 Wireless</a>.
                  Беспроводные, шумодав, до 57 часов с ANC, батарею можно заменить отвёрткой.
                  Для звонков и самолёта важнее, чем «студийный» провод без микрофона.
                </p>
              </section>
            </category>

            <separator style={$separator}>
              <line style={$separatorLine} />
              <caption style={$separatorCaption}>Софт</caption>
              <line style={$separatorLine} />
            </separator>

						<category style={$category}>
							<topper style={$topper}>Операционная система</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Вы можете подумать, что раз я такой техногик, то у меня что-то типа <a href="TODO">Ubuntu</a>.
                  Но это совершенно не так.
                  Самым главным минусом убунты для меня является то, что ней не работает <a href="https://www.autohotkey.com">AutoHotkey</a> (который я использую <b style={$b}>очень</b> активно).
                  По этой же причине я не смотрю в сторону <a href="https://www.apple.com/macos">MacOS</a>.
                  Так же на винде самая удобная система управления окнами.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Настройка <a href="https://www.microsoft.com/windows">Windows</a> у меня происходит в три этапа:
                  <ul style={$ul}>
                    <li><clickable onClick={() => setModal("boilerplate")} style={$clickable}>Удаление бойлерплейта</clickable></li>
                    <li><clickable onClick={() => setModal("components")} style={$clickable}>Отключение компонентов</clickable></li>
                    <li><clickable onClick={() => setModal("settings")} style={$clickable}>Обычные настройки</clickable></li>
                  </ul>
                </p>
              </section>

              <p style={$p}>
                На <a href="https://www.microsoft.com/windows">Windows</a> (как и на всех ОС) полный кавардак с установкой приложений по историческим причинам.

                <ul style={$ul}>
                  <li>Приложение можно поставить через <a href="TODO">winget</a>.</li>
                  <li>Приложение можно скачать через <a href="TODO">Windows Store</a>.</li>
                  <li>Приложение можно открыть в браузере.</li>
                  <li>Приложение можно скачать из веб-приложения.</li>
                  <li>Из вебсайта можно создать <clickable style={$clickable}>ярлык</clickable>, <clickable style={$clickable}>PWA</clickable>, <clickable style={$clickable}>установить как приложение</clickable>.</li>
                </ul>
              </p>

              <p style={$p}>
                Что бы все это как-то унифицировать, я придерживаюсь определенного алгоритма по установке приложений.

                <ul style={$ul}>
                  <li>Сначала пытаюсь поставить приложение через <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a>.</li>
                  <li>
                    Если в <a href="https://learn.microsoft.com/windows/package-manager/winget/">winget</a> приложения нет:
                    <ul>
                      <li>Если это веб-приложение то создаю <clickable style={$clickable}>десктопное приложение</clickable>.</li>
                      <li>Если это нативное приложение то гружу приложения с официального сайта.</li>
                    </ul>
                  </li>
                </ul>
              </p>

              <p style={$p}>
                Из моей практики это покрывает все пограничные случаи, почти не приходится пользоваться <a>Windows Store</a> (это скорее исключение).
              </p>
						</category>

						<category style={$category}>
							<topper style={$topper}>AutoHotkey</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://www.autohotkey.com">AutoHotkey</a> - язык программирования специально заточенный под создание своих горячих клавиш на <a href="TODO">Windows</a>.
                  Ниже - то, что по факту должно быть в ОС, но встраивается обходными путями и хаками.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Макросы.</b>
                  Не смотря на то что я очень люблю свою клавиатуру, определенные клавиши имеют удобное расположение, но то действие которое они выполняют используется крайне редко.
                  Это поправимо макросами.
                  Вот вам <clickable style={$clickable}>картинка</clickable> для наглядности где какие клавиши расположены.

                  <ul>
                    <li><term style={$term}>Caps Lock</term> = <term style={$term}>Ctrl</term>.</li>
                    <li><term style={$term}>Win</term> = <term style={$term}>Ctrl-Shift</term>.</li>
                    <li><term style={$term}>Right Ctrl</term> = <term style={$term}>Alt-Shift</term></li>
                    <li><term style={$term}>Left-Ctrl</term> = <term style={$term}>Alt-Ctrl-Shift</term></li>
                    <li><term style={$term}>/</term> = <term style={$term}>Alt-Tab</term>.</li>
                    <li><term style={$term}>Insert</term> = <term style={$term}>Shift-Tab</term>.</li>
                    <li><term style={$term}>~</term> = <term style={$term}>Esc</term>.</li>
                    <li><term style={$term}>ESC</term> = <term style={$term}>Win</term>.</li>
                  </ul>
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Унификация.</b>
                  Зафиксированы те символы которые печатаются по <term style={$term}>Shift-[0-9]</term>.
                  Сделал так, что бы печатался один и тот же символ вне зависимости от раскладки.
                  Так же часто используемые символы перенесены на <term style={$term}>Ctrl-[0-9]</term> (это слэши и все виды скобочек).
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Клавиатурные жесты.</b>
                  Сейчас по умолчанию долгом зажатии клавиши символ печатается много раз одна и та же буква - это поведение полезно при навигации, но абсолютно бесполезно на буквах.
                  Я сделал так, что при долгом зажатии буквы (или цифры) запускается определенное приложение.
                  Это поведение раз в миллион полезнее, чем печать большого количества одного и того же символа.
                  Вот <clickable style={$clickable}>список</clickable> моих биндов.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Свитчинг.</b>
                  При нажатии на обратный слэш, происходит переключение фокуса между текущим и предыдущим приложением (эмулируется нажатие <term style={$term}>Alt-Tab</term>).
                  Это супер-удобная клавиша для нажатия, но на которую печатается символ, который требуется один раз в неделю.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Селектор</b>
                  Стандартный альтаб меня не устраивал.
                  На нем можно переключаться только между запущенными приложениями, но нельзя запускать новые приложения.
                  Так же в нем нельзя фокусировать приложение вводя его имя.
                </p>

                <p style={$p}>
                  При долгом нажатии на клавишу <term style={$term}>a</term> запускается селектор в котором все ярлыки сортируются с помощью <a href="TODO">fzf</a>.
                  Так же добавлена проверка, если приложение запущено, то оно фокусируется, если нет то запускается.
                  То есть фокусировка и запуск приложения происходит через один и тот же интерфейс.
                  <clickable onClick={() => alert('TODO')} style={{...$clickable, marginLeft: 5}}>Вот как это работает</clickable>.
                </p>

                <p style={$p}>
                  В итоге если приложению назначен клавиатурный жест - я запускаю его через долгое нажатие.
                  Если нет - то использую свой селектор.
                  При этом запуск и фокус веб-приложений так же происходит через этот селектор (при установке веб-приложения автоматически создается ярлык на десктопе).
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Смена раскладки.</b>
                  Раскладку нужно менять по 100 раз на дню.
                  Ни <a href="https://yandex.ru/soft/punto/">Punto Switcher</a>, ни <a href="https://caramba-switcher.com">Caramba Switcher</a> мне не зашли (работают в 90% случаев, но отавшиеся 10% все портят).
                </p>

                <p style={$p}>
                  Я заметил, что проблемы с раскладкой возникают только в момент начала печати.
                  В моем скрипте написана логика, что при смене фокуса язык приложения сбрасывается на значение по умолчанию (язык указывается в названии ярлыка на десктопе, например <term style={$term}>warp.en.lnk</term>).
                </p>

                <p style={$p}>
                  Таким образом легко нарабатывается навык при котором запоминается начальная раскладка каждого приложения.
                  А когда текст уже печатается то раскладка удерживается в голове, и переключать ее не вызывает проблем.
                </p>

                <p style={$p}>
                  Во время печати, я управляю раскладкой вручную через одиночное нажатие на правый <term style={$term}>Shift</term> без модификаторов.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <b style={$b}>Мышинные кнопки.</b>
                  Одна мышинная кнопка на копирование, вторая на вставку, нажатие на колесико - Enter.
                </p>
              </section>
						</category>

            <category style={$category}>
              <topper style={$topper}>Браузер</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Браузеры с фокусом на приватность сразу идут лесом (<a href="https://duckduckgo.com/app">Duckduckgo</a>, <a href="https://brave.com">Brave</a>, <a href="https://mullvad.net/en/browser">Mullvad</a>).
                  Как показывает практика, браузеры в своих попытках обеспечить приватность зачастую ломают функционал.
                  Честное слово, мне абсолютно пофиг на то что какое-то приложение мониторит мою активность и собирают аналитику.
                  Но мне не пофиг на то, когда веб-приложения ломаются.
                  Пускай собирают свою телеметрию, благодаря этому разработчики исправляют ошибки и делают продукт лучше.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  В <a href="https://www.opera.com">Opera</a> много разного различного встроенного функционала, но его можно легко реализовать через плагины в <a href="https://www.google.com/chrome/">Chrome</a>.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  От <a href="https://www.mozilla.org/firefox/">Firefox</a> я отказался потому что мне не нравится его интерфейс.
                  Устанавливаю его исключительно для кросс-браузерной разработки.
                </p>

                <p style={$p}>
                  Я остановился на <a href="https://www.google.com/chrome/">Chrome</a> для браузинга и <a href="https://www.chromium.org">Chromium</a> для разработки (им назначены разные горячие клавиши и они открываются на разных мониторах).
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Вот список моих маст хэв плагинов (ставятся в <a href="https://www.google.com/chrome/">Chrome</a>, не <a href="https://www.chromium.org">Chromium</a>):
                  <ul style={$ul}>
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

              <section style={$categorySection}>
                <p style={$p}>
                  В хроме нельзя редактировать горячие клавиши, но на помощ к нам приходит <a href="TODO">AutoHotkey</a>.
                  Вот <clickable style={$clickable}>список</clickable> моих горячих клавиш для хрома.
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: undefined}}>
                <p style={$p}>
                  Я искал, но не нашел плагина для инкрементального fuzzy поиска на странице.
                  Если кто-то ищет идею для своего небольшого open source проекта то вот она.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Редактор кода</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://cursor.com">Cursor</a> - позиционируется как редактор с самой продвинутой поддержкой нейросетей, но честно-говоря в поддержки ии я особо разрницы не заметил с <a href="">WebStorm</a> с установленным <a href="TODO">Claude</a> плагином.
                </p>

                <p style={$p}>
                  Но при этом покупая подписку на <a href="TODO">Claude</a> вы можете его использовать: в браузере, на телефоне, как TUI на сервере и так же получаете API ключ, который вы можете вставлять куда хотите.
                  <a href="https://cursor.com">Cursor</a> ничего из этого не поддерживает.
                </p>

                <p style={$p}>
                  Многие говорят, что плюсом курсора является то, что можно менять нейросети на лету, это прикольно, но честно говоря не думаю это такая прям киллер фича.
                </p>
              </section>


              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://zed.dev">Zed</a> - очень понравилось то насколько мало памяти он жрет (в 20 раз меньше).
                  Пытался на него перейти, но по функциональности он намного слабже <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://www.jetbrains.com/webstorm/">WebStorm</a> - самый функциональный редактор для разработки веб-приложений на текущий момент.
                  Если используете не для коммерческой разработки, то он бесплатен.
                </p>

                <p style={$p}>
                  Вот список того функционала, которым пользуюсь каждый день и который в <a href="TODO">Zed</a> так и <a href="TODO">Cursor</a> либо полностью отсутствует либо реализован хуже:
                  <ul style={$ul}>
                    <li>Поддержка <a href="https://git-scm.com">Git</a></li>
                    <li>История последних открытых файлов (вкладки даже отключил)</li>
                    <li>Локальная история</li>
                    <li>Открытие панелей в отдельных окнах</li>
                    <li>Интенты</li>
                    <li>Предпросмотр файла в дереве</li>
                    <li>Скоупы (Frontend и Backend помечаю разными цветами)</li>
                    <li>Вкладки при поиске</li>
                    <li>Quicklists: LocalHistory, <a href="https://git-scm.com">Git</a>, <a href="https://github.com">GitHub</a></li>
                    <li>И еще <b style={$b}>очень много</b> других мелочей.</li>
                  </ul>
                </p>

                <p style={$p}>
                  Вы будете смеяться, но вкладки я отключил.
                  Вместо них - Recent Files.
                </p>

                <p style={$p}>
                  Вот мой конфиг - можете импортировать.
                </p>

                <p style={$p}>
                  Вот мои настройки <clickable onClick={() => alert('TODO')} style={$clickable}>WebStorm</clickable>.
                </p>

                <p style={$p}>
                  Список плагинов: <a href="https://plugins.jetbrains.com/plugin/22072-kursor">Kursor</a> для подсветки.
                </p>
              </section>
            </category>


            <category style={$category}>
              <topper style={$topper}>Нейросеть</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Нейросети - совершили революцию, это глупо отрицать.
                  А в программировании они совершил революцию больше чем где-то бы то ни было еще.
                  И очень важно грамтно заинтегрировать нейросети в свой ежедневный рабочий процесс.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Первое что нужно, это выбрать правильную нейросить.
                  Я написал простенькое приложение, менеджер контактов, полностью своими руками без нейросетей.
                  И потом я просил разные ИИ написать точно такое же приложение по функционал, но только по тому описанию, которое я ей давал.
                  Для меня это намного более релевантный показатель, чем различные бенчмарки.
                </p>

                <p style={$p}>
                  Лучшей опцией оказался <a
                  href="https://claude.ai"
                >Claude</a> - у него особый фокус на программировании.
                  Очень хорошая интеграция с WebStorm и качественные плагин под <a
                  href=""
                >Chrome</a>.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Второе - это нужно настроить MCP-сервера.
                  Для тех кто не в курсе, MCP это протокол по которому в нейросети можно добавлять дополнительные данные, которыми она может пользоваться.
                  Вот список MCP‑серверов, которые подключаю.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  Время от времени запускаю модели локально через <a href="https://lmstudio.ai">LM Studio</a> и <a href="https://ollama.com">Ollama</a>.
                  Как ни странно локальные модели показывают почти такие же результаты, как и облачные.
                  Возможно когда-нибудь полностью перейду на локальную модель.
                </p>
              </section>
            </category>

            <category style={$category}>
              <topper style={$topper}>Файловый менеджер</topper>

              <section style={$categorySection}>
                <p style={$p}>
                  Вообще не должно быть такого, что бы требовался файловый менеджер, этот функционал должен нативно поддерживаться операционной системой, без необходимости ставить сторонние приложения.
                  Но имеет то, что имеем.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://yazi-rs.github.io">Yazi</a>
                  (42k звезд на <a href="https://github.com/sxyazi/yazi">Github</a>).
                  Самая главная фишка в том, что работает в терминале и управляется как Vim.
                  Он бы был идеальным если бы он был двухпанельным, поэтому отпадает сразу.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://www.farmanager.com">Far Manager</a> -
                  Старый двухпанельный файловый менеджер.
                  По функционалу и интерфейсу явно проигрывает <a href="https://www.ghisler.com">Total Commander</a>.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://files.community">Files</a> -
                  Неплохой дизайн, но слишком казуальный и по функционалу так же проигрывает <a href="https://www.ghisler.com">Total Commander</a>.
                </p>
              </section>

              <section style={$categorySection}>
                <p style={$p}>
                  <a href="https://www.ghisler.com">Total Commander</a> -
                  интерфейс не самый лучший, но он двух-панельный, функциональный и позволяет гибко настраивать горячие клавиши.
                  В <a href="https://www.ghisler.com">Total Commander</a> включил темную тему, убрал лишний UI, поставил шрифт <a href="https://sourcefoundry.org/hack/">Hack</a>.
                  Горячие клавиши заточены под мою клавиатуру и симметричны с теми, что в <a href="https://www.jetbrains.com/webstorm/">WebStorm</a>.
                  Вот как выглядит <clickable style={$clickable}>внешний вид</clickable> и вот мой <clickable style={$clickable}>конфиг</clickable>.
                </p>
              </section>
            </category>

						<category style={$category}>
							<topper style={$topper}>Терминал</topper>

              <p style={$p}>Варианты: стандартный виндовый, <a href="https://www.warp.dev">Warp</a>, <a href="https://wezfurlong.org/wezterm/">WezTerm</a>, <a href="https://sw.kovidgoyal.net/kitty/">kitty</a>.</p>

              <p style={$p}>
                По большому счету 80% взаимодействия - два действия:

                <ul style={$ul}>
                  <li>Поиск по истории</li>
                  <li>Копирование вывода</li>
                </ul>

                Оба в <a href="https://www.warp.dev">Warp</a> заметно удобнее.
                Сравните типичный вывод в обычном терминале и в <a href="https://www.warp.dev">Warp</a>.
              </p>

              <p style={$p}>
                При этом на кой черт в него запилили ИИ (сейчас его пилят куда ни попадя) и дерево проектов.
                Убрать бы весь этот функционал и сделать <a href="https://www.warp.dev">Warp</a> минималистичнее - было бы лучше.
                Я фанат минимализма, но функциональность все же важнее.
              </p>
						</category>

            <category style={$category}>
              <topper style={$topper}>Почта</topper>

              <p style={$p}>
                Для меня самое важное в почтовом клиенте - вкладки.
                Письма читать умеют все.
                Хочу, чтобы вкладки были внутри приложения, а не через несколько вкладок браузера.
                Поэтому смотрел на <a href="https://www.thunderbird.net">Thunderbird</a>.
              </p>

              <p style={$p}>
                Публичный домен как‑то несолидно, нужен сервер с кастомными доменами.
                Выбор пал на <a href="https://purelymail.com">PurelyMail</a> - самый дешевый почтовый сервер (10$ в год).
              </p>

              <p style={$p}>
                От почтового сервера нужно только одно: получить письмо и перенаправить его мне.
              </p>

              <p style={$p}>
                При этом все телефонные SMS и пуш‑уведомления у меня идут через почту.
              </p>
            </category>

						<category style={$category}>
							<topper style={$topper}>Менеджер паролей</topper>

              <p style={$p}>
                Аутентификация - снова тот функционал, который должен быть в ядре ОС.
                По историческим причинам этого нет, и сейчас можно войти через email, <a href="https://accounts.google.com">Google</a> или менеджер паролей.
                Нужно определиться с одним способом входа и дальше использовать только его.
              </p>
              <p style={$p}>
                <a href="https://1password.com">1Password</a> - стопроцентный фаворит.
                Можно хранить коды двухфакторной аутентификации (чего нет в <a href="https://accounts.google.com">Google</a>).
              </p>
						</category>

            <category style={$category}>
              <topper style={$topper}>Скриншоты</topper>

              <p style={$p}>
                Безоговорочный лидер - <a href="https://getsharex.com">ShareX</a> (39k звезд на <a href="https://github.com/ShareX/ShareX">Github</a>).
                Он может делать не только для скриншоты, он так же содержит и много других инструментов, которые я использую :пипетку, линейка, для записи видео.
              </p>

              <p style={$p}>
                <b style={$b}>Утилиты.</b>
                Глобальные функциональные клавиши назначены на стандартные инструменты.

                <ul style={$ul}>
                  <li><term style={$term}>F9</term> - сделать скриншот.</li>
                  <li><term style={$term}>F10</term> - распознать текст (полезно что бы отправить его нейросети, обычные картинки жрут очень много токенов).</li>
                  <li><term style={$term}>F11</term> - записать гифку.</li>
                  <li><term style={$term}>F12</term> - запустить пипетка.</li>
                  <li><term style={$term}>Print Screen</term> - экранная линейка.</li>
                  <li><term style={$term}>Scroll Lock</term> - скриншот со скроллом.</li>
                  <li><term style={$term}>Pause Break</term> - просмотреть мета-данные о файле.</li>
                </ul>
              </p>
            </category>

            <category style={$category}>
              <topper style={$topper}>Остальные приложения</topper>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Железо:
                  <ul style={$ul}>
                    <li>
                      <a href="https://www.cpuid.com/softwares/cpu-z.html">CPU-Z</a>
                      - простая и поэтому лучшая утилита для просмотра характеристик железа
                    </li>
                    <li>
                      <a href="https://www.hwinfo.com">HWiNFO</a>
                      - когда нужно не "какое железо", а температуры, лимиты питания и что именно троттлит.
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

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Деньги
                  <ul style={$ul}>
                    <li><a href="https://alfabank.ru">alfabank.ru</a> - так же крупный банк и маловероятно что с ним что-то случится, но кто знает.</li>
                    <li><a href="https://www.sberbank.ru">sberbank.ru</a> - пользуюсь Сбером, самый крупный банк; учитывая текущую экономическую ситуацию, кто знает, что будет с другими. Про Lehman Brothers тоже говорили, что он непотопляем, а ситуация в РФ сейчас тяжелее, чем в США в 2008.</li>
                    <li><a href="https://www.tradingview.com">TradingView</a> - мониторинг акций.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Магазины
                  <ul style={$ul}>
                    <li><a href="https://aliexpress.com">aliexpress.com</a> - совершенно ужасный интерфейс, долгая доставка, но там можно купить все и дешевле чем на других маркетплейсах.</li>
                    <li><a href="https://wildberries.ru">wildberries.ru</a> - если нужно что-то купить и не хочется ждать доставку с китая.</li>
                    <li><a href="https://ozon.ru">ozon.ru</a> - доставка продуктов.</li>
                    <li><a href="https://ebay.com">ebay.com</a>  - если нужно купить что‑то с рук в РФ.</li>
                    <li><a href="https://avito.com">avito.com</a>  - если нужно купить что‑то с рук за пределами РФ. Альтернатив по большому счету нет.</li>
                    <li><a href="https://github.com/rcmaehl/MSEdgeRedirect">ek.ua</a> - лучший вебсайт по выбору железу, намного лучше <a href="TODO">dns-shop.ru</a> / <a href="pcpartpicker.com">pcpartpicker.com</a> / <a href="newegg.com">newegg.com</a>.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Компиляторы и рантаймы - ставлю все, авось пригодится.
                  <ul style={$ul}>
                    <li><a href="https://github.com/PowerShell/PowerShell">PowerShell 7</a> (55k звезд на <a href="https://github.com/PowerShell/PowerShell">Github</a>) - последняя версия (по умолчанию ставится старая)</li>
                    <li><a href="https://nodejs.org">Node</a> - далеко не самый лучший язык, но его главное преимущество в том, что позволяет писать <term style={$term}>Frontend</term> и <term style={$term}>Backend</term> на одном и том же языке.</li>
                    <li><a href="https://deno.com">Deno</a> - более продвинутый форк <a href="https://nodejs.org">Node</a>.</li>
                    <li><a href="https://www.rust-lang.org">Rust</a> - лучший язык программирования на текущий момент по моему мнению.</li>
                    <li><a href="https://go.dev">Go</a> - из-за своей простоты лучше всего подходит для вайбкодинга.</li>
                    <li><a href="https://www.python.org">Python</a> - не особо часто использую, но требуется для некоторых инструментов.</li>
                    <li><a href="https://www.whatsmydns.net/">whatsmydns.net</a></li> - проверить как ведут себя днс.
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Мессенджеры
                  <ul style={$ul}>
                    <li><a href="https://telegram.org">Telegram</a> - основной мессенджер.</li>
                    <li><a href="https://whatsapp.com">WhatsApp</a> - для общения с родственниками.</li>
                    <li><a href="https://discord.com">Discord</a> - игровой мессенджер.</li>
                    <li><a href="https://slack.com">Slack</a> - рабочий мессенджер.</li>
                    <li><a href="https://zoom.us">Zoom</a> - видеосвязь.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Развлечения:
                  <ul style={$ul}>
                    <li><a href="https://youtube.com">YouTube</a> - основное развлекательное приложение.</li>
                    <li><a href="https://reddit.com">Reddit</a> - самый популярных форум в мире.</li>
                    <li><a href="https://x.com">Twitter</a> - основная соц сеть для чтение мировых новостей (нужно только подписаться на правильных людей).</li>
                    <li><a href="https://threads.net">Threads</a> - на мой взгляд круче чем <a href="https://x.com">Twitter</a> по интерфейсу, но к сожалению появился намного позже и поэтому менее популярен.</li>
                    <li><a href="https://bash.im">Bash</a> - старый добрый цитатник.</li>
                    <li><a href="https://habr.com">Habr</a> - техностатьи, раз в неделю захожу и читаю лучшее за неделю.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Форумы: по сути их сейчас заменили нейросети.
                  Захожу раз месяц и просматриваю топ самых популярных вопросов.
                  <ul style={$ul}>
                    <li><a href="https://stackoverflow.com">stackoverflow.com</a> - вопросы по программированию.</li>
                    <li><a href="https://superuser.com">superuser.com</a> - вопросы продвинутых пользователей.</li>
                    <li><a href="https://serverfault.com">serverfault.com</a> - вопросы по администрированию.</li>
                    <li><a href="https://security.stackexchange.com">security.stackexchange.com</a> - вопросы по безопасности.</li>
                    <li><a href="https://math.stackexchange.com">math.stackexchange.com</a> - вопросы по математике.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Инструменты для программирования
                  <ul style={$ul}>
                    <li><a href="https://git-scm.com">Git</a> - как по мне лучше, но гит это стандарт де-факто. Коммиты подписываю, конфиг с алиасами лежит рядом с остальным сетапом.</li>
                    <li><a href="https://github.com/jj-vcs/jj">Jujutsu</a> - более современный аналог гита.</li>
                    <li><a href="https://github.com">GitHub</a> - использую что бы мониторить самые последние и свежие инструменты.</li>
                    <li><a href="https://learn.microsoft.com/sysinternals/downloads/process-explorer">Process Explorer</a> - диспетчер задач для людей, которым нужно увидеть хендлы и DLL, а не просто процент CPU.</li>
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

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  В вебе шрифты скачиваются автоматически, но для некоторых десктопных приложений их нужно ставить явно.
                  <ul style={$ul}>
                    <li><a href="https://sourcefoundry.org/hack/">Hack</a> - лучший шрифт для программирования (терминал и редактор).</li>
                    <li><a href="https://fonts.google.com/specimen/Montserrat">Montserrat</a> - самый нейтральный шрифт.</li>
                    <li><a href="https://fonts.google.com/specimen/Play">Play</a> - красивые цифры.</li>
                    <li><a href="https://www.nerdfonts.com">Nerd Fonts</a> - иконки для терминала.</li>
                  </ul>
                </p>
              </section>

              <section style={{...$categorySection, borderBottom: $topper.borderBottom}}>
                <p style={$p}>
                  Остальное
                  <ul style={$ul}>
                    <li><a href="https://www.microsoft.com/software-download/windows11">MediaCreationTool</a> - создание установочных флешек.</li>
                    <li><a href="https://www.voidtools.com">Everything</a> - локальный поисковик файлов.</li>
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

            <separator style={$separator}>
              <line style={$separatorLine} />
              <caption style={$separatorCaption}>Заключение</caption>
              <line style={$separatorLine} />
            </separator>

            <category style={$category}>
							<topper style={$topper}>Что сюда не попало</topper>

              <p style={$p}>
                Популярные инструменты, которым я не нашел практического применения.
                Возможно, кому‑то они будут полезны.
              </p>

              <p style={$p}>
                <a href="https://github.com/ArcadeRenegade/SidebarDiagnostics">SideBar</a> (3k звезд на <a href="https://github.com/ArcadeRenegade/SidebarDiagnostics">Github</a>) - сомнительная необходимость: показывает нагрузку на железо, но по сути это редко нужно.
              </p>
              <p style={$p}>
                <a href="https://github.com/tw93/Pake">Pake</a> (61k звезд на <a href="https://github.com/tw93/Pake">Github</a>) - позволяет собирать бинарники из сайтов; непонятно зачем, если можно создать ярлык.
              </p>
              <p style={$p}>
                <li>

                </li>
                Локальный поисковик файлов, полностью заменил поиск в <a href="TODO">TotalCommander</a>.
              </p>
              <p style={$p}>
                <li><a href="TODO">Rufus</a> - продвинутый инструмент для создания загрузочных флешек.</li>
                Весь тот функционал, который там есть не особо требуется, по большому MediaCreationTool адресует все мои потребности.
              </p>
						</category>

            <category style={$category}>
              <topper style={$topper}>Заключение</topper>

              <p style={$p}>
                Многие концентрируются на процессоре и видеокарте, но на них легко сэкономить.
                Честно говоря, обновление процессора даже близко не дает столько же удобства, сколько стол, стул, мышка или очки - не говоря уже о мониторах.
              </p>

              <p style={$p}>
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
			} as CSSProperties}
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