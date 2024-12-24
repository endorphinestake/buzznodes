.PHONY: pull
pull:
	sudo -u www-data git pull

.PHONY: back
back:
	.venv/bin/python back/manage.py runserver localhost:8000

.PHONY: migrate
migrate:
	.venv/bin/python back/manage.py migrate

.PHONY: front
front:
	. nodeenv22.3.0/bin/activate && cd front && npm run dev

.PHONY: build
build:
	cd front && npm run build

.PHONY: po
po:
	. .venv/bin/activate && \
	django-admin makemessages --locale=ru --symlinks --no-obsolete --ignore=cache --ignore="venv/*"

.PHONY: mo
mo:
	. .venv/bin/activate && \
	django-admin compilemessages --locale=ru --ignore=cache --ignore="venv/*"
