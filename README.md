# 🚀 BuzzNodes — Validator Monitoring and Alert System

BuzzNodes is a comprehensive monitoring and alerting platform specifically designed for Celestia validators. It addresses the critical need for real-time observability, reliability tracking, and instant alerting across the Celestia blockchain validator infrastructure.

The system provides a centralized interface to track validator performance, detect failures, receive alerts via SMS, email, or voice, and visualize key metrics through Prometheus and Grafana. BuzzNodes helps ensure high availability and minimizes slashing risks by enabling proactive responses.

## 🖥️ 1. System Requirements

- **OS:** Ubuntu 22.04+
- **Python:** 3.11+
- **Redis:** 7+
- **PostgreSQL or Percona:** 15+
- **Node.js:** 18+
- **Prometheus:** 2.45+ (for metrics collection)
- **Grafana:** 10+ (for metrics visualization)
- **Make:** for build automation

---

## 🛠️ 2. Installation

### 2.1 Clone the Project and Prepare the Environment

```bash
git clone https://github.com/endorphinestake/buzznodes
cd buzznodes
cp back/.env.sample back/.env
cp front/.env.sample front/.env
python3 -m venv .venv
nodeenv --node=22.3.0 .nodeenv22.3.0
```

### 2.2 Install Dependencies

```bash
.venv/bin/pip install -r  back/requirements.txt
. .nodeenv22.3.0/bin/activate && cd front && npm install
```

### 2.3 Install Databases and Caching

```bash
wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo dpkg -i percona-release_latest.generic_all.deb
sudo percona-release setup ps80
sudo apt update
sudo apt install percona-server-server
sudo systemctl start mysql
sudo mysql_secure_installation

sudo apt install -y redis-server
```

### 2.4 Install Prometheus

```bash
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz
cd prometheus-2.45.0.linux-amd64
sudo cp prometheus promtool /usr/local/bin/
sudo cp -r consoles/ console_libraries/ /etc/prometheus/
sudo cp prometheus.yml /etc/prometheus/
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo chown prometheus:prometheus /usr/local/bin/prometheus
```

### 2.5 Install Grafana (optional)

```bash
sudo apt-get install -y software-properties-common gnupg2
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install grafana
```

### 2.6 Apply Migrations and Create Superuser

```bash
cd /var/www/buzznodes/
.venv/bin/python back/manage.py migrate
.venv/bin/python back/manage.py createsuperuser
```

---

## ⚙️ 3. Services and Workers

| Service           | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| `back`           | Django backend                                                       |
| `alerts`         | Asynchronous alert delivery tasks                                    |
| `emails`         | Email tasks (registration confirmation, password reset/change)       |
| `sms`            | SMS notifications via [Bird](https://bird.com), [Hicell](https://hicell.com)                                   |
| `voice`          | Voice alerts via [Bird](https://bird.com), [UniTalk](https://unitalk.cloud)                                       |
| `scheduler`      | Scheduled task runner                                                |
| `redis`          | Queue broker (RQ used)                                               |
| `percona/postgres` | Database                                                           |
| `front`          | UI (NextJS)                                                          |
| `prometheus`     | Metrics collection                                                   |
| `grafana`        | Dashboards and metrics visualization                                 |

---

## 💻 4. UI

### 4.1 Development Mode

```bash
make back
make front
```

- Accessible at: [http://localhost:3000](http://localhost:3000)

---

## 🔐 5. Admin Panel

- Accessible at: [http://localhost:8000/admin/](http://localhost:8000/admin/)

### Features:

- User, blockchain, validator, and alert management
- Log viewing
- Internationalization via Rosetta

---

## ⚙️ 6. Configuration Highlights

- Uses `django-environ` for `.env` config
- RQ queues: `submit_email`, `submit_sms`, `submit_voice`
- Email via SMTP, SMS/Voice via Bird, HiCell, UniTalk
- Grafana integration for metrics
- CKEditor 5 with custom setup
- CSRF, CORS, and TRUSTED ORIGINS are environment-aware
- Google reCAPTCHA support

---

## 🗂️ 7. `.env` Structure

```env
DEBUG=True
SECRET_KEY=...
PROJECT_NAME=BuzzNodes
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=mysql://user:pass@host/db
SESSION_COOKIE_DOMAIN=localhost

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=...
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_SENDER_NAME=BuzzNodes

GRAFANA_BASE_URL=https://grafana.example.com
GRAFANA_SERVICE_TOKEN=...

HICELL_SMS_USERNAME=...
HICELL_SMS_API_KEY=...
BIRD_ACCESS_KEY=...
BIRD_WORKSPACE_ID=...
BIRD_SMS_CHANNEL_ID=...
BIRD_VOICE_CHANNEL_ID=...
UNITALK_VOICE_API_KEY=...

GOOGLE_RECAPTCHA_SECRET=...
```

---

## 🤝 8. Contacts

- **Developer:** VShevtsov  
- **Email:** vshevtsov17@gmail.com  
- **LinkedIn:** https://www.linkedin.com/in/vitaliy-shevtsov/
- **GitHub:** https://github.com/goldsheva
