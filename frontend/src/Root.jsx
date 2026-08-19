import {useEffect, useMemo, useRef, useState} from 'react';

export default function() {
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

    if (typeof IntersectionObserver === 'undefined') {
      viewport.querySelectorAll('section').
        forEach(s => s.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05, rootMargin: '0px 0px -40px 0px',
    });

    viewport.querySelectorAll('section').forEach((section) => {
      if (!section.classList.contains('visible')) {
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

  if (desktop) fonts = {text: 17, secondary: 15, header: 22};
  if (mobile) fonts = {text: 15, secondary: 15, header: 18};

  styles.root = {
    position: 'relative',
    height: '100%',
    color: colors.text.medium,
    background: `radial-gradient(circle 2000px, hsla(210 100% 50% / 6%) 0%, rgba(0, 0, 0, 1) 100%)`,
    fontSize: desktop ? '18px' : '16px',
  };

  styles.heading = {
    position: 'relative',
    height: desktop ? 60 : 50,
    fontWeight: 500,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: `1px solid ${colors.border.medium}`,
  };

  styles.content = {
    position: 'relative',
    left: layout.left,
    width: layout.width,
    paddingBottom: 100,
  };

  styles.seading = {
    height: 60,
    fontSize: fonts.header,
    color: colors.text.strong,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: '21px',
    background: colors.section,
  };

  styles.viewport = {
    overflow: 'auto',
    height: height - styles.heading.height,
    width: window.width,
    position: 'relative',
  };

  styles.grid.left = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: layout.left,
    pointerEvents: 'none',
    overflow: 'hidden',
    WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
    maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
    backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
  };

  styles.grid.right = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: layout.left,
    pointerEvents: 'none',
    overflow: 'hidden',
    WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
    maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
    backgroundImage: `
      repeating-linear-gradient(to bottom, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px),
      repeating-linear-gradient(to right, transparent, transparent 39px, ${colors.border.medium} 39px, ${colors.border.medium} 40px)
    `,
  };

  styles.electrons = {};

  styles.electrons.container = {
    position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
  };

  styles.electrons.base = {
    position: 'absolute',
    opacity: 0,
    borderRadius: 1,
    willChange: 'transform, opacity',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  };

  styles.electrons.vertical = {
    width: 2,
    height: 12,
    marginLeft: -1,
    background: 'linear-gradient(to bottom, transparent, hsl(210 100% 72% / 0.55) 45%, hsl(210 100% 72% / 0.55) 55%, transparent)',
    boxShadow: '0 0 10px hsl(210 100% 55% / 0.22)',
    animationName: 'electron-v',
  };

  styles.electrons.horizontal = {
    width: 12,
    height: 2,
    marginTop: -1,
    background: 'linear-gradient(to right, transparent, hsl(210 100% 72% / 0.45) 45%, hsl(210 100% 72% / 0.45) 55%, transparent)',
    boxShadow: '0 0 10px hsl(210 100% 55% / 0.18)',
    animationName: 'electron-h',
  };

  styles.electrons.horizontalReverse = {
    animationName: 'electron-h-reverse',
  };

  const gridHeight = contentHeight || height - styles.heading.height;

  return (
    <root style={styles.root}>
      <border-top style={{
        position: 'absolute',
        top: desktop ? 59 : 49,
        width: window.width,
        height: 1,
        background: colors.border.medium,
      }}/>

      <heading style={styles.heading}>
        <content style={{
          left: layout.left,
          width: layout.width,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
        }}>
          <name style={{fontSize: fonts.header}}>Egor Koshelko</name>
        </content>
      </heading>

      <viewport ref={viewportRef} style={styles.viewport}>
        <wrapper ref={wrapperRef} style={{
          position: 'relative',
          minHeight: '100%',
          paddingTop: desktop ? 40 : 20,
        }}>
          {
            desktop ?
              <grid-left style={styles.grid.left}>
                <GridElectrons
                  styles={styles.electrons}
                  width={layout.left}
                  height={gridHeight}
                />
              </grid-left> : null
          }
          {
            desktop ?
              <grid-right style={styles.grid.right}>
                <GridElectrons
                  styles={styles.electrons}
                  width={layout.left}
                  height={gridHeight}
                />
            </grid-right> : null
          }

          <content style={styles.content}>
            <section style={{...styles.section, marginTop: 0}}>
              <seading style={styles.seading}>Введение</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  В дестве мне больше нравились конфиги настраивать чем собственно играть.
                </p>

                <p>
                  Так же хотелось бы что это превратилось в волну, где люди публикуют свои сетапы (а то задолбали эти новости про ИИ чесслово).
                </p>

                <p>
                  Полностью этот сетап с нуля вряд-ли кто-то будет повторять, скорее всего каждый прочитавший заинтегрирует только определенные кусочки в него.
                </p>

                <p>
                  Так же хотелось бы что это превратилось в волну, где люди публикуют свои сетапы (а то задолбали эти новости про ИИ чесслово).
                  В этом есть и корыстный интерес, я хочу улучшать свой сетап и лучший способ - это смотреть на сетапы других пользователей.
                </p>

                <p>
                  Этот текст написан полностью человеком.
                  ИИ использовался только для обучения и проверки на ошибки.
                  Хотите что бы я отредактировал это сообщение в более дружелюбном стиле или оставить как есть?
                </p>
              </content>
            </section>


            <section style={{...styles.section, marginTop: 0}}>
              <seading style={styles.seading}>Рабочее место</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  Самое главное - это угловой стол.
                  Логти находятся на удобной позиции.
                  При этом столы скреплены снизу специальными пластинами на болтах.
                </p>

                <p>
                  Не менее важно  5 мониторов.
                  Все мониторы соединены липкой лентой, что бы не было зазоров.
                  все мониторы на кроштейнах.
                  Все фокусируются на процессоре, памяти видеокарте, но по факту мощное железо нужно для игр, рендеринга и других специфичных задач.
                  Один монитор основной, и 4 дополнительных, все четыре монитора вертикальные.
                  Диоганаль - 28 дюймов.
                </p>

                <p>
                  По факту сейчас вертикальное пространство важнее горизонтального.
                  Сами посудите, все социальные сети вертикальные, разработка в браузере сверху приложение, снизу дебаггер, терминалу так же вертикальное пространство нужнее.
                  Горизонтальное пространство нужно для кода, просмотр фильмов фото и игр.
                </p>

                <p>
                  Клавиатура - Advantage Kinesis.
                  То насколько я обожаю эту клавиатуру словами не описать, намного удобнее чем обычные клавиатуры.
                  Логти раздвинуты и удобно нажимать горячие клавиши.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Железо</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  Железо не является бутылочным горлышком, но оно у меня самое последнее.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Операционная система</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                <p>
                  Тут есть FreeBSD, Ubuntu, MacOS, Windows.
                </p>
                <p>
                  Вы бы могли подумать, что раз я такой техно-гик, то у меня стоит линукс.
                </p>
                <p>
                  Я конечно считаю, что FreeBSD лучше линукса, но я не настолько мазохист что бы ставить его себе на десктоп.
                </p>
                <p>
                  Самое главное преимущество винды в системе управлениями окнами.
                </p>
                <p>
                  На винде так же я могу использовать рабочие пространства отдельные что бы открыть много браузеров.
                  Сейчас разрабатываю приложение, где много юзеров взаимодействуют друг с другом. Удобно весь этот сетап держать на отдельном рабочем пространстве.
                </p>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>ИИ модель</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                В детстве мне очень нравилась игра квейк, и что самое странное мне больше даже нравилось не играть в нее а ковыряться в конфиге.
                Уже тогда у меня открылась страсть к программированию.

                <br/>

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
                <ul>
                  <li></li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Файловый менеджер</seading>

              <content style={{padding: desktop ? 20 : 10}}>

                <ul>
                  <li></li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Текстовый редактор</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Тут я выбирал между Cursor, WebStorm, Zed - тут явный фаворит
                это WebStorm.

                <ul>
                  <li>Очень нравится Zed но с ним есть большая, он жрет
                    значительно меньше памяти. Вот скриншот.
                  </li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>ИИ модель</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Я проанализировал все ИИ модели следующим образом - я сначала
                написал небольшой тестовый проект полностью сам.
                И потом попросил все возможные ИИ в максимальной конфигурации
                написать точно такой же проект.
                После этого я выбрал ту, код которой мне понравился больше всех.

                <ul>
                  <li></li>
                </ul>

                При использовании ИИ модели ее можно использовать либо через
                официальный гуи либо через курсор либо через WebStorm плагин,
                вебшторм плагины просто ужасные для ИИ.
                Больше половины моделей у меня тупо не запускались.
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>AHK</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Есть определенная часть функционала, которая я бы хотел что бы
                была представлена в операционной системе нативно.
                Я настроил долгое нажатие на горячую клавишу - когда она
                нажимается то фокусируется определенное приложение.
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Железо</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Я в деньгах не особо стеснен, поэтому железо просто топовое.
                Не то что бы я особо был игроманом, иногда конечно играю, но не
                ради этого я покупаю топовое железо.
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Клавиатура</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Тут есть однозначный виннер.
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Стол</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Самый удобный сетап, логти находятся на столе. Это крайне
                удобно. Плюс к этому мониторы можно расположить по дуге.
                Четыре монитора другим образом отобразить у меня бы не
                получилось.
              </content>
            </section>

            <section>
              <seading style={styles.seading}>Лэйаут</seading>

              <p>
                Рекомендую зафиксировать определенную позицию за каждым приложением, так удобнее сразу знать куда смотреть.

                <ul>
                  <li>Слева-слева: терминал.</li>
                  <li>Слева: браузер (для разработки) и Chrome Dev Tools.</li>
                  <li>Центр: Основной монитор IDE или любое другое временное приложение.</li>
                  <li>Справа: ИИ или любая другая документация.</li>
                  <li>Справа-справа: все мессенджеры (почта, тг, вотсап...).</li>
                </ul>
              </p>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>ОС</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Тут три вариант - убунта, freebsd, макось, винда:

                <ul>
                  <li>FreeBSD - мне нравится как сервер намного больше линукса
                    (потому что фрибсд только одна, а дистрибутивов линукса
                    хуева туча). Но для десктопа ее использовать это мазохизм.
                  </li>
                  <li>Убунта - отпадает.</li>
                  <li>Макось - отпадает. Как минимум потому что не
                    поддерживается AHK
                  </li>
                  <li>Винда - отпадает.</li>
                  <li>Самое главное преимущество винды - это более удобная
                    система по работе с окнам, чем на макоси. Ведь ось это по
                    сути домик для окон.
                  </li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Терминал</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Тут три вариант - убунта, freebsd, макось, винда:

                <ul>
                  <li>FreeBSD - мне нравится как сервер намного больше линукса
                    (потому что фрибсд только одна, а дистрибутивов линукса
                    хуева туча). Но для десктопа ее использовать это мазохизм.
                  </li>
                  <li>Убунта - отпадает.</li>
                  <li>Макось - отпадает. Как минимум потому что не
                    поддерживается AHK
                  </li>
                  <li>Винда - отпадает.</li>
                  <li>Самое главное преимущество винды - это более удобная
                    система по работе с окнам, чем на макоси. Ведь ось это по
                    сути домик для окон.
                  </li>
                </ul>
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Менеджер пароле</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                1Password - сто процентный фаворит
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Почта</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Тут только Thunderbird является возможным выбором.
                Киллер фичей почты является для меня наличие функционала
                вкладок.
                Ни один другой клиент не раполагает вкладками.
              </content>
            </section>

            <section style={styles.section}>
              <seading style={styles.seading}>Почта</seading>

              <content style={{padding: desktop ? 20 : 10}}>
                Для виртуальных карт и оплаты подписок я использую oplatym.ru.
              </content>
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
    </root>
  );
}

const VERTICAL_ELECTRONS = 100;
const HORIZONTAL_ELECTRONS = 100;

function buildRandomTracks(count, span, cell, duration, random) {
  const cells = Math.max(1, Math.floor(span / cell));

  return Array.from({length: count}, () => (
    {
      pos: Math.floor(Math.random() * cells) * cell,
      delay: -Math.random() * duration,
      duration,
      reverse: random ? Math.random() > 0.5 : false,
    }
  ));
}

function GridElectrons({styles, width, height}) {
  const cell = 40;
  const electronSpeed = 52;
  const vDuration = (height + 32) / electronSpeed;
  const hDuration = (width + 32) / electronSpeed;

  const verticalTracks = useMemo(
    () => buildRandomTracks(VERTICAL_ELECTRONS, width, cell, vDuration, false),
    [width, height, vDuration]
  );

  const horizontalTracks = useMemo(
    () => buildRandomTracks(HORIZONTAL_ELECTRONS, height, cell, hDuration, true),
    [width, height, hDuration]
  );

  return (
    <grid-electrons style={{
      ...styles.container,
      '--electron-travel': `${width}px`,
      '--electron-v-travel': `${height}px`,
    }}>
      {
        verticalTracks.map((track, index) => (
          <grid-electron
            key={`v-${index}`}
            style={{
              ...styles.base, ...styles.vertical,
              left: track.pos,
              animationDuration: `${track.duration}s`,
              animationDelay: `${track.delay}s`,
            }}
          />
        ))
      }
      {
        horizontalTracks.map((track, index) => (
          <grid-electron
            key={`h-${index}`}
            style={{
              ...styles.base, ...styles.horizontal, ...(
                track.reverse ? styles.horizontalReverse : null
              ),
              top: track.pos,
              animationDuration: `${track.duration}s`,
              animationDelay: `${track.delay}s`,
            }}
          />
        ))
      }
    </grid-electrons>
  );
}

function lexems() {
  return {
    test: ['test', 'second'],
  };
}
