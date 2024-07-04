## Незадокументированные методы и параметры к ним

После 2016 новые функции стали документироваться меньше. Большая часть методов взята [отсюда](https://zelenka.guru/threads/1527102/). Информация актуальна на лето 2024.

### account

#### account.getBalance

Возвращает количество голосов на аккаунте.

### audio

#### audio.getById

`url` — возвращается при непонятных обстоятельствах. Если использовать токен от VK Admin, то `url` сайт наотрез отказывается возвращать, даже с указанным `access_code`. Но если взять токен от веб-версии ВК, то `url` спокойно отдастся. Однако такой токен быстро истекает. Плюсом к этому, в `url` возвращается не .mp3, как написано в доках, а .m3u8, так что переконвертировать всё равно придётся.

`track_code` — телеметрия. Не только в аудиозаписях.

#### audio.getRecentAudios

Показывает недавно прослушанные аудиозаписи.

#### audio.getFavorites

Какое-то время даже был доступен в доках. Возвращает любимых артистов наверное.

### captcha

#### captcha.force

Метод для тестирования капчи.

### channels

#### channels.get

Возвращает Access denied. Вероятно, методы для каналов (типо паблики но отображаются в стиле телеги, поняли?)

### execute

#### execute.getNewsfeedSmart

Возвращает посты, истории и рекомендуемые группы разом, то бишь комбинирует несколько методов.

#### execute.groupsGet

Возвращает рекомендуемые тебе группы. Но если передать `count`: -1, то будет возвращать забаненные и сомнительные группы.

#### execute.getNotificationsSettings

Настройки уведомлений.

#### execute.getUserProfileContent

Возвращает информацию о пользователе вместе с его контентом.

#### execute.searchNewsfeedSmart

То же самое, что и newsfeed.search (?)

#### execute.searchGetHintsWithAttachments

search.getHints

### friends

#### friends.getFriendsDeletionSuggestions

С какими друзьями ты мало взаимодействующих и каких стоило бы удалить. Работает только с токеном веб-версии.

### groups

#### groups.getRecommendedGroups

Возвращает рекомендуемые тебе группы.

#### groups.getRecents

недавние группы

#### groups.removeRecents

Удалить недавние группы.

параметр `from_catalog` — для аналитики админам вк

#### groups.getContentForTabs

### newsfeed

#### newsfeed.addBan

По неподтверждённой информации:

`type`: `week` — скрыть источник с ленты на неделю

#### newsfeed.ignoreItem

Вместо 1 возвращает `{'status': true}`

#### newsfeed.getByType

Возвращает посты по типу:

`feed_type` — `top` — "интересные" записи, `recent` — то же самое, что и `newsfeed.get`

#### newsfeed.setPostTopic

Неизвестно.

#### newsfeed.getLikesFeed

Список лайкнутых тобой постов

#### newsfeed.getDiscoverCustom

список авторов vk donut

#### newsfeed.getUserTopicSources

Группы по темам, интересным для юзера.

Принимает параметры:

`extended`: 0-1 как и всегда

#### newsfeed.getBreakingNewsBlockContent

😐. Судя по названию, показывает новости. По умолчанию жалуется на отсутствие `track_code`

### notifications

#### notifications.getSettings

Возвращает настройки уведомлений.

### podcasts

#### podcasts.getEpisode

### queue

#### queue.subscribe

Подписывает на живую очередь сообщений/уведомлений, а может вообще новостей.

### search

#### search.getSuggestions

Подсказки.

#### search.clearRecents

#### search.addRecents

### status

#### status.getImagePopup

Более подробная информация о картинкостатус

### specials

#### specials.getEasterEggs

пасхалки

### settings

#### settings.getOAuthServices

#### settings.resetAllSessions

Не пробовал, но наверное сбрасывает все сессии.

### users

#### users.get

Незадокументированные `fields`: 

`cover` — обложка профиля

`image_status` — картинкостатус у имени

`is_nft` — наверное, что-то с NFT-аватарками

`animated_avatar` — анимированные аватарки от багосов

`custom_names_for_calls` — имя для звонков наверное.

`counters`:

`badges` — 🤷‍♂️

`clips_followers` — дублированные `followers_count`.

`clips_likes` — судя по названию, количество лайков в ВК Клипах

`clips_views` — судя по названию, количество просмотров в ^.

`groups` — возвращается не всегда.

### wall

#### wall.archive

Архивирует запись.

Принимает параметры: 

`owner_id`: Ваш ID понятное дело

`post_id`: ID поста, который нужно архивировать

Возвращает: 1.

#### wall.reveal

Возвращает запись из архива.

Принимает параметры: 

`owner_id`: Ваш ID

`post_id`: ID поста, который нужно архивировать

Возвращает: 1.

#### wall.subscribe

Подписывает вас на новые записи стены.

Принимает параметры:

`owner_id`: ID стены, на которую нужно подписаться.

#### wall.unsubscribe

Отписывает вас от новых записей стены.

Принимает параметры:

`owner_id`: ID стены, на которую нужно подписаться.

#### wall.get

Параметр `filter` может принимать значение `archived`, и возвращать архивированные посты.

`is_archived` — архивирован ли пост

`can_archive` — может ли текущий пользователь архивировать пост. Кстати, в отличии от `can_edit` и `can_delete`, равен не `0` или `1`, а `true` или `false`.

`final_post` — означает то, что пост был создан при удалении страницы.

`carousel_offset` — ?

`reaction_set_id` — ?

`reactions` — `likes`, но только здесь показывается информация о реакциях.

`has_translation` — есть ли перевод у поста, если проще — "не написан ли пост не на русском"

`short_text_rate` — всегда равно `0.8`, наверное, связано с сокращением текста

#### wall.getComments

`sort`: 

`asc` — сначала старые

`desc` — сначала новые

`smart` — сначала интересные

`is_from_post_author`: Пометка "Автор" у комментария.

`attachment`:`sticker`: не возвращает `images` по определённым причинам (может из-за vk admin?)

#### wall.getSubscriptions

Список стен, на которые вы подписывались с помощью метода wall.subscribe.

#### wall.getPostPreview

Предпросмотр поста.
