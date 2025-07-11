.PHONY: pull
pull:
	sudo -u www-data git pull

.PHONY: back
back:
	.venv/bin/python back/manage.py runserver local.com:8000

.PHONY: migrate
migrate:
	.venv/bin/python back/manage.py migrate

.PHONY: requirements
requirements:
	.venv/bin/pip install -r  back/requirements.txt

.PHONY: front
front:
	. .nodeenv22.3.0/bin/activate && cd front && npm run dev

.PHONY: build
build:
	cd front && sudo -u www-data npm run build

.PHONY: build_local
build_local:
	. .nodeenv22.3.0/bin/activate && cd front && npm run build

.PHONY: deploy
deploy:
	rsync -avz front/.next front/node_modules root@37.27.90.63:/var/www/monitoring/front/
	ssh root@37.27.90.63 "\
		chown -R www-data:www-data /var/www/monitoring/front/ && \
		service monitoring-front restart"

.PHONY: rq
rq:
	OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES \
	.venv/bin/python back/manage.py rqworker submit_voice & \
	OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES \
	.venv/bin/python back/manage.py rqworker submit_sms & \
	OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES \
	.venv/bin/python back/manage.py rqworker submit_email & \
	OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES \
	.venv/bin/python back/manage.py rqworker alerts

.PHONY: po
po:
	. .venv/bin/activate && \
	django-admin makemessages --locale=ru --symlinks --no-obsolete --ignore=cache --ignore="venv/*"

.PHONY: mo
mo:
	. .venv/bin/activate && \
	django-admin compilemessages --locale=ru --ignore=cache --ignore="venv/*"
