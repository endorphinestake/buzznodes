# BuzzNodes — обзор проекта

Краткий конспект структуры, стеков и запуска, чтобы быстро восстановить контекст после перезапуска среды.

## Назначение

Платформа мониторинга и оповещений для валидаторов (фокус: Celestia, также 0g, XRPL, Story). Отслеживает метрики валидаторов/мостов, формирует алерты и доставляет их по SMS/Voice/Email, интеграция с Prometheus/Grafana.

## Архитектура (high-level)

- Backend: Django 5 + DRF, очереди на Redis RQ, SMTP/провайдеры SMS/Voice.
- Frontend: Next.js 14 (React 18, TS), MUI + PatternFly, i18n.
- Брокер: Redis (DB 0..3 под разные очереди).
- БД: Percona/MySQL (или Postgres по README) через `DATABASE_URL`.
- Nginx-конфиги и unit-файлы systemd в `conf/`.

## Ключевые пути

- Backend: `back/`
  - Настройки: `back/main/settings.py`, `back/main/urls.py`, `back/main/middlewares.py`, `back/main/context_processors.py`
  - Приложения: `users/`, `blockchains/`, `alerts/`, `sms/`, `voice/`, `mails/`, `logs/`
  - Очереди/джобы: `alerts/tasks.py`, `sms/tasks.py`, `voice/tasks.py`, `mails/tasks.py`
  - Шаблоны: `templates/` (включая письма в `templates/emails/`)
- Frontend: `front/`
  - Конфиг: `front/next.config.js`, `front/package.json`, `front/tsconfig.json`
  - Публичные ресурсы: `front/public/`
- Инфраструктура: `Makefile`, `conf/*.service`, `conf/nginx/*.conf`

## Доменная модель (основное)

- Users: `users.models.User` (логин по email, `AUTH_USER_MODEL`), `users.models.UserPhone` (статус подтверждения, флаг тестового звонка).
- Blockchains: `Blockchain`, `BlockchainUrl`, `BlockchainValidator` (voting_power, uptime, commission, jailed/tombstoned/status), `BlockchainBridge` (node_height, *_diff, last_timestamp, версии).
- Alerts:
  - Глобальные пороги: `AlertSetting*` (VotingPower/Uptime/Comission, Jailed/Tombstoned/Bonded, OtelUpdate/SyncStatus).
  - Пользовательские привязки: `UserAlertSetting*` к валидатору или мосту + канал (SMS/VOICE).
- Журнал: `logs.models.Log` (info/warning/error, sync_to_async-обёртки).

## Потоки алертов

- Вычисление условий и постановка доставки: `alerts/tasks.py::check_alerts` (очередь `alerts`).
- Доставка:
  - SMS: `sms/tasks.py::submit_sms_alert` (HiCell — основной, Bird — резерв), модели `SMSAlert*`.
  - Voice: `voice/tasks.py::submit_voice_alert` (UniTalk — основной, Bird — резерв), модели `VoiceAlert*`.
  - Email: `mails/tasks.py` (верификация, сброс/смена пароля, креды).
- Форматирование текста и утилиты: `alerts/utils.py` (`clean_tags_from_text`, `format_ping_time`, `get_sync_status`).

## API (топ-уровень)

- Префикс: `/api/`
- Маршруты: `users/`, `blockchains/`, `mails/`, `alerts/`, `sms/`, `voice/` (см. `back/main/urls.py`).
- Admin: `/admin/`
- Служебные: `/django-rq/`, `/rosetta/`, `/ckeditor5/`, корневые шаблоны и статика (в DEBUG).

## Конфигурация и ENV

- Файл `.env` в `back/` (см. образец в README):
  - Базовые: `DEBUG`, `SECRET_KEY`, `PROJECT_NAME`, `BACKEND_URL`, `FRONTEND_URL`, `SESSION_COOKIE_DOMAIN`, `DATABASE_URL`.
  - Почта: `EMAIL_*`.
  - Интеграции: `GRAFANA_*`, `HICELL_*`, `BIRD_*`, `UNITALK_*`, `GOOGLE_RECAPTCHA_SECRET`.
- CORS/CSRF: домены для DEV/PROD заданы в `settings.py`.
- Очереди RQ: `submit_voice`(DB0), `submit_sms`(DB1), `submit_email`(DB2), `alerts`(DB3).

## Запуск локально (macOS)

1) Зависимости

```bash
# Python
python3 -m venv .venv
.venv/bin/pip install -r back/requirements.txt

# Redis (должен быть запущен локально)
# macOS (brew): brew install redis && brew services start redis

# Node (желательно nodeenv как в README)
. .nodeenv22.3.0/bin/activate || true
cd front && npm install
```

2) Миграции и суперпользователь

```bash
.venv/bin/python back/manage.py migrate
.venv/bin/python back/manage.py createsuperuser
```

3) Запуск сервисов (в отдельных терминалах)

```bash
# Backend (учти host из Makefile)
make back

# Очереди RQ (включает 4 воркера)
make rq

# Frontend (по умолчанию dev host celestia.local.com)
make front
```

Примечания:
- Makefile использует хосты `local.com`/`celestia.local.com`. Добавь записи в `/etc/hosts` или измени цели:
  - `back`: `runserver local.com:8000`
  - `front`: `next dev -H celestia.local.com`
- Для фронта создай `front/.env` с `API_URL=http://local.com:8000` для работы с локальным API.

## Полезные команды (Makefile)

- `make requirements` — установить Python-зависимости
- `make migrate` — миграции
- `make back` — Django runserver
- `make rq` — запустить воркеры RQ (4 очереди)
- `make front` — Next.js dev
- `make build_local` — сборка фронта локально

## Безопасность и операционные нюансы

- В проде избегать `ALLOWED_HOSTS=['*']`.
- Провайдерские ключи и SMTP — только в `.env`, не коммитить.
- Redis без пароля только для dev; для prod — пароль/изолированная сеть.

## Обновление этого файла

При изменении схемы/маршрутов/очередей обновляй соответствующие разделы. Этот файл — быстрый «mind map» проекта.
